import React, { useState, useCallback, useEffect } from "react";
import { View, Text, Image, SafeAreaView } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import BASE_URL from "../../config";
import Loading from "../../global/components/Loading";
import { getTodayLocalDate } from "../../util/date";

const PillIcon = () => (
  <View className="w-16 h-16 items-center justify-center">
    <Image
      source={require("../../assets/Home/medicine.png")}
      alt="Pill Icon"
      className="w-20 h-20"
    />
  </View>
);

const MedicationStatus = () => {
  const [loading, setLoading] = useState(true);
  const [hasTakenMeds, setHasTakenMeds] = useState(false);
  const [totalMeds, setTotalMeds] = useState(0);
  const [takenMeds, setTakenMeds] = useState(0);
  const [currentDate, setCurrentDate] = useState(getTodayLocalDate());

  const checkMedicationStatus = async () => {
    try {
      setLoading(true);

      // ตรวจสอบวันปัจจุบันและอัพเดต
      const todayFormatted = getTodayLocalDate();
      if (currentDate !== todayFormatted) {
        setCurrentDate(todayFormatted);
      }

      // Fetch user data from AsyncStorage
      const authData = await AsyncStorage.getItem("@auth");
      if (!authData) {
        console.log("User not logged in");
        setLoading(false);
        return;
      }

      const auth = JSON.parse(authData);
      const token = auth.token;
      const userId = auth.user._id;

      // Fetch today's medication data using local date
      const response = await axios.get(
        `${BASE_URL}/api/v1/regular-pills/daily/${userId}?date=${todayFormatted}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Process the response
      if (response.data.success && response.data.medicationLogs) {
        let total = 0;
        let taken = 0;

        response.data.medicationLogs.forEach(
          (timeGroup: {
            medications: { isTaken?: boolean; taken?: boolean }[];
          }) => {
            timeGroup.medications.forEach(
              (med: { isTaken?: boolean; taken?: boolean }) => {
                total++;
                if (med.isTaken || med.taken) {
                  taken++;
                }
              }
            );
          }
        );

        setTotalMeds(total);
        setTakenMeds(taken);
        setHasTakenMeds(total > 0 && total === taken);
      }
    } catch (error) {
      console.log("Error checking medication status:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      checkMedicationStatus();
      // ตรวจสอบว่าข้ามวัน
      const todayFormatted = getTodayLocalDate();
      if (currentDate !== todayFormatted) {
        setCurrentDate(todayFormatted);
      }

      checkMedicationStatus();

      // เพิ่มระบบตรวจสอบทุก 1 ชั่วโมง
      const intervalCheck = setInterval(() => {
        const newDate = getTodayLocalDate();
        if (newDate !== currentDate) {
          setCurrentDate(newDate);
          checkMedicationStatus();
        }
      }, 3600000); // 1 ชั่วโมง

      return () => clearInterval(intervalCheck);
    }, [currentDate])
  );

  // ตรวจสอบการเปลี่ยนวัน
  useEffect(() => {
    checkMedicationStatus();
  }, [currentDate]);

  // Status messages
  const statusText = hasTakenMeds
    ? "ตอนนี้คุณทานยาประจำครบแล้ว!"
    : totalMeds === 0
    ? "ไม่มียาประจำที่ต้องทานวันนี้"
    : `คุณยังทานยาไม่ครบ (${takenMeds}/${totalMeds})`;

  const subtitleText = hasTakenMeds
    ? "ยินดีด้วย! คุณทานยาประจำตัวครบแล้ว"
    : totalMeds === 0
    ? "ไม่มีรายการยาประจำในวันนี้"
    : "อย่าลืมทานยาประจำตัวที่เหลือของคุณ";

  if (loading) {
    return <Loading />;
  }

  return (
    <SafeAreaView>
      <View className="w-full items-center flex-row bg-white p-4 py-8 mb-8 justify-evenly">
        <PillIcon />

        <View className="items-center">
          <Text className="text-body font-regular text-secondary">
            {statusText}
          </Text>

          <Text className="text-description text-secondary text-center font-regular">
            {subtitleText}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MedicationStatus;

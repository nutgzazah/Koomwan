import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import BackButton from "../../../global/components/BackButton";
import Card from "../../../global/components/Card";
import BreakLine from "../../../global/components/BreakLine";
import Checkbox from "expo-checkbox";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_URL from "../../../config";
import Loading from "../../../global/components/Loading";

interface Medication {
  _id: string;
  pillName: string;
  pillType: string;
  description: string;
  reminderTimes: string[];
  checked?: boolean;
}

interface HealthInfo {
  _id: string;
  regularpill: Medication[];
}

export default function RegularMedScreen() {
  const router = useRouter();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMedications();
  }, []);

  const fetchMedications = async () => {
    try {
      setLoading(true);
      const authData = await AsyncStorage.getItem("@auth");

      if (!authData) {
        Alert.alert("Session Expired 1", "Please login again");
        router.push("/user/login");
        return;
      }
      const auth = JSON.parse(authData);
      // Get the token from AsyncStorage
      const token = auth.token;
      // Get the user ID from AsyncStorage
      const userId = auth.user._id;
      // Get the healthInfoId from AsyncStorage or from user profile
      const userResponse = await axios.get(
        `${BASE_URL}/api/v1/user/profile/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (userResponse.data.success && userResponse.data.user.healthinfo) {
        const healthInfoId = userResponse.data.user.healthinfo._id;

        // Fetch health info to get regular medication list
        const response = await axios.get(
          `${BASE_URL}/api/v1/user/healthinfo/${healthInfoId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          const healthInfo: HealthInfo = response.data.healthInfo;
          // Add 'checked' property to each medication for UI state
          const medsWithCheckState = healthInfo.regularpill.map((med) => ({
            ...med,
            checked: false,
          }));
          setMedications(medsWithCheckState);
        }
      }
    } catch (err) {
      console.error("Error fetching medications:", err);
      setError("ไม่สามารถโหลดข้อมูลยาได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  const isAnyChecked = medications.some((med) => med.checked);

  const handleCheckboxChange = (id: string) => {
    setMedications(
      medications.map((med) =>
        med._id === id ? { ...med, checked: !med.checked } : med
      )
    );
  };

  const handleDelete = () => {
    // Count selected items
    const selectedCount = medications.filter((med) => med.checked).length;

    Alert.alert(
      "คำเตือน",
      `คุณต้องการลบรายการยาที่เลือก ${selectedCount} รายการ?`,
      [
        {
          text: "ยกเลิก",
          style: "cancel",
        },
        {
          text: "ยืนยัน",
          style: "destructive",
          onPress: () => {
            // รอใส่ api
            const remainingMeds = medications.filter((med) => !med.checked);
            setMedications(remainingMeds);
          },
        },
      ]
    );
  };

  const handleMedicationDetails = (medId: string) => {
    router.push(`/profile/(med)/(medDetail)/${medId}`);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        <BackButton title="อัพเดทข้อมูลยาประจำ" />

        <Card>
          {/* Card Header */}
          <View className="flex-col items-center w-full mb-4">
            <Text className="text-title font-bold text-secondary">ยาประจำ</Text>
            <BreakLine />
          </View>

          {/* Error Message if any */}
          {error && (
            <View className="px-4 py-3 mb-4 bg-opacity-10 rounded-md">
              <Text className="font-regular text-description">{error}</Text>
            </View>
          )}

          {/* Medication List */}
          {medications.length > 0 ? (
            medications.map((med, index) => (
              <View key={med._id}>
                <View className="flex-row justify-between w-full px-2 items-center">
                  <View className="flex-row items-center">
                    <Checkbox
                      value={med.checked}
                      onValueChange={() => handleCheckboxChange(med._id)}
                      className="w-5 h-5"
                      color={med.checked ? "#3972F0" : undefined}
                    />
                    <Text className="pl-4 font-regular text-description text-secondary">
                      {med.pillName}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => handleMedicationDetails(med._id)}
                  >
                    <Text className="font-bold text-description text-primary">
                      รายละเอียดยา
                    </Text>
                  </TouchableOpacity>
                </View>
                {index < medications.length - 1 && <BreakLine />}
              </View>
            ))
          ) : (
            <Text></Text>
          )}
          <BreakLine />

          {/* Bottom Buttons */}
          <View className="flex-row justify-between mx-4 mt-4 mb-8 h-16 w-full">
            <TouchableOpacity
              disabled={!isAnyChecked}
              onPress={handleDelete}
              className={`flex-1 py-4 rounded-md mr-2 ${
                isAnyChecked ? "bg-abnormal" : "bg-background"
              }`}
            >
              <Text
                className={`text-center font-bold text-button ${
                  isAnyChecked ? "text-white" : "text-secondary"
                }`}
              >
                ลบรายชื่อยา
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 py-4 bg-primary rounded-md ml-2"
              onPress={() => router.push("/profile/(med)/addMed")}
            >
              <Text className="text-white text-center font-bold text-button">
                เพิ่มรายชื่อยาประจำ
              </Text>
            </TouchableOpacity>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

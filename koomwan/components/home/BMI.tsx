import React, { useState, useEffect, useCallback } from "react";
import { View, Text, Image, Alert, TouchableOpacity } from "react-native";
import Card from "../../global/components/Card";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_URL from "../../config";
import { router, useFocusEffect } from "expo-router";
import Loading from "../../global/components/Loading";
import { calculateBMI, getBMICategory } from "../../util/bmi";
import EmptyHomeCard from "./emptystate/EmptyHome";

const BMIScale = () => {
  const indicators = [
    { range: 6, color: "bg-warning" }, // Underweight < 18.5
    { range: 6, color: "bg-normal" }, // Normal 18.6-24
    { range: 6, color: "bg-orange" }, // Overweight 25-29.9
    { range: 6, color: "bg-abnormal" }, // Obese > 30
  ];

  return (
    <View className="w-full mt-4">
      <View className="flex flex-row justify-between w-full gap-0">
        {indicators.map((section, sectionIndex) =>
          Array(section.range)
            .fill(0)
            .map((_, i) => (
              <View
                key={`${sectionIndex}-${i}`}
                className={`h-8 w-2.5 rounded-[7px] mb-1 ${section.color}`}
              />
            ))
        )}
      </View>
      <View className="flex flex-row justify-between">
        <Text className="text-tag text-secondary font-regular">{"> "}0</Text>
        <Text className="text-tag text-secondary font-regular">18.6</Text>
        <Text className="text-tag text-secondary font-regular">23.0</Text>
        <Text className="text-tag text-secondary font-regular">25.0</Text>
        <Text className="text-tag text-secondary font-regular">{"> "}40</Text>
      </View>
    </View>
  );
};

interface UserInfoProps {
  weight: number;
  height: number;
  age: number | null;
  gender: string | null;
}

const UserInfo: React.FC<UserInfoProps> = ({ weight, height, age, gender }) => {
  const info = [
    { label: "น้ำหนัก", value: `${weight} กก.` },
    { label: "ส่วนสูง", value: `${height} ซม.` },
    { label: "อายุ", value: age ? `${age} ปี` : "ไม่มีข้อมูล" },
    {
      label: "เพศ",
      value: gender ? (gender === "male" ? "ชาย" : "หญิง") : "ไม่มีข้อมูล",
    },
  ];

  return (
    <View className="flex flex-row justify-between w-full mt-6 bg-background p-4 rounded-[10px]">
      {info.map((item, index) => (
        <View key={index} className="items-center">
          <Text className="text-description font-regular text-secondary">
            {item.value}
          </Text>
          <Text className="text-description font-regular text-secondary">
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  );
};

interface BMIDisplayProps {
  bmiValue: number;
}

const BMIDisplay: React.FC<BMIDisplayProps> = ({ bmiValue }) => {
  // Get BMI category using the utility function
  const bmiCategory = getBMICategory(bmiValue);

  // Map the color value to the appropriate text color class
  const getColorClass = (color: string) => {
    switch (color) {
      case "#2ED74D":
        return "text-normal";
      case "#FFD444":
        return "text-warning";
      case "#FE5757":
        return "text-abnormal";
      case "#FFA500":
        return "text-warning";
      default:
        return "text-primary";
    }
  };

  const colorClass = getColorClass(bmiCategory.color);

  return (
    <View className="items-center flex-row">
      <Image
        source={require("../../assets/Home/body.png")}
        className="w-[80px] h-[80px] mr-1"
      />
      <View className="px-2 py-2 rounded-full items-center">
        <Text className={`${colorClass} text-display font-bold mb-2`}>
          {bmiCategory.text}
        </Text>
        <Text className="text-tag font-regular text-secondary mb-2">
          {bmiValue.toFixed(2)} กก./ม.²
        </Text>
      </View>
    </View>
  );
};

export default function BMI() {
  interface UserData {
    weight: number;
    height: number;
    age: number | null;
    gender: string | null;
    bmi: number;
    lastUpdated: string;
  }

  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState("");
  const [hasRecords, setHasRecords] = useState(false);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      const authData = await AsyncStorage.getItem("@auth");
      if (!authData) {
        console.log("Session Expired", "Please login again");
        /* router.push("/user/login"); */
        return;
      }

      const auth = JSON.parse(authData);
      const token = auth.token;
      const userId = auth.user._id;

      if (!userId || !token) {
        throw new Error("User not authenticated");
      }

      // Fetch the user's health records
      const recordResponse = await axios.get(
        `${BASE_URL}/api/v1/user/getRecord/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Get the most recent record
      const records = recordResponse.data.records;
      if (!records || records.length === 0) {
        setHasRecords(false);
        setLoading(false);
        return;
      }

      // Has records
      setHasRecords(true);

      // Sort records by date (newest first)
      const sortedRecords = [...records].sort(
        (a, b) =>
          new Date(b.recordtime).getTime() - new Date(a.recordtime).getTime()
      );
      const latestRecord = sortedRecords[0];

      // Fetch health info to get age and gender
      let age = null;
      let gender = null;

      if (latestRecord.healthinfo) {
        try {
          const healthInfoId =
            typeof latestRecord.healthinfo === "string"
              ? latestRecord.healthinfo
              : latestRecord.healthinfo._id;

          const healthInfoResponse = await axios.get(
            `${BASE_URL}/api/v1/user/healthinfo/${healthInfoId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const healthInfo = healthInfoResponse.data.healthInfo;

          // Calculate age from birthdate
          if (healthInfo.birthdate) {
            const birthdate = new Date(healthInfo.birthdate);
            const today = new Date();
            const ageYears = today.getFullYear() - birthdate.getFullYear();
            const m = today.getMonth() - birthdate.getMonth();
            age =
              m < 0 || (m === 0 && today.getDate() < birthdate.getDate())
                ? ageYears - 1
                : ageYears;
          }

          gender = healthInfo.gender;
        } catch (healthInfoError) {
          console.error("Error fetching health info:", healthInfoError);
          // Continue without age and gender info if there's an error
        }
      }

      // calculateBMI function
      const bmi = calculateBMI(latestRecord.weight, latestRecord.height);

      // Format the last updated timestamp
      const formatThaiDateTime = (dateString: string): string => {
        // สร้าง Date object จากค่าที่รับเข้ามา
        const date = new Date(dateString);

        // ปรับเวลาให้เป็น GMT+7 (เวลาไทย)
        const bangkokTime = new Date(date);

        // ชื่อเดือนภาษาไทย
        const thaiMonths = [
          "มกราคม",
          "กุมภาพันธ์",
          "มีนาคม",
          "เมษายน",
          "พฤษภาคม",
          "มิถุนายน",
          "กรกฎาคม",
          "สิงหาคม",
          "กันยายน",
          "ตุลาคม",
          "พฤศจิกายน",
          "ธันวาคม",
        ];

        // จัดรูปแบบวันที่
        const day = bangkokTime.getDate();
        const month = thaiMonths[bangkokTime.getMonth()];
        const year = bangkokTime.getFullYear() + 543; // แปลงเป็นปี พ.ศ.

        // จัดรูปแบบเวลา
        const hours = bangkokTime.getHours().toString().padStart(2, "0");
        const minutes = bangkokTime.getMinutes().toString().padStart(2, "0");

        return `บันทึกล่าสุด ณ วันที่ ${day} ${month} ${year} เวลา ${hours}:${minutes} น.`;
      };

      const lastUpdatedText = formatThaiDateTime(latestRecord.recordtime);

      // Set all the user data
      setUserData({
        weight: latestRecord.weight,
        height: latestRecord.height,
        age: age,
        gender: gender,
        bmi: bmi,
        lastUpdated: lastUpdatedText,
      });

      setLastUpdated(lastUpdatedText);
      setLoading(false);
    } catch (err: any) {
      console.error("Error fetching user data:", err);
      setError(err.message || "ไม่สามารถโหลดข้อมูลได้");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
      return () => {
        // Optional cleanup if needed
      };
    }, [])
  );

  if (loading) {
    return (
      <Card>
        <Loading />
      </Card>
    );
  }

  if (!hasRecords) {
    return (
      <EmptyHomeCard
        header="ดัชนีมวลกายของฉัน"
        title="ยังไม่มีข้อมูลดัชนีมวลกาย"
        subtitle="กรุณาบันทึกข้อมูลน้ำหนักและส่วนสูงเพื่อคำนวณค่าดัชนีมวลกาย (BMI)"
        buttonText="บันทึกข้อมูลสุขภาพ"
        navigateTo="/(tabs)/tracking"
        icon={require("../../assets/Home/body.png")}
      />
    );
  }

  if (error) {
    return (
      <Card>
        <View className="p-4 items-center">
          <Text className="text-title font-regular text-secondary mb-2">
            ดัชนีมวลกายของฉัน
          </Text>
          <Text className="text-description text-secondary font-regular mb-4">
            ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง
          </Text>
          <TouchableOpacity
            onPress={fetchUserData}
            className="bg-primary py-2 px-4 rounded-[5px]"
          >
            <Text className="text-card font-regular">ลองอีกครั้ง</Text>
          </TouchableOpacity>
        </View>
      </Card>
    );
  }

  return (
    <Card>
      <View className=" items-center">
        <Text className="text-title font-regular text-secondary mb-2">
          ดัชนีมวลกายของฉัน
        </Text>
        <Text className="text-tag font-regular text-secondary text-center mb-2">
          {lastUpdated}
        </Text>

        {userData && (
          <>
            <BMIDisplay bmiValue={userData.bmi} />
            <BMIScale />
            <UserInfo
              weight={userData.weight}
              height={userData.height}
              age={userData.age}
              gender={userData.gender}
            />
          </>
        )}
      </View>
    </Card>
  );
}

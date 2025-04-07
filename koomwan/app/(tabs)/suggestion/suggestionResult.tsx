import React, { useContext, useEffect, useState } from 'react';
import {
  Text,
  SafeAreaView,
  View,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import axios from 'axios';
import { AuthContext } from "../../../context/authContext";
import BASE_URL from "../../../config"

interface SuggestionResultData {
  health_score: number;
  diabetes_risk_percent: number;
  diabetes_risk: string;
  summary: string;
  motivation: string;
  healthAdvice: {
    food: { title: string; description: string }[];
    exercise: { title: string; description: string }[];
    blog: {
      category: string;
}[];
  };
}

export default function SuggestionResult() {
  const router = useRouter();
  const [state] = useContext(AuthContext)
  const [result, setResult] = useState<SuggestionResultData | null>(null);
  const [loading, setLoading] = useState(true);
  console.log("State SuggestionResult: ",state)

  const navigation = useNavigation();


  useEffect(() => {
    const fetchHealthAndSuggest = async () => {
      try {
        const healthRes = await axios.get(`${BASE_URL}/api/v1/suggestion/getUserHealthLastWeek`);

        const healthData = healthRes.data.data;
        console.log("HealthData =>", healthData);

        // ถ้าข้อมูลครบ ค่อยส่งไปยัง Flask
        const response = await axios.post(`${BASE_URL}/api/v1/ai/predict`, {
          userId: state.user._id,
          diabetestype: healthData.diabetestype,
          gender: healthData.gender,
          age: calculateAge(healthData.birthdate),
          bmi: calculateBMI(healthData.weight, healthData.height),
          blood_glucose_level: healthData.bloodsugar,
          HbA1c_level: healthData.a1c,
          systolic_bp: healthData.systolic,
          diastolic_bp: healthData.diastolic,
          moodstatus: healthData.moodstatus,
        });

        setResult(response.data);
        // ตรวจสอบว่า isEstimatedA1C เป็น true หรือไม่
        console.log("isEstimatedA1C:",healthRes.data.estimatedA1C)
        if (healthRes.data.estimatedA1C) {
          Alert.alert(
            'HbA1c เป็นค่าประมาณ',
            'เนื่องจากไม่มีข้อมูลค่าน้ำตาลเฉลี่ยสะสมในเลือดแบบเจาะจง แอพจึงคำนวนให้เป็นค่าประมาณในการวิเคราะห์ครั้งนี้' 
          );
        }

        // ถ้ามีผลลัพธ์แล้ว ไปหน้า /suggestion
        if (response.data) {
          router.replace('/suggestion');
        }else {
          // ถ้าไม่มีผลลัพธ์จาก API
          Alert.alert('ไม่พบข้อมูล', 'ไม่สามารถประเมินผลได้ในตอนนี้ กรุณาลองใหม่อีกครั้ง');
        }

      } catch (error: any) {
        console.error('Error:', error?.response?.data || error);

        if (error?.response?.data?.message === 'Health info not found') {
          Alert.alert(
            'แจ้งเตือน',
            'ดูเหมือนว่าคุณยังไม่ได้บันทึกข้อมูลพื้นฐานเลยนะ ไปบันทึกตอนนี้เลย!',
            [{ text: 'ตกลง', onPress: () => router.replace('/user/beginner') }]
          );
        } else if (error?.response?.data?.message === 'ไม่พบข้อมูลสุขภาพครบทุกประเภทในช่วง 7 วันที่ผ่านมา') {
          const missing = error.response.data.missing;
          const missingList = [
            missing.bloodsugar ? 'ระดับน้ำตาลในเลือด 5 ครั้ง' : null,
            missing.a1c ? 'HbA1c' : null,
            missing.bloodpressure ? 'ความดันโลหิต' : null
          ].filter(Boolean).join(', ');

          Alert.alert(
            'แจ้งเตือน',
            `ดูเหมือนว่าใน 7 วันที่ผ่านมาคุณบันทึกข้อมูล ${missingList} ยังไม่ครบเลยนะ ไปบันทึกกันเลยตอนนี้!`,
            [{ text: 'ตกลง', onPress: () => router.replace('/tracking') }]
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHealthAndSuggest();
  }, []);

  const calculateAge = (birthdate: string): number => {
    const birth = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    if (
      today.getMonth() < birth.getMonth() ||
      (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  const calculateBMI = (weight: number, height: number): number => {
    return +(weight / ((height / 100) ** 2)).toFixed(2);
  };

  if (loading || !result) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#3972F0" />
        <Text className="font-sans text-description mt-4 text-secondary">
          กำลังประเมินผลสุขภาพ...
        </Text>
  
        {/* ปุ่มยกเลิก / ย้อนกลับ */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="bg-primary mt-6 px-8 py-4 rounded-xl"
        >
          <Text className="text-white font-sans">ยกเลิก</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}
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
import Card from '../../../global/components/Card';
import { AuthContext } from "../../../context/authContext";
import BreakLine from '../../../global/components/BreakLine';
import { ShortButton } from '../tracking/components/ShortButton';
import AdviceCard from './components/AdviceCard';
import BASE_URL from "../../../config"
import motivationalQuotes from './motivationalQuotes';

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
  const [quote, setQuote] = useState("");
  const [diabetestype, setDiabetestype] = useState<string | null>(null);
  console.log("State SuggestionResult: ",state)

  const navigation = useNavigation();


  useEffect(() => {
    const fetchHealthAndSuggest = async () => {
      try {
        const healthRes = await axios.get(`${BASE_URL}/api/v1/suggestion/getUserHealthLastWeek`);

        const healthData = healthRes.data.data;
        console.log("HealthData =>", healthData);
        setDiabetestype(healthData.diabetestype);

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
        const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
        setQuote(randomQuote);
        // ตรวจสอบว่า isEstimatedA1C เป็น true หรือไม่
        console.log("isEstimatedA1C:",healthRes.data.estimatedA1C)
        if (healthRes.data.estimatedA1C) {
          Alert.alert(
            'HbA1c เป็นค่าประมาณ',
            'เนื่องจากไม่มีข้อมูลค่าน้ำตาลเฉลี่ยสะสมในเลือดแบบเจาะจง แอพจึงคำนวนให้เป็นค่าประมาณในการวิเคราะห์ครั้งนี้' 
          );
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

  return (
    <SafeAreaView className="flex-1">
      <ScrollView mb-24>
        <Card>
          <Text className="text-title font-bold font-sans text-secondary text-center mt-2 mb-1">
            ประเมินสุขภาพ
          </Text>
          <BreakLine />

          <Image
            source={require('../../../assets/Suggestion/heart-primary.png')}
            className="w-32 h-32 mx-auto mb-1"
          />

          <Text className="text-headline font-bold font-sans text-secondary text-center mb-1 ">
            คะแนนสุขภาพ
            <Text className="text-display font-bold font-sans text-primary text-center ">
              {result.health_score}
            </Text>
            <Text className="text-body font-sans text-secondary">/10</Text>
          </Text>

          {diabetestype !== "diabetes" && (
          <Text className="text-headline font-bold font-sans text-secondary text-center mb-2"> 
            ความเสี่ยงเบาหวาน
            <Text className="text-display font-bold font-sans text-primary text-center ">
              {result.diabetes_risk_percent}%
            </Text>
            <Text className="text-body font-sans text-secondary">
              {' '}
              ({result.diabetes_risk})
            </Text>
          </Text>
        )}
          <BreakLine />

          <Text className="text-description font-sans text-secondary text-center mb-4">
            {result.summary}
          </Text>

          <View className="bg-background p-4 rounded-lg mb-4 ">
            <Text className="text-tag font-sans text-secondary text-center">
              {quote}
            </Text>
          </View>

          <ShortButton
            title="สร้างการประเมินใหม่"
            onPress={() => router.push('/suggestion')}
            iconSrc={require('../../../assets/Suggestion/rotate-left.png')}
            iconPosition="left"
            className="mt-2 mb-1"
          />
        </Card>

        {/* Recommended Food */}
        <View className="px-6">
          <Text className="text-headline font-bold font-sans text-secondary mt-1 mb-1">
            เมนูอาหารที่แนะนำ
          </Text>
        </View>

        <ScrollView horizontal className="mt-4 px-4 " showsHorizontalScrollIndicator={false}>
          {result.healthAdvice.food.map((item, index) => (
            <AdviceCard
              key={index}
              title={item.title}
              description={item.description}
              image={require('../../../assets/Suggestion/people-healthy.png')}
            />
          ))}
        </ScrollView>

        {/* Recommended Exercise */}
        <View className="px-6">
          <Text className="text-headline font-bold font-sans text-secondary mt-2 mb-1">
            การออกกำลังกายที่แนะนำ
          </Text>
        </View>

        <ScrollView horizontal className="mt-4 px-4" showsHorizontalScrollIndicator={false}>
          {result.healthAdvice.exercise.map((item, index) => (
            <AdviceCard
              key={index}
              title={item.title}
              description={item.description}
              image={require('../../../assets/Suggestion/people-exercise.png')}
            />
          ))}
        </ScrollView>

        {/* Recommended Articles */}
        <View className="px-6">
          <Text className="text-headline font-bold font-sans text-secondary mt-2 mb-1">
            บทความที่แนะนำ
          </Text>
        </View>

        <ScrollView horizontal className="mt-4 px-1" showsHorizontalScrollIndicator={false}>
          {result.healthAdvice.blog.map((item, index) => (
            <AdviceCard
              key={index}
              title={item.category}
              description={item.category}
              image={require('../../../assets/Suggestion/people-yoga.png')}
            />
          ))}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}
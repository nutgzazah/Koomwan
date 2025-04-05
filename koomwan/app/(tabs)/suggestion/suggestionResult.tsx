import React, { useEffect, useState } from 'react';
import {
  Text,
  SafeAreaView,
  View,
  ScrollView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import Card from '../../../global/components/Card';
import BreakLine from '../../../global/components/BreakLine';
import { ShortButton } from '../tracking/components/ShortButton';
import AdviceCard from './components/AdviceCard';
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
    blog: { title: string; description: string }[];
  };
}

export default function SuggestionResult() {
  const router = useRouter();
  const [result, setResult] = useState<SuggestionResultData | null>(null);

  useEffect(() => {
    const fetchSuggestion = async () => {
      try {
        const response = await axios.post(
          `${BASE_URL}/api/v1/ai/predict`,
          {
            userId: '66144c9e33fa4a7b12345698',
            gender: 'male',
            age: 55,
            bmi: 31,
            blood_glucose_level: 195,
            HbA1c_level: 7.2,
            systolic_bp: 145,
            diastolic_bp: 95,
          }
        );
        console.log("flaskRes",response)
        console.log("flaskRes Data",response.data)
        setResult(response.data);
      } catch (err) {
        console.error('Error fetching prediction:', err);
      }
    };
    fetchSuggestion();
  }, []);

  if (!result) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <Text>กำลังประเมินผลสุขภาพ...</Text>
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
          <BreakLine />

          <Text className="text-description font-sans text-secondary text-center mb-4">
            {result.summary}
          </Text>

          <View className="bg-background p-4 rounded-lg mb-4 ">
            <Text className="text-tag font-sans text-secondary text-center">
              {result.motivation}
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
              title={item.title}
              description={item.description}
              image={require('../../../assets/Suggestion/people-yoga.png')}
            />
          ))}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}
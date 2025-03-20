import React, { useState, useCallback } from "react";
import {
  View,
  Image,
  Text,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { getEmotionImage, getEmotionLabel } from "../../constant/emotion";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import BASE_URL from "../../config";
import Loading from "../../global/components/Loading";
import { useFocusEffect } from "@react-navigation/native";

// Record type definition
interface Record {
  _id: string;
  recordtime: string;
  moodstatus?: string;
  [key: string]: any; // สำหรับ fields อื่นๆ ที่อาจมี
}

type EmotionType =
  | "laughing"
  | "happy"
  | "neutral"
  | "irritated"
  | "sick"
  | "crying"
  | "angry"
  | "none";

interface EmoteDisplayProps {
  Mood?: EmotionType; // Optional prop - can override fetched mood if provided
}

const EmoteDisplay: React.FC<EmoteDisplayProps> = ({ Mood }) => {
  const [loading, setLoading] = useState(true);
  const [mood, setMood] = useState<EmotionType>("none");

  const fetchLatestMood = async () => {
    try {
      setLoading(true);

      // If Mood is provided, use it directly
      if (Mood) {
        setMood(Mood);
        setLoading(false);
        return;
      }

      // Get auth data from local storage
      const authData = await AsyncStorage.getItem("@auth");

      if (!authData) {
        console.error("Session expired or user not logged in");
        setLoading(false);
        return;
      }

      // Parse auth data
      const auth = JSON.parse(authData);
      const token = auth.token;
      const userId = auth.user._id;

      // Fetch all records for the user
      const response = await axios.get(
        `${BASE_URL}/api/v1/user/getRecord/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (
        response.data &&
        response.data.success &&
        response.data.records &&
        response.data.records.length > 0
      ) {
        // Sort records by date (newest first)
        const sortedRecords = response.data.records.sort(
          (a: Record, b: Record) => {
            return (
              new Date(b.recordtime).getTime() -
              new Date(a.recordtime).getTime()
            );
          }
        );

        // Get the latest record
        const latestRecord = sortedRecords[0];

        if (latestRecord && latestRecord.moodstatus) {
          setMood(latestRecord.moodstatus as EmotionType);
        } else {
          setMood("none");
        }
      } else {
        // No records found or no mood status set
        setMood("none");
      }
    } catch (error) {
      console.error("Error fetching latest mood:", error);
      setMood("none");
    } finally {
      setLoading(false);
    }
  };

  // ใช้ useFocusEffect แทน useEffect เพื่อให้โหลดข้อมูลใหม่ทุกครั้งที่หน้าจอได้รับโฟกัส
  useFocusEffect(
    useCallback(() => {
      fetchLatestMood();

      // Clean up function (optional)
      return () => {
        // ทำความสะอาดข้อมูลหรือยกเลิก request ที่ยังค้างอยู่ (ถ้ามี)
      };
    }, [Mood])
  );

  if (loading) {
    return <Loading />;
  }

  const emotionImage = getEmotionImage(mood);
  const emotionLabel = getEmotionLabel(mood);

  return (
    <SafeAreaView>
      <View className="flex flex-row items-center p-4 bg-white justify-evenly my-8">
        <Image
          source={emotionImage}
          className="w-24 h-24"
          resizeMode="contain"
        />
        <Text className="text-description font-regular text-center text-secondary ml-3">
          {emotionLabel}
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default EmoteDisplay;

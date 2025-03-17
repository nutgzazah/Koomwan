import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  ScrollView,
  Alert,
  ImageSourcePropType,
} from "react-native";
import axios from "axios";
import Card from "../../../../global/components/Card";
import BreakLine from "../../../../global/components/BreakLine";
import BackButton from "../../../../global/components/BackButton";
import Loading from "../../../../global/components/Loading";
import BASE_URL from "../../../../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useLocalSearchParams } from "expo-router";

interface Blog {
  title: string;
  content: string;
  image: ImageSourcePropType;
  date: Date;
  category: string;
  refs: string;
}

function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Intl.DateTimeFormat('th-TH', options).format(date);
}

function ArticleStructure({
  title,
  content,
  image,
  date,
  category,
  refs,
}: Blog) {
  return (
    <SafeAreaView className="flex-1">
      <ScrollView 
        className="mb-24"
        showsVerticalScrollIndicator={false}
      >
        <BackButton title="ย้อนกลับ" />
        <Card>
          <Text className="font-sans text-headline text-secondary w-full ml-4">{title}</Text>
          <BreakLine />
          <Text className="font-sans text-tag text-secondary w-full ml-4">{formatDate(new Date(date))}</Text>
          <View className="mx-4 w-full h-[9.375rem] mb-3">
            <Image
              className="w-full h-full"
              source={image}
            />
          </View>
          <Text className="font-sans text-description text-secondary w-full ml-4 pr-4">{content}</Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

export default function ArticleContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [blogData, setBlogData] = useState<Blog>();
  const resource_id = useLocalSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const authData = await AsyncStorage.getItem("@auth");
        console.log(resource_id)

        if (!authData) {
          Alert.alert("Session Expired ", "Please login again");
          router.push("/user/login");
          return;
        }

        const auth = JSON.parse(authData);
        const token = auth.token;
        const userId = auth.user._id;
        const healthInfoId = auth.user.healthinfo;

        if (!userId || !token) {
          Alert.alert("Session Expired", "Please login again");
          router.push("/user/login");
          return;
        }

        const resourceResponse = await axios.get(`${BASE_URL}/api/v1/admin/blog/${resource_id.id}`)

        if (resourceResponse.data.success) {
          setBlogData(resourceResponse.data.data);
          console.log(resourceResponse.data.data);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);

        if (axios.isAxiosError(error) && error.response?.status === 401) {
          await AsyncStorage.multiRemove(["userId", "token", "@auth"]);
          Alert.alert("Session Expired", "Please login again", [
            { text: "OK", onPress: () => router.push("/user/login") },
          ]);
        } else {
          Alert.alert(
            "Error",
            "Failed to load profile data. Please try again later.",
            [{ text: "OK", onPress: () => router.back() }]
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || !blogData) {
    return <Loading />;
  }
  return (
    <ArticleStructure
      title={blogData.title}
      content={blogData.content}
      image={blogData.image}
      date={blogData.date}
      category={blogData.category}
      refs={blogData.refs}
    />
  )
}
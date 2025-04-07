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
import HTMLView from "react-native-htmlview";

interface Blog {
  title: string;
  content: string;
  image: string;
  date: Date;
  category: string;
  refs: string;
}

function formatDate(date: Date): string {
  const thaiWeekdays = [
    "อาทิตย์",
    "จันทร์",
    "อังคาร",
    "พุธ",
    "พฤหัส",
    "ศุกร์",
    "เสาร์",
  ];

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const formattedDate = new Intl.DateTimeFormat("th-TH", options).format(date);
  const weekdayIndex = date.getDay();
  const thaiWeekday = thaiWeekdays[weekdayIndex];

  return `${thaiWeekday}, ${formattedDate}`;
}

function ArticleStructure({
  title,
  content,
  image,
  date,
  category,
  refs,
}: Blog) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    async function fetchImage() {
      try {
        const [folder, fileName] = image.includes("/") ? image.split("/") : ["blogImage", image];

        const response = await axios.get(`${BASE_URL}/api/v1/storage/getFileUrl`, {
          params: { fileName, folder },
          headers: { "Cache-Control": "no-cache" },
        });

        setImageUrl(response.data.success ? response.data.url : `${BASE_URL}/uploads/${image}`);
      } catch (error) {
        setImageUrl("");
      }
    }

    fetchImage();
  }, [image]);

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
          <Text className="font-sans text-tag text-secondary w-full ml-4 mb-3">เขียนโดย : {refs}</Text>
          <View className="mx-4 w-full min-h-[9.375rem] max-h-[18rem] mb-3">
            <Image
              className="w-full h-full"
              source={{ uri: imageUrl } as ImageSourcePropType}
              resizeMode="contain"
            />
          </View>
          <View className="w-[24rem]">
            <HTMLView
              value={content} // Pass the HTML content
              stylesheet={{
                p: {
                  fontFamily: "K2D-Regular",
                  fontSize: 14,
                  color: "#3E3B5B",
                },
                strong: {
                  fontFamily: "K2D-Bold",
                  fontSize: 16,
                  color: "#3E3B5B",
                  fontWeight: "bold",
                },
                a: {
                  fontFamily: "K2D-Bold",
                  fontSize: 14,
                  color: "#3E3B5B",
                  textDecorationLine: "underline",
                  fontWeight: "bold",
                },
                li: {
                  fontFamily: "K2D-Regular",
                  fontSize: 14,
                  color: "#3E3B5B",
                },
              }}
            />
          </View>
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

        const resourceResponse = await axios.get(`${BASE_URL}/api/v1/admin/blog/${resource_id.id}`);

        if (resourceResponse.data.success) {
          setBlogData(resourceResponse.data.data);
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          await AsyncStorage.multiRemove(["userId", "token", "@auth"]);
          Alert.alert("Session Expired", "Please login again", [
            { text: "OK", onPress: () => router.push("/user/login") },
          ]);
        } else {
          Alert.alert(
            "Error",
            "Failed to fetch the article. Please try again later.",
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
      refs={blogData.ref}
    />
  );
}
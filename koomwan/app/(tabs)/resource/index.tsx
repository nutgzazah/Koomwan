import React, { useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  Image,
  ScrollView,
  ImageSourcePropType,
  Alert,
  Pressable,
} from "react-native";
import axios from "axios";
import ArticleBox from "./components/ArticleBox";
import SearchBox from "../../../global/components/SearchBox";
import PopupScreen from "../../../global/components/PopupScreen";
import Loading from "../../../global/components/Loading";
import BASE_URL from "../../../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

interface Blog {
  _id: string;
  title: string;
  content: string;
  image: ImageSourcePropType;
  date: Date;
  category: string;
  ref: string;
}

export default function ResourceScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [blogsData, setBlogsData] = useState<Blog[]>([]);
  const mockChoices: string[] = [
    "การดูแลสุขภาพ",
    "ความรู้",
    "โภชนาการ",
    "การดูแลสุขภาพ",
    "การออกกำลังกาย",
    "โรค",
    "ผู้ป่วยเบาหวาน",
  ]

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

        const resourceResponse = await axios.get(`${BASE_URL}/api/v1/admin/blog`)

        if (resourceResponse.data.success) {
          setBlogsData(resourceResponse.data.data);
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

  if (loading || !blogsData) {
    return <Loading />;
  }

  return (
    <SafeAreaView className="flex-1">
      <ScrollView 
        className="mb-24"
        showsVerticalScrollIndicator={false}
      >
        <PopupScreen
          header="หมวดหมู่"
          modalVisible={modalVisible}
          setModalVisible={(() => setModalVisible(!setModalVisible))}
          choices={mockChoices}
          modalClosePlaceholder="ปิด"
        />
        <View className="flex flex-row ml-10 my-4 items-center">
          <Pressable 
            className="mr-4"
            onPress={() => setModalVisible(true)}
          >
            <Image
              source={require('../../../assets/Resource/filter-search.png')}
              className="w-6 h-6"
            />
          </Pressable>

          <SearchBox
            value={searchQuery}
            fullSize={false}
            placeholder={"ค้นหา..."}
            onChangeText={setSearchQuery}
          />
        </View>
        {
          blogsData.map((item, index) => (
            <ArticleBox
              key={index}
              title={item.title}
              imageSource={item.image}
              categories={item.category}
              articleId={item._id}
            />
          ))
        }
      </ScrollView>
    </SafeAreaView>
  );
}
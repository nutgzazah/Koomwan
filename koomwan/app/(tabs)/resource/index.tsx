import React, { useState, useMemo } from "react";
import {
  View,
  SafeAreaView,
  Image,
  ScrollView,
  Alert,
  Pressable,
  Text,
} from "react-native";
import axios from "axios";
import ArticleBox from "./components/ArticleBox";
import SearchBox from "../../../global/components/SearchBox";
import PopupScreen from "../../../global/components/PopupScreen";
import Loading from "../../../global/components/Loading";
import BASE_URL from "../../../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";

interface Blog {
  _id: string;
  title: string;
  content: string;
  image: string;
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
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const choices: string[] = extractCategories(blogsData);

  function extractCategories(blogList: Blog[]): string[] {
    const categorySet = new Set<string>([
      "ความรู้",
      "โภชนาการ",
      "โรค",
      "ออกกำลังกาย",
      "แรงบันดาลใจ",
      "ข่าวสาร",
    ]);
    return Array.from(categorySet);
  }

  const filteredBlogs = useMemo(() => {
    return blogsData.filter(blog =>
      blog.title.toLowerCase().includes(searchQuery.toLowerCase())
      && blog.content.toLowerCase().includes(searchQuery.toLowerCase())
      && (selectedCategories.length === 0 || selectedCategories.some(category => blog.category.includes(category))) // ใช้เงื่อนไข OR ในการ Filter
    );
  }, [blogsData, searchQuery, selectedCategories]);


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

      if (!userId || !token) {
        Alert.alert("Session Expired", "Please login again");
        router.push("/user/login");
        return;
      }

      const resourceResponse = await axios.get(`${BASE_URL}/api/v1/admin/blog`);

      if (resourceResponse.data.success) {
        const blogs = resourceResponse.data.data;

        // Fetch image URLs for each blog
        const blogsWithImageUrls = await Promise.all(
          blogs.map(async (blog: Blog) => {
            const [folder, fileName] = blog.image.includes("/")
              ? blog.image.split("/")
              : ["blogImage", blog.image];
            if (folder.includes("http")) {
              return blog.image;
            }
  
            try {
              const response = await axios.get(`${BASE_URL}/api/v1/storage/getFileUrl`, {
                params: { fileName, folder },
                headers: { "Cache-Control": "no-cache" },
              });
  
              const imageUrl = response.data.success
                ? response.data.url
                : `${BASE_URL}/uploads/${blog.image}`;
  
              return { ...blog, image: imageUrl || "" }; // Fallback to default image
            } catch (error) {
              return { ...blog, image: "" }; // Fallback to default image
            }
          })
        );

        setBlogsData(blogsWithImageUrls);
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
          "Failed to load profile data. Please try again later.",
          [{ text: "OK", onPress: () => router.back() }]
        );
      }
    } finally {
      setLoading(false);
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

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
          setModalVisible={() => setModalVisible(!modalVisible)}
          choices={choices}
          modalClosePlaceholder="ปิด"
          onChoiceSelect={setSelectedCategories}
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
        {filteredBlogs.length > 0 ? (
          filteredBlogs.map((item, index) => (
            <ArticleBox
              key={index}
              title={item.title}
              imageSource={item.image}
              categories={item.category}
              articleId={item._id}
            />
          ))
        ) : (
          <View className="flex-1 justify-center items-center mt-[16.125rem]">
            {/* Display if no blogs data is found */}
            <Image
              source={require("../../../assets/Resource/search-status.png")}
              className="w-[3.375rem] h-[3.375rem] mb-2"
            />
            <Text className="font-sans text-button text-secondary mx-10 text-center">
              ไม่มีข้อมูล
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
import {
  View,
  Modal,
  Alert,
  Text,
  SafeAreaView,
  Pressable,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import ForumCard from "./components/ForumCard";
import SearchBox from "../../../global/components/SearchBox";
import TwoChoiceFilterBox from "../../../global/components/FilterBox";
import { useRouter } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import BASE_URL from "../../../config"

const mockImageContent = require("../../../assets/Forum/forum-image.png")

type Post = {
  _id: string;
  image: string;
  likes: { count: number };
  comments: { length: number };
  title: string;
  imageUrl: string; 
};

export default function ForumScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFilterChoice, setCurrentFilterChoice] = useState(1);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
  try {
    const response = await axios.get<Post[]>(`${BASE_URL}/api/v1/forum/getAllPost`);
    const postsData = response.data;

    // เรียก API เพื่อแปลง path เป็น URL จริง
    const urls = await Promise.all(
      postsData.map(async (post) => {
        // ถ้าไม่มีรูป (post.image เป็นค่าว่างหรือ undefined) ให้ใช้ค่า default ทันที
        if (!post.image || post.image.trim() === "") {
          return { _id: post._id, imageUrl: null }; // ไม่มีภาพ ไม่ต้องส่ง imageContent
        }

        try {
          const res = await axios.get<{ url: string }>(
            `${BASE_URL}/api/v1/storage/getFileUrlFromPath`,
            { params: { path: post.image } }
          );
          console.log("IMAGE SSSSSSS",res.data.url)
          return { _id: post._id, imageUrl: res.data.url };
        } catch (error) {
          console.error(`Error fetching image for post ${post._id}:`, error);
          return { _id: post._id, imageUrl: null }; //ไม่มีภาพให้ส่งค่า null
          
        }
      })
    );

    // ผูก URL จริงกับข้อมูล post
    const postsWithImages = postsData.map((post) => ({
      ...post,
      imageUrl: urls.find((item) => item._id === post._id)?.imageUrl || null,
    }));
    console.log("Fetched image URLs:", urls);
    setPosts(postsWithImages);
  } catch (error) {
    console.error("Error fetching posts:", error);
  } finally {
    setLoading(false);
  }
};

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1">
        <ScrollView className="mb-24" showsVerticalScrollIndicator={false}>
          <View className="mx-6 my-4">
            <SearchBox
              value={searchQuery}
              fullSize={true}
              placeholder={"ค้นหา..."}
              onChangeText={setSearchQuery}
            />
          </View>

          <View className="mx-6 mb-4">
            <TwoChoiceFilterBox
              first_choice="ล่าสุด"
              second_choice="ยอดนิยม"
              first_onPress={() => setCurrentFilterChoice(1)}
              second_onPress={() => setCurrentFilterChoice(2)}
              current_choice={currentFilterChoice}
            />
          </View>

          <CreatePostTrigger />

          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            posts.map((post) => (
              <ForumCard
                key={post._id}
                {...(post.imageUrl ? { imageContent: { uri: post.imageUrl } } : {})} // ส่ง imageContent เฉพาะที่มีค่า
                like={post.likes.count}
                comments={post.comments.length}
                userimage={{ uri: "https://your-cdn.com/default-user.png" }} // เปลี่ยนเป็น URL โปรไฟล์จริง
                userName={"ไม่ระบุชื่อ"} // หาก API ไม่มีข้อมูล username ต้องแก้ไขตรงนี้
                doctorImage={{ uri: "https://your-cdn.com/default-doctor.png" }}
                doctorName={"แพทย์ไม่ระบุชื่อ"} // หาก API ไม่มีข้อมูลแพทย์ ต้องแก้ไขตรงนี้
                content={post.title}
                viewComments={false}
              />
            ))
            
          )}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );

  function CreatePostTrigger() {
    return (
      <Pressable
        className={"rounded-md bg-card mx-6 px-3 pt-4 pb-3"}
        onPress={() => router.push("/forum/create")}
      >
        <View className="flex flex-row justify-between items-center">
          <Image
            className="w-12 h-12 self-start ml-5"
            source={require("../../../assets/Login/user.png")}
          />
          <Text className="font-sans text-description text-gray">
            คุณกำลังมีข้อสงสัยอะไรอยู่...
          </Text>
          <Image
            className="w-6 h-6 mr-6"
            source={require("../../../assets/Forum/Pen-bold.png")}
          />
        </View>
      </Pressable>
    );
  }
}
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

const defaultUserAvatar01 = require("../../../assets/Avatars/koomwanAvatar01.png");
const defaultUserAvatar02 = require("../../../assets/Avatars/koomwanAvatar02.png");
const defaultUserAvatar03 = require("../../../assets/Avatars/koomwanAvatar03.png");
const defaultUserAvatar04 = require("../../../assets/Avatars/koomwanAvatar04.png");

type Post = {
  _id: string;
  image: string;
  likes: { count: number };
  comments: { length: number };
  title: string;
  imageUrl: string | null;
  postedBy: {
    username: string;
    image: string;  // เพิ่มฟิลด์รูปโปรไฟล์ของ user
  };
  userImage: string | null; // เก็บ URL รูปโปรไฟล์ของผู้ใช้
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
    
    // ดึง URL สำหรับรูปภาพโพสต์และโปรไฟล์ของผู้ใช้
    const urls = await Promise.all(
      postsData.map(async (post) => {
        const imageUrl = post.image
          ? await getImageUrl(post.image)
          : null;

        let userImageUrl = null;
          if (post.postedBy?.image) {
          // Checking if the user image is one of the local avatar files
          if (
            post.postedBy.image === "koomwanAvatar01.png" ||
            post.postedBy.image === "koomwanAvatar02.png" ||
            post.postedBy.image === "koomwanAvatar03.png" ||
            post.postedBy.image === "koomwanAvatar04.png"
          ) {
            // Set the local path for the avatar image
            userImageUrl = post.postedBy.image;
          } else {
            // Fallback to fetching the image URL if not a local avatar
            userImageUrl = await getProfileImageUrl(post.postedBy.image, "user");
          }
        }

        return {
          _id: post._id,
          imageUrl,
          userImage: userImageUrl,
        };
      })
    );

    // รวมข้อมูลที่อัปเดต
    const postsWithImages = postsData.map((post) => ({
      ...post,
      imageUrl: urls.find((item) => item._id === post._id)?.imageUrl || null,
      userImage: urls.find((item) => item._id === post._id)?.userImage || null,
    }));

      setPosts(postsWithImages);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันดึง URL ของไฟล์จาก path
  const getImageUrl = async (path: string): Promise<string | null> => {
    try {
      const res = await axios.get<{ url: string }>(
        `${BASE_URL}/api/v1/storage/getFileUrlFromPath`,
        { params: { path } }
      );
      return res.data.url;
    } catch (error) {
      console.error(`Error fetching image for path ${path}:`, error);
      return null;
    }
  };

  const getProfileImageUrl = async (fileName: string, folder: string, ) : Promise<string | null> => {
    try {
      const res = await axios.get<{ url: string }>(
        `${BASE_URL}/api/v1/storage/getFileUrl`,
        { params: { fileName,folder } }
      );
      return res.data.url;
    } catch (error) {
      console.error(`Error fetching image for path ${folder}/${fileName}:`, error);
      return null;
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
                userimage={
                  post.userImage ? (
                    post.userImage === "koomwanAvatar01.png" ? defaultUserAvatar01 :
                    post.userImage === "koomwanAvatar02.png" ? defaultUserAvatar02 :
                    post.userImage === "koomwanAvatar03.png" ? defaultUserAvatar03 :
                    post.userImage === "koomwanAvatar04.png" ? defaultUserAvatar04 :
                    { uri: post.userImage } // ถ้าไม่ใช่ 4 avatar ข้างต้น ให้ใช้ URL ของ userImage
                  ) : defaultUserAvatar01 // 🟢 ใช้รูป local ถ้า user ไม่มีรูป
                }
                userName={post.postedBy?.username || "ไม่ระบุชื่อ"}
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
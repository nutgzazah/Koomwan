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
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import ForumCard from "./components/ForumCard";
import SearchBox from "../../../global/components/SearchBox";
import TwoChoiceFilterBox from "../../../global/components/FilterBox";
import { useRouter } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthContext } from "../../../context/authContext";
import BASE_URL from "../../../config"
import { useFocusEffect } from "@react-navigation/native";

const defaultUserAvatar01 = require("../../../assets/Avatars/koomwanAvatar01.png");
const defaultUserAvatar02 = require("../../../assets/Avatars/koomwanAvatar02.png");
const defaultUserAvatar03 = require("../../../assets/Avatars/koomwanAvatar03.png");
const defaultUserAvatar04 = require("../../../assets/Avatars/koomwanAvatar04.png");
const defaultDoctorAvatar01 = require("../../../assets/Avatars/koomwanDoctorAvatar01.png");
const defaultDoctorAvatar02 = require("../../../assets/Avatars/koomwanDoctorAvatar02.png");

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
  createdAt: string;
  posttime: string;
  doctorImage: string;
  doctorName: string; 
  postId: string;
  
};

export default function ForumScreen() {
  const router = useRouter();
  const [state] = useContext(AuthContext)
  const token = state?.token;
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFilterChoice, setCurrentFilterChoice] = useState(1);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  console.log("State2: ",state)
  console.log("State Image: ",state.user.image)

  // ใช้ useFocusEffect เพื่อรีโหลดโพสต์ทุกครั้งที่หน้าถูกเรียกใหม่
  useFocusEffect(
    React.useCallback(() => {
      fetchPosts();
    }, [])
  );

  useEffect(() => {
    if (!state?.user?.image) return; // ป้องกัน state.user.image เป็น null หรือ undefined

    console.log("State User Role:", state?.user.role);
    console.log("State User Image:", state?.user.image);

    if (state?.user.image.startsWith("koomwanAvatar")) {
      setProfileImageUrl(
        state.user.image === "koomwanAvatar01.png" ? defaultUserAvatar01 :
        state.user.image === "koomwanAvatar02.png" ? defaultUserAvatar02 :
        state.user.image === "koomwanAvatar03.png" ? defaultUserAvatar03 :
        state.user.image === "koomwanAvatar04.png" ? defaultUserAvatar04 :
        defaultUserAvatar01
      );
    } else if (state?.user.image.startsWith("koomwanDoctorAvatar")) {
      setProfileImageUrl(
        state.user.image === "koomwanDoctorAvatar01.png" ? defaultDoctorAvatar01 :
        state.user.image === "koomwanDoctorAvatar02.png" ? defaultDoctorAvatar02 :
        defaultDoctorAvatar01
      );
    }else if (state?.user.role === "doctor") {
      console.log("Fetching doctor image...");
      getImageUrl(state.user.image).then((url) => {
        console.log("Doctor Image URL:", url);
        setProfileImageUrl(url);
      }).catch((error) => {
        console.error("Error fetching doctor image:", error);
      });
    } else if (state?.user.role === "user") {
      console.log("Fetching user image...");
      getProfileImageUrl(state.user.image, "user").then((url) => { 
        console.log("User Image URL:", url);
        setProfileImageUrl(url);
      }).catch((error) => {
        console.error("Error fetching user image:", error);
      });
    }
    fetchPosts();
  }, [currentFilterChoice, state?.user.image]);

  const fetchPosts = async () => {
  try {
    const response = await axios.get<Post[]>(`${BASE_URL}/api/v1/forum/getAllPost`);
    let postsData = response.data;

    
     // กรองโพสต์เฉพาะภายใน 1 เดือนที่ผ่านมา
     const oneMonthAgo = new Date();
     oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
 
     postsData = postsData.filter((post) => new Date(post.createdAt) >= oneMonthAgo);
 
     // เรียงลำดับโพสต์ตามไลค์ ถ้าเลือก "ยอดนิยม"
     if (currentFilterChoice === 2) {
       postsData.sort((a, b) => b.likes.count - a.likes.count);
     }

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
              post.postedBy.image.startsWith("koomwanAvatar")
            ) {
              // Set the local path for the avatar image
              userImageUrl = post.postedBy.image;
            } else {
              // Fallback to fetching the image URL if not a local avatar
              userImageUrl = await getProfileImageUrl(post.postedBy.image, "user");
            }
          }

        // หาคอมเมนต์ล่าสุดที่เป็นของ Doctor
        const latestDoctorComment = [...post.comments]
          .reverse()
          .find((comment) => comment.commenterModel === "Doctor");

        let doctorImageUrl = null;
        let doctorName = null;

        if (latestDoctorComment) {
          const doctorResponse = await axios.get<{ firstname: string; lastname: string; image: string }>(
            `${BASE_URL}/api/v1/forum/getDoctorInfo`,
            { params: { doctorId: latestDoctorComment.commenter } }
          );

          doctorName = doctorResponse.data.firstname+" "+doctorResponse.data.lastname;
          if (doctorResponse.data?.image) {
            if (
            doctorResponse.data.image.startsWith("koomwanDoctorAvatar")
            ) {
              // Set the local path for the avatar image
              doctorImageUrl = doctorResponse.data.image;
            } else {
              // Fallback to fetching the image URL if not a local avatar
              doctorImageUrl = await getImageUrl(doctorResponse.data.image);
            }
          }
        }

        return {
          _id: post._id,
          imageUrl,
          userImage: userImageUrl,
          doctorImage: doctorImageUrl,
          doctorName: doctorName,
          postId: post._id,
        };
      })
    );

    // รวมข้อมูลที่อัปเดต
    const postsWithImages = postsData.map((post) => ({
      ...post,
      imageUrl: urls.find((item) => item._id === post._id)?.imageUrl || null,
      userImage: urls.find((item) => item._id === post._id)?.userImage || null,
      doctorImage: urls.find((item) => item._id === post._id)?.doctorImage || null,
      doctorName: urls.find((item) => item._id === post._id)?.doctorName || null,
      posttime: post.createdAt, // 🟢 ใช้ createdAt เป็น posttime
      postId: post._id, // Add postId
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

          {state.user.role !== "doctor" && <CreatePostTrigger />}

          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            posts
            .filter((post) =>
              post.title.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((post) => (
              <ForumCard
                key={post._id}
                postId={post.postId}  // Pass postId
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
                doctorImage={
                  post.doctorImage ? (
                    post.doctorImage === "koomwanDoctorAvatar01.png" ? defaultDoctorAvatar01 :
                    post.doctorImage === "koomwanDoctorAvatar02.png" ? defaultDoctorAvatar02 :
                  { uri: post.doctorImage } 
                ) : defaultDoctorAvatar01
              }
                doctorName={post.doctorName || ""}
                content={post.title}
                viewComments={false}
                posttime={post.posttime} // 🟢 ส่ง posttime ไปยัง ForumCard
                handlePostDeleted={() =>  fetchPosts() } // ✅ Toggle เพื่อให้ useEffect โหลดข้อมูลใหม่
                
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
        className={"rounded-2xl bg-card mx-6 px-3 pt-4 pb-3"}
        onPress={() => router.push("/forum/create")}
      >
        <View className="flex flex-row justify-between items-center">
        <Image
            className="w-12 h-12 self-start ml-5 rounded-full"
            source={
              state?.user.image.startsWith("koomwanAvatar") 
              ? state.user.image === "koomwanAvatar01.png" ? defaultUserAvatar01 :
                state.user.image === "koomwanAvatar02.png" ? defaultUserAvatar02 :
                state.user.image === "koomwanAvatar03.png" ? defaultUserAvatar03 :
                state.user.image === "koomwanAvatar04.png" ? defaultUserAvatar04 :
                defaultUserAvatar01 // fallback หากไม่ตรงกับที่กำหนด
              : state?.user.image.startsWith("koomwanDoctorAvatar") 
                ? state.user.image === "koomwanDoctorAvatar01.png" ? defaultDoctorAvatar01 :
                  state.user.image === "koomwanDoctorAvatar02.png" ? defaultDoctorAvatar02 :
                  defaultDoctorAvatar01 // fallback หากไม่ตรงกับที่กำหนด
                : state?.user.role === "doctor" ? { uri: profileImageUrl } : { uri: profileImageUrl } // ใช้ getProfileImageUrl หากเป็น user
            }
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
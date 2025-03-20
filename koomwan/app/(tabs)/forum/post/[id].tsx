import {
  View,
  SafeAreaView,
  ScrollView,
  Text,
} from "react-native";
import React, { useEffect, useState } from "react";
import ForumCard from "../components/ForumCard";
import CommentCard from "../components/CommentBox";
import { useLocalSearchParams } from 'expo-router';
import axios from "axios";
import BASE_URL from "../../../../config"

const defaultUserAvatar01 = require("../../../../assets/Avatars/koomwanAvatar01.png");
const defaultUserAvatar02 = require("../../../../assets/Avatars/koomwanAvatar02.png");
const defaultUserAvatar03 = require("../../../../assets/Avatars/koomwanAvatar03.png");
const defaultUserAvatar04 = require("../../../../assets/Avatars/koomwanAvatar04.png");
const defaultDoctorAvatar01 = require("../../../../assets/Avatars/koomwanDoctorAvatar01.png");
const defaultDoctorAvatar02 = require("../../../../assets/Avatars/koomwanDoctorAvatar02.png");

// ฟังก์ชันดึง URL รูปภาพจาก Cloudflare
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

// ฟังก์ชันดึง URL รูปโปรไฟล์จาก Cloudflare
const getProfileImageUrl = async (
  fileName: string,
  folder: string
): Promise<string | null> => {
  try {
    const res = await axios.get<{ url: string }>(
      `${BASE_URL}/api/v1/storage/getFileUrl`,
      { params: { fileName, folder } }
    );
    return res.data.url;
  } catch (error) {
    console.error(`Error fetching profile image for ${folder}/${fileName}:`, error);
    return null;
  }
};

export default function ForumScreen() {
  const { postId }  = useLocalSearchParams();
  const [postData, setPostData] = useState<any>(null);  // เก็บข้อมูลโพสต์
  const [comments, setComments] = useState<any[]>([]);  // เก็บข้อมูลคอมเมนต์
  const [loading, setLoading] = useState(true); // เพิ่มสถานะโหลด


  useEffect(() => {
    
    if (postId) {
      axios.get(`${BASE_URL}/api/v1/forum/getPostById/${postId}`)
        .then(async (response) => {
          const post = response.data;

          // ดึง URL รูปภาพโพสต์
          const imageContent = post.image ? await getImageUrl(post.image) : null;

          // ดึง URL รูปโปรไฟล์ของผู้โพสต์
          let userImageUrl = null;
          if (post.postedBy?.image) {
            if (post.postedBy.image.startsWith("koomwanAvatar")) {
              userImageUrl = post.postedBy.image; // ใช้ local path
            } else {
              userImageUrl = await getProfileImageUrl(post.postedBy.image, "user");
            }
          }

          // อัปเดตโพสต์พร้อมข้อมูลรูปภาพ
          setPostData({
            ...post,
            imageContent,
            userImageUrl,
          });
          console.log( postData) 

          // โหลดข้อมูลคอมเมนต์พร้อมข้อมูลหมอ
          const commentsWithDoctorInfo = await Promise.all(
            post.comments.map(async (comment) => {
              let doctorName = "คุณหมอ";
              let doctorImageUrl = null;
              let isOwner = false;

              if (comment.role === "owner") {
                doctorName = post.postedBy.username ;
                // ดึง URL รูปโปรไฟล์ของผู้โพสต์
                let userImageUrl = null;
                if (post.postedBy?.image) {
                  if (post.postedBy.image.startsWith("koomwanAvatar")) {
                    userImageUrl = post.postedBy.image; // ใช้ local path
                  } else {
                    userImageUrl = await getProfileImageUrl(post.postedBy.image, "user");
                  }
                }
                doctorImageUrl = userImageUrl;
                isOwner = true; // ✅ 
              }else if (comment.role === "doctor") {
                try {
                  const doctorResponse = await axios.get<{ firstname: string; lastname: string; image: string }>(
                    `${BASE_URL}/api/v1/forum/getDoctorInfo`,
                    { params: { doctorId: comment.commenter } }
                  );

                  doctorName = `${doctorResponse.data.firstname} ${doctorResponse.data.lastname}`;
                  if (doctorResponse.data?.image) {
                    if (doctorResponse.data.image.startsWith("koomwanDoctorAvatar")) {
                      doctorImageUrl = doctorResponse.data.image; // ใช้ local path
                    } else {
                      doctorImageUrl = await getImageUrl(doctorResponse.data.image);
                    }
                  }
                } catch (error) {
                  console.error(`Error fetching doctor info for ID ${comment.commenter}:`, error);
                }
              }
              

              return {
                ...comment,
                doctorName,
                doctorImageUrl,
                isOwner, // ✅ เพิ่มฟิลด์ isOwner ลงไป
              };
              
            })
          );

          setComments(commentsWithDoctorInfo);
          console.log(commentsWithDoctorInfo)
          console.log("comments Data:",comments)

        })
        .catch(error => {
          console.error("Error fetching post:", error);
        });
    }
  }, [postId]);
  if (!postData) {
    return (
      <SafeAreaView className="flex-1">
        <Text>กำลังโหลดข้อมูลโพสต์...</Text>
      </SafeAreaView>
    );
  }
  

  return (
    <SafeAreaView className="flex-1">
      <ScrollView 
        className="mb-24"
        showsVerticalScrollIndicator={false}
      >
        <View>
          <ForumCard
              imageContent={postData.imageContent}  // รูปภาพของโพสต์
              like={postData.likes.count}  // จำนวนไลก์
              comments={comments.length}  // จำนวนคอมเมนต์
              userimage={
                postData.userImageUrl ? (
                  postData.userImageUrl === "koomwanAvatar01.png" ? defaultUserAvatar01 :
                  postData.userImageUrl === "koomwanAvatar02.png" ? defaultUserAvatar02 :
                  postData.userImageUrl === "koomwanAvatar03.png" ? defaultUserAvatar03 :
                  postData.userImageUrl === "koomwanAvatar04.png" ? defaultUserAvatar04 :
                  { uri: postData.userImageUrl } // ถ้าไม่ใช่ 4 avatar ข้างต้น ให้ใช้ URL ของ userImage
                ) : defaultUserAvatar01 // 🟢 ใช้รูป local ถ้า user ไม่มีรูป
              }
              userName={postData.postedBy.username}  // ชื่อผู้โพสต์
              doctorImage={null}  // ไม่มีข้อมูลหมอใน ForumCard
              doctorName={null}
              content={postData.title}  // เนื้อหาของโพสต์
              viewComments={true}
              posttime={postData.date}
            />
          {comments.map((comment, index) => (
            <CommentCard
            key={index}
            profileImage={
              comment.doctorImageUrl ? (
                comment.doctorImageUrl === "koomwanAvatar01.png" ? defaultUserAvatar01 :
                comment.doctorImageUrl === "koomwanAvatar02.png" ? defaultUserAvatar02 :
                comment.doctorImageUrl === "koomwanAvatar03.png" ? defaultUserAvatar03 :
                comment.doctorImageUrl === "koomwanAvatar04.png" ? defaultUserAvatar04 :
                comment.doctorImageUrl === "koomwanDoctorAvatar01.png" ? defaultDoctorAvatar01 :
                comment.doctorImageUrl === "koomwanDoctorAvatar02.png" ? defaultDoctorAvatar02 :
              { uri: comment.doctorImageUrl } 
            ) : defaultDoctorAvatar01
            }
            doctorName={comment.doctorName} // ชื่อคุณหมอ
            content={comment.answer}  // คอนเทนต์ของคอมเมนต์
            imageContentSource={null} // ไม่มีข้อมูลรูปภาพในคอมเมนต์
            commentTime={comment.date}
            isOwner={comment.isOwner} // ✅ ส่งค่า isOwner ไปด้วย
          />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView> 
  );
}

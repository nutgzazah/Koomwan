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

const mockImageContent = require("../../../../assets/Forum/forum-image.png");

export default function ForumScreen() {
  const mockDoctor = require("../../../../assets/Forum/doctor-profile-mock.png");
  const mockTextContent =
      `เอ่อช่วงนี้เลิกงานดึกประจำเลยทำให้ต้องออกกำลังกายตอนกลางคืนบ่อยๆ จะมีผลต่อระดับน้ำตาลในเลือดไหมครับ \nแล้วควรจะกินอะไรหลังออกกำลังกายดี?`;
  const mockName = "นายแพทย์ภูรินทร์ ดำรงค์ธรรม"; 
  const mockUsername = "อาทิตย์ สมใจ";
  const mockProfile = require("../../../../assets/Forum/user-mock.png");
  const mockDoctorName = "นายแพทย์ภูรินทร์ ดำรงค์ธรรม";
  const mockResponse = 
  `การกินยาหลายชนิดร่วมกันอาจทำให้เกิดปฏิกิริยาระหว่างยา ซึ่งอาจลดประสิทธิภาพของยาหรือเพิ่มความเสี่ยงต่อผลข้างเคียง ควรดูทราบก่อนครับว่าทานยาอะไรบ้าง`;



  const { postId }  = useLocalSearchParams();
  const [postData, setPostData] = useState<any>(null);  // เก็บข้อมูลโพสต์
  const [comments, setComments] = useState<any[]>([]);  // เก็บข้อมูลคอมเมนต์


  // ดึงข้อมูลโพสต์จาก API หรือจากฐานข้อมูล
  useEffect(() => {
    if (postId) {
      axios.get(`${BASE_URL}/api/v1/forum/getPostById/${postId}`)
      .then(response => {
        setPostData(response.data);  // กำหนดข้อมูลโพสต์
        // สมมติว่า response.data มีข้อมูลคอมเมนต์
        setComments(response.data.comments || []);  // ถ้ามีการคอมเมนต์
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
              imageContent={postData.imageContent} 
              like={postData.likeCount} 
              comments={postData.commentCount}
              userimage={postData.userImage}
              userName={postData.userName}
              doctorImage={postData.doctorImage}
              doctorName={postData.doctorName}
              content={postData.content}
              viewComments={true} 
            />
          {comments.map((comment, index) => (
            <CommentCard 
              key={index}
              profileImage={comment.doctorImage}
              doctorName={comment.doctorName}
              content={comment.content}
              imageContentSource={comment.imageContent}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

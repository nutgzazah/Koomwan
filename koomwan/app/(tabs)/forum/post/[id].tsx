import {
  View,
  SafeAreaView,
  ScrollView
} from "react-native";
import React from "react";
import ForumCard from "../components/ForumCard";
import CommentCard from "../components/CommentBox";
import { useState } from "react";

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

  return (
    <SafeAreaView className="flex-1">
      <ScrollView 
        className="mb-24"
        showsVerticalScrollIndicator={false}
      >
        <View>
          <ForumCard 
              imageContent={mockImageContent}
              like={1}
              comments={2}
              userimage={mockProfile}
              userName={mockUsername}
              doctorImage={mockDoctor}
              doctorName={mockDoctorName}
              content={mockTextContent}
              viewComments={true} 
            />
          <CommentCard 
            profileImage={mockDoctor}
            doctorName={mockName}
            content={mockResponse}
            imageContentSource={{}}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

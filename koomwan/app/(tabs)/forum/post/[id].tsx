import {
  View,
  SafeAreaView,
  ScrollView
} from "react-native";
import React from "react";
import ForumCard from "../components/ForumCard";
import CommentCard from "../components/CommentBox";

const mockImageContent = require("../../../../assets/Forum/forum-image.png");

export default function ForumScreen() {
  const mockDoctor = require("../../../../assets/Forum/doctor-profile-mock.png");
  const mockTextContent =
      `เอ่อช่วงนี้เลิกงานดึกประจำเลยทำให้ต้องออกกำลังกายตอนกลางคืนบ่อยๆ จะมีผลต่อระดับน้ำตาลในเลือดไหมครับ \nแล้วควรจะกินอะไรหลังออกกำลังกายดี?`;
  const mockName = "นายแพทย์ภูรินทร์ ดำรงค์ธรรม"; 

  return (
    <SafeAreaView className="flex-1">
      <ScrollView>
        <View>
          <ForumCard imageSource={mockImageContent} viewComments={true} />
          <CommentCard 
            profileImage={mockDoctor}
            doctorName={mockName}
            content={mockTextContent}
            imageContentSource={{}}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

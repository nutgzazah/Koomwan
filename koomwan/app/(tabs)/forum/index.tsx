import {
  View,
  Modal,
  Alert,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  Pressable,
} from "react-native";
import React from "react";
import ForumCard from "./components/ForumCard";
import SearchBox from "../../../global/components/SearchBox";
import { useState } from "react";
import TwoChoiceFilterBox from "../../../global/components/FilterBox";
import { useRouter } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

const mockImageContent = require("../../../assets/Forum/forum-image.png")

export default function ForumScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFilterChoice, setCurrentFilterChoice] = useState(1);
  const [likes, setLikes] = useState(1);
  const [isLike, setIsLike] = useState(false);
  const mockUsername = "อาทิตย์ สมใจ";
  const mockProfile = require("../../../assets/Forum/user-mock.png");
  const mockDoctor = require("../../../assets/Forum/doctor-profile-mock.png");
  const mockDoctorName = "";
  const mockTextContent =
    `เอ่อช่วงนี้เลิกงานดึกประจำเลยทำให้ต้องออกกำลังกายตอนกลางคืนบ่อยๆ จะมีผลต่อระดับน้ำตาลในเลือดไหมครับ \nแล้วควรจะกินอะไรหลังออกกำลังกายดี?`;
  const mockChoices: string[] = [
    "สแปม",
    "คำพูดรุนแรง",
    "ข้อมูลเท็จ",
    "การคุกคาม",
    "เนื้อหาไม่เหมาะสม",
    "อื่นๆ",
  ];

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1">
        <ScrollView>
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
              first_onPress={(() => setCurrentFilterChoice(1))}
              second_onPress={(() => setCurrentFilterChoice(2))}
              current_choice={currentFilterChoice}
            />
          </View>
          <TouchableOpacity
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
          </TouchableOpacity>
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
            />
          </View>
          <View>
            <ForumCard 
              imageContent={{}}
              like={0}
              comments={0}
              userimage={mockProfile}
              userName={mockUsername}
              doctorImage={mockDoctor}
              doctorName={mockDoctorName}
              content={mockTextContent}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

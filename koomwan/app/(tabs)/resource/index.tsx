import {
  View,
  SafeAreaView,
  Image,
  ScrollView,
  Pressable
} from "react-native";
import React, { useState } from "react";
import ArticleBox, { articleBoxProps } from "./components/ArticleBox";
import SearchBox from "../../../global/components/SearchBox";
import PopupScreen from "../../../global/components/PopupScreen";

const mockData: Array<articleBoxProps> = [
  {
    title: "นอกจากระดับน้ำตาล นี่สิ่งที่คุณต้องระวัง...",
    imageSource: require("../../../assets/Resource/resource-image.png"),
    author: "นายแพทย์สมใจ หมายดี",
    categories: ["การดูแลสุขภาพ", "ความรู้"]
  },
  {
    title: "เบาหวาน... ยังมีอะไรที่คุณต้องรู้",
    imageSource: require("../../../assets/Resource/resource-image-1.png"),
    author: "นายแพทย์สมใจ หมายดี",
    categories: ["โภชนาการ", "การดูแลสุขภาพ", "ความรู้"]
  },
  {
    title: "เป็นเบาหวาน ควรพึงดูแลตัวเอง ห่างโรค...",
    imageSource: require("../../../assets/Resource/resource-image-2.png"),
    author: "นายแพทย์สมใจ หมายดี",
    categories: ["ผู้ป่วยเบาหวาน", "การดูแลสุขภาพ", "โภชนาการ"]
  },
];

export default function ResourceScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const mockChoices: string[] = [
    "การดูแลสุขภาพ",
    "ความรู้",
    "โภชนาการ",
    "การดูแลสุขภาพ",
    "การออกกำลังกาย",
    "โรค",
    "ผู้ป่วยเบาหวาน",
  ]

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
          mockData.map((item, index) => (
            <ArticleBox
              key={index}
              title={item.title}
              imageSource={item.imageSource}
              author={item.author}
              categories={item.categories}
            />
          ))
        }
      </ScrollView>
    </SafeAreaView>
  );
}
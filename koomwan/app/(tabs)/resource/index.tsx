import {
  View,
  SafeAreaView,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity
} from "react-native";
import React, { useState } from "react";
import ArticleBox, { articleBoxProps } from "./components/ArticleBox";
import SearchBox from "../../../global/components/SearchBox";

const mockData: Array<articleBoxProps> = [
  {
    title: "นอกจากระดับน้ำตาล นี่สิ่งที่คุณต้องระวัง...",
    imageSource: require("../../../assets/BeginnerSetup/cake.png"),
    author: "นายแพทย์สมใจ หมายดี",
    categories: ["การดูแลสุขภาพ", "ความรู้"]
  },
  {
    title: "เบาหวาน... ยังมีอะไรที่คุณต้องรู้",
    imageSource: require("../../../assets/BeginnerSetup/cake.png"),
    author: "นายแพทย์สมใจ หมายดี",
    categories: ["โภชนาการ", "การดูแลสุขภาพ", "ความรู้"]
  },
  {
    title: "เป็นเบาหวาน ควรพึงดูแลตัวเอง ห่างโรค...",
    imageSource: require("../../../assets/BeginnerSetup/cake.png"),
    author: "นายแพทย์สมใจ หมายดี",
    categories: ["ผู้ป่วยเบาหวาน", "การดูแลสุขภาพ", "โภชนาการ"]
  },
]

export default function ResourceScreen() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <SafeAreaView className="flex-1">
      <ScrollView>
        <View className="flex flex-row ml-10 my-4 items-center">
          <TouchableOpacity className="mr-4">
            <Image 
              source={require('../../../assets/Resource/filter-search.png')}
              className="w-6 h-6"
            />
          </TouchableOpacity>

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
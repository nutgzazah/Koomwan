import {
  View,
  Text,
  SafeAreaView,
  Image,
  ScrollView
} from "react-native";
import React from "react";
import Card from "../../../global/components/Card";
import ArticleBox, { articleBoxProps } from "./components/ArticleBox";

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


// ฉบับสาธิตการ์ด
export default function ResourceScreen() {
  return (
    <SafeAreaView className="flex-1">
      <ScrollView>
        <View>
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
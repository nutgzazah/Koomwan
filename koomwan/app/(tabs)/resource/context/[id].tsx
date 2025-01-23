import {
  View,
  Text,
  SafeAreaView,
  Image,
  ScrollView,
  ImageSourcePropType,
} from "react-native";
import React from "react";
import Card from "../../../../global/components/Card";
import BreakLine from "../../../../global/components/BreakLine";
import BackButton from "../../../../global/components/BackButton";


interface articleContentProps {
    title: string,
    imageSource: ImageSourcePropType,
    author: string,
    content: string,
}


function ArticleStructure({
  title,
  imageSource,
  author,
  content
}: articleContentProps) {
  return (
    <SafeAreaView className="flex-1">
      <ScrollView>
        <BackButton title="ย้อนกลับ" />
        <Card>
          <Text className="font-sans text-headline text-secondary">{title}</Text>
          <BreakLine />
          <Text className="font-san text-tag text-secondary">จันทร์, 14 ตุลาคม 2024</Text>
          <Text className="font-san text-tag text-secondary">เขียนโดย : {author}</Text>
          <View className="mx-6 w-full h-36">
            <Image
              className="w-full h-full"
              source={imageSource}
            />
          </View>
          <Text className="font-san text-description text-secondary">{content}</Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

export default function ArticleContent() {
  const mockData: articleContentProps =
  {
    title: "นอกจากระดับน้ำตาล นี่สิ่งที่คุณต้องระวัง...",
    imageSource: require("../../../../assets/Resource/resource-image.png"),
    author: "นายแพทย์สมใจ หมายดี",
    content: `
    ผู้ป่วยเบาหวานควรรู้! 
    นอกจากการควบคุมระดับน้ำตาลในเลือดยังมีอีกหลายปัจจัยที่ต้องระวังเพื่อป้องกันภาวะแทรกซ้อน
    \t1. ความดันโลหิต:ความดันสูงเป็นปัจจัยเสี่ยงต่อโรคหัวใจและหลอดเลือด ควรควบคุมไม่ให้เกิน 130/80 mmHg ด้วยการลดเค็ม ออกกำลังกาย และหลีกเลี่ยงความเครียด
    \t2. ไขมันในเลือด:คอเลสเตอรอลสูงอาจทำให้หลอดเลือดอุดตัน เสี่ยงหัวใจวายและโรคหลอดเลือดสมอง หลีกเลี่ยงอาหารมัน และเพิ่มไขมันดีในมื้ออาหาร
    \t3. ไตเสื่อม:น้ำตาลที่สูงต่อเนื่องทำให้เส้นเลือดฝอยในไต เสียหาย ตรวจสุขภาพไตเป็นประจำ ลดการกินเค็ม และ ดื่มน้ำให้เพียงพอ
    \t4. ปัญหาดวงตา:เบาหวานขึ้นจอประสาทตาอาจทำให้ตาบอดได้ ตรวจตา ปีละครั้ง และควบคุมความดันกับน้ำตาลให้อยู่ในเกณฑ์ปกติ
    \t5. เส้นประสาทเสียหาย:ชาหรือปวดแสบที่ปลายมือเท้าอาจเป็นสัญญาณเตือน ดูแลเท้าให้ดีและตรวจหาแผลทุกวัน
    \t6. สุขภาพจิต:เบาหวานเพิ่มความเสี่ยงต่อภาวะซึมเศร้า อย่าละเลยสัญญาณ ความเครียด และหากจำเป็นควรปรึกษาผู้เชี่ยวชาญ
    \tข้อแนะนำ: การดูแลตัวเองให้ครอบคลุมทุกด้าน ช่วยลดโอกาสเกิดภาวะแทรกซ้อน และทำให้ผู้ป่วยเบาหวานมีชีวิตที่ยืนยาวและมี คุณภาพมากขึ้น
    `
  }
  return (
    <ArticleStructure
      title={mockData.title}
      imageSource={mockData.imageSource}
      author={mockData.author}
      content={mockData.content}
    />
  )
}
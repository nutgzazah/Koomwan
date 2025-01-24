import { Text, SafeAreaView, View, ScrollView, Image, Modal, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import Card from "../../../global/components/Card";
import BreakLine from "../../../global/components/BreakLine";
import { ShortButton } from "../tracking/components/ShortButton";
import SlideCardImg from "./(components)/SlideCardImg";
import ArticleCard from "./(components)/ArticleCard"; 
import FullCardView from "./(components)/FullCardView"; 

export default function SuggestionResult() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>(null);

  const openFullCard = (cardData: any) => {
    setSelectedCard(cardData);  
    setModalVisible(true);  
  };

  const closeModal = () => {
    setModalVisible(false);  
    setSelectedCard(null); 
  };

  return (
    <SafeAreaView className="flex-1">
      <ScrollView >
        <Card>
          <Text className="text-3xl font-sans text-secondary text-center mt-2 mb-1">
            ประเมินสุขภาพ
          </Text>
          <BreakLine />

          <Image
            source={require("../../../assets/Suggestion/heart-primary.png")}
            className="w-32 h-32 mx-auto mb-1"
          />

          <Text className="text-2xl font-sans text-secondary text-center mb-1 ">
            คะแนนสุขภาพ 
            <Text className="text-3xl font-sans text-primary text-center ">
              9
            </Text>
            <Text className="text-xl font-sans text-secondary">/10</Text>
          </Text>

          <Text className="text-2xl font-sans text-secondary text-center mb-2">
            ความเสี่ยงเบาหวาน 
            <Text className="text-3xl font-sans text-primary text-center ">
              10%
            </Text>
            <Text className="text-xl text-secondary"> (ต่ำมาก)</Text>
          </Text>
          <BreakLine />

          <Text className="text-l font-sans text-secondary text-center mb-4">
            คุณสุขภาพโดยรวมดี น้ำหนักและส่วนสูงสมส่วน {"\n"}
            ระดับน้ำตาลในเลือดและ A1c อยู่ในเกณฑ์ปกติ {"\n"}
            ความดันโลหิตดีมาก
          </Text>
          <View className="bg-background p-4 rounded-lg mb-4 ">
            <Text className="text-sm font-sans text-secondary text-center">
              ดูแลสุขภาพได้ดีมาก!{"\n"}
              รักษาพฤติกรรมการกินและออกกำลังกายแบบนี้ต่อไป {"\n"}
              แล้วสุขภาพจะแข็งแรงขึ้นในอนาคต ✨
            </Text>
          </View>
          <ShortButton
            title="สร้างการประเมินใหม่"
            onPress={() => router.push("/suggestion")}
            iconSrc={require("../../../assets/Suggestion/rotate-left.png")}
            iconPosition="left"
            className="mt-2 mb-3"
          />
        </Card>

        {/* Recommended Food */}
        <View className="px-6" >
          <Text className="text-2xl font-sans text-secondary mt-1 mb-1">
            เมนูอาหารที่แนะนำ
          </Text>
        </View>
        
        <ScrollView
          horizontal
          className="mt-4 px-4"
          showsHorizontalScrollIndicator={false}
        >
          <SlideCardImg
            title="สลัดไข่ต้ม"
            description="+ ควบคุมน้ำหนัก"
            imageSrc={require("../../../assets/Suggestion/slad-egg.png")}
            onPress={() => openFullCard({ type: 'food', title: 'สลัดไข่ต้ม', imageSrc: require("../../../assets/Suggestion/slad-egg.png"), content: 'สลัดไข่ต้มเหมาะสำหรับการควบคุมน้ำหนัก...' })}
          />
          <SlideCardImg
            title="สเต็กอกไก่"
            description="+ เพิ่มกล้ามเนื้อ"
            imageSrc={require("../../../assets/Suggestion/steak.png")}
            onPress={() => openFullCard({ type: 'food', title: 'สเต็กอกไก่', imageSrc: require("../../../assets/Suggestion/steak.png"), content: 'สเต็กอกไก่เป็นแหล่งโปรตีนที่ดีสำหรับการเพิ่มกล้ามเนื้อ...' })}
          />
        </ScrollView>

        {/* Recommended Exercise */}
        <View className="px-6">
          <Text className="text-2xl font-sans text-secondary mt-2 mb-1">
            การออกกำลังกายที่แนะนำ
          </Text>
        </View>

        <ScrollView
          horizontal
          className="mt-4 px-4"
          showsHorizontalScrollIndicator={false}
        >
          <SlideCardImg
            title="โยคะ"
            description="+ เพิ่มความยืดหยุ่น"
            imageSrc={require("../../../assets/Suggestion/relaxing-muscle.png")}
            onPress={() => openFullCard({ type: 'exercise', title: 'โยคะ', imageSrc: require("../../../assets/Suggestion/relaxing-muscle.png"), content: 'โยคะช่วยเพิ่มความยืดหยุ่นและลดความเครียด...' })}
          />
          <SlideCardImg
            title="การวิ่ง"
            description="+ เสริมสมรรถภาพ"
            imageSrc={require("../../../assets/Suggestion/relaxing-muscle.png")}
            onPress={() => openFullCard({ type: 'exercise', title: 'การวิ่ง', imageSrc: require("../../../assets/Suggestion/relaxing-muscle.png"), content: 'การวิ่งช่วยเสริมสมรรถภาพและเผาผลาญพลังงาน...' })}
          />
        </ScrollView>

        {/* Recommended Articles */}
        <View className="px-6">
          <Text className="text-2xl font-sans text-secondary mt-2 mb-1">
            บทความที่แนะนำ
          </Text>
        </View>

        <ArticleCard
          title="เคล็ดลับการดูแลสุขภาพ"
          author="John Doe"
          category="สุขภาพ"
          tags={["การออกกำลังกาย", "โภชนาการ"]}
          imageSrc={require("../../../assets/Suggestion/relaxing-muscle.png")}
          onPress={() => openFullCard({ type: 'article', title: 'เคล็ดลับการดูแลสุขภาพ', imageSrc: require("../../../assets/Suggestion/relaxing-muscle.png"), content: 'บทความนี้ให้คำแนะนำเกี่ยวกับการดูแลสุขภาพ...' , author:'John Doe',
            category:'สุขภาพ'})}
        />
      </ScrollView>

      {/* Modal for Full View */}
      {modalVisible && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View className="flex-1 justify-center items-center bg-black opacity-50">
            <FullCardView
              cardData={selectedCard}
              closeModal={closeModal}
            />
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

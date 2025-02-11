import {
  Text,
  SafeAreaView,
  View,
  ScrollView,
  Image,
  Modal,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import Card from "../../../global/components/Card";
import BreakLine from "../../../global/components/BreakLine";
import { ShortButton } from "../tracking/components/ShortButton";
import SlideCardImg from "./components/SlideCardImg";
import ArticleCard from "./components/ArticleCard"; 
import FullCardView from "./components/FullCardView"; 
import healthData  from "./data/healthData";
import recommendationData from "./data/recommendationData"; 

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
      <ScrollView mb-24>
        <Card>
          <Text className="text-title font-bold font-sans text-secondary text-center mt-2 mb-1">
            ประเมินสุขภาพ
          </Text>
          <BreakLine />

          <Image
            source={require("../../../assets/Suggestion/heart-primary.png")}
            className="w-32 h-32 mx-auto mb-1"
          />

          <Text className="text-headline font-bold font-sans text-secondary text-center mb-1 ">
            คะแนนสุขภาพ 
            <Text className="text-display font-bold font-sans text-primary text-center ">
              {healthData.healthScore}
            </Text>
            <Text className="text-body font-sans text-secondary">/10</Text>
          </Text>

          <Text className="text-headline font-bold font-sans text-secondary text-center mb-2">
            ความเสี่ยงเบาหวาน 
            <Text className="text-display font-bold font-sans text-primary text-center ">
              {healthData.diabetesRisk.percentage}%
            </Text>
            <Text className="text-body font-sans text-secondary"> ({healthData.diabetesRisk.level})</Text>
          </Text>
          <BreakLine />

          <Text className="text-description font-sans text-secondary text-center mb-4">
            {healthData.summary.join("\n")}
          </Text>

          <View className="bg-background p-4 rounded-lg mb-4 ">
            <Text className="text-tag font-sans text-secondary text-center">
              {healthData.recommendation.join("\n")}
            </Text>
          </View>
          
          <ShortButton
            title="สร้างการประเมินใหม่"
            onPress={() => router.push("/suggestion")}
            iconSrc={require("../../../assets/Suggestion/rotate-left.png")}
            iconPosition="left"
            className="mt-2 mb-1"
          />
        </Card>

        {/* Recommended Food */}
        <View className="px-6" >
          <Text className="text-headline font-bold font-sans text-secondary mt-1 mb-1">
            เมนูอาหารที่แนะนำ
          </Text>
        </View>
        
        <ScrollView
          horizontal
          className="mt-4 px-4 "
          showsHorizontalScrollIndicator={false}
        >
          {recommendationData.food.map((item, index) => (
            <SlideCardImg
              key={index}
              title={item.title}
              description={item.description}
              imageSrc={item.imageSrc}
              onPress={() => openFullCard(item)}
            />
          ))}
        </ScrollView>

        {/* Recommended Exercise */}
        <View className="px-6">
          <Text className="text-headline font-bold font-sans text-secondary mt-2 mb-1">
            การออกกำลังกายที่แนะนำ
          </Text>
        </View>

        <ScrollView
          horizontal
          className="mt-4 px-4"
          showsHorizontalScrollIndicator={false}
        >
          {recommendationData.exercise.map((item, index) => (
            <SlideCardImg
              key={index}
              title={item.title}
              description={item.description}
              imageSrc={item.imageSrc}
              onPress={() => openFullCard(item)}
            />
          ))}
        </ScrollView>

        {/* Recommended Articles */}
        <View className="px-6">
          <Text className="text-headline font-bold font-sans text-secondary mt-2 mb-1">
            บทความที่แนะนำ
          </Text>
        </View>
        
        <ScrollView
          horizontal
          className="mt-4 px-1"
          showsHorizontalScrollIndicator={false}
        >
          {recommendationData.articles.map((item, index) => (
            <ArticleCard
              key={index}
              title={item.title}
              author={item.author}
              category={item.category}
              tags={item.tags}
              imageSrc={item.imageSrc}
              onPress={() => openFullCard(item)}
            />
          ))}
        </ScrollView>
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

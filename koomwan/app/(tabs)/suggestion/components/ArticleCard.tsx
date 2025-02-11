import { Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";

interface ArticleCardProps {
  title: string;
  author: string;
  category: string;
  tags: string[];
  imageSrc: any;
  onPress: () => void;
}

export default function ArticleCard({
  title,
  author,
  category,
  tags,
  imageSrc,
  onPress,
}: ArticleCardProps) {
  return (

    <TouchableOpacity onPress={onPress}>
      <View className="bg-card rounded-xl w-80 px-2 mx-2 mb-6"> 
        <Image
          source={imageSrc}
          className="w-full h-40 mb-2" 
          resizeMode="cover"
        />
        <Text className="text-body font-sans text-secondary text-center mt-2"> 
          {title}
        </Text>
        <Text className="text-description font-bold font-sans text-primary text-center mt-2"> 
          {author}
        </Text>
        <Text className="text-description bg-primary text-card font-sans text-center rounded-xl w-20 mt-2 ml-auto mr-auto"> {/* ปรับคลาสและเพิ่ม margin */}
          {category}
        </Text>
        <View className="flex flex-row flex-wrap mt-1">
          {tags.map((tag, index) => (
            <Text key={index} className="text-tag font-sans text-card mr-1">
              {tag}
            </Text>
          ))}
        </View>
        <View className="bg-card h-3 rounded-b-xl px-4"/> 
      </View>
    </TouchableOpacity>
  );
}

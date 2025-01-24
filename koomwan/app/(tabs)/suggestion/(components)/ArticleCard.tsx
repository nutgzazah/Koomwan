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
      <View className="bg-card shadow-lg rounded-xl w-60 mx-2 mb-6">
        <Image
          source={imageSrc}
          className="w-full h-32 rounded-lg"
          resizeMode="cover"
        />
        <Text className="text-xl font-sans text-secondary mt-2">{title}</Text>
        <Text className="text-sm font-sans text-secondary">{author}</Text>
        <Text className="text-sm font-sans text-primary">{category}</Text>
        <View className="flex flex-row flex-wrap mt-2">
          {tags.map((tag, index) => (
            <Text key={index} className="text-xs font-sans text-primary mr-2">
              {tag}
            </Text>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}

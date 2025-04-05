import { 
  Text, 
  View, 
  Image, 
  TouchableOpacity 
} from "react-native";

import React from "react";

interface BlogCardProps {
  title: string;
  author: string;
  category: string;
  tags: string[];
  imageSrc: any;
}

export default function BlogCard({
  title,
  author,
  category,
  tags,
  imageSrc,
}: BlogCardProps) {
  return (

    <TouchableOpacity >

      <View className="bg-card rounded-xl w-80  mb-6 ml-4"> 
        <Image
          source={imageSrc}
          className="w-full h-40 mb-2 rounded-t-xl" 
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
        <View className="flex flex-row mt-1">
          {tags.map((tag, index) => (
            <Text key={index} className="text-tag font-sans text-card ">
              {tag}
            </Text>
          ))}
        </View>
        <View className="bg-card h-3 rounded-xl px-4 mb-6"/> 
      </View>
    </TouchableOpacity>
  );
}
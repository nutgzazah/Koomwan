import { View, Text } from "react-native";
import React from "react";

interface categoryProps {
    category: string;
}

export default function CategoryBox({category} : categoryProps) {
  return (
    <View className="bg-primary px-3 justify-center rounded-3xl h-8 flex mr-3 mt-3">
      <Text className="flex text-white text-tag text-center">
        {category}
      </Text>
    </View>
  )
}
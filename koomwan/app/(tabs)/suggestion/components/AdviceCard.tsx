import { Text, View, Image } from 'react-native';
import React from 'react';

interface AdviceCardProps {
  title: string;
  description: string;
  image?: any;
}

export default function AdviceCard({ title, description, image }: AdviceCardProps) {
  return (
    <View className="bg-card shadow-m rounded-xl w-72 h-64 mx-2 mb-4 p-4 relative overflow-hidden">
      {/* Text Content */}
      <View className="z-10">
        <Text className="text-body font-bold font-sans text-primary mb-2">{title}</Text>
        <Text className="text-description font-sans text-secondary">{description}</Text>
      </View>

      {/* Background Image */}
      {image && (
        <Image
          source={image}
          className="w-36 h-36 absolute bottom-0 left-1/2 -translate-x-1/2 opacity-40"
          resizeMode="contain"
        />
      )}
    </View>
  );
}
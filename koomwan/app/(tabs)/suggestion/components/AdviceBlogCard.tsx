import { Text, View, Image, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import BASE_URL from '../../../../config';
import axios from 'axios';
import HTML from 'react-native-render-html';

interface AdviceBlogCardProps {
  title: string;
  content: string;
  image?: string;
  blogId: string;
}

const defaultBlogImage = require("../../../../assets/Avatars/koomwanAvatar04.png");

// ฟังก์ชันลบแท็ก HTML
const removeHtmlTags = (str: string) => {
  return str.replace(/<\/?[^>]+(>|$)/g, "");  // ใช้ regex เพื่อลบแท็ก HTML ออก
};

export default function AdviceBlogCard({ title, content, image, blogId }: AdviceBlogCardProps) {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  console.log("image:",image)

  const shortenText = (text: string, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const handlePress = () => {
    router.push(`/resource/${blogId}`);
  };

  useEffect(() => {
    if (image && image !== "") {
      // ดึง URL ของภาพจาก API
      const getImageUrl = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/api/v1/storage/getFileUrlFromPath?path=${image}`);
          setImageUrl(response.data.url); // สมมุติว่า API ส่ง url ของภาพ
          console.log("Image URL",response.data.ur)
        } catch (error) {
          console.error('Error fetching image URL:', error);
        }
      };
      getImageUrl();
    }
  }, [image]);

  return (
    <View className="bg-card shadow-m rounded-xl w-[280px] h-fit ml-4 mb-4 p-4 relative overflow-hidden flex flex-col">
      {/* Text Content */}
      <View className="flex-grow">
        <Text className="text-body font-bold font-sans text-primary mb-3" numberOfLines={2}>{title}</Text>
        
        <Image 
        source={imageUrl ? { uri: imageUrl } : defaultBlogImage} // ใช้ imageUrl ถ้ามีค่า มิฉะนั้นใช้ defaultBlogImage
        className="w-full h-40 rounded-md mb-4" // รูปภาพกว้างเต็มการ์ด
        resizeMode="cover"
      />

        <Text className="text-description font-sans text-secondary mb-4" numberOfLines={4}>
          {shortenText(removeHtmlTags(content))} {/* ลบแท็ก HTML ก่อนแสดง */}
        </Text>
      </View>

      {/* ปุ่มอ่านต่อ */}
      <Pressable onPress={handlePress} className="mt-auto">
        <Text className="bg-primary w-24 rounded-xl px-6 py-4 font-bold font-sans text-description text-center text-white">อ่านต่อ</Text>
      </Pressable>
    </View>
  );
}

import {
  View,
  Text,
  SafeAreaView,
  Pressable,
  ScrollView,
  Image,
  TextInput,
} from "react-native";
import React from "react";
import Card from "../../../../global/components/Card";
import BreakLine from "../../../../global/components/BreakLine";
import BackButton from "../../../../global/components/BackButton";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function ForumScreen() {
  const [displayMockImage, setDisplayMockImage] = useState(false);
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1">
      <ScrollView
        className="mb-24"
        showsVerticalScrollIndicator={false}
      >
        <BackButton title="ย้อนกลับ" />
        <Card>
          <View className="flex flex-row w-full mx-4 items-start">
            <Image
              className="w-12 h-12 mr-6 self-start"
              source={require("../../../../assets/Login/user.png")}
            />
            <TextInput
              className="font-sans text-description text-secondary mr-3 items-start flex-shrink"
              placeholder="คุณกำลังมีข้อสงสัยอะไรอยู่..."
              multiline
            />
          </View>
          {displayMockImage &&
            <Image
              className="w-full h-[18.75rem] mt-3"
              source={require("../../../../assets/Forum/forum-upload-mock.png")}
            />
          }
          <BreakLine />
          <View className="flex flex-row w-full mx-4 justify-between items-center">
            <UploadImageButton />
            <PostButton />
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );

  function UploadImageButton() {
    return (
      <Pressable
        className="w-6 h-6 ml-4"
        onPress={() => setDisplayMockImage(!displayMockImage)}
      >
        <Image
          className="w-full h-full"
          source={require("../../../../assets/Forum/gallery.png")} />
      </Pressable>
    );
  }

  function PostButton() {
    return (
      <Pressable onPress={(() => router.back())}>
        <View className="flex flex-row bg-primary w-[5.5rem] h-8 rounded-[33px] justify-evenly items-center">
          <Text className="font-sans text-sub-button text-center text-card">
            โพสต์
          </Text>
          <Image
            className="w-4 h-4"
            source={require("../../../../assets/Forum/Pen-white.png")} />
        </View>
      </Pressable>
    );
  }
}

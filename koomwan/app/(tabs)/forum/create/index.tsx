import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
} from "react-native";
import React from "react";
import Card from "../../../../global/components/Card";
import BreakLine from "../../../../global/components/BreakLine";
import BackButton from "../../../../global/components/BackButton";

export default function ForumScreen() {
  return (
    <SafeAreaView className="flex-1">
      <ScrollView>
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
          <BreakLine />
          <View className="flex flex-row w-full mx-4 justify-between items-center">
            <TouchableOpacity className="w-6 h-6 ml-4">
              <Image
                className="w-full h-full"
                source={require("../../../../assets/Forum/gallery.png")}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <View className="flex flex-row bg-primary w-[5.5rem] h-8 rounded-[33px] justify-evenly items-center">
                <Text className="font-sans text-sub-button text-center text-card">
                  โพสต์
                </Text>
                <Image
                  className="w-4 h-4"
                  source={require("../../../../assets/Forum/Pen-white.png")}
                />
              </View>
            </TouchableOpacity>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import Card from "../../../../global/components/Card";
import BreakLine from "../../../../global/components/BreakLine";
import BackButton from "../../../../global/components/BackButton";

export default function OtherHelpScreen() {
  const [problemDetail, setProblemDetail] = useState("");

  const handleSubmit = () => {
    // Handle form submission
    console.log("Problem detail:", problemDetail);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView>
        <BackButton title="ย้อนกลับ" />

        <View className="w-full px-4">
          <Card>
            <View className="w-full">
              <Text className="text-title font-bold text-secondary text-center mb-4">
                ปัญหาอื่น ๆ
              </Text>

              <BreakLine />

              <Text className="text-description font-regular text-secondary mb-4">
                กรุณากรอกรายละเอียดของปัญหา
              </Text>

              <TextInput
                className="w-full h-48 p-4 font-regular bg-background rounded-lg text-description"
                multiline
                textAlignVertical="top"
                value={problemDetail}
                onChangeText={setProblemDetail}
                placeholder="รายละเอียด"
              />

              <TouchableOpacity
                className="w-full bg-primary py-4 rounded mt-6"
                onPress={handleSubmit}
              >
                <Text className="text-card text-center font-bold text-button">
                  ส่ง
                </Text>
              </TouchableOpacity>
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

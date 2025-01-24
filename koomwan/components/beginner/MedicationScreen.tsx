import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Card from "../../global/components/Card";
import BreakLine from "../../global/components/BreakLine";
import NavigationDots from "../../components/beginner/NavigationDots";
import { router } from "expo-router";

export default function MedicationScreen() {
  const [medication, setMedication] = useState("");
  const currentStep = 5; // Following after weight screen
  const totalSteps = 6; // Updated total steps

  const handleNext = () => {
    router.push("/Success");
  };

  const handleBack = () => {
    router.back();
  };

  const getMessage = () => {
    return "เพิ่มยาที่คุณใช้ประจำเพื่อช่วยเตือนการทานยา\nและวิเคราะห์สุขภาพที่แม่นยำยิ่งขึ้น";
  }; // Not use using in beginner.tsx instead

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <SafeAreaView className="flex-1 bg-background">
        <TouchableOpacity
          onPress={handleBack}
          className="px-4 mt-safe flex-row items-center"
        >
          <Image
            source={require("../../assets/Signup/arrow-circle-left.png")}
            className="w-6 h-6"
            resizeMode="contain"
          />
          <Text className="text-body text-secondary font-regular ml-2">
            ย้อนกลับ
          </Text>
        </TouchableOpacity>

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 justify-center px-4">
            <Card>
              <Text className="text-title text-secondary font-bold mb-2">
                ยาประจำของฉัน
              </Text>
              <BreakLine />

              <View className="flex-col items-center w-full">
                <Image
                  source={require("../../assets/BeginnerSetup/medicine.png")}
                  className="w-32 h-32 mb-6"
                  resizeMode="contain"
                />
                <View className="w-full">
                  <View className="relative w-full">
                    <TextInput
                      className="w-full bg-background rounded p-3 pr-12 text-description font-regular"
                      placeholder="เพิ่มยาประจำของคุณ"
                      value={medication}
                      onChangeText={setMedication}
                    />
                    <TouchableOpacity
                      className="absolute right-3 top-3"
                      onPress={() => {
                        // Handle add medication
                      }}
                    >
                      <View className="w-6 h-6 bg-primary rounded-full items-center justify-center">
                        <Text className="text-card font-bold">+</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <BreakLine />

              <NavigationDots
                currentStep={currentStep}
                totalSteps={totalSteps}
                message={getMessage()} // Using in beginner.tsx instead
              />
            </Card>
          </View>
        </TouchableWithoutFeedback>

        <View className="px-4 pb-8">
          <TouchableOpacity
            className="w-full py-4 rounded bg-primary"
            onPress={handleNext}
          >
            <Text className="text-card text-center font-bold text-button">
              เสร็จสิ้น
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

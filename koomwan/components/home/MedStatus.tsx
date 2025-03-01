import React from "react";
import { View, Text, Image, SafeAreaView } from "react-native";

const PillIcon = () => (
  <View className="w-16 h-16 items-center justify-center">
    <Image
      source={require("../../assets/Home/medicine.png")}
      alt="Pill Icon"
      className="w-20 h-20"
    />
  </View>
);

const MedicationStatus = ({ hasTakenMeds = false }) => {
  const statusText = hasTakenMeds
    ? "ตอนนี้คุณทานยาประจำครบแล้ว!"
    : "คุณยังไม่ได้ทานยาประจำ";

  const subtitleText = hasTakenMeds
    ? "ยินดีด้วย! คุณทานยาประจำตัวครบแล้ว"
    : "อย่าลืมทานยาประจำตัวของคุณ";

  return (
    <SafeAreaView>
      <View className="w-full items-center flex-row bg-white p-4 py-8 mb-8 justify-evenly ">
        <PillIcon />

        <View className="items-center">
          <Text className="text-description font-regular text-secondary">
            {statusText}
          </Text>

          <Text className="text-tag text-secondary text-center font-regular">
            {subtitleText}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MedicationStatus;

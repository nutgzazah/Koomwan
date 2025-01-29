import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { router } from "expo-router";
import Card from "../../global/components/Card";
import BreakLine from "../../global/components/BreakLine";

export default function MedicationFormScreen() {
  const [pill_name, setPillName] = useState("");
  const [pill_type, setPillType] = useState("");
  const [pill_description, setPillDescription] = useState("");
  const [image, setImage] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Medication types
  const medicationTypes = [
    "ยารักษาโรคเบาหวาน",
    "ยารักษาเฉพาะโรค",
    "ยาสามัญประจำบ้าน",
    "ยาใช้ภายนอก",
    "ยาอันตราย",
    "ยาวิตามินและอาหารเสริม",
    "อื่นๆ",
  ];

  const handleBack = () => {
    router.back();
  };

  const handleAddMedication = () => {
    // Handle adding medication logic here
    router.back();
  };

  const handleImageUpload = () => {
    // Handle image upload logic here
  };

  const handleSelectType = (selectedType: string) => {
    setPillType(selectedType);
    setIsDropdownOpen(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center px-4 py-2 border-b border-gray">
        <TouchableOpacity
          onPress={handleBack}
          className="flex-row items-center"
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
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-4">
          <Card>
            <Text className="flex-1 text-headline text-secondary font-medium text-center ">
              ยาประจำของฉัน
            </Text>
            <BreakLine />
            {/* Image Upload */}
            <TouchableOpacity
              onPress={handleImageUpload}
              className="w-full aspect-[2/1] bg-background rounded-lg items-center justify-center border border-gray"
            >
              {image ? (
                <Image
                  source={{ uri: image }}
                  className="w-full h-full rounded-lg"
                  resizeMode="cover"
                />
              ) : (
                <View className="items-center">
                  <Image
                    source={require("../../assets/BeginnerSetup/add-image.png")}
                    className="w-16 h-16 mb-2"
                    resizeMode="contain"
                  />
                </View>
              )}
            </TouchableOpacity>

            {/* Name Input */}
            <View className="mt-4 w-full">
              <Text className="text-description text-secondary font-regular mb-2">
                ชื่อยา
              </Text>
              <TextInput
                value={pill_name}
                onChangeText={setPillName}
                placeholder="ชื่อยา"
                className="w-full bg-background border border-gray rounded p-3 text-description font-regular"
              />
            </View>

            {/* Type Selection with Dropdown */}
            <View className="mt-4">
              <Text className="text-description text-secondary font-regular mb-2">
                ประเภท (Optional)
              </Text>
              <View className="relative">
                <TouchableOpacity
                  onPress={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full bg-background border border-gray rounded p-3 flex-row justify-between items-center"
                >
                  <Text className="text-description font-regular text-gray">
                    {pill_type || "เลือกประเภทยา"}
                  </Text>
                  <Image
                    source={require("../../assets/BeginnerSetup/drop-arrow.png")}
                    className="w-5 h-5"
                    resizeMode="contain"
                  />
                </TouchableOpacity>

                {isDropdownOpen && (
                  <View className="absolute top-full left-0 right-0 mt-1 bg-card border border-gray rounded-lg shadow-lg z-50 max-h-48">
                    <ScrollView>
                      {medicationTypes.map((medicationType, index) => (
                        <Pressable
                          key={index}
                          onPress={() => handleSelectType(medicationType)}
                          className={`p-3 border-b border-gray ${
                            index === medicationTypes.length - 1
                              ? "border-b-0"
                              : ""
                          }`}
                        >
                          <Text className="text-description font-regular">
                            {medicationType}
                          </Text>
                        </Pressable>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
            </View>

            {/* Details Input */}
            <View className="mt-4 w-full">
              <Text className="text-description text-secondary font-regular mb-2">
                รายละเอียด (Optional)
              </Text>
              <TextInput
                value={pill_description}
                onChangeText={setPillDescription}
                placeholder="เพิ่มรายละเอียดเกี่ยวกับยา"
                multiline
                numberOfLines={4}
                className="w-full bg-background border border-gray rounded p-3 text-description font-regular h-32"
                textAlignVertical="top"
              />
            </View>
          </Card>
        </ScrollView>

        {/* Add Button */}
        <View className="px-4 py-4 bg-card border-gray">
          <TouchableOpacity
            onPress={handleAddMedication}
            className="w-full bg-primary py-4 rounded"
          >
            <Text className="text-card text-center font-bold text-button">
              เพิ่มยา
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

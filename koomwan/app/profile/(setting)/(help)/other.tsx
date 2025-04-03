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
import ProblemDropdown from "../../../../components/profile/problemDropdown";
import { PROBLEM_TYPES } from "../../../../constant/problem";

export default function OtherHelpScreen() {
  const [problemDetail, setProblemDetail] = useState<string>("");
  const [problemType, setProblemType] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSelectType = (selectedType: string) => {
    setProblemType(selectedType);
    setIsDropdownOpen(false);
  };

  const handleSubmit = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    console.log("Problem detail:", problemDetail);
    // Add your form submission logic here (e.g., API call)
    setIsSubmitting(false); // Re-enable after submission
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

              {/* Type Selection */}
              <View className="mt-4">
                <Text className="text-description text-secondary font-regular mb-2">
                  ประเภท (Optional)
                </Text>
                <ProblemDropdown
                  value={problemType}
                  options={PROBLEM_TYPES}
                  onSelect={handleSelectType}
                  disabled={isSubmitting}
                />
              </View>

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
                disabled={isSubmitting} // Disable button during submission
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

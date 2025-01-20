import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
} from "react-native";

// Mock data for dropdowns
const experts = [
  "เวชกรรม",
  "อายุรกรรมทั่วไป",
  "การให้คำปรึกษาสุขภาพจิต",
  "การให้คำปรึกษาวัยรุ่น",
  "การให้คำปรึกษาครอบครัว",
  "การดูแลผู้ป่วยมะเร็ง",
];

const hospitals = [
  "โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ",
  "โรงพยาบาลราชวิถี",
  "โรงพยาบาลจุฬาลงกรณ์",
  "โรงพยาบาลรามาธิบดี",
  "โรงพยาบาลศิริราช",
  "โรงพยาบาลตำรวจ",
];

const DoctorSignUpInfoScreen = () => {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [occupation, setOccupation] = useState("");
  const [expert, setExpert] = useState("");
  const [hospital, setHospital] = useState("");
  const [showExpertDropdown, setShowExpertDropdown] = useState(false);
  const [showHospitalDropdown, setShowHospitalDropdown] = useState(false);

  // Validation states
  const [errors, setErrors] = useState({
    first_name: false,
    last_name: false,
    occupation: false,
    expert: false,
    hospital: false,
  });

  // Validation function
  const validateForm = () => {
    const newErrors = {
      first_name: !first_name.trim(),
      last_name: !last_name.trim(),
      occupation: !occupation.trim(),
      expert: !expert,
      hospital: !hospital,
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = () => {
    const isValid = validateForm();
    if (isValid) {
      // Handle form submission
      console.log("Form is valid");
    }
  };

  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6">
          <Text className="text-display font-bold text-secondary mb-6 mt-4 text-center">
            ข้อมูลส่วนตัว
          </Text>

          {/* Profile Image */}
          <TouchableOpacity onPress={() => {}} className="items-center mb-6">
            <View className="w-36 h-36 bg-background rounded items-center justify-center border border-gray shadow-sm">
              <Image
                source={require("../../assets/Doctor/signup.png")}
                className="w-10 h-10"
              />
            </View>
          </TouchableOpacity>

          {/* Form Fields */}
          <View className="space-y-4 mb-6">
            <View>
              <Text className="text-description text-secondary font-regular mb-2">
                ชื่อ - นามสกุล
              </Text>
              <TextInput
                className={`w-full h-[50px] pl-4 pr-4 border rounded-[5px] text-description font-regular mb-2 ${
                  errors.first_name ? "border-abnormal" : "border-gray"
                }`}
                placeholder="ชื่อ"
                value={first_name}
                onChangeText={(text) => {
                  setFirstName(text);
                  setErrors((prev) => ({ ...prev, first_name: false }));
                }}
              />
              <TextInput
                className={`w-full h-[50px] pl-4 pr-4 border rounded-[5px] text-description font-regular mb-5 ${
                  errors.last_name ? "border-abnormal" : "border-gray"
                }`}
                placeholder="นามสกุล"
                value={last_name}
                onChangeText={(text) => {
                  setLastName(text);
                  setErrors((prev) => ({ ...prev, last_name: false }));
                }}
              />
            </View>

            <View>
              <Text className="text-description text-secondary mb-2 font-regular">
                อาชีพ
              </Text>
              <TextInput
                className={`w-full h-[50px] pl-4 pr-4 border rounded-[5px] text-description font-regular mb-5 ${
                  errors.occupation ? "border-abnormal" : "border-gray"
                }`}
                placeholder="อาชีพ"
                value={occupation}
                onChangeText={(text) => {
                  setOccupation(text);
                  setErrors((prev) => ({ ...prev, occupation: false }));
                }}
              />
            </View>

            {/* Expert Dropdown */}
            <View>
              <Text className="text-description text-secondary mb-2 font-regular">
                ด้านที่เชี่ยวชาญ
              </Text>
              <View className="relative">
                <TouchableOpacity
                  onPress={() => {
                    setShowExpertDropdown(!showExpertDropdown);
                    setShowHospitalDropdown(false);
                  }}
                  className={`w-full h-[50px] pl-4 pr-4 border rounded-[5px] text-description font-regular mb-3 flex-row items-center justify-between ${
                    errors.expert ? "border-abnormal" : "border-gray"
                  }`}
                >
                  <Text
                    className={`text-description font-regular ${
                      expert ? "text-secondary" : "text-gray"
                    }`}
                  >
                    {expert || "เลือกด้านที่เชี่ยวชาญ"}
                  </Text>
                  <Image
                    source={
                      showExpertDropdown
                        ? require("../../assets/Doctor/icon/drop_up.png")
                        : require("../../assets/Doctor/icon/drop_down.png")
                    }
                    className="w-6 h-6"
                  />
                </TouchableOpacity>

                {showExpertDropdown && (
                  <View className="absolute top-12 left-0 right-0 bg-card border border-gray rounded z-10">
                    <ScrollView className="max-h-48">
                      {experts.map((item) => (
                        <TouchableOpacity
                          key={item}
                          onPress={() => {
                            setExpert(item);
                            setShowExpertDropdown(false);
                            setErrors((prev) => ({ ...prev, expert: false }));
                          }}
                          className="p-4 border-b border-gray"
                        >
                          <Text className="text-description text-secondary font-regular">
                            {item}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
            </View>

            {/* Hospital Dropdown */}
            <View>
              <Text className="text-description text-secondary font-regular mb-2">
                โรงพยาบาล
              </Text>
              <View className="relative">
                <TouchableOpacity
                  onPress={() => {
                    setShowHospitalDropdown(!showHospitalDropdown);
                    setShowExpertDropdown(false);
                  }}
                  className={`w-full h-[50px] pl-4 pr-4 border rounded-[5px] text-description font-regular mb-3 flex-row items-center justify-between ${
                    errors.hospital ? "border-abnormal" : "border-gray"
                  }`}
                >
                  <Text
                    className={`text-description font-regular ${
                      hospital ? "text-secondary" : "text-gray"
                    }`}
                  >
                    {hospital || "เลือกโรงพยาบาล"}
                  </Text>
                  <Image
                    source={
                      showHospitalDropdown
                        ? require("../../assets/Doctor/icon/drop_up.png")
                        : require("../../assets/Doctor/icon/drop_down.png")
                    }
                    className="w-6 h-6"
                  />
                </TouchableOpacity>

                {showHospitalDropdown && (
                  <View className="absolute top-12 left-0 right-0 bg-card border border-gray rounded z-10">
                    <ScrollView className="max-h-48">
                      {hospitals.map((item) => (
                        <TouchableOpacity
                          key={item}
                          onPress={() => {
                            setHospital(item);
                            setShowHospitalDropdown(false);
                            setErrors((prev) => ({ ...prev, hospital: false }));
                          }}
                          className="p-4 border-b border-gray"
                        >
                          <Text className="text-description text-secondary font-regular">
                            {item}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
            </View>

            {/* Medical Document */}
            <View>
              <Text className="text-description text-secondary font-regular mb-2">
                เอกสารประกอบทางการแพทย์
              </Text>
              <TouchableOpacity
                onPress={() => {}}
                className="w-full h-[50px] px-4 border border-gray rounded bg-background flex-row items-center mb-3 justify-between"
              >
                <Text className="text-description text-gray font-regular">
                  เอกสารประกอบทางการแพทย์
                </Text>
                <View className="w-12 h-6 bg-primary rounded-full items-center justify-center">
                  <Text className="text-card text-tag">PDF</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Error Message */}
            {Object.values(errors).some((error) => error) && (
              <Text className="text-abnormal text-description font-regular mt-2">
                กรุณากรอกข้อมูลให้ครบ
              </Text>
            )}
          </View>

          {/* Buttons */}
          <View className="flex-row space-x-4 gap-4 mb-5">
            <TouchableOpacity
              className="flex-1 py-4 rounded-lg border border-gray"
              onPress={() => router.back()}
            >
              <Text className="text-secondary text-center font-bold text-button">
                ย้อนกลับ
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 bg-primary py-4 rounded-lg"
              onPress={handleSubmit}
            >
              <Text className="font-bold text-button text-center text-card">
                บันทึก
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DoctorSignUpInfoScreen;

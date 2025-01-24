import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Card from "../../global/components/Card";
import BreakLine from "../../global/components/BreakLine";
import SelectionModal from "../../components/beginner/SelectionModal";
import BirthdayInput from "../../components/beginner/BirthdayInput";
import NavigationDots from "../../components/beginner/NavigationDots";
import { router } from "expo-router";

// Step type definition
type SetupStep = {
  id: number;
  title: string;
  options: Array<{
    id: string;
    icon: any;
    label: string;
  }>;
};

type DateModalType = "day" | "month" | "year" | null;

export default function BeginnerSetupScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState({
    userType: "",
    gender: "",
    birthday: { day: "", month: "", year: "" },
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<DateModalType>(null);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  // Generate arrays for day, month, and year options
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const months = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];
  const currentYear = new Date().getFullYear() + 543; // Convert to Buddhist year
  const years = Array.from({ length: 100 }, (_, i) =>
    (currentYear - i).toString()
  );

  const handleNext = () => {
    if (currentStep === 2 && isBirthdayComplete()) {
      setCurrentStep(3);
    } else if (currentStep === 3 && height) {
      setCurrentStep(4);
    } else if (currentStep === 4 && weight) {
      setCurrentStep(5);
    } else if (currentStep === 5) {
      // Handle completion
      router.push("/user/Success");
    }
  };

  // Setup steps configuration
  const steps: SetupStep[] = [
    {
      id: 0,
      title: "ฉันเป็น",
      options: [
        {
          id: "new_user",
          icon: require("../../assets/BeginnerSetup/normal.png"),
          label: "ผู้ใช้ทั่วไป",
        },
        {
          id: "diabetic",
          icon: require("../../assets/BeginnerSetup/diabete.png"),
          label: "ผู้ป่วยเบาหวาน",
        },
      ],
    },
    {
      id: 1,
      title: "เพศของฉัน",
      options: [
        {
          id: "male",
          icon: require("../../assets/BeginnerSetup/gender-male.png"),
          label: "ชาย",
        },
        {
          id: "female",
          icon: require("../../assets/BeginnerSetup/gender-female.png"),
          label: "หญิง",
        },
      ],
    },
    {
      id: 2,
      title: "วันเกิดของฉัน",
      options: [],
    },
  ];

  const handleSelection = (value: string) => {
    switch (currentStep) {
      case 0:
        setSelections((prev) => ({ ...prev, userType: value }));
        break;
      case 1:
        setSelections((prev) => ({ ...prev, gender: value }));
        break;
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      router.back();
    }
  };

  const handleDateSelection = (value: string) => {
    if (!modalType) return;

    setSelections((prev) => ({
      ...prev,
      birthday: {
        ...prev.birthday,
        [modalType]: value,
      },
    }));
    setModalVisible(false);
    setModalType(null);
  };

  const openDateModal = (type: DateModalType) => {
    setModalType(type);
    setModalVisible(true);
  };

  const getModalOptions = () => {
    switch (modalType) {
      case "day":
        return days;
      case "month":
        return months;
      case "year":
        return years;
      default:
        return [];
    }
  };

  const renderOption = (option: SetupStep["options"][0]) => (
    <TouchableOpacity
      key={option.id}
      className="w-full bg-card rounded-lg p-4 mb-4 shadow-sm"
      onPress={() => handleSelection(option.id)}
    >
      <View className="flex-col items-center">
        <Image
          source={option.icon}
          className="w-[150px] h-[150px]"
          resizeMode="contain"
        />
        <Text className="text-description text-secondary font-medium">
          {option.label}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const getStepMessage = () => {
    switch (currentStep) {
      case 0:
        return "เลือกประเภทผู้ใช้เพื่อให้คำแนะนำ\nและการวิเคราะห์สุขภาพที่เหมาะ\nกับความต้องการของคุณมากที่สุด!";
      case 1:
        return "การเลือกเพศของคุณจะใช้สำหรับวิเคราะห์\nและสุขภาพที่ได้มีประสิทธิภาพมากขึ้น";
      case 2:
        return "การระบุวันเกิดจะช่วยให้เราสามารถ\nวิเคราะห์สุขภาพได้ถูกต้องแม่นยำมากขึ้น";
      case 3:
        return "ส่วนสูงของคุณเป็นข้อมูลสำคัญที่ช่วยในการประเมินดัชนีมวลกาย";
      case 4:
        return "น้ำหนักของคุณเป็นข้อมูลสำคัญที่ช่วยในการประเมินดัชนีมวลกาย";
      case 5:
        return "เพิ่มยาที่คุณใช้ประจำเพื่อช่วยเตือนการทานยาและวิเคราะห์สุขภาพที่แม่นยำยิ่งขึ้น";
      default:
        return "";
    }
  };

  const isBirthdayComplete = () => {
    return (
      selections.birthday.day &&
      selections.birthday.month &&
      selections.birthday.year
    );
  };

  const getModalTitle = () => {
    switch (modalType) {
      case "day":
        return "วันที่";
      case "month":
        return "เดือน";
      case "year":
        return "ปี";
      default:
        return "";
    }
  };

  const getStepTitle = () => {
    if (currentStep === 3) return "ส่วนสูงของฉัน";
    if (currentStep === 4) return "น้ำหนักของฉัน";
    if (currentStep === 5) return "ยาประจำของฉัน";
    return steps[currentStep]?.title || "";
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 3:
        return (
          <View className="flex-col items-center">
            <Image
              source={require("../../assets/BeginnerSetup/ruler&pen.png")}
              className="w-32 h-32 mb-6"
              resizeMode="contain"
            />
            <View className="w-full flex-row justify-center items-center space-x-2">
              <TextInput
                className="flex-1 bg-background rounded p-3 text-center text-description font-regular"
                placeholder="ส่วนสูง"
                keyboardType="numeric"
                value={height}
                onChangeText={setHeight}
              />
              <Text className="text-description text-secondary font-regular pl-2">
                เซนติเมตร
              </Text>
            </View>
          </View>
        );
      case 4:
        return (
          <View className="flex-col items-center">
            <Image
              source={require("../../assets/BeginnerSetup/weight.png")}
              className="w-32 h-32 mb-6"
              resizeMode="contain"
            />
            <View className="w-full flex-row justify-center items-center space-x-2">
              <TextInput
                className="flex-1 bg-background rounded p-3 text-center text-description font-regular"
                placeholder="น้ำหนัก"
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
              />
              <Text className="text-description text-secondary font-regular pl-2">
                กิโลกรัม
              </Text>
            </View>
          </View>
        );
      case 5:
        return (
          <View className="flex-col items-center w-full">
            <Image
              source={require("../../assets/BeginnerSetup/medicine.png")}
              className="w-32 h-32 mb-6"
              resizeMode="contain"
            />
            <View className="w-full">
              <TouchableOpacity
                className="w-full flex-row items-center justify-between bg-background rounded p-3"
                onPress={() => router.push("/user/MedicationForm")}
              >
                <Text className="text-gray-400 text-description font-regular">
                  เพิ่มยาประจำของคุณ
                </Text>
                <View className="w-6 h-6 bg-primary rounded-full items-center justify-center">
                  <Text className="text-card font-bold">+</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 2:
        return (
          <BirthdayInput
            day={selections.birthday.day}
            month={selections.birthday.month}
            year={selections.birthday.year}
            onPressDay={() => openDateModal("day")}
            onPressMonth={() => openDateModal("month")}
            onPressYear={() => openDateModal("year")}
          />
        );
      default:
        return steps[currentStep]?.options.map(renderOption);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <SafeAreaView className="flex-1 bg-background">
        <StatusBar barStyle="dark-content" backgroundColor="#F8F8F8" />

        {currentStep > 0 && (
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
        )}

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 justify-center px-4">
            <Card>
              <Text className="text-title text-secondary font-bold mb-2">
                {getStepTitle()}
              </Text>
              <BreakLine />

              {renderStepContent()}

              <BreakLine />

              <NavigationDots
                currentStep={currentStep}
                totalSteps={6}
                message={getStepMessage()}
              />
            </Card>
          </View>
        </TouchableWithoutFeedback>

        {(currentStep === 2 ||
          currentStep === 3 ||
          currentStep === 4 ||
          currentStep === 5) && (
          <View className="px-4 pb-8">
            <TouchableOpacity
              className={`w-full py-4 rounded ${
                (currentStep === 2 && isBirthdayComplete()) ||
                (currentStep === 3 && height) ||
                (currentStep === 4 && weight) ||
                currentStep === 5
                  ? "bg-primary"
                  : "bg-gray"
              }`}
              onPress={handleNext}
              disabled={
                (currentStep === 2 && !isBirthdayComplete()) ||
                (currentStep === 3 && !height) ||
                (currentStep === 4 && !weight)
              }
            >
              <Text className="text-card text-center font-bold text-button">
                {currentStep === 5 ? "เสร็จสิ้น" : "ต่อไป"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <SelectionModal
          visible={modalVisible}
          onClose={() => {
            setModalVisible(false);
            setModalType(null);
          }}
          onSelect={handleDateSelection}
          options={getModalOptions()}
          title={getModalTitle()}
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

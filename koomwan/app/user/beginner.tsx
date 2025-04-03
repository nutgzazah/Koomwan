import React, { useEffect, useRef } from "react";
import {
  View,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  Animated,
  Easing,
} from "react-native";
import { router } from "expo-router";
import Card from "../../global/components/Card";
import BreakLine from "../../global/components/BreakLine";
import SelectionModal from "../../components/beginner/SelectionModal";
import BirthdayInput from "../../components/beginner/BirthdayInput";
import NavigationDots from "../../components/beginner/NavigationDots";
import { HeightInput } from "../../components/beginner/HeightInput";
import { WeightInput } from "../../components/beginner/WeightInput";
import { MedicineInput } from "../../components/beginner/(medicine)/MedicineInput";
import { StepOption } from "../../components/beginner/StepOption";
import { BeginnerBackButton } from "../../components/beginner/BackButton";
import { NextButton } from "../../components/beginner/NextButton";
import { useBeginnerSetup } from "../../hooks/useBeginnerSetup";
import Loading from "../../global/components/Loading";
import {
  steps,
  getStepMessage,
  getModalTitle,
  getStepTitle,
  getModalOptions,
} from "../../constant/beginnerSetup";

export default function BeginnerSetupScreen() {
  const {
    currentStep,
    selections,
    modalVisible,
    modalType,
    height,
    weight,
    isLoading,
    healthInfoId,
    setHeight,
    setWeight,
    handleNext,
    handleBack,
    handleSelection,
    handleDateSelection,
    openDateModal,
    setModalVisible,
    setModalType,
    isBirthdayComplete,
    isStepValid,
  } = useBeginnerSetup();

  // Animation
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const previousStep = useRef(currentStep);

  // เพิ่ม Animation ตอน switch case
  useEffect(() => {
    // ข้ามการ animate ถ้า currentStep ไม่เปลี่ยน
    if (previousStep.current !== currentStep) {
      // ทิศทางการ animate
      // 1 = ขวาไปซ้าย (next)
      // -1 = ซ้ายไปขวา (back)
      // 0 = ไม่มีการ animate (first step)
      const direction = previousStep.current < currentStep ? 1 : -1;

      // ลบ animation ก่อนหน้า
      slideAnim.setValue(100 * direction);
      fadeAnim.setValue(0);

      // แสดง animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
      ]).start();
    }

    // อัพเดท previousStep
    // เพื่อให้ animation ทำงานถูกต้องในครั้งถัดไป
    previousStep.current = currentStep;
  }, [currentStep, fadeAnim, slideAnim]);

  const renderStepContent = () => {
    switch (currentStep) {
      case 3:
        return <HeightInput height={height} setHeight={setHeight} />;
      case 4:
        return <WeightInput weight={weight} setWeight={setWeight} />;
      case 5:
        // ส่ง healthInfoId ไปให้ MedicineInput
        return <MedicineInput healthInfoId={healthInfoId} />;
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
        return steps[currentStep]?.options.map((option) => (
          <StepOption
            key={option.id}
            option={option}
            onSelect={handleSelection}
          />
        ));
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <SafeAreaView className="flex-1 bg-background">
        <StatusBar barStyle="dark-content" backgroundColor="#F8F8F8" />

        {currentStep > 0 && <BeginnerBackButton onPress={handleBack} />}

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 justify-center px-4">
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ translateX: slideAnim }],
                flex: 1,
                justifyContent: "center",
              }}
            >
              <Card>
                <Text className="text-title text-secondary font-bold mb-2">
                  {getStepTitle(currentStep)}
                </Text>
                <BreakLine />

                {renderStepContent()}

                <BreakLine />

                <NavigationDots
                  currentStep={currentStep}
                  totalSteps={6}
                  message={getStepMessage(currentStep)}
                />
              </Card>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>

        {(currentStep === 2 ||
          currentStep === 3 ||
          currentStep === 4 ||
          currentStep === 5) && (
          <View className="px-4 pb-8">
            <NextButton
              onPress={handleNext}
              disabled={!isStepValid()}
              isLastStep={currentStep === 5}
            />
          </View>
        )}

        <SelectionModal
          visible={modalVisible}
          onClose={() => {
            setModalVisible(false);
            setModalType(null);
          }}
          onSelect={handleDateSelection}
          options={getModalOptions(modalType)}
          title={getModalTitle(modalType)}
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

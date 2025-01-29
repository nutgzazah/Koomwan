// screens/BeginnerSetupScreen.tsx
import React from "react";
import {
  View,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
} from "react-native";
import Card from "../../global/components/Card";
import BreakLine from "../../global/components/BreakLine";
import SelectionModal from "../../components/beginner/SelectionModal";
import BirthdayInput from "../../components/beginner/BirthdayInput";
import NavigationDots from "../../components/beginner/NavigationDots";
import { HeightInput } from "../../components/beginner/HeightInput";
import { WeightInput } from "../../components/beginner/WeightInput";
import { MedicineInput } from "../../components/beginner/MedicineInput";
import { StepOption } from "../../components/beginner/StepOption";
import { BackButton } from "../../components/beginner/BackButton";
import { NextButton } from "../../components/beginner/NextButton";
import { useBeginnerSetup } from "../../hooks/useBeginnerSetup";
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
  } = useBeginnerSetup();

  const renderStepContent = () => {
    switch (currentStep) {
      case 3:
        return <HeightInput height={height} setHeight={setHeight} />;
      case 4:
        return <WeightInput weight={weight} setWeight={setWeight} />;
      case 5:
        return <MedicineInput />;
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <SafeAreaView className="flex-1 bg-background">
        <StatusBar barStyle="dark-content" backgroundColor="#F8F8F8" />

        {currentStep > 0 && <BackButton onPress={handleBack} />}

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 justify-center px-4">
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
          </View>
        </TouchableWithoutFeedback>

        {(currentStep === 2 ||
          currentStep === 3 ||
          currentStep === 4 ||
          currentStep === 5) && (
          <View className="px-4 pb-8">
            <NextButton
              onPress={handleNext}
              disabled={
                (currentStep === 2 && !isBirthdayComplete()) ||
                (currentStep === 3 && !height) ||
                (currentStep === 4 && !weight)
              }
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

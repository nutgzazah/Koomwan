import { useState } from 'react';
import { router } from 'expo-router';

export type DateModalType = "day" | "month" | "year" | null;

export const useBeginnerSetup = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState({
    userType: "", //เก็บว่า user ทั่วไป หรือ เบาหวาน
    gender: "",
    birthday: { day: "", month: "", year: "" },
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<DateModalType>(null);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const isHeightValid = (height: string) => {
    const heightNum = parseInt(height);
    return heightNum >= 100 && heightNum <= 299;
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 2:
        return isBirthdayComplete();
      case 3:
        return height && isHeightValid(height);
      case 4:
        return !!weight;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep === 2 && isBirthdayComplete()) {
      setCurrentStep(3);
    } else if (currentStep === 3 && height && isHeightValid(height)) {
      setCurrentStep(4);
    } else if (currentStep === 4 && weight) {
      setCurrentStep(5);
    } else if (currentStep === 5) {
      router.push("/user/Success");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      router.back();
    }
  };

  const handleSelection = (value: string) => {
    switch (currentStep) {
      case 0:
        setSelections((prev) => ({ ...prev, userType: value }));
        break;
      case 1:
        setSelections((prev) => ({ ...prev, gender: value }));
        break;
    }
    if (currentStep < 2) {
      setCurrentStep((prev) => prev + 1);
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

  const isBirthdayComplete = () => {
    return (
      selections.birthday.day &&
      selections.birthday.month && 
      selections.birthday.year
    );
  };

  return {
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
    isStepValid,
  };
};
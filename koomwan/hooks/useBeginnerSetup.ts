import { useState } from 'react';
import { router } from 'expo-router';
import BASE_URL from '../config';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

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
  const [isLoading, setIsLoading] = useState(false);
  const [healthInfoId, setHealthInfoId] = useState<string | null>(null);

  // แปลงเดือนภาษาไทยเป็นตัวเลข
  const getMonthNumber = (monthName: string): number => {
    const months = [
      "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
      "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];
    return months.indexOf(monthName);
  };

  // แปลงปีพุทธศักราชเป็นคริสต์ศักราช พ.ศ. - 543 = ค.ศ.
  const convertToGregorianYear = (buddhistYear: string): number => {
    return parseInt(buddhistYear) - 543;
  };

  // สร้างวันที่โดยกำหนดเวลาเป็น 00:00:00
  const createDateWithoutTime = (day: number, month: number, year: number): string => {
    // สร้างวันที่ในรูปแบบ ISO string ที่เวลาเป็น 00:00:00
    const date = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
    return date.toISOString();
  };

  const isHeightValid = (height: string) => {
    const heightNum = parseInt(height);
    return heightNum >= 100 && heightNum <= 299;
  };

  const isWeightValid = (weight: string) => {
    const weightNum = parseInt(weight);
    return weightNum > 30 && weightNum <= 200;
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 2:
        return isBirthdayComplete();
      case 3:
        return height && isHeightValid(height);
      case 4:
        return weight && isWeightValid(weight);
      default:
        return true;
    }
  };

  // Function to create healthInfo before the medication step
  const createHealthInfo = async () => {
    try {
      setIsLoading(true);
      
      // Get authentication data from AsyncStorage
      const authData = await AsyncStorage.getItem("@auth");
      if (!authData) {
        console.log("No authentication data found.");
        return false;
      }
      const auth = JSON.parse(authData);
      const token = auth.token;
      const user = auth.user;
      const userId = user._id;
      
      if (!userId || !token) {
        Alert.alert("ข้อผิดพลาด", "กรุณาเข้าสู่ระบบอีกครั้ง");
        router.replace('/user/login');
        return false;
      }
      
      // สร้างวันที่จากข้อมูลที่ผู้ใช้เลือก (โดยตั้งเวลาเป็น 00:00:00)
      const day = parseInt(selections.birthday.day);
      const month = getMonthNumber(selections.birthday.month);
      const year = convertToGregorianYear(selections.birthday.year);
      const birthdateString = createDateWithoutTime(day, month, year);
      
      // ข้อมูลสำหรับส่งไปยัง API
      const data = {
        userId: userId,
        diabetestype: selections.userType === 'diabetic' ? 'diabetes' : 'none',
        gender: selections.gender,
        birthdate: birthdateString,
        height: parseInt(height),
        weight: parseInt(weight),
        // regularpill เพิ่มข้อมูลแยกอีกไฟล์แล้ว
      };
      
      // แสดงข้อมูลที่จะส่งไป API
      console.log("Creating healthInfo with data:", JSON.stringify(data, null, 2));
      
      const response = await axios.post(
        `${BASE_URL}/api/v1/user/beginnerSetup`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      // Log ผลลัพธ์จาก API
      console.log("API Response:", JSON.stringify(response.data, null, 2));
      
      if (response.data.success) {
        // ดึง healthInfoId หลังจากสร้าง healthInfo สำเร็จ
        if (response.data.healthInfo && response.data.healthInfo._id) {
          setHealthInfoId(response.data.healthInfo._id);
        }
        return true;
      } else {
        Alert.alert("เกิดข้อผิดพลาดในการส่งข้อมูล", "กรุณาลองใหม่อีกครั้ง");
        return false;
      }
    } catch (error) {
      console.error('Error creating health info:', error);
      
      // Log ข้อผิดพลาด
      if (axios.isAxiosError(error)) {
        console.log("API Error Response:", JSON.stringify(error.response?.data, null, 2));
        console.log("API Error Status:", error.response?.status);
      } 
      
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        Alert.alert("เกิดข้อผิดพลาด", 'กรุณาลองใหม่อีกครั้ง');
      } else {
        Alert.alert('เกิดข้อผิดพลาดในการเชื่อมต่อ', 'กรุณาลองใหม่อีกครั้ง');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    if (currentStep === 2 && isBirthdayComplete()) {
      setCurrentStep(3);
    } else if (currentStep === 3 && height && isHeightValid(height)) {
      setCurrentStep(4);
    } else if (currentStep === 4 && weight && isWeightValid(weight)) {
      // เมื่อผู้ใช้กรอกข้อมูลครบถึงน้ำหนัก ให้สร้าง healthInfo ก่อนไปหน้าเพิ่มยา
      const success = await createHealthInfo();
      if (success) {
        setCurrentStep(5);
      }
    } else if (currentStep === 5) {
      console.log("======== BEGINNER SETUP COMPLETED ========");
      console.log("User Type:", selections.userType);
      console.log("Gender:", selections.gender);
      console.log("Birthday:", selections.birthday);
      console.log("Height:", height);
      console.log("Weight:", weight);
      console.log("HealthInfoId:", healthInfoId);
      console.log("Current Step:", currentStep);
      console.log("====================================");
      router.replace("/user/Success");
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
  };
};
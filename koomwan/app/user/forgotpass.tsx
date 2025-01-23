import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";

import { AuthLayout } from "../../components/login_signin/AuthLayout";
import { StatusScreen } from "../../components/login_signin/StatusScreen";
import { OTPScreen } from "../../components/login_signin/OTPScreen";
import BASE_URL from "../../config"
import axios from "axios";
import Toast from 'react-native-toast-message';

type StatusType = "none" | "success" | "error";

function ForgotPasswordScreen() {
  const router = useRouter();

  // State for inputs
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Screen state
  const [otpSent, setOtpSent] = useState(false);
  const [isSettingPassword, setIsSettingPassword] = useState(false);
  const [status, setStatus] = useState<StatusType>("none");

  // OTP resend functionality
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(30);

  // Input validation
  const isUsernameValid = username.trim().length > 0;
  const isOtpValid = otp.length === 6;
  const isPasswordValid =
    newPassword.length > 5 && newPassword === confirmPassword;

  {
    /* OTP countdown timer  */
  }
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (resendDisabled && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }

    if (countdown === 0) {
      setResendDisabled(false);
      setCountdown(30);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [resendDisabled, countdown]);

  const handleRequestOTP = async () => {
    
    try {
      // เช็คว่ามี username หรือ phone ไหม
      if (isUsernameValid) {
        // ตรวจสอบว่า username คือเบอร์โทรศัพท์มีไหม
        let checkuserData = {};
  
        if (validatePhone(username)) {
          // ถ้าเป็นเบอร์โทรศัพท์ไทย
          checkuserData = { username};
        } else {
          // ถ้าเป็น username ธรรมดา
          checkuserData = { username};
        }
  
        const response = await axios.post(`${BASE_URL}/api/v1/auth/checkUserResetPassword`, checkuserData);
        if (response.status === 200) {
          setOtpSent(true);
          setResendDisabled(true);
        } else {
          console.error("checking failed:");
        }
      }
      else {
        console.error("Username Invalid: ",username);
      }
    } catch (error) {
      // ตรวจสอบว่าคือ AxiosError หรือไม่
      if (axios.isAxiosError(error)) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: error.response?.data.message || "Unknown error occurred",
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Unexpected Error',
          text2: 'An unexpected error occurred',
        });
      }
      console.error("Error submitting form:", error);
    }


    if (isUsernameValid) {
      // ตรวจสอบว่า username คือเบอร์โทรศัพท์มีไหม
      let checkuserData = {};

      if (validatePhone(username)) {
        // ถ้าเป็นเบอร์โทรศัพท์ไทย
        checkuserData = { username};
      } else {
        // ถ้าเป็น username ธรรมดา
        checkuserData = { username};
      }

      const result = await axios.post(`${BASE_URL}/api/v1/auth/checkUserResetPassword`, checkuserData);
      setOtpSent(true);
      setResendDisabled(true);
    }
  };

  const handleResendOTP = () => {
    if (!resendDisabled) {
      setResendDisabled(true);
    }
  };

  const handleVerifyOTP = () => {
    if (isOtpValid) {
      setOtpSent(false);
      setIsSettingPassword(true);
    }
  };
  
  const validatePhone = (phone: string): boolean => {
    // Remove any spaces or dashes
    const cleanPhone = phone.replace(/[ -]/g, "");
  
    // Must start with 0
    // Second digit must be 6, 8, or 9 (for mobile numbers)
    // Must be exactly 10 digits
    const thaiMobileRegex = /^0[689]\d{8}$/;
  
    return thaiMobileRegex.test(cleanPhone);
  };

  const handleSetNewPassword = () => {
    if (isPasswordValid) {
      setStatus("success");
    } else {
      setStatus("error");
    }
  };

  {
    /* Success/Error status screen component */
  }
  if (status !== "none") {
    return (
      <StatusScreen
        status={status === "success" ? "success" : "error"}
        title={
          status === "success"
            ? "เปลี่ยนรหัสผ่านสำเร็จ"
            : "เปลี่ยนรหัสผ่านไม่สำเร็จ"
        }
        description={
          status === "success"
            ? "พร้อมสำหรับการดูแลสุขภาพของคุณหรือยัง!"
            : "โปรดลองใหม่อีกครั้งในภายหลัง"
        }
        buttonText={
          status === "success" ? "เข้าสู่ระบบ" : "กลับไปที่หน้าเข้าสู่ระบบ"
        }
        onButtonPress={() => router.replace("/user/login")}
        backgroundImage={require("../../assets/Login/images/forgotpass.png")}
      />
    );
  }

  {
    /* Set new password screen component */
  }
  const renderSetPasswordScreen = () => (
    <AuthLayout
      backgroundImage={require("../../assets/Login/images/forgotpass.png")}
    >
      <View className="items-center mb-8">
        <Text className="text-display font-bold text-secondary mb-5">
          ตั้งรหัสผ่านใหม่
        </Text>
        <Text className="text-description text-secondary text-center font-regular">
          โปรดตั้งรหัสผ่านใหม่สำหรับบัญชีของคุณ
        </Text>
      </View>

      <View className="h-[1px] w-full bg-gray mb-8" />

      <View className="space-y-4">
        {/* New password input */}
        <View className="relative mb-3">
          <Image
            source={require("../../assets/Login/lock.png")}
            className="w-6 h-6 absolute left-4 top-4 z-10"
            resizeMode="contain"
          />
          <TextInput
            className="w-full pl-12 h-[50px] px-4 border border-gray rounded-[5px] text-description font-bold bg-background"
            placeholder="รหัสผ่าน"
            secureTextEntry={!showPassword}
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TouchableOpacity
            className="absolute right-4 top-4 z-10"
            onPress={() => setShowPassword(!showPassword)}
          >
            <Image
              source={
                showPassword
                  ? require("../../assets/Login/eye.png")
                  : require("../../assets/Login/eye-slash.png")
              }
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* Confirm password input */}
        <View className="relative mb-8">
          <Image
            source={require("../../assets/Login/lock.png")}
            className="w-6 h-6 absolute left-4 top-4 z-10"
            resizeMode="contain"
          />
          <TextInput
            className="w-full pl-12 h-[50px] px-4 border border-gray rounded-[5px] text-description font-bold bg-background"
            placeholder="ยืนยันรหัสผ่าน"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        <TouchableOpacity
          className={`w-full py-4 rounded-[5px] mb-5 ${
            isPasswordValid ? "bg-primary" : "bg-gray"
          }`}
          onPress={handleSetNewPassword}
          disabled={!isPasswordValid}
        >
          <Text className="text-card text-center font-bold text-button">
            เปลี่ยนรหัสผ่าน
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-primary text-center font-bold text-button">
            กลับไปหน้าเข้าสู่ระบบ
          </Text>
        </TouchableOpacity>
      </View>
    </AuthLayout>
  );

  {
    /* OTP verification screen component */
  }
  const renderOTPScreen = () => (
    <OTPScreen
      backgroundImage={require("../../assets/Login/images/forgotpass.png")}
      otp={otp}
      onOtpChange={setOtp}
      onVerifyOTP={handleVerifyOTP}
      onResendOTP={handleResendOTP}
      onBack={() => router.back()}
      isOtpValid={isOtpValid}
      resendDisabled={resendDisabled}
      countdown={countdown}
      backType="login"
    />
  );

  {
    /*Forgot password screen component*/
  }
  const renderInitialScreen = () => (
    <AuthLayout
      backgroundImage={require("../../assets/Login/images/forgotpass.png")}
    >
      <View className="items-center mb-8">
        <Text className="text-display font-bold text-secondary mb-5">
          ลืมรหัสผ่าน
        </Text>
        <Text className="text-description text-secondary font-regular text-center">
          เราจะทำการส่ง OTP เลข 6 หลัก{"\n"}
          ที่เบอร์โทรศัพท์ของบัญชีที่คุณลงทะเบียน
        </Text>
      </View>

      <View className="h-[1px] w-full bg-gray mb-8" />

      <View className="space-y-4">
        <View className="relative mb-8">
          <Image
            source={require("../../assets/Login/user.png")}
            className="w-6 h-6 absolute left-4 top-4 z-10"
            resizeMode="contain"
          />
          <TextInput
            className="w-full pl-12 h-[50px] px-4 border border-gray rounded-[5px] text-description font-bold bg-background"
            placeholder="ชื่อผู้ใช้งานหรือเบอร์โทรศัพท์"
            value={username}
            onChangeText={setUsername}
          />
        </View>

        <TouchableOpacity
          className={`w-full py-4 rounded-[5px] mb-5 ${
            isUsernameValid ? "bg-primary" : "bg-gray"
          }`}
          onPress={handleRequestOTP}
          disabled={!isUsernameValid}
        >
          <Text className="text-card text-center font-bold text-button">
            ส่งรหัส OTP
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-primary text-center font-bold text-button">
            กลับไปหน้าเข้าสู่ระบบ
          </Text>
        </TouchableOpacity>
      </View>
    </AuthLayout>
  );

  {
    /* Render screen based on current state*/
  }

  if (isSettingPassword) return renderSetPasswordScreen();
  if (otpSent) return renderOTPScreen()
  return (
    <>
    {renderInitialScreen()}
    <Toast />
    </>
  )
}

export default ForgotPasswordScreen;

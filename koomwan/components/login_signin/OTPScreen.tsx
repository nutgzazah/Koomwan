import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { AuthLayout } from "./AuthLayout";

type OTPScreenProps = {
  backgroundImage: any;
  otp: string;
  onOtpChange: (text: string) => void;
  onVerifyOTP: () => void;
  onResendOTP: () => void;
  onBack: () => void;
  isOtpValid: boolean;
  resendDisabled: boolean;
  countdown: number;
  backType: "login" | "register";
};

export const OTPScreen = ({
  backgroundImage,
  otp,
  onOtpChange,
  onVerifyOTP,
  onResendOTP,
  onBack,
  isOtpValid,
  resendDisabled,
  countdown,
  backType,
}: OTPScreenProps) => {
  const getBackButtonText = () => {
    return backType === "login"
      ? "กลับไปหน้าเข้าสู่ระบบ"
      : "กลับไปหน้าลงทะเบียน";
  };

  return (
    <AuthLayout backgroundImage={backgroundImage}>
      <View className="items-center mb-8">
        <Text className="text-display font-bold text-secondary mb-5">
          ยืนยัน OTP
        </Text>
        <Text className="text-description text-secondary text-center font-regular">
          กรอกรหัส OTP เลข 6 หลักที่ส่งไปยัง{"\n"}เบอร์โทรศัพท์ของคุณ
        </Text>
      </View>

      <View className="h-[1px] w-full bg-gray mb-8" />

      <View className="space-y-4">
        <TextInput
          className="w-full h-[50px] px-4 border border-gray rounded-[5px] text-description font-bold bg-background mb-5"
          placeholder="กรอกรหัส OTP"
          value={otp}
          onChangeText={onOtpChange}
          keyboardType="number-pad"
          maxLength={6}
        />

        <View className="flex-row justify-between items-center mb-5">
          <Text className="text-description text-secondary font-regular">
            ยังไม่ได้รับรหัส OTP?
          </Text>
          <TouchableOpacity onPress={onResendOTP} disabled={resendDisabled}>
            <Text
              className={`text-description font-bold ${
                resendDisabled ? "text-gray" : "text-primary"
              }`}
            >
              {resendDisabled
                ? `ส่งรหัสอีกครั้ง (${countdown}s)`
                : "ส่งรหัสอีกครั้ง"}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className={`w-full py-4 rounded-[5px] mb-5 ${
            isOtpValid ? "bg-primary" : "bg-gray"
          }`}
          onPress={onVerifyOTP}
          disabled={!isOtpValid}
        >
          <Text className="text-card text-center font-bold text-button">
            ยืนยัน OTP
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onBack}>
          <Text className="text-primary text-center font-bold text-button">
            {getBackButtonText()}
          </Text>
        </TouchableOpacity>
      </View>
    </AuthLayout>
  );
};

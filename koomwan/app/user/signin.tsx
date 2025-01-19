import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { AuthLayout } from "../../components/login_signin/AuthLayout";
import { useRouter } from "expo-router";
import { OTPScreen } from "../../components/login_signin/OTPScreen";

type FormData = {
  username: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
};

export default function UserSignInScreen() {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });

  const router = useRouter();
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [showOTP, setShowOTP] = useState(false);

  // for OTP Screen component
  const [otp, setOtp] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(30);

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

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};

    if (!formData.username) {
      newErrors.username = "กรุณากรอกชื่อผู้ใช้";
    }

    if (!formData.password) {
      newErrors.password = "กรุณากรอกรหัสผ่าน";
    } else if (formData.password.length < 6) {
      newErrors.password = "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "กรุณายืนยันรหัสผ่าน";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "รหัสผ่านไม่ตรงกัน";
    }

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "กรุณากรอกเบอร์โทรศัพท์";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log("Form submitted:", formData);
      // Handle successful form submission
      setShowOTP(true);
      setResendDisabled(true);
    }
  };

  const handleOtpChange = (text: string) => {
    setOtp(text);
  };

  const handleVerifyOTP = () => {
    // TODO: Verify OTP logic
    console.log("Verifying OTP:", otp);
  };

  const handleResendOTP = () => {
    if (!resendDisabled) {
      // TODO: Resend OTP logic
      console.log("Resending OTP");
      setResendDisabled(true);
    }
  };

  if (showOTP) {
    return (
      <OTPScreen
        backgroundImage={require("../../assets/Signup/images/signup1.png")}
        otp={otp}
        onOtpChange={handleOtpChange}
        onVerifyOTP={handleVerifyOTP}
        onResendOTP={handleResendOTP}
        onBack={() => setShowOTP(false)}
        isOtpValid={otp.length === 6}
        resendDisabled={resendDisabled}
        countdown={countdown}
        backType="register"
      />
    );
  }

  return (
    <AuthLayout
      backgroundImage={require("../../assets/Signup/images/signup1.png")}
    >
      <View className="flex-1">
        <TouchableOpacity
          className="absolute left-0 top-0 p-2 z-10"
          onPress={() => router.back()}
        >
          <Image
            source={require("../../assets/Signup/arrow-circle-left.png")}
            className="w-8 h-8"
          />
        </TouchableOpacity>

        <View className="items-center mb-8">
          <Text className="text-display font-bold text-secondary mb-5">
            ลงทะเบียน
          </Text>
          <Text className="text-description font-regular text-secondary">
            มาเป็นส่วนหนึ่งเดียวกับพวกเรา!
          </Text>
        </View>

        <View className="h-[1px] bg-gray mb-8" />

        <View className="space-y-4">
          <View className="relative mb-3">
            <Image
              source={require("../../assets/Signup/user.png")}
              className="w-6 h-6 absolute left-4 top-4 z-10"
              resizeMode="contain"
            />
            <TextInput
              className={`w-full h-[50px] pl-12 pr-4 border rounded-[5px] text-description font-bold ${
                errors.username ? "border-abnormal" : "border-gray"
              }`}
              placeholder="ชื่อผู้ใช้"
              value={formData.username}
              onChangeText={(text) =>
                setFormData({ ...formData, username: text })
              }
            />
            {errors.username && (
              <Text className="text-abnormal text-tag font-regular mt-1">
                {errors.username}
              </Text>
            )}
          </View>

          <View className="relative mb-3">
            <Image
              source={require("../../assets/Signup/lock.png")}
              className="w-6 h-6 absolute left-4 top-4 z-10"
              resizeMode="contain"
            />
            <TextInput
              className={`w-full h-[50px] pl-12 pr-4 border rounded-[5px] text-description font-bold ${
                errors.password ? "border-abnormal" : "border-gray"
              }`}
              placeholder="รหัสผ่าน"
              secureTextEntry
              value={formData.password}
              onChangeText={(text) =>
                setFormData({ ...formData, password: text })
              }
            />
            {errors.password && (
              <Text className="text-abnormal text-tag font-regular mt-1">
                {errors.password}
              </Text>
            )}
          </View>

          <View className="relative mb-3">
            <Image
              source={require("../../assets/Signup/lock.png")}
              className="w-6 h-6 absolute left-4 top-4 z-10"
              resizeMode="contain"
            />
            <TextInput
              className={`w-full h-[50px] pl-12 pr-4 border rounded-[5px] text-description font-bold ${
                errors.confirmPassword ? "border-abnormal" : "border-gray"
              }`}
              placeholder="ยืนยันรหัสผ่าน"
              secureTextEntry
              value={formData.confirmPassword}
              onChangeText={(text) =>
                setFormData({ ...formData, confirmPassword: text })
              }
            />
            {errors.confirmPassword && (
              <Text className="text-abnormal text-tag font-regular mt-1">
                {errors.confirmPassword}
              </Text>
            )}
          </View>

          <View className="relative mb-5">
            <Image
              source={require("../../assets/Signup/phone.png")}
              className="w-6 h-6 absolute left-4 top-4 z-10"
              resizeMode="contain"
            />
            <TextInput
              className={`w-full h-[50px] pl-12 pr-4 border rounded-[5px] text-description font-bold ${
                errors.phoneNumber ? "border-abnormal" : "border-gray"
              }`}
              placeholder="โทรศัพท์"
              keyboardType="phone-pad"
              value={formData.phoneNumber}
              onChangeText={(text) =>
                setFormData({ ...formData, phoneNumber: text })
              }
            />
            {errors.phoneNumber && (
              <Text className="text-abnormal text-tag font-regular mt-1">
                {errors.phoneNumber}
              </Text>
            )}
          </View>

          <TouchableOpacity
            className="w-full bg-primary py-4 rounded-[5px] mt-5 mb-5"
            onPress={() => {
              handleSubmit();
            }}
          >
            <Text className="text-card text-center font-bold text-button">
              ถัดไป
            </Text>
          </TouchableOpacity>

          <View className="flex-row justify-center mb-5">
            <Text className="text-description text-gray font-regular">
              มีบัญชีผู้ใช้แล้วใช่ไหม?{"  "}
            </Text>
            <TouchableOpacity onPress={() => router.push("/user/login")}>
              <Text className="text-button font-bold text-primary font-regular">
                เข้าสู่ระบบ
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </AuthLayout>
  );
}

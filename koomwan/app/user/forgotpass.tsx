import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { AuthLayout } from "../../components/login_signin/AuthLayout";
import { useRouter } from "expo-router";

type StatusType = "none" | "success" | "error";

function ForgotPasswordScreen() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [otpSent, setOtpSent] = useState(false);
  const [isSettingPassword, setIsSettingPassword] = useState(false); // Controls password setting screen
  const [status, setStatus] = useState<StatusType>("none"); // Controls success/error screen

  // OTP resend functionality
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(30);

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

  const handleRequestOTP = () => {
    if (username) {
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
    if (otp.length === 6) {
      setOtpSent(false);
      setIsSettingPassword(true);
    }
  };

  const handleSetNewPassword = () => {
    if (newPassword && newPassword === confirmPassword) {
      setStatus("success");
    } else {
      setStatus("error");
    }
  };

  {
    /* Success/Error status screen component */
  }
  const renderStatusScreen = () => (
    <AuthLayout
      backgroundImage={require("../../assets/Login/images/forgotpass.png")}
    >
      <View className="items-center pt-8">
        {status === "success" ? (
          <>
            <View className="p-4 mb-4">
              <Image
                source={require("../../assets/Login/tick-circle.png")}
                className="w-20 h-20"
                resizeMode="contain"
              />
            </View>
            <Text className="text-display font-bold text-secondary mb-2">
              เปลี่ยนรหัสผ่านสำเร็จ
            </Text>
            <Text className="text-description text-secondary mb-8 font-regular">
              พร้อมสำหรับการดูแลสุขภาพของคุณหรือยัง!
            </Text>
          </>
        ) : (
          <>
            <View className="p-4 mb-4">
              <Image
                source={require("../../assets/Login/close-circle.png")}
                className="w-20 h-20"
                resizeMode="contain"
              />
            </View>
            <Text className="text-display font-bold text-secondary mb-2">
              เปลี่ยนรหัสผ่านไม่สำเร็จ
            </Text>
            <Text className="text-description text-secondary mb-8 font-regular">
              โปรดลองใหม่อีกครั้งในภายหลัง
            </Text>
          </>
        )}
        <View className="h-[1px] w-full bg-gray mb-8" />
        <TouchableOpacity
          className="w-full bg-primary py-4 rounded-[5px]"
          onPress={() => router.replace("/user/login")}
        >
          <Text className="text-card text-center font-bold text-button">
            {status === "success" ? "เข้าสู่ระบบ" : "กลับไปที่หน้าเข้าสู่ระบบ"}
          </Text>
        </TouchableOpacity>
      </View>
    </AuthLayout>
  );

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
          className="w-full bg-primary py-4 rounded-[5px] mb-5"
          onPress={handleSetNewPassword}
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
    <AuthLayout
      backgroundImage={require("../../assets/Login/images/forgotpass.png")}
    >
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
          onChangeText={setOtp}
          keyboardType="number-pad"
          maxLength={6}
        />

        <View className="flex-row justify-between items-center mb-5">
          <Text className="text-description text-secondary font-regular">
            ยังไม่ได้รับรหัส OTP?
          </Text>
          <TouchableOpacity onPress={handleResendOTP} disabled={resendDisabled}>
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
          className="w-full bg-primary py-4 rounded-[5px] mb-5"
          onPress={handleVerifyOTP}
        >
          <Text className="text-card text-center font-bold text-button">
            ยืนยัน OTP
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
        <View className="relative mb-5">
          <Image
            source={require("../../assets/Login/user.png")}
            className="w-6 h-6 absolute left-4 top-4 z-10"
            resizeMode="contain"
          />
          <TextInput
            className="w-full pl-12 h-[50px] px-4 border border-gray rounded-[5px] text-description font-bold bg-background mb-5"
            placeholder="ชื่อผู้ใช้งานหรือเบอร์โทรศัพท์"
            value={username}
            onChangeText={setUsername}
          />
        </View>

        <TouchableOpacity
          className="w-full bg-primary py-4 rounded-[5px] mb-5"
          onPress={handleRequestOTP}
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
  if (status !== "none") return renderStatusScreen();
  if (isSettingPassword) return renderSetPasswordScreen();
  if (otpSent) return renderOTPScreen();
  return renderInitialScreen();
}

export default ForgotPasswordScreen;

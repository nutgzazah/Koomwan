import React, { useState } from "react";
import { Image, View, Text, TextInput, TouchableOpacity } from "react-native";
import { AuthLayout } from "./AuthLayout";

type LoginLayoutProps = {
  title: string;
  description: string;
  backgroundImage: any;
  onForgotPassword: () => void;
  onRegister: () => void;
  onLogin: (username: string, password: string) => void;
};

export const LoginLayout = ({
  title,
  description,
  backgroundImage,
  onForgotPassword,
  onRegister,
  onLogin,
}: LoginLayoutProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLogin = () => {
    if (!username || !password) {
      setHasError(true);
    } else {
      setHasError(false);
      onLogin(username, password);
    }
  };

  return (
    <AuthLayout backgroundImage={backgroundImage}>
      {/* Header */}
      <View className="items-center mb-8">
        <Text className="text-display font-bold text-secondary mb-5">
          {title}
        </Text>
        <Text className="text-description font-regular text-secondary">
          {description}
        </Text>
      </View>

      {/* Divider Line */}
      <View className="h-[1px] bg-gray mb-8" />

      {/* Form Fields */}
      <View className="space-y-6">
        {/* Username Field */}
        <View className="relative mb-3">
          <Image
            source={require("../../assets/Login/user.png")}
            className="w-6 h-6 absolute left-4 top-4 z-10"
            resizeMode="contain"
          />
          <TextInput
            className={`w-full h-[50px] pl-12 pr-4 border rounded-[5px] text-description font-bold ${
              hasError && !username ? "border-abnormal" : "border-gray"
            } bg-background`}
            placeholder="ชื่อผู้ใช้งานหรือเบอร์โทรศัพท์"
            value={username}
            onChangeText={setUsername}
            placeholderTextColor="#C6C6C6"
          />
        </View>

        {/* Password Field */}
        <View className="relative">
          <Image
            source={require("../../assets/Login/lock.png")}
            className="w-6 h-6 absolute left-4 top-4 z-10"
            resizeMode="contain"
          />
          <TextInput
            className={`w-full h-[50px] pl-12 pr-12 border rounded-[5px] text-description font-bold ${
              hasError && !password ? "border-abnormal" : "border-gray"
            } bg-background`}
            placeholder="รหัสผ่าน"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#C6C6C6"
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

        {/* Error Message and Forgot Password Row */}
        <View className="flex-row justify-between items-center mt-5 mb-5">
          {hasError && !username && !password && (
            <Text className="text-abnormal text-description font-regular">
              โปรดกรอกชื่อผู้ใช้และรหัสผ่าน
            </Text>
          )}
          <TouchableOpacity className="ml-auto" onPress={onForgotPassword}>
            <Text className="text-primary text-button font-bold">
              ลืมรหัสผ่าน?
            </Text>
          </TouchableOpacity>
        </View>

        {/* Login Button */}
        <TouchableOpacity
          className="w-full bg-primary py-4 rounded-[5px]"
          onPress={handleLogin}
        >
          <Text className="text-card text-center font-bold text-button">
            เข้าสู่ระบบ
          </Text>
        </TouchableOpacity>

        {/* Divider */}
        <View className="flex-row items-center my-6">
          <View className="flex-1 h-px bg-secondary" />
          <Text className="mx-4 text-description font-regular color-secondary">
            หรือ
          </Text>
          <View className="flex-1 h-px bg-secondary" />
        </View>

        {/* Google Login Button */}
        <TouchableOpacity className="w-full flex-row items-center justify-center border border-[#CBCBCB] py-4 rounded-xl bg-white mt-4">
          <Image
            source={require("../../assets/Login/google-icon.png")}
            className="w-6 h-6 mr-2"
            resizeMode="contain"
          />
          <Text className="text-secondary text-description font-regular">
            เข้าสู่ระบบด้วย Google
          </Text>
        </TouchableOpacity>

        {/* Registration Link */}
        <View className="flex-row justify-center mt-6 mb-12">
          <Text className="text-description font-regular text-secondary">
            หากคุณยังไม่เคยลงทะเบียนมาก่อน{" "}
          </Text>
          <TouchableOpacity onPress={onRegister}>
            <Text className="text-primary text-button font-bold">
              ลงทะเบียน
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </AuthLayout>
  );
};

export default LoginLayout;

import {
  Image,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import React, { useContext, useState } from "react";
import { useRouter } from "expo-router";
import axios from "axios";
import BASE_URL from "../../config";

import InputField from "../../global/components/InputField";
import Toast from "react-native-toast-message";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../../context/authContext";

export default function UserLoginScreen() {
  const [state, setState] = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [hasError, setHasError] = useState(false);

  const router = useRouter();

  const validatePhone = (phone: string): boolean => {
    // Remove any spaces or dashes
    const cleanPhone = phone.replace(/[ -]/g, "");

    // Must start with 0
    // Second digit must be 6, 8, or 9 (for mobile numbers)
    // Must be exactly 10 digits
    const thaiMobileRegex = /^0[689]\d{8}$/;

    return thaiMobileRegex.test(cleanPhone);
  };

  // Check if user has health info
  const checkHealthInfoExists = async (userId: string): Promise<boolean> => {
    try {
      const authData = await AsyncStorage.getItem("@auth");
      const auth = authData ? JSON.parse(authData) : null;
      const token = auth.token;
      const response = await axios.get(
        `${BASE_URL}/api/v1/user/profile/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Check if healthinfo exists and is not null
      return response.data?.user?.healthinfo != null;
    } catch (error) {
      console.error("Error checking health info:", error);
      // If there's an error, we'll assume user needs to go through setup
      return false;
    }
  };

  const handleLogin = async () => {
    console.log("Login function called");
    try {
      if (!username || !password) {
        setHasError(true);
      } else {
        setHasError(false);

        // ตรวจสอบว่า username คือเบอร์โทรศัพท์ที่ถูกต้องหรือไม่
        let loginData = {};

        if (validatePhone(username)) {
          // ถ้าเป็นเบอร์โทรศัพท์ไทย
          loginData = { username, password };
        } else {
          // ถ้าเป็น username ธรรมดา
          loginData = { username, password };
        }

        const response = await axios.post(
          `${BASE_URL}/api/v1/auth/login`,
          loginData
        );
        setState({
          user: response.data.user,
          token: response.data.token,
        });
        await AsyncStorage.setItem("@auth", JSON.stringify(response.data));
        await AsyncStorage.setItem("userId", response.data.user._id);
        await AsyncStorage.setItem("token", response.data.token);
        console.log("Login response data:", response.data);

        // Check if user has health info
        const hasHealthInfo = await checkHealthInfoExists(
          response.data.user._id
        );

        if (hasHealthInfo) {
          // User has health info, route to main tabs

          router.replace("/(tabs)");
        } else {
          // User needs to complete beginner setup
          router.replace("/user/beginner");
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.reason
          ? `${error.response.data.message}\n\nเหตุผล: ${error.response.data.reason}`
          : error.response?.data?.message || "กรุณาลองใหม่อีกครั้ง";
    
        Alert.alert("เกิดข้อผิดพลาด", errorMessage);
        console.log("API Error Response:", error.response?.data);
      } else {
        Alert.alert("เกิดข้อผิดพลาด", "กรุณาลองใหม่อีกครั้ง");
      }
      console.error("Error to login:", error);
    }
  };

  //temp function to check local storage data
  const getLocalStorageData = async () => {
    let data = await AsyncStorage.getItem("@auth");
    console.log("Local Storage => ", data);
  };
  getLocalStorageData();

  return (
    <>
      <SafeAreaView className="flex-1 bg-background">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Background Image Container */}
          <View className="relative h-80">
            <Image
              source={require("../../assets/Login/images/login.png")}
              className="w-full h-full"
              resizeMode="cover"
            />
            {/* White Overlay */}
            <View className="absolute bottom-0 w-full h-8 bg-card rounded-t-[50px]" />
          </View>

          {/* Content Container */}
          <View className="flex-1 bg-card px-6">
            {/* Header */}
            <View className="items-center mb-8">
              <Text className="text-display font-bold text-secondary mb-5">
                เข้าสู่ระบบ
              </Text>
              <Text className="text-description font-regular text-secondary">
                กรุณาลงชื่อเข้าใช้เพื่อดำเนินการต่อ
              </Text>
            </View>

            {/* Divider Line */}
            <View className="h-[1px] bg-gray mb-8" />

            {/* Form Fields */}
            <View className="space-y-6">
              {/* Username Field */}
              <InputField
                value={username}
                onChangeText={setUsername}
                placeholder="ชื่อผู้ใช้งานหรือเบอร์โทรศัพท์"
                leftIcon={require("../../assets/Login/user.png")}
                hasError={hasError && !username}
              />

              {/* Password Field */}
              <InputField
                value={password}
                onChangeText={setPassword}
                placeholder="รหัสผ่าน"
                leftIcon={require("../../assets/Login/lock.png")}
                rightIcon={
                  showPassword
                    ? require("../../assets/Login/eye.png")
                    : require("../../assets/Login/eye-slash.png")
                }
                onRightIconPress={() => setShowPassword(!showPassword)}
                secureTextEntry={!showPassword}
                hasError={hasError && !password}
              />

              {/* Error Message and Forgot Password Row */}
              <View className="flex-row justify-between items-center mb-5">
                {/* Error Message */}
                <Text
                  className={`text-button font-regular ${
                    hasError ? "text-abnormal" : "text-transparent"
                  }`}
                >
                  โปรดกรอกชื่อผู้ใช้และรหัสผ่าน
                </Text>
                {/* Forgot Password Link */}
                <TouchableOpacity
                  onPress={() => router.push("/user/forgotpass")}
                >
                  <Text className="text-primary text-button font-bold">
                    ลืมรหัสผ่าน?
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Login Button */}
              <TouchableOpacity
                className="w-full bg-primary py-4 rounded-[5px] mt-3"
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
                <TouchableOpacity
                  onPress={() => router.push("/user/roleselect")}
                >
                  <Text className="text-primary text-button font-bold">
                    ลงทะเบียน
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
      <Toast />
    </>
  );
}

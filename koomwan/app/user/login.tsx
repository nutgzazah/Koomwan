import React from "react";
import { useRouter } from "expo-router";
import LoginLayout from "../../components/login_signin/LoginLayout";

export default function UserLoginScreen() {
  const router = useRouter();

  const handleLogin = (username: string, password: string) => {
    // Handle login logic
  };

  return (
    <LoginLayout
      title="เข้าสู่ระบบ"
      description="กรุณาลงชื่อเข้าใช้เพื่อดำเนินการต่อ"
      backgroundImage={require("../../assets/Login/images/login.png")}
      onForgotPassword={() => router.push("/user/forgotpass")}
      onRegister={() => router.push("/user/roleselect")}
      onLogin={handleLogin}
    />
  );
}

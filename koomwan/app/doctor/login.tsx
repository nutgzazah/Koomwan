import React from "react";
import { useRouter } from "expo-router";
import LoginLayout from "../../components/login_signin/LoginLayout";

export default function DoctorLoginScreen() {
  const router = useRouter();

  const handleLogin = (username: string, password: string) => {
    // Handle login logic
  };

  return (
    <LoginLayout
      title="เข้าสู่ระบบ"
      description="บุคลากรทางการแพทย์"
      backgroundImage={require("../../assets/Login/images/doctor_login.png")}
      onForgotPassword={() => router.push("/user/forgotpass")}
      onRegister={() => router.push("/doctor/signin")}
      onLogin={handleLogin}
    />
  );
}

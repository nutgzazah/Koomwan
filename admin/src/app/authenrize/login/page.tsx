'use client'

import { useState } from "react";
import { Eye, EyeOff, User, Lock } from "lucide-react";

export default function Login() {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-96">
        <div className="flex flex-col items-center">
         
          <h2 className="text-xl font-semibold">คุมหวาน</h2>
          <p className="text-gray-600 text-sm mb-6">ระบบจัดการหลังบ้าน</p>
        </div>
        <div className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="ชื่อผู้ใช้หรือเบอร์โทรศัพท์"
              className="w-full px-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" />
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="รหัสผ่าน"
              className="w-full px-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-400"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? <EyeOff /> : <Eye />}
            </button>
          </div>
          <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
            เข้าสู่ระบบ
          </button>
        </div>
      </div>
    </div>
  );
}

export const layout = null;
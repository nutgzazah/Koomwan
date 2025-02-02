import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Card from "../../global/components/Card";
import BreakLine from "../../global/components/BreakLine";
import BackButton from "../../global/components/BackButton";
import ProfileInputField from "../../components/profile/ProfileInputField";
import { useRouter } from "expo-router";

export default function EditProfileScreen() {
  const router = useRouter();

  // State สำหรับเก็บข้อมูลฟอร์ม
  const [formData, setFormData] = useState({
    username: "Somchai123",
    profileImage: require("../../assets/Profile/images/profile.png"),
    height: "168",
    birthDate: "09/01/2541",
    gender: "ชาย",
    status: "ผู้ป่วยเบาหวาน",
    email: "",
    phone: "0819430552",
  });

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        <BackButton title="โปรไฟล์ของฉัน" />

        <Card>
          <View className="flex-col items-center w-full mb-4">
            <Text className="text-title font-bold text-secondary">
              แก้ไขโปรไฟล์
            </Text>
            <BreakLine />

            {/* Profile Image with Edit Button */}
            <View className="relative mb-4">
              <Image
                source={formData.profileImage}
                className="w-[150px] h-[150px] rounded-full"
              />
              <TouchableOpacity className="absolute bottom-0 right-0">
                <Image
                  source={require("../../assets/Profile/edit.png")}
                  className="w-12 h-12"
                />
              </TouchableOpacity>
            </View>

            {/* Username */}
            <View className="flex-row items-center mb-4">
              <Image
                source={require("../../assets/Profile/user.png")}
                className="w-6 h-6"
              />
              <Text className="text-headline font-bold text-secondary pl-2">
                {formData.username}
              </Text>
            </View>

            <BreakLine />

            {/* Input Fields */}
            <View className="w-full space-y-6 py-2 gap-4">
              <ProfileInputField
                icon={require("../../assets/Profile/ruler-pen.png")}
                label="ส่วนสูง"
                value={formData.height}
                onChangeText={(text) =>
                  setFormData({ ...formData, height: text })
                }
              />

              <ProfileInputField
                icon={require("../../assets/Profile/cake.png")}
                label="วันเกิด"
                value={formData.birthDate}
                onChangeText={(text) =>
                  setFormData({ ...formData, birthDate: text })
                }
              />

              <ProfileInputField
                icon={require("../../assets/Profile/sex.png")}
                label="เพศ"
                value={formData.gender}
                onChangeText={(text) =>
                  setFormData({ ...formData, gender: text })
                }
              />

              <ProfileInputField
                icon={require("../../assets/Profile/heart.png")}
                label="สถานะ"
                value={formData.status}
                onChangeText={(text) =>
                  setFormData({ ...formData, status: text })
                }
              />

              <ProfileInputField
                icon={require("../../assets/Profile/email.png")}
                label="อีเมล"
                value={formData.email}
                onChangeText={(text) =>
                  setFormData({ ...formData, email: text })
                }
                placeholder="เพิ่มอีเมล"
              />

              <ProfileInputField
                icon={require("../../assets/Profile/phone.png")}
                label="เบอร์โทรศัพท์"
                value={formData.phone}
                onChangeText={(text) =>
                  setFormData({ ...formData, phone: text })
                }
              />
            </View>
          </View>
        </Card>

        {/* Save Button */}
        <TouchableOpacity
          className="bg-primary mx-6 py-4 rounded-lg my-4"
          onPress={() => {
            // TODO: Handle save
            router.back();
          }}
        >
          <Text className="text-white text-center font-bold text-button">
            บันทึก
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

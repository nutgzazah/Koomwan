import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import Card from "../../../global/components/Card";
import BackButton from "../../../global/components/BackButton";
import DoctorDisplayCard from "./components/DoctorDisplayCard";
import BreakLine from "../../../global/components/BreakLine";

// Define the Notification interface
interface Notification {
  user: string; // Assuming user ID is a string
  createdAt: Date;
  title: string;
  detail: string;
  notificationType: string; // Consider using a union type if the types are fixed
  medicationDetails?: {
    pillId?: string; // Assuming pill ID is a string
    pillName?: string;
  };
  isRead: boolean;
}

interface NotificationInfoBoxProps {
  label: string;
  value: string;
}

const NotificationInfoSmallBox: React.FC<NotificationInfoBoxProps> = ({
  label,
  value,
}) => {
  return (
    <View className="mb-3 px-1 w-full ">
      <Text className="text-description font-bold font-sans text-secondary mb-1 w-full ">{label}</Text>

      <View className={"mb-1 w-full bg-background border border-gray rounded-lg flex-row items-center"}>
        <TextInput
          value={value}
          placeholderTextColor="gray"
          editable={false}
          multiline={true}
          className="font-sans text-description flex-1 mx-3 w-full"
        />
      </View>
    </View>
  );
};

const NotificationInfoBigBox: React.FC<NotificationInfoBoxProps> = ({
  label,
  value,
}) => {
  return (
    <View className="mb-3 px-1 w-full ">
      <Text className="text-description font-bold font-sans text-secondary mb-1 w-full ">{label}</Text>

      <View className={"mb-1 w-full bg-background border border-gray rounded-lg flex-row items-center"}>
        <TextInput
          value={value}
          placeholderTextColor="gray"
          editable={false}
          multiline={true}
          className="font-sans text-description flex-1 mx-3 w-full"
          style={{
            height: 135,
            textAlignVertical: "top",
          }}
        />
      </View>
    </View>
  );
};

export default function SystemNotificationScreen() {

  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="mb-24" showsVerticalScrollIndicator={false}>
        <BackButton title="ย้อนกลับ" />
        <Card>
          <Text className="font-sans text-title text-secondary">
            การตอบกลับปัญหาผู้ใช้งาน
          </Text>
          <BreakLine />
          <NotificationInfoSmallBox
            label={"หัวข้อ"}
            value={"อื่นๆ"}
          />
          <NotificationInfoSmallBox
            label={"วันที่แจ้งเตือน"}
            value={"28/11/2024"}
          />
          <NotificationInfoBigBox
            label={"รายละเอียด"}
            value={"ผมกดตอบฟอรั่มผู้ใช้แล้วมันเด้งขึ้นว่าส่งไม่สำเร็จ\nผมกดส่งไปกี่ครั้งมันก็ขึ้นว่าไม่สำเร็จ\n"}
          />
          <NotificationInfoBigBox
            label={"รายละเอียด"}
            value={"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
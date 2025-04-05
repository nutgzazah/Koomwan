import { SafeAreaView, ScrollView, Text, View, TextInput, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import Card from "../../../global/components/Card";
import BackButton from "../../../global/components/BackButton";
import BreakLine from "../../../global/components/BreakLine";
import { useLocalSearchParams } from "expo-router";
import BASE_URL from "../../../config";

// Define the Notification interface
interface Notification {
  _id: string;
  user: string;
  createdAt: string;
  title: string;
  detail: string;
  response: string;
  notificationType: string;
  medicationDetails?: {
    pillId?: string;
    pillName?: string;
  };
  isRead: boolean;
}

interface NotificationInfoBoxProps {

  label: string;
  value: string;
}

const NotificationInfoSmallBox: React.FC<NotificationInfoBoxProps> = ({ label, value }) => {
  return (
    <View className="mb-3 px-1 w-full">
      <Text className="text-description font-bold font-sans text-secondary mb-1 w-full">
        {label}
      </Text>
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

const NotificationInfoBigBox: React.FC<NotificationInfoBoxProps> = ({ label, value }) => {
  return (
    <View className="mb-3 px-1 w-full">
      <Text className="text-description font-bold font-sans text-secondary mb-1 w-full">{label}</Text>
      <View className={"mb-1 w-full bg-background border border-gray rounded-lg flex-row items-center"}>
        <TextInput
          value={value}
          placeholderTextColor="gray"
          editable={false}
          multiline={true}
          className="font-sans text-description flex-1 mx-3 w-full"
          style={{ height: 135, textAlignVertical: "top" }}
        />
      </View>
    </View>
  );
};

export default function SystemNotificationScreen() {
  const { id } = useLocalSearchParams();
  const helpRequestId = id || "";

  const [notification, setNotification] = useState<Notification | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (helpRequestId) {
      fetchNotification();
    }
  }, [helpRequestId]);

  const fetchNotification = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/v1/user/getProblem/${helpRequestId}`);
      if (response.data.success) {
        setNotification(response.data.data);
      } else {
        setError("No notification found.");
      }
    } catch (error) {
      console.error("Error fetching notification:", error);
      setError("Error fetching notification data.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1">
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1">
        <Text>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="mb-24" showsVerticalScrollIndicator={false}>
        <BackButton title="ย้อนกลับ" />
        <Card>
          <Text className="font-sans text-title text-secondary">การตอบกลับปัญหาผู้ใช้งาน</Text>
          <BreakLine />
          <NotificationInfoSmallBox label={"หัวข้อ"} value={notification?.title || "ไม่พบข้อมูล"} />
          <NotificationInfoSmallBox
            label={"วันที่แจ้งเตือน"}
            value={notification?.createdAt ? new Date(notification.createdAt).toLocaleDateString() : "ไม่พบข้อมูล"}
          />
          <NotificationInfoBigBox label={"รายละเอียด"} value={notification?.detail || "ไม่พบข้อมูล"} />
          {notification?.medicationDetails && (
            <NotificationInfoBigBox
              label={"รายละเอียดยา"}
              value={`Pill ID: ${notification.medicationDetails.pillId || "ไม่ระบุ"}, Pill Name: ${notification.medicationDetails.pillName || "ไม่ระบุ"}`}
            />
          )}
          <NotificationInfoBigBox label={"การตอบกลับจากแอดมิน"} value={notification?.response || "ไม่พบข้อมูล"} />
          {notification?.medicationDetails && (
            <NotificationInfoBigBox
              label={"รายละเอียดยา"}
              value={`Pill ID: ${notification.medicationDetails.pillId || "ไม่ระบุ"}, Pill Name: ${notification.medicationDetails.pillName || "ไม่ระบุ"}`}
            />
          )}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

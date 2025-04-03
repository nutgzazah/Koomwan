import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import Card from "../../../global/components/Card";
import DoctorDisplayCard from "./components/DoctorDisplayCard";
import BreakLine from "../../../global/components/BreakLine";
import NotificationCard from "./components/NotificationCard";
import TwoChoiceFilterBox from "../../../global/components/FilterBox";
import { useRouter } from "expo-router";

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

export default function NotificationScreen() {
  // Change here to change view, temporary roles
  const router = useRouter();
  const role: string = "doctor";
  const [filter, setFilter] = useState(1);

  // onPress for each notification block
  const onPress = () => {
    router.push("/notification/[id]");
  };

  // Interface for typescript typing in DoctorView, UserView
  interface NotificationsProps {
    notifications: Array<Notification>;
  }

  // Code block for doctor view
  function DoctorView({ notifications }: NotificationsProps): React.ReactNode {
    return (
      <DoctorDisplayCard>
        <TwoChoiceFilterBox
          first_choice="ส่วนตัว"
          second_choice="ฟอรัม"
          first_onPress={() => setFilter(1)}
          second_onPress={() => setFilter(2)}
          current_choice={filter}
        />
        <View className="my-2"></View>
        {notifications.map((notification, index) => (
          <NotificationCard
            key={index}
            notification={notification}
            onPress={onPress}
          />
        ))}
      </DoctorDisplayCard>
    );
  }

  // Code block for user view
  function UserView({ notifications }: NotificationsProps): React.ReactNode {
    return (
      <Card>
        <Text className="font-sans text-title text-secondary">
          การแจ้งเตือน
        </Text>
        <BreakLine />
        {notifications.map((notification, index) => (
          <NotificationCard
            key={index}
            notification={notification}
            onPress={onPress}
          />
        ))}
      </Card>
    );
  }

  // Mock data, only for development, change on productions
  const mockNotifications: Array<Notification> = [
    {
      user: "JohnDoe123",
      createdAt: new Date("2024-10-01T11:13:31.759+00:00"),
      title: "Reminder: Medication Due",
      detail: "Your medication 'Metformin' is due in 2 hours.",
      notificationType: "medication",
      medicationDetails: {
        pillId: "med123",
        pillName: "Metformin",
      },
      isRead: false,
    },
    {
      user: "JaneSmith456",
      createdAt: new Date("2025-01-02T14:15:00Z"),
      title: "Refill Available",
      detail: "Your prescription for 'Lisinopril' is ready for refill.",
      notificationType: "general",
      medicationDetails: {
        pillId: "med456",
        pillName: "Lisinopril",
      },
      isRead: true,
    },
    {
      user: "AliceWonder",
      createdAt: new Date("2025-01-30T09:45:00Z"),
      title: "New Message from Dr. Smith",
      detail: "You have a new message regarding your recent lab results.",
      notificationType: "forum",
      medicationDetails: {
        pillId: "msg789",
        pillName: "Lab Results",
      },
      isRead: false,
    },
    {
      user: "BobBuilder",
      createdAt: new Date("2025-01-28T17:00:00Z"),
      title: "Appointment Reminder",
      detail: "Your appointment with Dr. Johnson is scheduled for tomorrow at 10:00 AM.",
      notificationType: "system",
      medicationDetails: {
        pillId: "apt012",
        pillName: "Dr. Johnson",
      },
      isRead: false,
    },
  ];

  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="mb-24" showsVerticalScrollIndicator={false}>
        {role === "doctor" && <DoctorView notifications={mockNotifications} />}
        {role === "user" && <UserView notifications={mockNotifications} />}
      </ScrollView>
    </SafeAreaView>
  );
}
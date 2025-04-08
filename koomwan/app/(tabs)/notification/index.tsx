import { SafeAreaView, ScrollView, Text, View, ActivityIndicator, Alert } from "react-native"; // Added Alert import
import React, { useState, useEffect, useCallback } from "react";
import Card from "../../../global/components/Card";
import DoctorDisplayCard from "./components/DoctorDisplayCard";
import BreakLine from "../../../global/components/BreakLine";
import NotificationCard, { notificationCardProps } from "./components/NotificationCard";
import TwoChoiceFilterBox from "../../../global/components/FilterBox";
import axios from 'axios'; // Import Axios
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_URL from "../../../config";
import { useNavigation } from '@react-navigation/native'; // Import the navigation hook
import { useRouter, useFocusEffect } from "expo-router";

export default function ResourceScreen() {
  const role: string = "doctor"; // Change this dynamically as per the user role
  const router = useRouter();
  const [filter, setFilter] = useState(1);
  const [notifications, setNotifications] = useState<notificationCardProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Fetch notifications from the backend API
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const authData = await AsyncStorage.getItem("@auth");
      if (!authData) {
        Alert.alert("Session Expired", "Please login again");
        router.push("/user/login");
        return;
      }

      const auth = JSON.parse(authData);
      const token = auth.token;

      // Make the request with the token
      const response = await axios.get(`${BASE_URL}/api/v1/user/getAllNotification`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Notifications received:", response.data);

      // Sort notifications by time (assuming 'createdAt' is the timestamp field)
      const sortedNotifications = response.data.notifications.sort(
        (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      // Log only helpRequest for each notification
      sortedNotifications.forEach((notification: any) => {
        console.log("HelpRequest:", notification.helpRequest);
      });

      setNotifications(sortedNotifications || []);
      setLoading(false);
    } catch (err) {
      setNotifications([]);
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchNotifications(); // Fetch notifications when the screen is focused
    }, []
    ));



  // Filter notifications based on type
  const filteredNotifications = notifications.filter((notification) => {
    if (filter === 1) {
      return notification.notificationType === "general"; // Show general in personal
    } else if (filter === 2) {
      return notification.notificationType === "forum"; // Show forum in forum section
    }
    return true;
  });

  // Update onPress to handle the logic for different headers
  const onPress = (helpRequestId: string, header: string) => {
    if (header === "การรายงานปัญหา") {
      router.push(`/notification/${helpRequestId}`); // Use helpRequestId in the URL
      console.log(`${helpRequestId}`);
    } else if (header === "แจ้งเตือนการทานยา") {
      router.push(`/home/calendarView`);
      console.log(`${helpRequestId}`);
    }
  };

  // Interface for typescript typing in DoctorView, UserView
  interface notificationsProps {
    notifications: notificationCardProps[];
  }

  // Code block for doctor view
  function DoctorView({ notifications }: notificationsProps): React.ReactNode {
    return (
      <DoctorDisplayCard>
        <TwoChoiceFilterBox
          first_choice="ส่วนตัว"
          second_choice="ฟอรัม"
          first_onPress={() => setFilter(1)}  // Filter to show 'general'
          second_onPress={() => setFilter(2)} // Filter to show 'forum'
          current_choice={filter}
        />
        <View className="my-2"></View>
        {filter === 1 && filteredNotifications.length === 0 ? (
          <Text className="font-sans text-body text-center text-secondary flex-1 justify-center items-center">ไม่มีการแจ้งเตือนสำหรับส่วนตัว</Text>
        ) : filter === 2 && filteredNotifications.length === 0 ? (
          <Text className="font-sans text-body text-center text-secondary flex-1 justify-center items-center">ไม่มีการแจ้งเตือนสำหรับฟอรั่ม</Text>
        ) : (
          filteredNotifications.map((notification, index) => (
            <NotificationCard
              key={index}
              notification={notification}
              onPress={(helpRequestId: string, header: string) => onPress(helpRequestId, header)} // Pass header along with helpRequestId
            />
          ))
        )}
      </DoctorDisplayCard>
    );
  }

  // Code block for user view
  function UserView({ notifications }: notificationsProps): React.ReactNode {
    return (
      <Card>
        <Text className="font-sans text-title text-secondary">การแจ้งเตือน</Text>
        <BreakLine />
        {filter === 1 && filteredNotifications.length === 0 ? (
          <Text className="font-sans text-body text-center text-secondary flex-1 justify-center items-center">ไม่มีการแจ้งเตือนสำหรับส่วนตัว</Text>
        ) : filter === 2 && filteredNotifications.length === 0 ? (
          <Text className="font-sans text-body text-center text-secondary flex-1 justify-center items-center">ไม่มีการแจ้งเตือนสำหรับฟอรั่ม</Text>
        ) : (
          filteredNotifications.map((notification: notificationCardProps, index: number) => (
            <NotificationCard
              key={index}
              notification={notification}
              onPress={(helpRequestId: string, header: string) => onPress(helpRequestId, header)} // Pass header along with helpRequestId
            />
          ))
        )}
      </Card>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="mb-24" showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            {role === "doctor" && <DoctorView notifications={notifications} />}
            {role === "user" && <UserView notifications={notifications} />}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

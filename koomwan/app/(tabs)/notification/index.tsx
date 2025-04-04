import { SafeAreaView, ScrollView, Text, View, ActivityIndicator, Alert } from "react-native"; // Added Alert import
import React, { useState, useEffect } from "react";
import Card from "../../../global/components/Card";
import DoctorDisplayCard from "./components/DoctorDisplayCard";
import BreakLine from "../../../global/components/BreakLine";
import NotificationCard, { notificationCardProps } from "./components/NotificationCard";
import TwoChoiceFilterBox from "../../../global/components/FilterBox";
import axios from 'axios'; // Import Axios
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_URL from "../../../config";
import { useNavigation } from '@react-navigation/native'; // Import the navigation hook

export default function ResourceScreen() {
  const role: string = "doctor"; // Change this dynamically as per the user role
  const [filter, setFilter] = useState(1);
  const [notifications, setNotifications] = useState<notificationCardProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const navigation = useNavigation(); // useNavigation hook for navigation

  // Fetch notifications from the backend API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const authData = await AsyncStorage.getItem("@auth");
        if (!authData) {
          Alert.alert("Session Expired ", "Please login again");
          navigation.navigate("/user/login"); // Changed to use navigation from React Navigation
          return;
        }
    
        const auth = JSON.parse(authData);
        const token = auth.token;
        const userId = auth.user._id;

        // Make the request with the token
        const response = await axios.get(`${BASE_URL}/api/v1/user/getAllNotification`, {
          headers: {
            Authorization: `Bearer ${token}`, // Ensure the token is passed in the correct format
          },
        });
    
        console.log("Notifications received:", response.data); // Log the response to check data
        setNotifications(response.data.notifications || []); // Ensure notifications are set to an empty array if not available
        setLoading(false);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError('Failed to load notifications');
        setLoading(false);
      }
    };    
    
    fetchNotifications();
  }, [navigation]); // Added navigation to dependency array for better effect management


  // onPress for each notification block
  const onPress = () => {
    console.log("Notification pressed");
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
  function UserView({ notifications }: notificationsProps): React.ReactNode {
    return (
      <Card>
        <Text className="font-sans text-title text-secondary">การแจ้งเตือน</Text>
        <BreakLine />
        {notifications.map((notification: notificationCardProps, index: number) => (
          <NotificationCard
            key={index}
            notification={notification}
            onPress={onPress}
          />
        ))}
      </Card>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="mb-24" showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : error ? (
          <Text>{error}</Text>
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

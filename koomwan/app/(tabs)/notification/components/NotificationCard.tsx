import { Text, Image, Pressable, View } from "react-native";
import React from "react";
import BreakLine from "../../../../global/components/BreakLine";

export interface notificationCardProps {
  helpRequest: string; // problemId or notificationId that will be used for navigation
  header: string; // This will be dynamically set based on the title
  title: string;
  detail: string;
  notificationType: string;
  createdAt: Date;
  pillId: string;
  forum: string;
  pillName: string;
  isRead: boolean;
}

export interface notificationInterface {
  notification: notificationCardProps;
  onPress: (helpRequestOrForum: string, header: string) => void;
}

const NotificationCard = ({ notification, onPress }: notificationInterface) => {
  // Header mapping for simplified logic
  const headerMapping: { [key: string]: string } = {
    "แจ้งเตือนการทานยา": "แจ้งเตือนการทานยา",
    "อื่นๆ": "การรายงานปัญหา",
    "บัญชี": "การรายงานปัญหา",
    "การติดตามสุขภาพ": "การรายงานปัญหา",
    "หมอได้ตอบคำถามของคุณแล้ว": "หมอได้ตอบคำถามของคุณแล้ว",
  };

  // Function to get the header
  function getHeader(title: string): string {
    return headerMapping[title] || "";
  }

  // Map icon according to notification type
  const iconMap = (notificationType: string) => {
    const icons: { [key: string]: any } = {
      forum: require("../../../../assets/Notification/messages.png"),
      general: require("../../../../assets/Notification/info-circle.png"),
      medication: require("../../../../assets/Notification/notification.png"),
      system: require("../../../../assets/Notification/information.png"),
    };
    return icons[notificationType] || icons["general"]; // Default to 'general' if no match
  };

  // Calculate time difference between current and event times
  function formatDateDifference(targetDate: Date): string {
    const date = new Date(targetDate); // Ensure targetDate is a Date object
    const now = new Date();
    const diffInMilliseconds = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
    const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

    const formatTime = (date: Date): string => {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const minutesStr = minutes < 10 ? '0' + minutes : minutes;
      return `${hours}:${minutesStr}`;
    };

    if (diffInMinutes < 60) {
      return `เมื่อ ${diffInMinutes} นาทีก่อน`;
    } else if (diffInHours < 24) {
      return `เมื่อ ${diffInHours} ชั่วโมงก่อน`;
    } else if (diffInDays === 1) {
      return `เมื่อวาน ${formatTime(date)}`;
    } else if (diffInDays < 7) {
      return `${diffInDays} วันก่อนเมื่อ ${formatTime(date)}`;
    } else if (diffInDays < 14) {
      return `สัปดาห์ก่อนเมื่อ ${formatTime(date)}`;
    } else {
      const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
      const day = date.getDate();
      const month = monthNames[date.getMonth()];
      if (now.getFullYear() !== date.getFullYear()) {
        const year = date.getFullYear();
        return `${day} ${transformMonthToThai(month)} ${year} เมื่อ ${formatTime(date)}`;
      }
      return `${day} ${transformMonthToThai(month)} เมื่อ ${formatTime(date)}`;
    }
  }

  // Convert month in English to Thai
  function transformMonthToThai(monthInEnglish: string): string {
    const monthMapping: { [key: string]: string } = {
      January: "มกราคม", February: "กุมภาพันธ์", March: "มีนาคม", April: "เมษายน", May: "พฤษภาคม",
      June: "มิถุนายน", July: "กรกฎาคม", August: "สิงหาคม", September: "กันยายน", October: "ตุลาคม",
      November: "พฤศจิกายน", December: "ธันวาคม",
    };

    // Convert the input to title case (e.g., "january" -> "January")
    const formattedMonth = monthInEnglish.charAt(0).toUpperCase() + monthInEnglish.slice(1).toLowerCase();
    return monthMapping[formattedMonth] || "Invalid month";
  }

  return (
    <Pressable
      className={`mx-3 rounded-2xl w-full 
        ${notification.isRead ? "bg-card" : "bg-background"} 
        mb-3 border-[1px] border-gray drop-shadow`}
        onPress={() => {
          const navTarget = notification.forum || notification.helpRequest;
          onPress(navTarget, getHeader(notification.title));
        }}
    >
      <View className="flex flex-col justify-between items-center mx-3 py-4">
        <View className="w-full">
          <View className="flex flex-row items-start h-[2.625rem] w-full mb-[1.0625rem] justify-start">
            <Image
              className="w-[2.625rem] h-[2.625rem] mr-7"
              source={iconMap(notification.notificationType)}
            />
            <Text className="font-sans text-body text-secondary">
              {getHeader(notification.title)} {/* Use the dynamic header here */}
            </Text>
          </View>
          <View className="justify-start">
            <Text className="font-sans text-tag text-secondary">
              {formatDateDifference(notification.createdAt)}
            </Text>
          </View>
        </View>
        <BreakLine />
        <View className="flex flex-row items-center justify-start w-full">
          <Text className="font-sans text-description text-secondary">
            {notification.title} : {notification.detail}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

export default NotificationCard;
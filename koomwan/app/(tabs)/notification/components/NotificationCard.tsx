import { Text, Image, Pressable, View } from "react-native";
import React from "react";
import BreakLine from "../../../../global/components/BreakLine";

// Future interface implement to handle notification model
export interface notificationCardProps {
    user: string,
    createdAt: Date,
    title: string,
    detail: string,
    notificationType: string,
    pillId: string,
    pillName: string,
    isRead: boolean
}

export interface notificationInterface {
    notification: notificationCardProps
    onPress: () => void
}

export default function NotificationCard({notification, onPress}: notificationInterface) {

    // Map icon according to notification type
    function iconMap(notificationType: string) {
        switch (notificationType) {
            case "forum":
                return require("../../../../assets/Notification/messages.png");
            case "general":
                return require("../../../../assets/Notification/info-circle.png");
            case "medication":
                return require("../../../../assets/Notification/notification.png");
            case "system":
                return require("../../../../assets/Notification/information.png");
            default:
                console.log("An unknown bug occured");
                break;
        }
    }

    // Calculate Time difference between present and event times
    function formatDateDifference(targetDate: Date): string {
        const now = new Date();
        const diffInMilliseconds = now.getTime() - targetDate.getTime();
        const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
        const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

        const formatTime = (date: Date): string => {
            let hours = date.getHours();
            const minutes = date.getMinutes();
            const minutesStr = minutes < 10 ? '0' + minutes : minutes;
            return `${hours}:${minutesStr}`;
        };

        if (diffInMinutes < 60) {
            return `เมื่อ ${diffInMinutes} นาทีก่อน`;
        } else if (diffInHours < 24) {
            return `เมื่อ ${diffInHours} ชั่วโมงก่อน`;
        } else if (diffInDays === 1) {
            return `เมื่อวาน ${formatTime(targetDate)}`;
        } else if (diffInDays < 7) {
            return `${diffInDays}วันก่อนเมื่อ ${formatTime(targetDate)}`;
        } else if (diffInDays < 14) {
            return `สัปดาห์ก่อนเมื่อ ${formatTime(targetDate)}`;
        } else {
            const monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"];
            const day = targetDate.getDate();
            const month = monthNames[targetDate.getMonth()];
            return `${day} ${transformMonthToThai(month)} เมื่อ ${formatTime(targetDate)}`;
        }
    }

    // Convert month in English to Thai
    function transformMonthToThai(monthInEnglish: string): string {
        const monthMapping: { [key: string]: string } = {
            January: "มกราคม",
            February: "กุมภาพันธ์",
            March: "มีนาคม",
            April: "เมษายน",
            May: "พฤษภาคม",
            June: "มิถุนายน",
            July: "กรกฎาคม",
            August: "สิงหาคม",
            September: "กันยายน",
            October: "ตุลาคม",
            November: "พฤศจิกายน",
            December: "ธันวาคม",
        };

        // Convert the input to title case (e.g., "january" -> "January")
        const formattedMonth = monthInEnglish.charAt(0).toUpperCase() + monthInEnglish.slice(1).toLowerCase();

        // Return the Thai month or a fallback if the input is invalid
        return monthMapping[formattedMonth] || "Invalid month";
    }


    return (
        <Pressable
            className={`mx-3 rounded-2xl w-full 
                ${notification.isRead ? "bg-card" : "bg-background"} 
                mb-3 border-[1px] border-gray drop-shadow`}
            onPress={onPress}
        >
            <View className="flex flex-col justify-between items-center mx-3 py-4">
                <View className="w-full">
                    <View className="flex flex-row items-start h-[2.625rem] w-full mb-[1.0625rem] justify-start">
                        <Image
                            className="w-[2.625rem] h-[2.625rem] mr-7"
                            source={iconMap(notification.notificationType)}
                        />
                        <Text className="font-sans text-body text-secondary">
                            {notification.title}
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
                        {notification.detail}
                    </Text>
                </View>
            </View>
        </Pressable>
    )
}


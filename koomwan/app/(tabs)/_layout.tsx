import {
  View,
  Text,
  TouchableOpacity,
  Image
} from "react-native";
import React from "react";
import { useRouter, Tabs } from "expo-router";
import { NavTabIcon, NavBigIcon } from "../../global/components/NavBarBottom";

export default function TabsLayout() {
  const router = useRouter();

  // โค๊ดส่วนนี้ Import รูปภาพจาก Assets สำหรับ Navbar
  const profileIcon = require("../../assets/Navbar/mock-profile.png");
  const logoIcon = require("../../assets/Navbar/Logo.png");
  const notificationsIcon = require("../../assets/Navbar/notification.png");
  const homeIcon = require("../../assets/Navbar/home.png");
  const homeBoldIcon = require("../../assets/Navbar/home-bold.png");
  const suggestionIcon = require("../../assets/Navbar/weight.png");
  const suggestionBoldIcon = require("../../assets/Navbar/weight-bold.png");
  const trackingIcon = require("../../assets/Navbar/Pen-transparent.png");
  const resourceIcon = require("../../assets/Navbar/book.png");
  const resourceBoldIcon = require("../../assets/Navbar/book-bold.png");
  const forumIcon = require("../../assets/Navbar/messages.png");
  const forumBoldIcon = require("../../assets/Navbar/messages-bold.png");

  // Route ที่ไม่ต้องการให้แสดงอยู่ในแท็บอย่างเช่น notification, profile, setting
  // ตอนนี้ใส่คอมเมนต์ไปเพราะยังไม่ได้ทำ route, ถอดคอมเมนต์ข้างล่างออกได้ตอนทำ route จริง
  const hiddenRoutes = ["notification"];

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerLeft: () => (
          // headerLeft : ส่วน Icon โปรไฟล์
          // โปรไฟล์ แก้ไข Path รูปโปรไฟล์ ตอนทำจริง
          // บทบาท (ทั่วไป) แก้ไขตอนทำจริง
          <TouchableOpacity 
            onPress={(() => router.push("suggestion"))}
            className="ml-4"
          >
            <View className="flex-row items-baseline">
              <Image className="w-12 h-12"
                source={profileIcon}
              />
              <View className="bg-primary right-6 px-3 rounded-3xl">
                <Text className="text-card font-sans font-medium">ทั่วไป</Text>
              </View>
            </View>
          </TouchableOpacity>
        ),
        // headerTitle : ส่วน Logo
        headerTitle: () => (
          <TouchableOpacity 
            onPress={(() => router.replace(""))}

          >
            <Image className="w-10 h-10"
              source={logoIcon}
            />
          </TouchableOpacity>
        ),
        // headerRight : ส่วน Icon notification
        // notification แก้ไข Path ตอนทำจริง
        headerRight: () => (
          <TouchableOpacity 
            onPress={(() => router.push("notification"))}
            className="mr-4"
          >
            <Image className="w-6 h-6"
              source={notificationsIcon}
            />
          </TouchableOpacity>
        ),
        headerTitleAlign: "center",
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          justifyContent: "center",
          alignItems: "center",
          borderTopLeftRadius: 30, // Curved Container
          borderTopRightRadius: 30,
          borderTopWidth: 1,
          height: 75,
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <NavTabIcon
              focused={focused}
              label="หน้าหลัก"
              iconNormal={homeIcon}
              iconBold={homeBoldIcon}
            />
          )
        }}
      />
      <Tabs.Screen
        name="suggestion"
        options={{
          title: "suggestion",
          tabBarIcon: ({ focused }) => (
            <NavTabIcon
              focused={focused}
              label="ประเมิน"
              iconNormal={suggestionIcon}
              iconBold={suggestionBoldIcon}
            />
          )
        }}
      />
      <Tabs.Screen
        name="tracking"
        options={{
          title: "tracking",
          tabBarIcon: ({ }) => (
            <NavBigIcon icon={trackingIcon} />
          )
        }}
      />
      <Tabs.Screen
        name="resource"
        options={{
          tabBarIcon: ({ focused }) => (
            <NavTabIcon
              focused={focused}
              label="เรียนรู้"
              iconNormal={resourceIcon}
              iconBold={resourceBoldIcon}
            />
          )
        }}
      />
      <Tabs.Screen
        name="forum"
        options={{
          tabBarIcon: ({ focused }) => (
            <NavTabIcon
              focused={focused}
              label="ฟอรัม"
              iconNormal={forumIcon}
              iconBold={forumBoldIcon}
            />
          )
        }}
      />
      { // อันนี้เอาไว้ซ่อน Route ที่ไม่ต้องให้อยู่บน Navbar ข้างล่าง 
        // คอมเมนต์เอาไว้ก่อน ตอนมีค่อยถอดคอมเมนต์ข้างล่าง
        hiddenRoutes.map((path, key) => (
          <Tabs.Screen
            key={key}
            name={path}
            options={{
              href: null,
            }}
          />
        ))
      }
    </Tabs>
  );
}

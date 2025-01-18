import { View, Text } from "react-native";
import React from "react";
import { RelativePathString, Tabs } from "expo-router";
import { NavTabIcon, NavBigIcon } from "../../global/components/NavBarBottom";

export default function TabsLayout() {

  // โค๊ดส่วนนี้ Import รูปภาพจาก Assets สำหรับ Navbar
  const homeIcon = require("../../assets/Navbar/home.png");
  const homeBoldIcon = require("../../assets/Navbar/home-bold.png");
  const suggestionIcon = require("../../assets/Navbar/weight.png");
  const suggestionBoldIcon = require("../../assets/Navbar/weight-bold.png");
  const trackingIcon = require("../../assets/Navbar/Pen-transparent.png");
  const resourceIcon = require("../../assets/Navbar/book.png");
  const resourceBoldIcon = require("../../assets/Navbar/book-bold.png");
  const forumIcon = require("../../assets/Navbar/messages.png");
  const forumBoldIcon = require("../../assets/Navbar/messages-bold.png");

  // Path ที่ไม่ต้องการให้แสดงอยู่ในแท็บอย่างเช่น notification, profile, setting
  const hiddenPaths = ["notification"];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
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
      { // อันนี้เอาไว้ซ่อน Path ที่ไม่ต้องให้อยู่บน Navbar ข้างล่าง
        hiddenPaths.map((path, key) => (
          <Tabs.Screen
            key={key}
            name={path}
            options={{
              href: null,
            }}
          />
      ))}
    </Tabs>
  );
}

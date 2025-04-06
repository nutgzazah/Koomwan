import { View, Text, TouchableOpacity, Image, ImageSourcePropType } from "react-native";
import React, { useEffect, useState, useContext, useCallback } from "react";
import { useRouter, Tabs, useFocusEffect } from "expo-router";
import { NavTabIcon, NavBigIcon } from "../../global/components/NavBarBottom";
import { AuthContext } from "../../context/authContext";
import BASE_URL from "../../config"
import axios from "axios";

export default function TabsLayout() {
  const router = useRouter();

  // โค๊ดส่วนนี้ Import รูปภาพจาก Assets สำหรับ Navbar
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

  // โค๊ดสำหรับ Icon ของ Profile
  const defaultUserAvatar01 = require("../../assets/Avatars/koomwanAvatar01.png");
  const defaultUserAvatar02 = require("../../assets/Avatars/koomwanAvatar02.png");
  const defaultUserAvatar03 = require("../../assets/Avatars/koomwanAvatar03.png");
  const defaultUserAvatar04 = require("../../assets/Avatars/koomwanAvatar04.png");
  const defaultDoctorAvatar01 = require("../../assets/Avatars/koomwanDoctorAvatar01.png");
  const defaultDoctorAvatar02 = require("../../assets/Avatars/koomwanDoctorAvatar02.png");

  // Route ที่ไม่ต้องการให้แสดงอยู่ในแท็บอย่างเช่น notification, profile, setting
  // ตอนนี้ใส่คอมเมนต์ไปเพราะยังไม่ได้ทำ route, ถอดคอมเมนต์ข้างล่างออกได้ตอนทำ route จริง
  const hiddenRoutes = ["notification"];
  const [state] = useContext(AuthContext)
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>('user');

  const fetchImageUrl = async (endpoint: string, params: object): Promise<string | null> => {
    try {
      const res = await axios.get<{ url: string }>(`${BASE_URL}${endpoint}`, {
        params,
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
      });
      return res.data.url;
    } catch (error) {
      console.error(`Error fetching image from ${endpoint}:`, error);
      return null;
    }
  };
  
  const getImageUrl = (path: string): Promise<string | null> => {
    return fetchImageUrl('/api/v1/storage/getFileUrlFromPath', { path });
  };
  
  const getProfileImageUrl = (fileName: string, folder: string): Promise<string | null> => {
    return fetchImageUrl('/api/v1/storage/getFileUrl', { fileName, folder });
  };

  const fetchProfileImage = useCallback(async () => {
    if (!state?.user?.image) return;
  
    const { image, role: userRole } = state.user;
    setRole(userRole);
  
    try {
      // Handle default avatars
      const defaultAvatar = getDefaultAvatar(image);
      if (defaultAvatar) {
        setImageUrl(defaultAvatar);
        return;
      }
  
      // Handle custom images
      const url =
        userRole === "user"
          ? await getProfileImageUrl(image, "user")
          : await getImageUrl(image);
  
      if (url?.startsWith("https")) {
        setImageUrl(url);
      }
    } catch (error) {
      console.error("Error fetching profile image:", error);
    }
  }, [state?.user?.image, state?.user?.role]);

  const getDefaultAvatar = (imageName: string) => {
    if (imageName.startsWith("koomwanAvatar")) {
      switch (imageName) {
        case "koomwanAvatar01.png": return defaultUserAvatar01;
        case "koomwanAvatar02.png": return defaultUserAvatar02;
        case "koomwanAvatar03.png": return defaultUserAvatar03;
        case "koomwanAvatar04.png": return defaultUserAvatar04;
        default: return defaultUserAvatar01;
      }
    } else if (imageName.startsWith("koomwanDoctorAvatar")) {
      switch (imageName) {
        case "koomwanDoctorAvatar01.png": return defaultDoctorAvatar01;
        case "koomwanDoctorAvatar02.png": return defaultDoctorAvatar02;
        default: return defaultDoctorAvatar01;
      }
    }
    return null;
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchProfileImage();
  }, [fetchProfileImage]);

  // Fetch on focus
  useFocusEffect(
    useCallback(() => {
      fetchProfileImage();
    }, [fetchProfileImage])
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => router.push("profile")}
            className="ml-4"
          >
            <View className="flex-row items-baseline">
              <Image
                className="w-12 h-12 rounded-full border border-primary"
                source={{
                  uri: imageUrl,
                  headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache',
                  }
                }}
              />
              <View className="bg-primary right-6 px-3 rounded-3xl">
                <Text className="text-card font-sans font-medium">
                  {role === 'user' ? "ทั่วไป" : "หมอ"}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ),
        // headerTitle : ส่วน Logo
        headerTitle: () => (
          <TouchableOpacity onPress={() => router.replace("")}>
            <Image className="w-10 h-10" source={logoIcon} />
          </TouchableOpacity>
        ),
        // headerRight : ส่วน Icon notification
        // notification แก้ไข Path ตอนทำจริง
        headerRight: () => (
          <TouchableOpacity
            onPress={() => router.push("notification")}
            className="mr-4"
          >
            <Image className="w-6 h-6" source={notificationsIcon} />
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
        },
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
          ),
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
          ),
        }}
      />
      <Tabs.Screen
        name="tracking"
        options={{
          title: "tracking",
          tabBarIcon: ({ }) => <NavBigIcon icon={trackingIcon} />,
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
          ),
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
          ),
        }}
      />
      {
        // อันนี้เอาไว้ซ่อน Route ที่ไม่ต้องให้อยู่บน Navbar ข้างล่าง
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

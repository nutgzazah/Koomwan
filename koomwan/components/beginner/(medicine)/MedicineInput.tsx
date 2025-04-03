import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import BASE_URL from "../../../config";
import { useFocusEffect } from "@react-navigation/native";

type MedicationType = {
  _id: string;
  pillName: string;
  pillType: string;
  description: string;
  pillImage?: string;
  reminderTimes: string[];
  addedAt: string;
};

export const MedicineInput = () => {
  const [medications, setMedications] = useState<MedicationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      fetchMedications();
    }, [])
  );

  const fetchMedications = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get auth data from storage
      const authData = await AsyncStorage.getItem("@auth");
      if (!authData) {
        setError("Session expired. Please login again.");
        return;
      }

      const auth = JSON.parse(authData);
      const token = auth.token;
      const userId = auth.user._id;

      // Get the user profile to get the healthInfoId
      const userResponse = await axios.get(
        `${BASE_URL}/api/v1/user/profile/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!userResponse.data.success || !userResponse.data.user.healthinfo) {
        setError("No health information found.");
        return;
      }

      const healthInfoId = userResponse.data.user.healthinfo._id;

      // get medication data
      const healthInfoResponse = await axios.get(
        `${BASE_URL}/api/v1/user/healthinfo/${healthInfoId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (healthInfoResponse.data.success) {
        const healthInfo = healthInfoResponse.data.healthInfo;

        // Set medications from regularpill array - show only 3 most recent
        if (healthInfo.regularpill && healthInfo.regularpill.length > 0) {
          // Sort by addedAt timestamp (most recent first)
          const sortedMedications = [...healthInfo.regularpill].sort((a, b) => {
            const dateA = new Date(a.addedAt || 0).getTime();
            const dateB = new Date(b.addedAt || 0).getTime();
            return dateB - dateA; // Sort in descending order (newest first)
          });

          // Take only the first 3 items
          const recentMedications = sortedMedications.slice(0, 3);
          setMedications(recentMedications);
        } else {
          setMedications([]);
        }
      }
    } catch (error) {
      console.error("Error fetching medications:", error);
      setError("Could not fetch medications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMedication = async (pillId: string) => {
    try {
      setDeletingId(pillId);

      // Get auth data from storage
      const authData = await AsyncStorage.getItem("@auth");
      if (!authData) {
        Alert.alert("Session Expired", "Please login again");
        router.push("/user/login");
        return;
      }

      const auth = JSON.parse(authData);
      const token = auth.token;
      const userId = auth.user._id;

      // Get user profile to get healthInfoId
      const userResponse = await axios.get(
        `${BASE_URL}/api/v1/user/profile/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!userResponse.data.success || !userResponse.data.user.healthinfo) {
        Alert.alert("Error", "No health information found");
        return;
      }

      const healthInfoId = userResponse.data.user.healthinfo._id;

      const response = await axios.put(
        `${BASE_URL}/api/v1/user/healthinfo/${healthInfoId}/remove-pills`,
        {
          removePills: [pillId],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setMedications((prev) => prev.filter((med) => med._id !== pillId));
        fetchMedications();
      } else {
        Alert.alert("เกิดข้อผิดพลาด", "การลบยาไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
      }
    } catch (error) {
      console.error("Error deleting medication:", error);
      Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถลบยาได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setDeletingId(null);
    }
  };

  const confirmDeleteMedication = (item: MedicationType) => {
    Alert.alert(
      "ยืนยันการลบยา",
      `คุณต้องการลบยา "${item.pillName}" ใช่หรือไม่?`,
      [
        {
          text: "ยกเลิก",
          style: "cancel",
        },
        {
          text: "ลบ",
          onPress: () => handleDeleteMedication(item._id),
          style: "destructive",
        },
      ]
    );
  };

  const renderMedicationItem = ({ item }: { item: MedicationType }) => (
    <View className="bg-card rounded-lg p-1 flex-row items-center">
      {/* Pill Icon */}
      <View className="w-10 h-8 items-center justify-center mr-3">
        <Image
          source={require("../../../assets/BeginnerSetup/medicine.png")}
          className="w-8 h-8"
          resizeMode="contain"
        />
      </View>

      {/* Medication Details */}
      <View className="flex-1">
        <Text className="text-description font-bold text-secondary">
          {item.pillName}
        </Text>
        {item.pillType && (
          <Text className="text-tag font-regular text-gray">
            {item.pillType}
          </Text>
        )}
      </View>

      {/* Delete Button */}
      <TouchableOpacity
        onPress={() => confirmDeleteMedication(item)}
        disabled={deletingId === item._id}
        className="p-2"
      >
        {deletingId === item._id ? (
          <ActivityIndicator size="small" color="#FE5757" />
        ) : (
          <Image
            source={require("../../../assets/Profile/eraser.png")}
            className="w-5 h-5"
            resizeMode="contain"
          />
        )}
      </TouchableOpacity>
    </View>
  );

  // Empty state when no medications
  const EmptyMedicationList = () => <View></View>;

  return (
    <View className="flex-col items-center w-full">
      <Image
        source={require("../../../assets/BeginnerSetup/medicine.png")}
        className="w-32 h-32 mb-4"
        resizeMode="contain"
      />
      <View className="w-full">
        <TouchableOpacity
          className="w-full flex-row items-center justify-between bg-background rounded p-4 mb-2"
          onPress={() => router.push("/profile/addMed")}
        >
          <Text className="text-gray pr-12 text-description font-regular">
            เพิ่มยาประจำของคุณ
          </Text>
          <View className="w-6 h-6 bg-primary rounded-full items-center justify-center">
            <Text className="text-card font-bold">+</Text>
          </View>
        </TouchableOpacity>

        {loading ? (
          <View className="items-center py-4">
            <ActivityIndicator size="small" color="#3972F0" />
            <Text className="text-description font-regular text-gray mt-2">
              กำลังโหลดข้อมูล...
            </Text>
          </View>
        ) : error ? (
          // Error state
          <View className="items-center py-4 bg-background rounded p-4">
            <Text className="text-description font-regular text-abnormal text-center">
              {error}
            </Text>
            <TouchableOpacity
              className="mt-2 p-2 rounded bg-background border border-primary"
              onPress={fetchMedications}
            >
              <Text className="text-description font-regular text-primary">
                ลองใหม่
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Show medication list or empty state
          <FlatList
            data={medications}
            renderItem={renderMedicationItem}
            keyExtractor={(item) => item._id}
            ListEmptyComponent={EmptyMedicationList}
            className="w-full"
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            contentContainerStyle={{ paddingBottom: 1 }}
          />
        )}
      </View>
    </View>
  );
};

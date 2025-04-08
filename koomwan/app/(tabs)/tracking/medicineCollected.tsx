import React, { useState, useEffect } from "react";
import {
  Text,
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ImageSourcePropType,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import Card from "../../../global/components/Card";
import BreakLine from "../../../global/components/BreakLine";
import Checkbox from "expo-checkbox";
import BackButton from "../../../global/components/BackButton";
import { LongButton } from "./components/LongButton";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_URL from "../../../config";
import Loading from "../../../global/components/Loading";

// Define a Medicine interface for better type-checking
interface Medicine {
  id: string;
  name: string;
  type: string;
  details: string;
  image: ImageSourcePropType | string;
  time?: string; // Optional property for medicine time
  taken?: boolean; // Optional property for medicine taken status
}

// Interface for grouped medications by time
interface MedicationLogGroup {
  time: string;
  medications: Medicine[];
}

export default function MedicineCollectedScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [loading, setLoading] = useState(true);
  const [deletingMedicineId, setDeletingMedicineId] = useState<string | null>(
    null
  );
  const [regularMedicines, setRegularMedicines] = useState<Medicine[]>([]);
  const [groupedRegularMeds, setGroupedRegularMeds] = useState<
    MedicationLogGroup[]
  >([]);
  const [additionalMedicines, setAdditionalMedicines] = useState<Medicine[]>(
    []
  );
  const [selectedMedicines, setSelectedMedicines] = useState<{
    [key: string]: boolean;
  }>({});
  const [formData, setFormData] = useState<any>(null);

  // Add state to track if medicines were loaded from AsyncStorage
  const [loadedFromStorage, setLoadedFromStorage] = useState(false);

  // Load health form data and saved medicines from AsyncStorage
  useEffect(() => {
    const loadStoredData = async () => {
      try {
        // Load form data
        const savedFormData = await AsyncStorage.getItem("trackingFormData");
        if (savedFormData) {
          setFormData(JSON.parse(savedFormData));
        }

        // Load any previously saved additional medicines
        const savedMedicines = await AsyncStorage.getItem(
          "additionalMedicines"
        );
        if (savedMedicines) {
          const parsedMedicines = JSON.parse(savedMedicines);
          setAdditionalMedicines(parsedMedicines);
          setLoadedFromStorage(true);
        }

        // Load selected medicines status
        const savedSelectedMedicines = await AsyncStorage.getItem(
          "selectedMedicinesStatus"
        );
        if (savedSelectedMedicines) {
          setSelectedMedicines(JSON.parse(savedSelectedMedicines));
        }

        console.log("Stored data loaded successfully");
      } catch (error) {
        console.error("Error loading stored data:", error);
      }
    };

    loadStoredData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // ใช้ flag เพื่อตรวจสอบว่าเป็นการเข้าสู่หน้าครั้งแรกหรือไม่
      const checkFirstLoad = async () => {
        try {
          const isFirstLoad = await AsyncStorage.getItem("isFirstLoadMed");
          if (isFirstLoad !== "false") {
            // เคลียร์ข้อมูลยาเพิ่มเติม
            if (!loadedFromStorage) {
              setAdditionalMedicines([]);
              setSelectedMedicines({});
            }

            // ตั้งค่า flag เพื่อไม่ให้เคลียร์ข้อมูลในครั้งต่อไป (เมื่อกลับมาจากหน้า addMedicine)
            await AsyncStorage.setItem("isFirstLoadMed", "false");
          }
        } catch (error) {
          console.error("Error checking first load:", error);
        }
      };

      checkFirstLoad();
      return () => {
        // ฟังก์ชันนี้จะทำงานเมื่อออกจากหน้า
        // เมื่อไปยังหน้า summaryTracking หรือ addMedicine
        // reset flag เพื่อให้เคลียร์ข้อมูลในครั้งต่อไปเมื่อกลับมาจากหน้า Home
        if (router.canGoBack() === false) {
          AsyncStorage.removeItem("isFirstLoadMed");
        }
      };
    }, [loadedFromStorage])
  );

  // Save additional medicines to AsyncStorage whenever they change
  useEffect(() => {
    if (additionalMedicines.length > 0) {
      AsyncStorage.setItem(
        "additionalMedicines",
        JSON.stringify(additionalMedicines)
      );
    } else {
      // If no additional medicines, remove the item from storage
      AsyncStorage.removeItem("additionalMedicines");
    }
  }, [additionalMedicines]);

  // Save selected medicines status to AsyncStorage whenever it changes
  useEffect(() => {
    if (Object.keys(selectedMedicines).length > 0) {
      AsyncStorage.setItem(
        "selectedMedicinesStatus",
        JSON.stringify(selectedMedicines)
      );
    } else {
      AsyncStorage.removeItem("selectedMedicinesStatus");
    }
  }, [selectedMedicines]);

  // Group regular medicines by time whenever they change
  useEffect(() => {
    if (regularMedicines.length > 0) {
      // Group medicines by time
      const groupsByTime: { [key: string]: Medicine[] } = {};

      regularMedicines.forEach((medicine) => {
        const time = medicine.time || "ไม่ระบุเวลา";
        if (!groupsByTime[time]) {
          groupsByTime[time] = [];
        }
        groupsByTime[time].push(medicine);
      });

      // Convert to array format needed for rendering
      const groups = Object.entries(groupsByTime).map(([time, meds]) => ({
        time,
        medications: meds,
      }));

      setGroupedRegularMeds(groups);

      // ตั้งค่า selectedMedicines สำหรับยาที่มีสถานะ taken แล้ว
      const initialSelectedMedicines = { ...selectedMedicines };
      regularMedicines.forEach((medicine) => {
        if (medicine.taken) {
          initialSelectedMedicines[medicine.id] = true;
        }
      });
      setSelectedMedicines(initialSelectedMedicines);
    } else {
      setGroupedRegularMeds([]);
    }
  }, [regularMedicines]);

  // Fetch regular medicines from API
  useEffect(() => {
    const fetchRegularMedicines = async () => {
      try {
        setLoading(true);

        // Get authentication data
        const authData = await AsyncStorage.getItem("@auth");

        if (!authData) {
          console.log("No auth data found. Please log in.");
          return;
        }

        const auth = authData ? JSON.parse(authData) : null;
        const token = auth.token;
        const userId = auth.user._id;

        // ใช้วันที่ปัจจุบันเสมอ ไม่ใช้จาก formData
        const today = new Date();
        const trackingDate = today.toISOString().split("T")[0];
        console.log("Using current date for medicine tracking:", trackingDate);

        // 1. Generate medication tracking for the selected date
        await axios.post(
          `${BASE_URL}/api/v1/regular-pills/generate`,
          { userId, date: trackingDate, generateHistory: true },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        // 2. Fetch the daily medication data
        const dailyMedicationsResponse = await axios.get(
          `${BASE_URL}/api/v1/regular-pills/daily/${userId}?date=${trackingDate}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (
          dailyMedicationsResponse.data.success &&
          dailyMedicationsResponse.data.medicationLogs
        ) {
          // Convert format
          const regularPills =
            dailyMedicationsResponse.data.medicationLogs.flatMap(
              (medicationLog: any) =>
                medicationLog.medications.map((med: any) => ({
                  id:
                    med.pillId ||
                    med._id ||
                    `regular-${Math.random().toString(36).substring(2)}`,
                  name: med.pillName || med.name || "ไม่ระบุชื่อยา",
                  type: med.type || med.pillType || "ยาประจำ",
                  details: med.description || "",
                  image: med.pillImage
                    ? `${BASE_URL}/uploads/${med.pillImage}`
                    : require("../../../assets/Tracking/Medicine.png"),
                  time: medicationLog.time || "",
                  taken: med.isTaken || med.taken || false,
                }))
            );

          setRegularMedicines(regularPills);

          // สร้าง selected medicines จากยาที่มีสถานะ taken แล้ว
          const takenMedicines = regularPills
            .filter((med: Medicine) => med.taken)
            .reduce((acc: { [key: string]: boolean }, med: Medicine) => {
              acc[med.id] = true;
              return acc;
            }, {});

          setSelectedMedicines((prev) => ({ ...prev, ...takenMedicines }));
        } else {
          // If no medication logs, fetch from health info as fallback
          const response = await axios.get(
            `${BASE_URL}/api/v1/user/profile/${userId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (response.data.success && response.data.user.healthinfo) {
            const healthInfoId = response.data.user.healthinfo._id;

            // Fetch health info details
            const healthInfoResponse = await axios.get(
              `${BASE_URL}/api/v1/user/healthinfo/${healthInfoId}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            if (
              healthInfoResponse.data.success &&
              healthInfoResponse.data.healthInfo.regularpill
            ) {
              // Transform regularpill data to match our Medicine interface
              const regularPills =
                healthInfoResponse.data.healthInfo.regularpill.map(
                  (pill: any, index: number) => ({
                    id: pill._id || `regular-${index}`,
                    name: pill.pillName,
                    type: pill.pillType,
                    details: pill.description || "",
                    image: pill.pillImage
                      ? `${BASE_URL}/uploads/${pill.pillImage}`
                      : require("../../../assets/Tracking/Medicine.png"),
                  })
                );

              setRegularMedicines(regularPills);
            }
          }
        }
      } catch (error: any) {
        if (error.response && error.response.status === 404) {
          console.log("No Regular pill data found.");
          return; // Do nothing if 404
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRegularMedicines();
  }, []);

  // Load additional medicine data when params are available
  useEffect(() => {
    if (params.name && params.type) {
      const newMedicine: Medicine = {
        id: params.id ? String(params.id) : Date.now().toString(),
        name: String(params.name),
        type: String(params.type),
        details: params.details ? String(params.details) : "",
        image: params.image
          ? String(params.image)
          : require("../../../assets/Tracking/Medicine.png"),
      };

      // Check if this medicine already exists or is being edited
      const exists = additionalMedicines.some(
        (med) => med.id === newMedicine.id
      );

      if (!exists) {
        // Add new medicine
        setAdditionalMedicines((prev) => [...prev, newMedicine]);
      } else {
        // Update existing medicine
        setAdditionalMedicines((prev) =>
          prev.map((med) => (med.id === newMedicine.id ? newMedicine : med))
        );
      }
    }
  }, [params.name, params.type, params.details, params.image]);

  // Update pill status in API
  const updateMedicationStatus = async (
    medicineId: string,
    time: string,
    isChecked: boolean
  ) => {
    try {
      // Get authentication data
      const authData = await AsyncStorage.getItem("@auth");
      if (!authData) {
        console.error("Authentication data not found");
        return;
      }

      const auth = JSON.parse(authData);
      const token = auth.token;
      const userId = auth.user._id;

      // Update checkbox status in local state
      handleCheckboxChange(medicineId, isChecked);

      // Call API to update pill status
      await axios.post(
        `${BASE_URL}/api/v1/regular-pills/update-status`,
        {
          medicationId: medicineId,
          userId: userId,
          status: isChecked ? "taken" : "pending",
          actualTime: time,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(
        `Updated medication ${medicineId} status to ${
          isChecked ? "taken" : "pending"
        }`
      );

      // อัปเดตสถานะ taken ในยา
      setRegularMedicines((prevMeds) =>
        prevMeds.map((med) =>
          med.id === medicineId ? { ...med, taken: isChecked } : med
        )
      );
    } catch (error) {
      console.error("Error updating medication status:", error);
      Alert.alert("ข้อผิดพลาด", "ไม่สามารถอัพเดตสถานะยาได้");
    }
  };

  // Function to delete image from server
  const deleteImageFromServer = async (imagePath: string) => {
    try {
      // ข้าม หากไม่มี path หรือไม่ใช่รูปแบบที่ถูกต้อง
      if (!imagePath || typeof imagePath !== "string") {
        return true;
      }

      // ข้าม หากเป็นรูปภาพเริ่มต้น (จาก require)
      if (!imagePath.includes("/")) {
        return true;
      }

      // รับข้อมูล auth token
      const authData = await AsyncStorage.getItem("@auth");
      if (!authData) {
        throw new Error("Authentication data not found");
      }

      const auth = JSON.parse(authData);
      const token = auth.token;

      // แยกส่วนของชื่อโฟลเดอร์และชื่อไฟล์
      let folder = "pill-images";
      let fileName = "";

      if (imagePath.startsWith("file://")) {
        // เป็นไฟล์ในเครื่อง ไม่ต้องลบจากเซิร์ฟเวอร์
        return true;
      } else if (imagePath.includes("/")) {
        // มีพาธที่มี / แยกส่วนของโฟลเดอร์และชื่อไฟล์
        const parts = imagePath.split("/");
        fileName = parts.pop() || "";

        // ถ้ามีโฟลเดอร์ใน path ก็ใช้โฟลเดอร์นั้น แต่ถ้าไม่มีก็ใช้ค่าเริ่มต้น
        if (parts.length > 0 && parts[parts.length - 1] !== "uploads") {
          folder = parts.pop() || "pill-images";
        }
      } else {
        // เป็นเพียงชื่อไฟล์
        fileName = imagePath;
      }

      // ข้ามถ้าไม่มีชื่อไฟล์
      if (!fileName) {
        return true;
      }

      // ส่ง request ลบไฟล์ไปยัง API
      await axios.delete(`${BASE_URL}/api/v1/storage/deleteFile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: {
          folder: folder,
          fileName: fileName,
        },
      });

      console.log(`ลบรูปภาพสำเร็จ: ${fileName} จากโฟลเดอร์ ${folder}`);
      return true;
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการลบรูปภาพ:", error);
      // ไม่บล็อกการลบยาแม้ว่าการลบรูปภาพจะล้มเหลว
      return false;
    }
  };

  // View medicine details when clicked
  const handleViewDetails = (medicine: Medicine, isRegular: boolean) => {
    if (isRegular) {
      // สำหรับยาประจำ ให้ route ไปยัง profile/(med)/(medDetail)/[id]
      router.push({
        pathname: "/profile/(med)/(medDetail)/[id]",
        params: {
          id: medicine.id,
        },
      });
    } else {
      // สำหรับยาเพิ่มเติม ไปที่ medicineDetail
      router.push({
        pathname: "./medicineDetail",
        params: {
          name: medicine.name,
          type: medicine.type,
          details: medicine.details,
          image:
            typeof medicine.image === "string" ? medicine.image : undefined,
          isRegular: isRegular ? "true" : "false",
        },
      });
    }
  };

  // Add a new medicine
  const handleAddMedicine = () => {
    router.push({
      pathname: "./addMedicine",
    });
  };

  // Edit an existing medicine
  const handleEditMedicine = (medicine: Medicine) => {
    router.push({
      pathname: "./addMedicine",
      params: {
        id: medicine.id,
        name: medicine.name,
        type: medicine.type,
        details: medicine.details,
        image: typeof medicine.image === "string" ? medicine.image : undefined,
        isEdit: "true", // Flag for editing mode
      },
    });
  };

  // Delete a medicine
  const handleDeleteMedicine = (medicineId: string) => {
    // ค้นหายาที่จะลบเพื่อเข้าถึงพาธของรูปภาพ
    const medicineToDelete = additionalMedicines.find(
      (med) => med.id === medicineId
    );

    if (!medicineToDelete) {
      console.error("ไม่พบยาที่ต้องการลบ:", medicineId);
      return;
    }

    Alert.alert("ยืนยันการลบ", "คุณแน่ใจหรือไม่ว่าต้องการลบยานี้?", [
      { text: "ยกเลิก", style: "cancel" },
      {
        text: "ลบ",
        onPress: async () => {
          try {
            // แสดงสถานะกำลังลบ
            setDeletingMedicineId(medicineId);

            // ลองลบรูปภาพจากเซิร์ฟเวอร์ก่อน
            let imageDeleted = true;
            if (typeof medicineToDelete.image === "string") {
              imageDeleted = await deleteImageFromServer(
                medicineToDelete.image
              );
            }

            // ลบข้อมูลยาออกจาก state
            setAdditionalMedicines((prev) =>
              prev.filter((medicine) => medicine.id !== medicineId)
            );

            // ลบออกจาก selected medicines
            setSelectedMedicines((prev) => {
              const updatedState = { ...prev };
              delete updatedState[medicineId];
              return updatedState;
            });

            // อัพเดต AsyncStorage
            AsyncStorage.getItem("additionalMedicines").then(
              (storedMedicines) => {
                if (storedMedicines) {
                  const parsedMedicines = JSON.parse(storedMedicines);
                  const updatedMedicines = parsedMedicines.filter(
                    (med: Medicine) => med.id !== medicineId
                  );

                  if (updatedMedicines.length > 0) {
                    AsyncStorage.setItem(
                      "additionalMedicines",
                      JSON.stringify(updatedMedicines)
                    );
                  } else {
                    AsyncStorage.removeItem("additionalMedicines");
                  }
                }
              }
            );

            // แสดงข้อความตามผลการลบ
            if (imageDeleted) {
              Alert.alert("ลบสำเร็จ", "ยาถูกลบเรียบร้อย");
            } else {
              Alert.alert(
                "ลบสำเร็จบางส่วน",
                "ยาถูกลบแล้ว แต่ไม่สามารถลบรูปภาพได้"
              );
            }
          } catch (error) {
            console.error("เกิดข้อผิดพลาดในกระบวนการลบ:", error);
            Alert.alert(
              "เกิดข้อผิดพลาด",
              "ไม่สามารถลบยาได้ กรุณาลองใหม่อีกครั้ง"
            );
          } finally {
            // ล้างสถานะกำลังลบ
            setDeletingMedicineId(null);
          }
        },
      },
    ]);
  };

  // Handle checkbox selection change
  const handleCheckboxChange = (medicineId: string, isChecked: boolean) => {
    setSelectedMedicines((prev) => ({
      ...prev,
      [medicineId]: isChecked, // Update the checkbox state
    }));
  };

  // Handle next button click
  const handleNext = async () => {
    // Store selected medicines with their status
    const selectedRegularMeds = regularMedicines
      .filter((med) => selectedMedicines[med.id])
      .map((med) => ({
        ...med,
        taken: true, // Mark as taken since it's checked
      }))
      .reduce((acc, med) => ({ ...acc, [med.id]: med }), {});

    const selectedAdditionalMeds = additionalMedicines.reduce(
      (acc, med) => ({ ...acc, [med.id]: med }),
      {}
    ); // All additional medicines are selected by default

    const allSelectedMedicines = {
      ...selectedRegularMeds,
      ...selectedAdditionalMeds,
    };

    // Save to AsyncStorage
    try {
      await AsyncStorage.setItem(
        "selectedMedicines",
        JSON.stringify(allSelectedMedicines)
      );
      console.log(
        "Selected medicines saved successfully:",
        Object.keys(allSelectedMedicines).length
      );
      router.push({
        pathname: "./summaryTracking",
      });
    } catch (error) {
      console.error("Error saving selected medicines:", error);
      Alert.alert("ข้อผิดพลาด", "ไม่สามารถบันทึกยาที่เลือกได้");
    }
  };

  // Render medicine image with proper handling for different source types
  const renderMedicineImage = (medicine: Medicine) => {
    return (
      <Image
        source={require("../../../assets/Tracking/Medicine.png")}
        className="w-8 h-8 rounded-lg ml-2"
      />
    );
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <SafeAreaView className="flex-1">
      <BackButton title="ย้อนกลับ" />

      <ScrollView className="mb-24">
        {!loading && (
          <>
            {/* Regular medicines section */}
            <Card>
              <Text className="text-title font-medium text-secondary">
                ยาประจำ
              </Text>
              <BreakLine />
              {groupedRegularMeds.length > 0 ? (
                groupedRegularMeds.map((medicationLog, timeIndex) => (
                  <View
                    key={`medication-time-${medicationLog.time}-${timeIndex}`}
                    className="mb-4 justify-between"
                  >
                    <Text className="text-description text-secondary mb-2 font-regular">
                      เวลา {medicationLog.time}
                    </Text>
                    {medicationLog.medications.map((medication, medIndex) => (
                      <View
                        key={`${medicationLog.time}-${medication.id}-${medIndex}`}
                        className="flex-row items-center justify-between mt-2 gap-8"
                      >
                        <View className="flex-row items-center">
                          <Checkbox
                            value={
                              selectedMedicines[medication.id] ||
                              medication.taken ||
                              false
                            }
                            onValueChange={(newValue) =>
                              updateMedicationStatus(
                                medication.id,
                                medicationLog.time,
                                newValue
                              )
                            }
                            className="w-6 h-6 rounded border"
                            color={
                              selectedMedicines[medication.id] ||
                              medication.taken
                                ? "#3972F0"
                                : "#F8F8F8"
                            }
                          />
                          {renderMedicineImage(medication)}
                          <Text className="text-description text-secondary font-regular ml-2">
                            {medication.name || "ไม่ระบุชื่อยา"}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => handleViewDetails(medication, true)}
                        >
                          <Text className="text-primary text-description font-regular">
                            รายละเอียดยา
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                ))
              ) : (
                <Text className="text-description text-center font-regular py-2">
                  ไม่พบยาประจำ
                </Text>
              )}
            </Card>

            {/* Additional medicines section */}
            <Card>
              <Text className="text-title font-medium text-secondary text-center mt-2">
                ยาเพิ่มเติม
              </Text>
              <BreakLine />
              {additionalMedicines.length > 0 ? (
                additionalMedicines.map((medicine) => (
                  <TouchableOpacity
                    key={medicine.id}
                    onPress={() => handleViewDetails(medicine, false)}
                    className="flex-row items-center py-2"
                  >
                    {renderMedicineImage(medicine)}
                    <View className="ml-2 flex-1">
                      <Text className="font-sans text-description font-semibold">
                        {String(medicine.name)}
                      </Text>
                      {medicine.type && (
                        <Text className="font-sans text-tag text-secondary">
                          {String(medicine.type)}
                        </Text>
                      )}
                    </View>
                    <View className="flex-row items-center">
                      <TouchableOpacity
                        onPress={() => handleDeleteMedicine(medicine.id)}
                        disabled={deletingMedicineId === medicine.id}
                      >
                        {deletingMedicineId === medicine.id ? (
                          <ActivityIndicator size="small" color="red" />
                        ) : (
                          <Image
                            source={require("../../../assets/Tracking/trash.png")}
                            className="w-6 h-6"
                            style={{ tintColor: "red" }}
                          />
                        )}
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <Text className="text-center py-2 text-description font-regular text-secondary">
                  ยังไม่มียาเพิ่มเติม
                </Text>
              )}

              <TouchableOpacity
                className="bg-primary rounded-[10px] py-4 px-8 mt-4"
                onPress={handleAddMedicine}
              >
                <Text className="font-sans text-button font-bold text-card text-center">
                  เพิ่มยาใหม่
                </Text>
              </TouchableOpacity>
            </Card>

            {/* Next button outside the card */}
            <View className="items-center w-full px-6 mb-6">
              <LongButton
                title="ถัดไป"
                onPress={handleNext}
                customStyle={"bg-primary"}
              />
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

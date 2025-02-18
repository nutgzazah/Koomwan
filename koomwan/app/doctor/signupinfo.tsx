import { useRouter } from "expo-router";
import { useEffect } from 'react';
import React, { useState } from "react";
import { useLocalSearchParams } from 'expo-router';  // ถ้าใช้ Expo Router
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import Toast from "react-native-toast-message";
import StatusModal from "../../components/login_signin/StatusModal";
import PDFViewer from "../../components/beginner/PDFViewer";
import BASE_URL from "../../config"
import axios from "axios";
import * as FileSystem from 'expo-file-system';

// Mock data for dropdowns
const experts = [
  "เวชกรรม",
  "อายุรกรรมทั่วไป",
  "การให้คำปรึกษาสุขภาพจิต",
  "การให้คำปรึกษาวัยรุ่น",
  "การให้คำปรึกษาครอบครัว",
  "การดูแลผู้ป่วยมะเร็ง",
];

const hospitals = [
  "โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ",
  "โรงพยาบาลราชวิถี",
  "โรงพยาบาลจุฬาลงกรณ์",
  "โรงพยาบาลรามาธิบดี",
  "โรงพยาบาลศิริราช",
  "โรงพยาบาลตำรวจ",
];

type FormData = {
  username: string;
  email: string;
  password: string;
  phone: string;
  firstname: string;
  lastname: string;
  occupation: string;
  expert: string;
  hospital: string;
  document: string;  // ใช้ค่า R2imgPath
  image: string;  // ใช้ค่า R2docPath
};

const DoctorSignUpInfoScreen = () => {

  

  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    phone: "",
    firstname: "",
    lastname: "",
    occupation: "",
    expert: "",
    hospital: "",
    document: "",
    image: "",
  });


  const router = useRouter();
  const { username, email, password, phone } = useLocalSearchParams();
  console.log(username, email, password, phone);
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [occupation, setOccupation] = useState("");
  const [expert, setExpert] = useState("");
  const [hospital, setHospital] = useState("");
  const [selectedImage, setSelectedImage] = useState<{ uri: string; fileName: string; type: string } | undefined>(undefined);
  const [document, setDocument] = useState<{
    name: string;
    uri: string;
    size: number;
  } | null>(null);
  const [showExpertDropdown, setShowExpertDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showHospitalDropdown, setShowHospitalDropdown] = useState(false);
  const [isPDFVisible, setIsPDFVisible] = useState(false);
  // Toast แสดงสถานะอัพโหลดรูป
  const showToast = (type: "success" | "error", message: string) => {
    Toast.show({
      type: type,
      text1: type === "success" ? "สำเร็จ" : "ข้อผิดพลาด",
      text2: message,
      position: "bottom",
      visibilityTime: 3000,
    });
  };

  const pickImageAsync = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        showToast("error", "ต้องการสิทธิ์ในการเข้าถึงคลังรูปภาพ");
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 0.7,
        aspect: [1, 1],
      });

      if (!result.canceled) {
        const fileName = result.assets[0].uri.split('/').pop() || 'image.jpg'; // สร้างชื่อไฟล์จาก uri หรือใช้ชื่อเริ่มต้น
        setSelectedImage({
          uri: result.assets[0].uri,
          fileName: fileName,
          type: result.assets[0].type || 'image/jpeg', // ถ้าไม่มีประเภทก็ใช้เป็น 'image/jpeg'
        });
        showToast("success", "อัพโหลดรูปภาพสำเร็จ");
      }
    } catch (error) {
      console.error("Error picking image:", error);
      showToast("error", "เกิดข้อผิดพลาดในการเลือกรูปภาพ");
    }
  };
  //อัพโหลดเอกสาร
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        multiple: false,
        copyToCacheDirectory: true,
      });

      if (result.assets && result.assets[0]) {
        const selectedDoc = result.assets[0];

        // ตรวจสอบขนาดไฟล์ (จำกัดที่ 10MB)
        const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
        if (selectedDoc.size && selectedDoc.size > MAX_FILE_SIZE) {
          showToast("error", "ขนาดไฟล์ต้องไม่เกิน 10MB");
          return;
        }

        setDocument({
          name: selectedDoc.name,
          uri: selectedDoc.uri,
          size: selectedDoc.size ?? 0,
        });
        setErrors((prev) => ({ ...prev, document: false }));
        showToast("success", "อัพโหลดเอกสารสำเร็จ");
      }
    } catch (error) {
      console.error("Error picking document:", error);
      showToast("error", "เกิดข้อผิดพลาดในการอัพโหลดเอกสาร");
    }
  };

  // Validation states
  const [errors, setErrors] = useState({
    first_name: false,
    last_name: false,
    occupation: false,
    expert: false,
    hospital: false,
    document: false,
    selectedImage: false,
  });

  // Validation function
  const validateForm = () => {
    const newErrors = {
      first_name: !first_name.trim(),
      last_name: !last_name.trim(),
      occupation: !occupation.trim(),
      expert: !expert,
      hospital: !hospital,
      document: !document,
      selectedImage: !selectedImage,
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = async () => {
    const isValid = validateForm();
    if (isValid) {
      setShowModal(true);
      setIsLoading(true);
      
      try {
        // Set formData here before submission

        setFormData((prevFormData) => ({
          ...prevFormData,
          username: String(username),
          email: String(email),
          password: String(password),
          phone: String(phone),
          document: R2docPath,
          image: R2imgPath,
        }));
        //form สำหรับอัปโหลดรูปลง R2 cloudflare storage
        const formDataForUploadImg = new FormData();

        // ตรวจสอบและเพิ่มไฟล์รูปภาพ (image)
        if (selectedImage) {
          const fileExtension = selectedImage.fileName.split('.').pop() || 'jpg'; // Get file extension or default to 'jpg'
          const fileName = `doctor-${Array.isArray(username) ? username[0].toLowerCase() : username.toLowerCase()}.${fileExtension}`; // ตรวจสอบ username ว่าเป็น array หรือไม่
          formDataForUploadImg.append("file", {
            uri: selectedImage.uri,
            name: fileName,
            type: selectedImage.type || "image/jpeg",
          });
        }
        formDataForUploadImg.append("folder", "doctor");

        //อัปโหลดรูปลง R2 cloudflare storage
        const uploadimg = await axios.post(`${BASE_URL}/api/v1/storage/uploadFile`, formDataForUploadImg,{
          headers: {
            "Content-Type": "multipart/form-data",
            "Accept": "application/json",
          },
        });
        //ดึง path ที่อัปโหลดมาบันทึกลง form
        const R2imgPath = uploadimg.data.R2filePath;
        
        //form สำหรับอัปโหลดเอกสารลง R2 cloudflare storage
        const formDataForUploadDoc = new FormData();
        // ตรวจสอบและเพิ่มไฟล์เอกสาร (document)
        if (document) {
          const fileExtension = document.uri.split('.').pop() || 'pdf'; // Get file extension or default to 'pdf'
          const fileName = `doctor-${Array.isArray(username) ? username[0].toLowerCase() : username.toLowerCase()}.${fileExtension}`; // ตรวจสอบ username ว่าเป็น array หรือไม่
          formDataForUploadDoc.append("file", {
            uri: document.uri,
            name: fileName,
            type: document.type || "application/pdf",
          });
        }
        formDataForUploadDoc.append("folder", "doctor");
        //อัปโหลดรูปลง R2 cloudflare storage
        const uploaddoc = await axios.post(`${BASE_URL}/api/v1/storage/uploadFile`, formDataForUploadDoc,{
          headers: {
            "Content-Type": "multipart/form-data",
            "Accept": "application/json",
          },
        });
        //ดึง path ที่อัปโหลดมาบันทึกลง form
        const R2docPath = uploaddoc.data.R2filePath;

        // อัปเดต formData ให้เสร็จสิ้นก่อนส่ง request
      const updatedFormData = {
        username: String(username),
        email: String(email),
        password: String(password),
        phone: String(phone),
        firstname: first_name,
        lastname: last_name,
        occupation,
        expert,
        hospital,
        document: R2docPath,
        image: R2imgPath,
      };

        console.log("First FormData:",formData);
        console.log("Final FormData:", updatedFormData);
        

        const response = await axios.post(`${BASE_URL}/api/v1/auth/registerdoctor`, updatedFormData);

        if (response.status === 201) {
          // After successful submission
          setIsLoading(false);
        } else {
          console.error("Registration failed:", response.data);
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        setShowModal(false);
        setIsLoading(false);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);

    router.push("/user/login");
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6">
          <Text className="text-display font-bold text-secondary mb-6 mt-4 text-center">
            ข้อมูลส่วนตัว
          </Text>

          {/* Profile Image */}
          <Text className="text-description text-secondary text-center font-regular mb-2">
            รูปโปรไฟล์
          </Text>
          <TouchableOpacity
            onPress={pickImageAsync}
            className="items-center mb-6"
          >
            <View className="w-36 h-36 bg-background rounded items-center justify-center border border-gray shadow-sm">
              {selectedImage ? (
                <Image
                  source={{ uri: selectedImage.uri }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <Image
                  source={require("../../assets/Doctor/signup.png")}
                  className="w-10 h-10"
                />
              )}
            </View>
          </TouchableOpacity>

          {/* Form Fields */}
          <View className="space-y-4 mb-6">
            <View>
              <Text className="text-description text-secondary font-regular mb-2">
                ชื่อ - นามสกุล
              </Text>
              <TextInput
                className={`w-full h-[50px] pl-4 pr-4 border rounded-[5px] text-description font-regular mb-2 ${
                  errors.first_name ? "border-abnormal" : "border-gray"
                }`}
                placeholder="ชื่อ"
                value={first_name}
                onChangeText={(text) => {
                  setFirstName(text);
                  setFormData({ ...formData, firstname: text })
                  setErrors((prev) => ({ ...prev, first_name: false }));
                }}
              />
              <TextInput
                className={`w-full h-[50px] pl-4 pr-4 border rounded-[5px] text-description font-regular mb-5 ${
                  errors.last_name ? "border-abnormal" : "border-gray"
                }`}
                placeholder="นามสกุล"
                value={last_name}
                onChangeText={(text) => {
                  setFormData({ ...formData, lastname: text })
                  setLastName(text);
                  setErrors((prev) => ({ ...prev, last_name: false }));
                }}
              />
            </View>

            <View>
              <Text className="text-description text-secondary mb-2 font-regular">
                อาชีพ
              </Text>
              <TextInput
                className={`w-full h-[50px] pl-4 pr-4 border rounded-[5px] text-description font-regular mb-5 ${
                  errors.occupation ? "border-abnormal" : "border-gray"
                }`}
                placeholder="อาชีพ"
                value={occupation}
                onChangeText={(text) => {
                  setOccupation(text);
                  setFormData({ ...formData, occupation: text })
                  setErrors((prev) => ({ ...prev, occupation: false }));
                }}
              />
            </View>

            {/* Expert Dropdown */}
            <View>
              <Text className="text-description text-secondary mb-2 font-regular">
                ด้านที่เชี่ยวชาญ
              </Text>
              <View className="relative">
                <TouchableOpacity
                  onPress={() => {
                    setShowExpertDropdown(!showExpertDropdown);
                    setShowHospitalDropdown(false);
                  }}
                  className={`w-full h-[50px] pl-4 pr-4 border rounded-[5px] text-description font-regular mb-3 flex-row items-center justify-between ${
                    errors.expert ? "border-abnormal" : "border-gray"
                  }`}
                >
                  <Text
                    className={`text-description font-regular ${
                      expert ? "text-secondary" : "text-gray"
                    }`}
                  >
                    {expert || "เลือกด้านที่เชี่ยวชาญ"}
                  </Text>
                  <Image
                    source={
                      showExpertDropdown
                        ? require("../../assets/Doctor/icon/drop_up.png")
                        : require("../../assets/Doctor/icon/drop_down.png")
                    }
                    className="w-6 h-6"
                  />
                </TouchableOpacity>

                {showExpertDropdown && (
                  <View className="absolute top-12 left-0 right-0 bg-card border border-gray rounded z-10">
                    <ScrollView className="max-h-48">
                      {experts.map((item) => (
                        <TouchableOpacity
                          key={item}
                          onPress={() => {
                            setExpert(item);
                            setFormData((prev) => ({ ...prev, expert: item })); // อัปเดต formData
                            setShowExpertDropdown(false);
                            setErrors((prev) => ({ ...prev, expert: false }));
                          }}
                          className="p-4 border-b border-gray"
                        >
                          <Text className="text-description text-secondary font-regular">
                            {item}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
            </View>

            {/* Hospital Dropdown */}
            <View>
              <Text className="text-description text-secondary font-regular mb-2">
                โรงพยาบาล
              </Text>
              <View className="relative">
                <TouchableOpacity
                  onPress={() => {
                    setShowHospitalDropdown(!showHospitalDropdown);
                    setShowExpertDropdown(false);
                  }}
                  className={`w-full h-[50px] pl-4 pr-4 border rounded-[5px] text-description font-regular mb-3 flex-row items-center justify-between ${
                    errors.hospital ? "border-abnormal" : "border-gray"
                  }`}
                >
                  <Text
                    className={`text-description font-regular ${
                      hospital ? "text-secondary" : "text-gray"
                    }`}
                  >
                    {hospital || "เลือกโรงพยาบาล"}
                  </Text>
                  <Image
                    source={
                      showHospitalDropdown
                        ? require("../../assets/Doctor/icon/drop_up.png")
                        : require("../../assets/Doctor/icon/drop_down.png")
                    }
                    className="w-6 h-6"
                  />
                </TouchableOpacity>

                {showHospitalDropdown && (
                  <View className="absolute top-12 left-0 right-0 bg-card border border-gray rounded z-10">
                    <ScrollView className="max-h-48">
                      {hospitals.map((item) => (
                        <TouchableOpacity
                          key={item}
                          onPress={() => {
                            setHospital(item);
                            setShowHospitalDropdown(false);
                            setFormData((prev) => ({ ...prev, hospital: item })); // อัปเดต formData
                            setErrors((prev) => ({ ...prev, hospital: false }));
                          }}
                          className="p-4 border-b border-gray"
                        >
                          <Text className="text-description text-secondary font-regular">
                            {item}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
            </View>

            {/* Medical Document */}
            <View>
              <Text className="text-description text-secondary font-regular mb-2">
                เอกสารประกอบทางการแพทย์
              </Text>
              <View className="flex-row items-center">
                <TouchableOpacity
                  onPress={pickDocument}
                  className={`flex-1 h-[50px] px-4 border rounded bg-background flex-row items-center mb-3 justify-between ${
                    errors.document ? "border-abnormal" : "border-gray"
                  }`}
                >
                  <View className="flex-1 flex-row items-center">
                    <Text
                      className={`text-description ${
                        document ? "text-secondary" : "text-gray"
                      } font-regular flex-1`}
                      numberOfLines={1}
                      ellipsizeMode="middle"
                    >
                      {document ? document.name : "เอกสารประกอบทางการแพทย์"}
                    </Text>
                  </View>
                  <View className="flex-row items-center ml-2">
                    {document && (
                      <Text className="text-description text-gray mr-2">
                        {(document.size / (1024 * 1024)).toFixed(1)}MB
                      </Text>
                    )}
                    <View className="w-12 h-6 bg-primary rounded-full items-center justify-center">
                      <Text className="text-card text-tag">PDF</Text>
                    </View>
                  </View>
                </TouchableOpacity>

                {document && (
                  <TouchableOpacity
                    onPress={() => setIsPDFVisible(true)}
                    className="ml-2 p-2"
                  >
                    <Image
                      source={require("../../assets/Login/eye.png")}
                      className="w-6 h-6"
                    />
                  </TouchableOpacity>
                )}
              </View>
              {errors.document && (
                <Text className="text-abnormal text-description font-regular">
                  กรุณาอัพโหลดเอกสารประกอบทางการแพทย์
                </Text>
              )}

              {/* PDF Viewer Modal */}
              {document && (
                <PDFViewer
                  uri={document.uri}
                  isVisible={isPDFVisible}
                  onClose={() => setIsPDFVisible(false)}
                  fileName={document.name}
                />
              )}
            </View>

            {/* Error Message */}
            {Object.values(errors).some((error) => error) && (
              <Text className="text-abnormal text-description font-regular mt-2">
                กรุณากรอกข้อมูลให้ครบ
              </Text>
            )}
          </View>

          {/* Buttons */}
          <View className="flex-row space-x-4 gap-4 mb-5">
            <TouchableOpacity
              className="flex-1 py-4 rounded-lg border border-gray"
              onPress={() => router.back()}
            >
              <Text className="text-secondary text-center font-bold text-button">
                ย้อนกลับ
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 bg-primary py-4 rounded-lg"
              onPress={handleSubmit}
            >
              <Text className="font-bold text-button text-center text-card">
                บันทึก
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <Toast />
      <StatusModal
        visible={showModal}
        isLoading={isLoading}
        onClose={handleCloseModal}
      />
    </SafeAreaView>
  );
};

export default DoctorSignUpInfoScreen;

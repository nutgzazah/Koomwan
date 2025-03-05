import { 
  View, 
  Text, 
  Image, 
  ScrollView 
} from "react-native";
import React, { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "../../../global/components/BackButton";
import Card from "../../../global/components/Card";
import BreakLine from "../../../global/components/BreakLine";
import InputFieldOne from "./components/InputFieldOne";
import InputFieldLong from "./components/InputFieldLong";

export default function MedicineDetailScreen() {
  const router = useRouter();
  const { name, type, details, image, isRegular } = useLocalSearchParams();

  const [medicineName, setMedicineName] = useState(name as string);
  const [medicineType, setMedicineType] = useState(type as string);
  const [medicineDetails, setMedicineDetails] = useState(details as string);

  return (
    <SafeAreaView className="flex-1">
      <BackButton title="ย้อนกลับ" />
      <ScrollView className="mb-24">
        <Card>
          <Text className="text-title font-bold text-secondary text-center mt-2 ">ยาประจำ</Text>
          <BreakLine />
          <View className="bg-background border border-gray rounded-lg mb-2 mt-1 w-full h-60  ">
            <Image
              source={require("../../../assets/Tracking/glipizide-med.png")}
              style={{ width: '100%', height: '100%' }}
              resizeMode="contain"
            />
          </View>
          
          {/*Show Medicine Name+Type+Detail*/}
          <InputFieldOne
            label="ชื่อยา"
            value={medicineName}
            placeholder="ชื่อยา"
            editable={false}
            onChangeText={setMedicineName}
            className="mb-0.5"       
          />

          <InputFieldOne
            label="ประเภท"
            value={medicineType}
            placeholder="ประเภทยา"
            editable={false}
            onChangeText={setMedicineType}
            className="mb-0.5" 
          />

          <InputFieldLong
            label="รายละเอียด"
            value={medicineDetails}
            placeholder="รายละเอียดยา"
            editable={false}
            onChangeText={setMedicineDetails}
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
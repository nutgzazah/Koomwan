import { 
    View, 
    Text, 
    Image, 
    TouchableOpacity, 
    TextInput, 
    ScrollView 
} from "react-native";
import React, { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "../../../global/components/BackButton";
import Card from "../../../global/components/Card";
import BreakLine from "../../../global/components/BreakLine";
import InputFieldOne from "./components/InputFieldOne";

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
                <Text className="text-title font-bold text-secondary text-center mt-2">ยาประจำ</Text>
                <BreakLine />

                <View className="bg-background border boder-gray px-20 py-10 rounded-lg" >
                <Image
                 source={require("../../../assets/Suggestion/heart-secondary.png")}
                 className="w-50 h-25"
                />
                </View>

                <InputFieldOne
                 label="ชื่อยา"
                 value={medicineName}
                 placeholder="ชื่อยา"
                 editable={!isRegular} 
                 onChangeText={setMedicineName}
                />

                <InputFieldOne
                 label="ประเภท"
                 value={medicineType}
                 placeholder="ชื่อยา"
                 editable={!isRegular} 
                 onChangeText={setMedicineType}
                />

                <InputFieldOne
                 label="รายละเอียด"
                 value={medicineDetails}
                 placeholder="ชื่อยา"
                 editable={!isRegular} 
                 onChangeText={setMedicineDetails}
                />

            </Card>
        </ScrollView>
      
        
    </SafeAreaView>
  );
}

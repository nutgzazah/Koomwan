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

                <View className="bg-background border border-gray px-20 py-5 rounded-lg mb-3 mt-1" style={{ width: 300, height: 200 }}>
                  <Image
                    source={require("../../../assets/Tracking/glipizide-med.png")}
                    style={{ width: '100%', height: '100%' }} // ให้ภาพยืดให้พอดีกับขนาดของกล่อง
                    resizeMode="contain" // ให้ภาพไม่ถูกบิดเบือน ย่อให้พอดีกับกล่อง
                  />
                </View>


                <InputFieldOne
                 label="ชื่อยา"
                 value={medicineName}
                 placeholder="ชื่อยา"
                 editable={false} 
                 onChangeText={setMedicineName}
                />

                <InputFieldOne
                 label="ประเภท"
                 value={medicineType}
                 placeholder="ชื่อยา"
                 editable={false} 
                 onChangeText={setMedicineType}
                />

                <InputFieldOne
                 label="รายละเอียด"
                 value={medicineDetails}
                 placeholder="ชื่อยา"
                 editable={false} 
                 onChangeText={setMedicineDetails}
                />

            </Card>
        </ScrollView>
      
        
    </SafeAreaView>
  );
}
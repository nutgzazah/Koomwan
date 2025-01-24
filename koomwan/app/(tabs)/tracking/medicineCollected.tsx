
import { Text, SafeAreaView, ScrollView, Image } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import Card from "../../../global/components/Card";
import BreakLine from "../../../global/components/BreakLine";


export default function medicineCollected() {
  return (
    <SafeAreaView>
        <Card>
            <Text className="text-2xl font-sans color-secondary text-center mt-2">ยาประจำ</Text>
            
            <BreakLine />
        </Card>

        <Card>
            <Text className="text-2xl font-sans color-secondary text-center mt-2">ยาเพิ่มเติม</Text>
            
            <BreakLine />
        </Card>
        
    </SafeAreaView>
  );
}
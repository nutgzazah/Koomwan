import { 
  SafeAreaView, 
  Text, 
  View, 
  Image
} from "react-native";
import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import Card from "../../../global/components/Card";
import BreakLine from "../../../global/components/BreakLine";
import ProgressBar from "./components/ProgressBar";
import { ShortButton } from "../tracking/components/ShortButton";

export default function SuggestionScreen() {
  const router = useRouter();
  const [showFirstCard, setShowFirstCard] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!showFirstCard) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev < 100) {
            return prev + 1;
          } else {
            clearInterval(interval);
            // Wrap the router.push in a separate call
            setTimeout(() => {
              router.push("./suggestion/suggestionResult");
            }, 0);
            return 100;
          }
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [showFirstCard, router]);

  return (
    <SafeAreaView>
      <Card>
        {showFirstCard ? (
          <FirstCard setShowFirstCard={setShowFirstCard} />
        ) : (
          <SecondCard progress={progress} />
        )}
      </Card>
    </SafeAreaView>
  );
}

//The First Card
function FirstCard({ setShowFirstCard }: { setShowFirstCard: (value: boolean) => void }) {
  return (
    <>
      <Text className="text-title font-bold font-sans text-secondary">
        ประเมินสุขภาพ
      </Text>
      <BreakLine />
      <Image
        source={require("../../../assets/Suggestion/heart-secondary.png")}
        className="w-50 h-25"
      />
      <BreakLine />
      <Text className="text-body font-sans text-secondary text-center mt-1">
        ยังไม่มีการประเมินสุขภาพ
      </Text>
      <Text className="text-description font-sans text-secondary text-center mt-1">
        เริ่มต้นสร้างการประเมินสุขภาพ เพื่อรับการวิเคราะห์ {"\n"} และข้อเสนอต่างๆ
      </Text>
      <ShortButton
          title="เริ่มสร้างการประเมิน"
          onPress={() => setShowFirstCard(false)}
          iconSrc={require("../../../assets/Suggestion/shield-line.png")} 
          iconPosition="left" 
          className="mt-6 mb-7" 
      />
    </>
  );
}

//The Second Card
function SecondCard({ progress }: { progress: number }) {
  return (
    <>
      <Text className="text-title font-bold font-sans text-secondary text-center mt-2">
        ประเมินสุขภาพ
      </Text>
      <BreakLine />
      <Image
        source={require("../../../assets/Suggestion/heart-primary.png")}
        className="w-50 h-25"
      />
      <Text className="text-l font-sans text-secondary text-center mt-1 mb-">
        กำลังสร้าง ...
      </Text>

      <ProgressBar progress={progress} />

      <BreakLine />
      <Text className="text-m font-sans text-secondary text-center mt-2">
        ระบบกำลังวิเคราะห์ข้อมูลของคุณด้วย AI {"\n"} เพื่อสร้างคำแนะนำที่เหมาะสมกับสุขภาพของคุณ {"\n"} โปรดรอซักครู่
      </Text>
      <View className="bg-background px-5 py-2 rounded-xl">
        <Text className="text-m font-sans text-secondary text-center mt-2">
          ดูแลวันนี้ เพื่อพรุ่งนี้ที่ดีกว่า 🌟
        </Text>
      </View>
    </>
  );
}
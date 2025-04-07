import { 
  SafeAreaView, 
  Text, 
  View, 
  Image, 
  Modal, 
  Pressable, 
  Alert,
  ActivityIndicator,
  ScrollView
} from "react-native";
import React, { useCallback, useContext, useState } from "react";
import { useRouter } from "expo-router";
import Card from "../../../global/components/Card";
import { AuthContext } from "../../../context/authContext";
import BreakLine from "../../../global/components/BreakLine";
import { ShortButton } from "../tracking/components/ShortButton";
import Loading from "../../../global/components/Loading";
import AdviceCard from './components/AdviceCard';
import BASE_URL from "../../../config"
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import motivationalQuotes from './motivationalQuotes';
import AdviceBlogCard from "./components/AdviceBlogCard";


export default function SuggestionScreen() {
  const router = useRouter();
  const [state] = useContext(AuthContext)
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [quote, setQuote] = useState("");
  const [diabetesType, setDiabetesType] = useState<string | null>(null);
  const [randomBlogs, setRandomBlogs] = useState<any[]>([]);
  console.log("State Suggestion: ",state)

  const isCooldownActive = () => {
    if (!result?.createdAt) return false;
    const createdTime = new Date(result.createdAt).getTime();
    const now = new Date().getTime();
    const diffMinutes = (now - createdTime) / (1000 * 60);
    return diffMinutes < 5;
  };

  const fetchDiabetesType = async () => {
    setLoading(true);  // Start loading
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/suggestion/getUserDiabetesType`);
      setDiabetesType(res.data?.diabetestype);
      console.log("DiabetesType data",res.data?.diabetestype)
    } catch (err) {
      console.error("Error fetching diabetes type:", err);
      setDiabetesType(null); // fallback กรณี error
    }finally {
      setLoading(false);  // End loading
    }
  };

  const fetchSuggestionData = async () => {
    setLoading(true);  // Start loading
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/suggestion/getSuggestionData`);
      setResult(res.data);
      await fetchBlogsByCategory(res.data.healthAdvice.blog); 
      console.log("result",res.data)
      const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
      setQuote(randomQuote);
    } catch (err: any) {
      if (err.response?.data?.message === "Suggestion not found") {
        setResult(null); // ไม่มีข้อมูล → แสดงหน้าเดิม
      }
    }finally {
      setLoading(false);  // End loading
    }
  };

  const fetchBlogsByCategory = async (blogs: any[]) => {
    try {
      const blogResults = await Promise.all(
        blogs.map(async (item) => { 
          try {
            const res = await axios.get(`${BASE_URL}/api/v1/suggestion/getRandomBlogFromCategory/${item.category}`);
            return {
              blogId: res.data._id,
              image: res.data.image,
              title: res.data.title,
              content: res.data.content,
            };
          } catch (error) {
            // ถ้าไม่เจอ blog (API ส่ง 404 หรือ error)
            return {
              blogId: "",
              image: null,
              title: "ไม่มี Blog",
              content: "ไม่มีรายละเอียด",
            };
          }
        })
      );
      setRandomBlogs(blogResults);
    } catch (error) {
      console.error("Error fetching random blogs:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const fetchAll = async () => {
        await fetchDiabetesType();
        await fetchSuggestionData();
      };
      fetchAll();
    }, [])
  );

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/suggestion/getUserHealthLastWeek`);
      console.log("Health data:", res.data);
      setShowModal(false);
      router.push("./suggestion/suggestionResult");
    } catch (error: any) {
      console.error("Error:", error?.response?.data || error);

      setShowModal(false); // ปิด Modal ก่อนแสดง Alert

      if (error?.response?.data?.message === "Health info not found") {
        Alert.alert(
          "แจ้งเตือน",
          "ดูเหมือนว่าคุณยังไม่ได้บันทึกข้อมูลพื้นฐานเลยนะ ไปบันทึกตอนนี้เลย!",
          [{ text: "ตกลง", onPress: () => router.replace("/user/beginner") }]
        );
      } else if (
        error?.response?.data?.message ===
        "ไม่พบข้อมูลสุขภาพครบทุกประเภทในช่วง 7 วันที่ผ่านมา"
      ) {
        const missing = error.response.data.missing;
        const missingList = [
          missing.bloodsugar ? "ระดับน้ำตาลในเลือด 5 ครั้ง" : null,
          missing.a1c ? "HbA1c" : null,
          missing.bloodpressure ? "ความดันโลหิต" : null,
        ]
          .filter(Boolean)
          .join(", ");

        Alert.alert(
          "แจ้งเตือน",
          `ดูเหมือนว่าใน 7 วันที่ผ่านมาคุณบันทึกข้อมูล ${missingList} ยังไม่ครบเลยนะ ไปบันทึกกันเลยตอนนี้!`,
          [{ text: "ตกลง", onPress: () => router.replace("/tracking") }]
        );
      } else {
        Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถดึงข้อมูลได้ กรุณาลองใหม่");
      }
    } finally {
      setLoading(false);
    }
  };
  if (loading ) {
      return (
        <Loading />
      );
    }
  

  return (
    <SafeAreaView className="flex-1 mt-2">
      {!result ? (
        <Card>
          <Text className="text-title font-bold font-sans text-secondary">
            ประเมินสุขภาพ
          </Text>
          <BreakLine />
          <Image
            source={require("../../../assets/Suggestion/heart-secondary.png")}
            className="w-50 h-25 my-10"
          />
          <BreakLine />
          <Text className="text-body font-bold font-sans text-primary text-center mt-1">
            ยังไม่มีการประเมินสุขภาพ
          </Text>
          <Text className="text-description font-sans text-secondary text-center mt-1">
            เริ่มต้นสร้างการประเมินสุขภาพ เพื่อรับการวิเคราะห์ {"\n"} และข้อเสนอต่างๆ
          </Text>
          <ShortButton
            title="เริ่มสร้างการประเมิน"
            onPress={() => setShowModal(true)}
            iconSrc={require("../../../assets/Suggestion/shield-line.png")}
            iconPosition="left"
            className="mt-12 mb-4"
          />
        </Card>
      ) : (
        <ScrollView className="mb-24">
          <Card>
            <Text className="text-title font-bold font-sans text-secondary text-center mt-2 mb-1">
              ประเมินสุขภาพ
            </Text>
            <BreakLine />

            <Image
              source={require("../../../assets/Suggestion/heart-primary.png")}
              className="w-32 h-32 mx-auto mb-1"
            />

            <Text className="text-headline font-bold font-sans text-secondary text-center mb-1 ">
              คะแนนสุขภาพ
              <Text className="text-display font-bold font-sans text-primary">
                {result.healthScore}
              </Text>
              <Text className="text-body font-sans text-secondary">/10</Text>
            </Text>

            {diabetesType !== "diabetes" && (
              <Text className="text-headline font-bold font-sans text-secondary text-center mb-2">
                ความเสี่ยงเบาหวาน
                <Text className="text-display font-bold font-sans text-primary">
                  {result.riskScore}%
                </Text>
                <Text className="text-body font-sans text-secondary">
                  {" "}
                  ({result.healthResult})
                </Text>
              </Text>
            )}
            <BreakLine />

            <Text className="text-description font-sans text-secondary text-center mb-4">
              {result.summary}
            </Text>

            <View className="bg-background p-4 rounded-lg mb-4 ">
              <Text className="text-tag font-sans text-secondary text-center">
                {quote}
              </Text>
            </View>

            <ShortButton
              title={isCooldownActive() ? "กรุณารอสักครู่..." : "สร้างการประเมินใหม่"}
              onPress={() => {
                if (isCooldownActive()) {
                  Alert.alert("กรุณารอสักครู่", "คุณสามารถสร้างการประเมินใหม่ได้ทุก 5 นาที");
                } else {
                  setShowModal(true);
                }
              }}
              iconSrc={require("../../../assets/Suggestion/rotate-left.png")}
              iconPosition="left"
              className="mt-2 mb-1"
            />
          </Card>

          {/* Recommended Food */}
          <View className="px-6">
            <Text className="text-headline font-bold font-sans text-secondary mt-1 mb-1">
             โภชนาการที่แนะนำ
            </Text>
          </View>
          <ScrollView horizontal className="mt-4 px-4" showsHorizontalScrollIndicator={false}>
            {result.healthAdvice.food.map((item, index) => (
              <AdviceCard
                key={index}
                title={item.title}
                description={item.description}
                image={require("../../../assets/Suggestion/people-healthy.png")}
              />
            ))}
          </ScrollView>

          {/* Recommended Exercise */}
          <View className="px-6">
            <Text className="text-headline font-bold font-sans text-secondary mt-2 mb-1">
              การออกกำลังกายที่แนะนำ
            </Text>
          </View>
          <ScrollView horizontal className="mt-4 px-4" showsHorizontalScrollIndicator={false}>
            {result.healthAdvice.exercise.map((item, index) => (
              <AdviceCard
                key={index}
                title={item.title}
                description={item.description}
                image={require("../../../assets/Suggestion/people-exercise.png")}
              />
            ))}
          </ScrollView>

          {/* Recommended Articles */}
          <View className="px-6">
            <Text className="text-headline font-bold font-sans text-secondary mt-2 mb-1">
              บทความที่แนะนำ
            </Text>
          </View>
          <ScrollView horizontal className="mt-4 px-1" showsHorizontalScrollIndicator={false}>
          {randomBlogs.map((item, index) => (
            <AdviceBlogCard
              key={index}
              title={item.title}
              content={item.content}
              image={item.image} 
              blogId={item.blogId}            />
          ))}
          </ScrollView>
        </ScrollView>
      )}

      {/* Modal ยืนยัน */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-xl ">
            <Text className="font-sans text-headline font-bold text-primary mb-4 text-center">
              ยืนยันการเริ่มต้นประเมิน
            </Text>
            <Text className="font-sans text-description text-center text-secondary mb-4">
              คุณต้องการเริ่มต้นสร้างการประเมินสุขภาพหรือไม่?
            </Text>
            {loading ? (
              <ActivityIndicator size="large" color="#3972F0" className="my-4" />
            ) : (
              <View className="flex-row justify-around mt-2">
                <Pressable
                  onPress={() => setShowModal(false)}
                  className="mt-2 px-10 py-4 rounded-xl"
                >
                  <Text className="text-secondary text-description font-bold font-sans">
                    ยกเลิก
                  </Text>
                </Pressable>
                <Pressable
                  onPress={handleConfirm}
                  className="bg-primary mt-2 px-10 py-4 rounded-xl"
                >
                  <Text className="font-sans text-description font-bold text-white">
                    ยืนยัน
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

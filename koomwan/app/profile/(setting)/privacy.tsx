import { View, Text, SafeAreaView, ScrollView } from "react-native";
import React from "react";
import Card from "../../../global/components/Card";
import BackButton from "../../../global/components/BackButton";
import BreakLine from "../../../global/components/BreakLine";

export default function PrivacyPolicycreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        <BackButton title="ย้อนกลับ" />
        <Card>
          <View className="flex-col items-center w-full mb-4">
            <Text className="text-title font-bold text-secondary">
              นโยบายความเป็นส่วนตัว
            </Text>
            <BreakLine />
            <Text className="text-description font-regular">
              {"ปรับปรุงล่าสุด: 29/11/2024\n\n"}
              {
                "     คุมหวาน เราให้ความสำคัญกับความเป็นส่วนตัวของคุณเป็นอย่างยิ่ง นโยบายนี้อธิบายถึงวิธีที่เรารวบรวมใช้และปกป้องข้อมูลส่วนบุคคลของคุณเมื่อคุณใช้แอปพลิเคชันของเรา\n\n"
              }
              {
                "     โปรดอ่านนโยบายนี้อย่างละเอียดเพื่อทำความเข้าใจสิทธิของคุณ\n\n"
              }
              {"1. ข้อมูลที่เรารวบรวม\n"}
              {
                "     เมื่อคุณใช้แอปพลิเคชัน เราอาจรวบรวมข้อมูลส่วนบุคคลต่อไปนี้\n\n"
              }
              {"   1.1 ข้อมูลที่คุณให้โดยตรง\n"}
              {"     • อีเมล\n"}
              {"     • เบอร์โทรศัพท์ (ถ้ามี)\n"}
              {
                "     • ข้อมูลสุขภาพ เช่น ระดับน้ำตาลในเลือด น้ำหนัก ส่วนสูง อาการทางสุขภาพ\n       และข้อมูลที่เกี่ยวข้องกับโรคเบาหวาน\n\n"
              }
              {"   1.2 ข้อมูลที่เรารวบรวมโดยอัตโนมัติ\n"}
              {
                "     • พฤติกรรมการใช้งานแอปพลิเคชัน เช่น ฟีเจอร์ที่คุณใช้และเวลาที่ใช้\n\n"
              }
              {"   1.3 ข้อมูลจากบุคคลที่สาม\n"}
              {
                "     เราอาจได้รับข้อมูลเพิ่มเติมเกี่ยวกับคุณจากบุคคลที่สาม เช่น บริการเชื่อมต่อบัญชีผ่าน Google หรือ Facebook\n\n"
              }
              {"2. การใช้ข้อมูลของคุณ\n"}
              {"     ข้อมูลส่วนบุคคลของคุณจะถูกนำไปใช้เพื่อ\n"}
              {"     • จัดการและปรับปรุงประสบการณ์การใช้งานแอปพลิเคชัน\n"}
              {
                "     • ส่งการแจ้งเตือนที่เกี่ยวข้องกับสุขภาพ เช่น การแจ้งเตือนการวัดระดับน้ำตาลหรือการนัดหมาย\n"
              }
              {"     • วิเคราะห์ข้อมูลเพื่อปรับปรุงประสิทธิภาพของแอปพลิเคชัน\n"}
              {"     • ติดต่อคุณเพื่อให้บริการสนับสนุนเกี่ยวกับแอปพลิเคชัน\n\n"}
              {
                "     หากคุณมีข้อสงสัยเกี่ยวกับเงื่อนไขการให้บริการนี้ กรุณาติดต่อเราได้ที่\n     notavailable@unknown.com"
              }
            </Text>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

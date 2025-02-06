import { View, Text, SafeAreaView, ScrollView } from "react-native";
import React from "react";
import Card from "../../../global/components/Card";
import BackButton from "../../../global/components/BackButton";
import BreakLine from "../../../global/components/BreakLine";

export default function TermAndCondScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        <BackButton title="ย้อนกลับ" />
        <Card>
          <View className="flex-col items-center w-full mb-4">
            <Text className="text-title font-bold text-secondary">
              เงื่อนไขการให้บริการ
            </Text>
            <BreakLine />
            <Text className="text-description font-regular">
              {"ปรับปรุงล่าสุด: 29/11/2024\n\n"}
              {
                "     ยินดีต้อนรับสู่ คุมหวาน แอปพลิเคชันนี้ออกแบบมาเพื่อช่วยให้ผู้ใช้งานสามารถติดตามและจัดการข้อมูลสุขภาพเกี่ยวกับโรคเบาหวานได้อย่างมีประสิทธิภาพ\n"
              }
              {
                "     การใช้บริการของเราแสดงว่าคุณยอมรับและตกลงที่จะปฏิบัติตามเงื่อนไขการให้บริการนี้ กรุณาอ่านเอกสารนี้อย่างละเอียด\n\n"
              }
              {"1. การยอมรับเงื่อนไข\n"}
              {
                "     โดยการใช้หรือเข้าถึงแอปพลิเคชัน คุมหวาน คุณตกลงที่จะปฏิบัติตามเงื่อนไขการให้บริการนี้ หากคุณไม่เห็นด้วยกับเงื่อนไขใด ๆ กรุณาหยุดใช้แอปพลิเคชันทันที\n\n"
              }
              {"2. การใช้งานแอปพลิเคชันนี้\n"}
              {"     2.1 การสร้างบัญชี\n"}
              {
                "          ผู้ใช้บางฟีเจอร์อาจต้องลงทะเบียนและสร้างบัญชี โดยคุณต้องให้ข้อมูลที่ถูกต้องและอัปเดตข้อมูลดังกล่าวให้เป็นปัจจุบัน\n"
              }
              {"     2.2 ความปลอดภัยของบัญชี\n"}
              {
                "          คุณมีหน้าที่รับผิดชอบในการรักษาความลับของข้อมูลบัญชีและแจ้งให้เราทราบทันทีหากพบการใช้งานโดยไม่ได้รับอนุญาต\n\n"
              }
              {"3. ความเป็นส่วนตัว\n"}
              {
                "     การใช้แอปพลิเคชันนี้อยู่ภายใต้นโยบายความเป็นส่วนตัวของเรา ซึ่งระบุถึงวิธีการที่เรารวบรวมใช้และจัดการข้อมูลส่วนบุคคลของคุณ\n\n"
              }
              {
                "     หากคุณมีข้อสงสัยเกี่ยวกับเงื่อนไขการให้บริการนี้ กรุณาติดต่อเราได้ที่ notavailable@unknown.com"
              }
            </Text>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

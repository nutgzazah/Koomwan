/**
 * ไฟล์ utility สำหรับจัดการเกี่ยวกับวันที่
 */

/**
 * รับวันที่ปัจจุบันในรูปแบบ YYYY-MM-DD ตามเวลาท้องถิ่น
 * @returns วันที่ในรูปแบบ string (YYYY-MM-DD)
 */
export const getTodayLocalDate = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // เดือนเริ่มจาก 0
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  
  /**
   * แปลงวันที่จาก Date object เป็น string ในรูปแบบ YYYY-MM-DD
   * @param date - Date object ที่ต้องการแปลง
   * @returns วันที่ในรูปแบบ string (YYYY-MM-DD)
   */
  export const formatDateToYYYYMMDD = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  
  /**
   * ตรวจสอบว่าวันที่ที่ส่งมาอยู่ในอดีตหรือไม่
   * @param dateStr - วันที่ในรูปแบบ YYYY-MM-DD
   * @returns true ถ้าวันที่อยู่ในอดีต, false ถ้าเป็นวันนี้หรือในอนาคต
   */
  export const isDateInPast = (dateStr: string): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(dateStr);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate < today;
  };
  
  /**
   * เพิ่มเวลาในรูปแบบไทย (HH:MM น.) ให้กับ string วันที่
   * @param dateString - วันที่ในรูปแบบที่สามารถสร้าง Date object ได้
   * @returns เวลาในรูปแบบ "HH:MM น."
   */
  export const formatTimeToThai = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")} น.`;
    } catch (error) {
      console.error("Error formatting Thai time:", error);
      return dateString; // คืนค่าเดิมถ้ามีข้อผิดพลาด
    }
  };
  
  /**
   * สร้าง Date object ของเที่ยงคืนวันถัดไป
   * @returns Date object ของเที่ยงคืนวันถัดไป
   */
  export const getNextMidnight = (): Date => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
  };
  
  /**
   * คำนวณเวลาที่เหลือจนถึงเที่ยงคืน (มิลลิวินาที)
   * @returns จำนวนมิลลิวินาทีที่เหลือจนถึงเที่ยงคืน
   */
  export const getMillisecondsUntilMidnight = (): number => {
    const now = new Date();
    const midnight = getNextMidnight();
    return midnight.getTime() - now.getTime();
  };
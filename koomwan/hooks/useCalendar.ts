import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import BASE_URL from '../config';
import { useState, useEffect, useCallback } from 'react';

// Type definitions
export type MedicationLog = {
  time: string;
  medications: Array<{
    id: string;
    name: string;
    taken: boolean;
    type?: string;
    description?: string;
    isPastMedication?: boolean; // เพิ่มฟิลด์เพื่อระบุว่าเป็นยาในวันก่อนๆหรือไม่
  }>;
};

export type HealthLog = {
  id: string;
  time: string;
  height?: number;
  weight?: number;
  blood_sugar_level?: number;
  blood_pressure?: {
    systolic?: number;
    diastolic?: number;
  };
  a1c?: number;
  mood?:
    | "laughing"
    | "happy"
    | "neutral"
    | "irritated"
    | "sick"
    | "crying"
    | "angry"
    | "none";
  // เพิ่มฟิลด์สำหรับเก็บข้อมูลยาเพิ่มเติม
  additionalPills?: Array<{
    id: string;
    name: string;
    taken?: boolean;
    type?: string;
    description?: string;
  }>;
};

export type DayData = {
  medications: MedicationLog[];
  healthLogs: HealthLog[];
};

// Format date to YYYY-MM-DD
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Format time from Date object to Thai format
const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.';
};

// Check if date is in the past
const isDateInPast = (dateStr: string): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(dateStr);
  compareDate.setHours(0, 0, 0, 0);
  return compareDate < today;
};

/**
 * ฟังก์ชันสำหรับประมวลผลข้อมูลที่ได้จาก API อย่างปลอดภัย
 * รองรับหลายรูปแบบของข้อมูลที่อาจได้รับจาก API
 */
const safelyExtractRecords = (response: any): any[] => {
  if (!response) return [];
  
  // ตรวจสอบทุกรูปแบบที่เป็นไปได้
  if (Array.isArray(response)) {
    return response;
  } else if (response.data && Array.isArray(response.data)) {
    return response.data;
  } else if (response.records && Array.isArray(response.records)) {
    return response.records;
  } else if (response.record && typeof response.record === 'object') {
    return [response.record];
  } else if (typeof response === 'object' && response._id) {
    return [response];
  }
  
  // ถ้าไม่ตรงกับรูปแบบใดเลย
  console.warn("Unknown API response format:", response);
  return [];
};

/**
 * Custom hook for managing calendar data
 */
export const useCalendarData = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [markedDates, setMarkedDates] = useState<{
    [key: string]: {
      marked: boolean;
      dotColor: string;
    };
  }>({});
  const [dayData, setDayData] = useState<{ [key: string]: DayData }>({});
  const [error, setError] = useState<string | null>(null);

  // Fetch calendar data from API
  const fetchCalendarData = useCallback(async () => {
    try {
      setError(null);
      
      // Get auth data from local storage
      const authData = await AsyncStorage.getItem("@auth");

      if (!authData) {
        setError("กรุณาเข้าสู่ระบบใหม่");
        throw new Error("Session expired or user not logged in");
      }

      // Parse auth data
      const auth = JSON.parse(authData);
      const token = auth.token;
      const userId = auth.user._id;
      const userHealthInfoId = auth.user.healthinfo;

      if (!userHealthInfoId) {
        setError("ไม่พบข้อมูลสุขภาพ");
        throw new Error("Health info not found");
      }

      // Process the data
      const newMarkedDates: { [key: string]: { marked: boolean; dotColor: string } } = {};
      const newDayData: { [key: string]: DayData } = {};

      // ทำ Promise.allSettled เพื่อให้ไม่เกิด error ถ้า request ใด request หนึ่งล้มเหลว
      const [recordsResult, healthInfoResult] = await Promise.allSettled([
        // Fetch records
        axios.get(`${BASE_URL}/api/v1/user/getRecord/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        
        // Fetch health info to get regular pills
        axios.get(`${BASE_URL}/api/v1/user/healthinfo/${userHealthInfoId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      // ประมวลผลข้อมูล records ถ้าการเรียก API สำเร็จ
      if (recordsResult.status === 'fulfilled') {
        // ใช้ฟังก์ชันที่ปรับปรุงเพื่อรองรับหลายรูปแบบข้อมูล
        const records = safelyExtractRecords(recordsResult.value.data);
        
        if (records.length === 0) {
          console.log("Warning: No records found in API response");
        }
        
        records.forEach((record: any) => {
          if (!record || !record.recordtime) {
            console.warn("Invalid record or missing recordtime:", record);
            return;
          }
          
          const recordDate = formatDate(new Date(record.recordtime));
          
          // Mark the date
          newMarkedDates[recordDate] = { marked: true, dotColor: "#3972F0" };
          
          // Initialize data for this day if not already done
          if (!newDayData[recordDate]) {
            newDayData[recordDate] = { medications: [], healthLogs: [] };
          }

          // สร้าง health log
          const healthLog: HealthLog = {
            id: record._id,
            time: formatTime(record.recordtime),
            height: record.height,
            weight: record.weight,
            mood: record.moodstatus || "none",
          };

          if (record.bloodsugar) healthLog.blood_sugar_level = record.bloodsugar;
          if (record.a1c) healthLog.a1c = record.a1c;
          if (record.bloodpressure && (record.bloodpressure.systolic || record.bloodpressure.diastolic)) {
            healthLog.blood_pressure = {
              systolic: record.bloodpressure.systolic,
              diastolic: record.bloodpressure.diastolic
            };
          }

          // เพิ่ม additional pills เข้าไปใน health log
          if (record.additionpill && record.additionpill.length > 0) {
            healthLog.additionalPills = record.additionpill.map((pill: any) => ({
              id: pill._id,
              name: pill.pillName,
              taken: true, // เนื่องจากเป็นยาที่บันทึกแล้ว จึงถือว่าทานแล้ว
              type: pill.pillType,
              description: pill.description
            }));
          }

          newDayData[recordDate].healthLogs.push(healthLog);
        });
      } else {
        console.warn('Failed to fetch records:', recordsResult.reason);
      }

      // ประมวลผลข้อมูล healthInfo ถ้าการเรียก API สำเร็จ
      let regularPills: any[] = [];
      if (healthInfoResult.status === 'fulfilled') {
        const healthInfoData = healthInfoResult.value.data;
        
        // ตรวจสอบรูปแบบข้อมูลจาก API
        if (healthInfoData && healthInfoData.regularpill) {
          regularPills = healthInfoData.regularpill;
        } else if (healthInfoData && healthInfoData.healthInfo && healthInfoData.healthInfo.regularpill) {
          regularPills = healthInfoData.healthInfo.regularpill;
        } else {
          console.warn("Could not find regularpill in healthInfo response:", healthInfoData);
        }
      } else {
        console.warn('Failed to fetch health info:', healthInfoResult.reason);
      }

      // Process regular pills (for past, today and future days)
      if (regularPills.length > 0) {
        // วันที่ย้อนหลัง, วันนี้, และวันในอนาคต
        const currentDate = new Date();
        
        // กำหนดช่วงเวลา
        const daysInPast = 21;    // เก็บข้อมูลย้อนหลัง 21 วัน
        const daysInFuture = 7;   // เก็บข้อมูลล่วงหน้า 7 วัน
        
        // สร้างช่วงวันที่จะแสดงในปฏิทิน
        const datesToShow: string[] = [];
        
        // เพิ่มวันย้อนหลัง
        for (let i = daysInPast; i > 0; i--) {
          const date = new Date(currentDate);
          date.setDate(date.getDate() - i);
          datesToShow.push(formatDate(date));
        }
        
        // เพิ่มวันปัจจุบัน
        datesToShow.push(formatDate(currentDate));
        
        // เพิ่มวันในอนาคต
        for (let i = 1; i <= daysInFuture; i++) {
          const date = new Date(currentDate);
          date.setDate(date.getDate() + i);
          datesToShow.push(formatDate(date));
        }
        
        regularPills.forEach((pill: any) => {
          if (pill.reminderTimes && pill.reminderTimes.length > 0) {
            pill.reminderTimes.forEach((reminderTime: string) => {
              // แยกเวลาและวันที่ต้องแจ้งเตือน
              let timeStr = '';
              let dayPattern = '';
              
              if (reminderTime.includes('/')) {
                // รูปแบบ "Everyday/08:00" หรือ "Mon/20:00"
                const parts = reminderTime.split('/');
                dayPattern = parts[0].toLowerCase(); // everyday, mon, tue, ...
                timeStr = parts[1]; // เวลา เช่น 08:00
              } else {
                // รูปแบบเวลาอย่างเดียว "08:00"
                timeStr = reminderTime;
                dayPattern = 'everyday'; // ถ้าไม่ระบุวัน ถือว่าเป็นทุกวัน
              }
              
              // จัดการนำยาเข้าวันที่ตรงกับรูปแบบที่กำหนด
              datesToShow.forEach(dateStr => {
                const date = new Date(dateStr);
                const dayOfWeek = date.getDay(); // 0 = อาทิตย์, 1 = จันทร์, ...
                const isPast = isDateInPast(dateStr);
                
                // ตรวจสอบว่าวันนี้ตรงกับรูปแบบหรือไม่
                const shouldShowPill = 
                  dayPattern === 'everyday' || 
                  (dayPattern === 'mon' && dayOfWeek === 1) ||
                  (dayPattern === 'tue' && dayOfWeek === 2) ||
                  (dayPattern === 'wed' && dayOfWeek === 3) ||
                  (dayPattern === 'thu' && dayOfWeek === 4) ||
                  (dayPattern === 'fri' && dayOfWeek === 5) ||
                  (dayPattern === 'sat' && dayOfWeek === 6) ||
                  (dayPattern === 'sun' && dayOfWeek === 0);
                
                if (shouldShowPill) {
                  // เตรียมข้อมูลสำหรับวันนี้
                  if (!newDayData[dateStr]) {
                    newDayData[dateStr] = { medications: [], healthLogs: [] };
                    newMarkedDates[dateStr] = { marked: true, dotColor: "#3972F0" };
                  }
                  
                  // จัดการเวลา
                  const timeDisplay = timeStr.endsWith('น.') ? timeStr : `${timeStr} น.`;

                  // ตรวจสอบว่ามีเวลานี้ในข้อมูลแล้วหรือไม่
                  // ปรับเพื่อป้องกัน key ซ้ำ
                  const existingMedicationLogIndex = newDayData[dateStr].medications.findIndex(
                    log => log.time === timeDisplay
                  );
                  
                  if (existingMedicationLogIndex === -1) {
                    // ถ้ายังไม่มี ให้สร้างใหม่
                    const newMedicationLog = {
                      time: timeDisplay,
                      medications: [{
                        id: pill._id,
                        name: pill.pillName,
                        taken: false, // ยาประจำเริ่มต้นยังไม่ได้ทาน
                        type: pill.pillType,
                        description: pill.description,
                        isPastMedication: isPast // เพิ่มการระบุว่าเป็นยาในอดีตหรือไม่
                      }]
                    };
                    newDayData[dateStr].medications.push(newMedicationLog);
                  } else {
                    // ถ้ามีแล้ว ให้เพิ่มยาในรายการที่มีอยู่
                    newDayData[dateStr].medications[existingMedicationLogIndex].medications.push({
                      id: pill._id,
                      name: pill.pillName,
                      taken: false,
                      type: pill.pillType,
                      description: pill.description,
                      isPastMedication: isPast
                    });
                  }
                }
              });
            });
          }
        });
      }

      // ถ้าไม่มีข้อมูลทั้ง records และ regularPills
      if (Object.keys(newMarkedDates).length === 0 && Object.keys(newDayData).length === 0) {
        // แม้ไม่มีข้อมูล แต่ยังต้องสร้างข้อมูลสำหรับวันนี้เพื่อแสดงในปฏิทิน
        const today = formatDate(new Date());
        newDayData[today] = { medications: [], healthLogs: [] };
      }

      console.log("Calendar data prepared:", {
        markedDates: Object.keys(newMarkedDates).length,
        dayData: Object.keys(newDayData).length
      });
      
      setMarkedDates(newMarkedDates);
      setDayData(newDayData);
      return { newMarkedDates, newDayData };
    } catch (error: any) {
      console.error("Error fetching calendar data:", error);
      setError(error.message || "ไม่สามารถโหลดข้อมูลปฏิทินได้");
      // ไม่ throw error เพื่อป้องกันแอปพลิเคชันล่ม
      return { newMarkedDates: {}, newDayData: {} };
    }
  }, []);

  // Load calendar data
  const loadCalendarData = useCallback(async () => {
    try {
      setLoading(true);
      await fetchCalendarData();
    } catch (error) {
      console.error("Error loading calendar data:", error);
      // Error handling already done in fetchCalendarData
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [fetchCalendarData]);

  // Refresh calendar data
  const refreshCalendarData = useCallback(async () => {
    setRefreshing(true);
    loadCalendarData();
  }, [loadCalendarData]);

  // Update pill status
  const updatePillStatus = useCallback(async (
    pillId: string,
    recordDate: string,
    pillTime: string,
    taken: boolean
  ): Promise<boolean> => {
    try {
      // Check if the date is in the past
      if (isDateInPast(recordDate)) {
        console.warn("Cannot update pill status for past dates");
        return false;
      }

      // Get auth data from local storage
      const authData = await AsyncStorage.getItem("@auth");

      if (!authData) {
        console.error("Session expired or user not logged in");
        return false;
      }

      // Parse auth data
      const auth = JSON.parse(authData);
      const token = auth.token;
      
      // Send update request to API
      /* await axios.post(
        `${BASE_URL}/api/records/pill/status`,
        {
          pillId,
          date: recordDate,
          time: pillTime,
          taken
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      ); */
      // รอการเชื่อมต่อกับ API จริงๆ

      return true;
    } catch (error) {
      console.error("Error updating pill status:", error);
      return false;
    }
  }, []);

  // Handle pill status change in UI
  const handlePillStatusChange = useCallback(async (
    pillId: string,
    date: string,
    medicationTime: string,
    newStatus: boolean
  ) => {
    // ตรวจสอบว่าเป็นวันในอดีตหรือไม่
    if (isDateInPast(date)) {
      console.warn("Cannot change pill status for past dates");
      return; // ไม่อนุญาตให้เปลี่ยนสถานะยาในอดีต
    }
    
    // Clone the current state to avoid mutating it directly
    const newDayData = { ...dayData };
    const currentDayData = { ...newDayData[date] };
    
    if (!currentDayData) return;
    
    // Find and update the specific medication
    currentDayData.medications = currentDayData.medications.map(medicationLog => {
      if (medicationLog.time === medicationTime) {
        const updatedMedications = medicationLog.medications.map(medication => {
          if (medication.id === pillId) {
            return { ...medication, taken: newStatus };
          }
          return medication;
        });
        return { ...medicationLog, medications: updatedMedications };
      }
      return medicationLog;
    });
    
    // Update the state first for immediate UI feedback
    newDayData[date] = currentDayData;
    setDayData(newDayData);
    
    // Then send the update to the API
    try {
      const success = await updatePillStatus(
        pillId,
        date,
        medicationTime,
        newStatus
      );
      
      if (!success) {
        // Revert the change if the API update failed
        setError("ไม่สามารถอัปเดตสถานะยาได้");
        loadCalendarData(); // Reload data to ensure UI is in sync with server
      }
    } catch (error) {
      console.error("Error updating pill status:", error);
      setError("ไม่สามารถอัปเดตสถานะยาได้");
      loadCalendarData(); // Reload data to ensure UI is in sync with server
    }
  }, [dayData, loadCalendarData, updatePillStatus]);

  // Load data when the hook is initialized
  useEffect(() => {
    loadCalendarData();
  }, [loadCalendarData]);

  return {
    loading,
    refreshing,
    markedDates,
    dayData,
    error,
    loadCalendarData,
    refreshCalendarData,
    handlePillStatusChange
  };
};
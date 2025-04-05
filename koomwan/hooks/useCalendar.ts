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
  // ใช้ getFullYear, getMonth และ getDate เพื่อให้ได้วันที่ตามโซนเวลาท้องถิ่น
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // +1 เพราะ getMonth() เริ่มจาก 0
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
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
 * ฟังก์ชันสำหรับประมวลผลข้อมูลที่ได้จาก API 
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
      // วันที่ปัจจุบัน
    const today = formatDate(new Date());

    try {
      // เรียก API เพื่อสร้างข้อมูลประวัติย้อนหลังถ้ายังไม่มี
      await axios.post(
        `${BASE_URL}/api/v1/regular-pills/generate`,
        { 
          userId, 
          date: today,
          generateHistory: true // เพิ่มฟิลด์นี้เพื่อขอข้อมูลย้อนหลัง
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (error) {
      console.warn("Error ensuring historical medication trackings:", error);
    }
      // Process the data
      const newMarkedDates: { [key: string]: { marked: boolean; dotColor: string } } = {};
      const newDayData: { [key: string]: DayData } = {};

      // กำหนดช่วงวันที่
      const daysInPast = 60;    // เก็บข้อมูลย้อนหลัง 30 วัน
      const daysInFuture = 7;   // เก็บข้อมูลล่วงหน้า 7 วัน
      
      const currentDate = new Date();
      const startDate = new Date(currentDate);
      startDate.setDate(startDate.getDate() - daysInPast);
      
      const endDate = new Date(currentDate);
      endDate.setDate(endDate.getDate() + daysInFuture);
      
      // Format dates for API
      const startDateStr = formatDate(startDate);
      const endDateStr = formatDate(endDate);

      // ทำ Promise.allSettled เพื่อให้ไม่เกิด error ถ้า request ใด request หนึ่งล้มเหลว
      const [recordsResult, medicationTrackingsResult] = await Promise.allSettled([
        // Fetch health records
        axios.get(`${BASE_URL}/api/v1/user/getRecord/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        
        // Fetch medication trackings
        axios.get(`${BASE_URL}/api/v1/regular-pills/range/${userId}?startDate=${startDateStr}&endDate=${endDateStr}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      // ประมวลผลข้อมูล health records ถ้าการเรียก API สำเร็จ
      if (recordsResult.status === 'fulfilled') {
        // ใช้ฟังก์ชันที่ เพื่อรองรับหลายรูปแบบข้อมูล
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

          // Create health log
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

      // ประมวลผลข้อมูล medication trackings ถ้าการเรียก API สำเร็จ
      if (medicationTrackingsResult.status === 'fulfilled') {
        const trackingsResponse = medicationTrackingsResult.value.data;
        /* console.log("Medication trackings response:", JSON.stringify(trackingsResponse)); */
        
        if (trackingsResponse && trackingsResponse.success && trackingsResponse.data) {
          // Merge data from medication trackings
          const dateData = trackingsResponse.data;
          
          // Loop through each date in the response
          Object.keys(dateData).forEach(dateStr => {
            // Mark the date in calendar
            newMarkedDates[dateStr] = { marked: true, dotColor: "#3972F0" };
            
            // Initialize day data if needed
            if (!newDayData[dateStr]) {
              newDayData[dateStr] = { medications: [], healthLogs: [] };
            }
            
            // Add medication logs with proper field mapping
            if (dateData[dateStr].medications && dateData[dateStr].medications.length > 0) {
              // แปลงข้อมูลจาก API เป็นรูปแบบที่ component ต้องการ
              const mappedMedications = dateData[dateStr].medications.map((medicationLog: any) => {
                return {
                  time: medicationLog.time,
                  medications: medicationLog.medications.map((med: any) => {
                    return {
                      id: med.pillId || med.id, 
                      name: med.pillName || med.name || "ไม่ระบุชื่อยา", 
                      taken: med.isTaken || med.taken || false, // แปลง isTaken เป็น taken
                      type: med.type || med.pillType || "",
                      description: med.description || "",
                      isPastMedication: isDateInPast(dateStr)
                    };
                  })
                };
              });
              
              newDayData[dateStr].medications = mappedMedications;
            }
          });
        } else {
          console.warn("No medication tracking data or unexpected format:", trackingsResponse);
        }
      } else {
        console.warn('Failed to fetch medication trackings:', medicationTrackingsResult.reason);
      }

      // สร้างข้อมูลสำหรับวันนี้ถ้ายังไม่มี
      if (!newDayData[today]) {
        newDayData[today] = { medications: [], healthLogs: [] };
      }

      // ดึงรายการติดตามยาสำหรับวันนี้เพื่อให้แน่ใจว่ามีข้อมูลล่าสุด
      try {
        // ทำให้แน่ใจว่ามีรายการติดตามสำหรับวันนี้
        await axios.post(
          `${BASE_URL}/api/v1/regular-pills/generate`,
          { userId, date: today, generateHistory: true  },
          {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        // ดึงข้อมูลสำหรับวันนี้อีกครั้ง
        const todayTrackingsResponse = await axios.get(
          `${BASE_URL}/api/v1/regular-pills/daily/${userId}?date=${today}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        
        if (todayTrackingsResponse.data.success && todayTrackingsResponse.data.medicationLogs) {
          // แปลงข้อมูลให้ตรงกับโครงสร้างที่ component ต้องการ
          const mappedMedications = todayTrackingsResponse.data.medicationLogs.map((medicationLog: any) => {
            return {
              time: medicationLog.time,
              medications: medicationLog.medications.map((med: any) => {
                return {
                  id: med.pillId || med.id,
                  name: med.pillName || med.name || "ไม่ระบุชื่อยา",
                  taken: med.isTaken || med.taken || false,
                  type: med.type || med.pillType || "",
                  description: med.description || "",
                  isPastMedication: false 
                };
              })
            };
          });
          
          newDayData[today].medications = mappedMedications;
        }
      } catch (error) {
        console.warn("Error ensuring today's medication trackings:", error);
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

  // Update pill status using the API
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
      const userId = auth.user._id;
  
      // Using regular pills API to update status
      const response = await axios.post(
        `${BASE_URL}/api/v1/regular-pills/update-status`,
        {
          medicationId: pillId,
          userId: userId,
          status: taken ? 'taken' : 'pending',
          actualTime: pillTime.replace(' น.', '') // ตัด " น." ออก
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      return response.data.success;
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
    // Check if date is in the past
    if (isDateInPast(date)) {
      console.warn("Cannot change pill status for past dates");
      return; // Don't allow status change for past dates
    }
    
    // Clone current state to avoid direct mutation
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
    
    // Update state first for immediate UI feedback
    newDayData[date] = currentDayData;
    setDayData(newDayData);
    
    // Then send update to API
    try {
      const success = await updatePillStatus(
        pillId,
        date,
        medicationTime,
        newStatus
      );
      
      if (!success) {
        // Revert change if API update failed
        setError("ไม่สามารถอัปเดตสถานะยาได้");
        loadCalendarData(); // Reload data to ensure UI is in sync with server
      }
    } catch (error) {
      console.error("Error updating pill status:", error);
      setError("ไม่สามารถอัปเดตสถานะยาได้");
      loadCalendarData(); // Reload data to ensure UI is in sync with server
    }
  }, [dayData, loadCalendarData, updatePillStatus]);

  // Load data on hook initialization
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
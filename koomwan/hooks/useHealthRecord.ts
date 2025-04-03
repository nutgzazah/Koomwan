import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import BASE_URL from '../config';

export type BloodPressure = {
  systolic: number;
  diastolic: number;
};

export type MedicationItem = {
  pill_name: string;
  pill_id: string;
  pill_type: string;
  description?: string;
  pill_image?: string;
};

export type HealthRecordData = {
  id: string;
  date: string;
  time: string;
  mood?: 'laughing' | 'happy' | 'neutral' | 'irritated' | 'sick' | 'crying' | 'angry' | 'none';
  weight?: number;
  height?: number;
  blood_pressure?: BloodPressure;
  blood_sugar_level?: number;
  a1c?: number;
  medications?: MedicationItem[];
};


// Format date to Thai format with fallback
const formatThaiDate = (dateStr: string | Date): string => {
  try {
    const thaiDate = new Date(dateStr);
    
    // Check if date is valid
    if (isNaN(thaiDate.getTime())) {
      console.warn('Invalid date:', dateStr);
      return 'ไม่พบข้อมูลวันที่';
    }
    
    return thaiDate.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      era: 'short',
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'ไม่พบข้อมูลวันที่';
  }
};

// Format time to Thai format with fallback
const formatThaiTime = (dateStr: string | Date): string => {
  try {
    const thaiDate = new Date(dateStr);
    
    // Check if date is valid
    if (isNaN(thaiDate.getTime())) {
      console.warn('Invalid time:', dateStr);
      return 'ไม่พบข้อมูลเวลา';
    }
    
    return thaiDate.toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
    }) + ' น.';
  } catch (error) {
    console.error('Error formatting time:', error);
    return 'ไม่พบข้อมูลเวลา';
  }
};

export const useHealthRecord = (recordId: string) => {
  const [loading, setLoading] = useState(true);
  const [record, setRecord] = useState<HealthRecordData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHealthRecord = async () => {
      if (!recordId) {
        setError('ไม่พบข้อมูลบันทึกสุขภาพ');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Get auth data from local storage
        const authData = await AsyncStorage.getItem("@auth");

        if (!authData) {
          setError("กรุณาเข้าสู่ระบบใหม่");
          setLoading(false);
          return;
        }

        // Parse auth data
        const auth = JSON.parse(authData);
        const token = auth.token;
        const userId = auth.user._id;

        // Log for debugging
        console.log(`Fetching records for user: ${userId}, looking for record: ${recordId}`);
        
        // Use the getRecord endpoint to get all records
        const response = await axios.get(
          `${BASE_URL}/api/v1/user/getRecord/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log('API Response status:', response.status);
        
        if (!response.data || response.status !== 200) {
          throw new Error('ไม่พบข้อมูล');
        }

        // Extract all records from the response
        let records = Array.isArray(response.data) ? response.data : 
                    (response.data.records ? response.data.records : []);
        
        console.log(`Found ${records.length} records total`);
        
        // Find the specific record with the matching ID
        const recordData = records.find((rec: any) => rec._id === recordId);
        
        if (!recordData) {
          console.error(`Record with ID ${recordId} not found in response`);
          throw new Error('ไม่พบข้อมูลบันทึกที่ต้องการ');
        }
        
        console.log('Found matching record:', JSON.stringify(recordData, null, 2));
        
        // Handle date formatting specially for MongoDB date objects
        let recordDate;
        let recordTime;
        
        if (recordData.recordtime) {
          // Handle MongoDB date format which might be an object or string
          if (typeof recordData.recordtime === 'object' && recordData.recordtime.$date) {
            // MongoDB date format
            recordDate = formatThaiDate(new Date(recordData.recordtime.$date));
            recordTime = formatThaiTime(new Date(recordData.recordtime.$date));
          } else {
            // Regular date string
            recordDate = formatThaiDate(recordData.recordtime);
            recordTime = formatThaiTime(recordData.recordtime);
          }
        } else {
          recordDate = 'ไม่พบข้อมูลวันที่';
          recordTime = 'ไม่พบข้อมูลเวลา';
        }

        // Create health record object with safety checks
        const healthRecord: HealthRecordData = {
          id: recordData._id || recordId,
          date: recordDate,
          time: recordTime,
          weight: typeof recordData.weight === 'number' ? recordData.weight : undefined,
          height: typeof recordData.height === 'number' ? recordData.height : undefined,
          mood: recordData.moodstatus || "none",
          blood_sugar_level: typeof recordData.bloodsugar === 'number' ? recordData.bloodsugar : undefined,
          a1c: typeof recordData.a1c === 'number' ? recordData.a1c : undefined,
          medications: []
        };

        // Add blood pressure if available (with safety checks)
        if (recordData.bloodpressure) {
          const systolic = recordData.bloodpressure.systolic;
          const diastolic = recordData.bloodpressure.diastolic;
          
          if (typeof systolic === 'number' || typeof diastolic === 'number') {
            healthRecord.blood_pressure = {
              systolic: typeof systolic === 'number' ? systolic : 0,
              diastolic: typeof diastolic === 'number' ? diastolic : 0
            };
          }
        }

        // Add medications if available (with safety checks)
        if (recordData.additionpill && Array.isArray(recordData.additionpill) && recordData.additionpill.length > 0) {
          healthRecord.medications = recordData.additionpill.map((pill: any) => {
            // Handle MongoDB ObjectId format
            let pillId = '';
            if (pill._id) {
              pillId = typeof pill._id === 'string' ? pill._id : 
                       (pill._id.$oid ? pill._id.$oid : '');
            }
            
            return {
              pill_id: pillId || '',
              pill_name: pill.pillName || 'ไม่ระบุชื่อยา',
              pill_type: pill.pillType || '',
              description: pill.description || '',
              pill_image: pill.pillImage || ''
            };
          });
        }

        console.log('Processed health record:', healthRecord);
        
        setRecord(healthRecord);
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching health record:', err);
        setError(err.message || 'ไม่สามารถโหลดข้อมูลบันทึกสุขภาพได้');
        setLoading(false);
      }
    };

    fetchHealthRecord();
  }, [recordId]);

  return { loading, record, error };
};
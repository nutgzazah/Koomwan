export interface ForumDataInterface {
  forum_id: string;
  user_id: string; 
  username: string; 
  text: string;
  date_and_time: string;
  like: number;
  doctor_id?: string;
  doctor_comment?: string;
  title_report?: string;
  reason_report?: string;
}

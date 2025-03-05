export const statusMapping: { [key: string]: string } = {
    pending: "รออนุมัติ",
    approve: "อนุมัติ",
    disapprove: "ไม่อนุมัติ",
  };

export const statusReport: { [key: string]: string } = {
    pending: "รอการจัดการ",
    completed: "จัดการแล้ว",
};

export const ForumReportTitle: { [key: string]: string } = {
  Spam: "สแปม",
  HateSpeech: "คำพูดรุนแรง",
  Misinformation: "ข้อมูลเท็จ",
  Harassment: "การคุกคาม",
  InappropriateContent: "เนื้อหาไม่เหมาะสม",
  Other: "อื่นๆ",
};
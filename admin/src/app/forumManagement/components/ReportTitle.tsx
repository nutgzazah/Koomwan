import React from "react";

interface ReportTitleProps {
  title: "Spam" | "HateSpeech" | "Misinformation" | "Harassment" | "InappropriateContent" | "Other";
}

export default function ReportTitle({ title }: ReportTitleProps) {
  const translatedTitle = 
    title === "Spam" ? "สแปม" :
    title === "HateSpeech" ? "คำพูดรุนแรง" :
    title === "Misinformation" ? "ข้อมูลเท็จ" :
    title === "Harassment" ? "การคุกคาม" :
    title === "InappropriateContent" ? "เนื้อหาไม่เหมาะสม" :
    title === "Other" ? "อื่นๆ" :
    "ไม่ระบุ";

  return <span className="text-detail_2">{translatedTitle}</span>;
}

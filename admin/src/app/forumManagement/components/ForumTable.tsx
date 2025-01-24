'use client';

import React from "react";
import { useRouter } from "next/navigation";
import Table from "@/components/Table";
import { ForumDataInterface } from "@/interfaces/forumInterface";
import forums from "@/data/forum.json";

const ForumTable: React.FC = () => {
  const router = useRouter();

  const headers = ["ลำดับ", "ชื่อบัญชีผู้ใช้", "หัวข้อรายงาน", "เนื้อหาโพส", "วันที่โพส", "สถานะ"];

  const sanitizedData: ForumDataInterface[] = forums.map((forum) => ({
    forum_id: forum.forum_id || "",
    user_id: forum.user_id || "ไม่ระบุ",
    text: forum.text || "ไม่มีเนื้อหา",
    date_and_time: forum.date_and_time || "ไม่ระบุวันที่",
    like: forum.like || 0,
    doctor_id: forum.doctor_id ?? undefined,
    doctor_comment: forum.doctor_comment ?? undefined,
    title_report: forum.title_report || "ไม่มีหัวข้อ",
    reason_report: forum.reason_report || "ไม่มีสถานะ",
  }));

  const data: (string | React.ReactNode)[][] = sanitizedData.map((forum, index) => [
    (index + 1).toString(),
    forum.user_id,
    forum.title_report,
    forum.text,
    forum.date_and_time,
    forum.reason_report,
  ]);

  const handleRowClick = (rowData: React.ReactNode[]) => {
    const rowIndex = parseInt(rowData[0] as string, 10) - 1;
    const selectedForum = sanitizedData[rowIndex];
    if (selectedForum && selectedForum.forum_id) {
      router.push(`/forumManagement/${selectedForum.forum_id}`);
    } else {
      console.warn("Invalid forum ID:", selectedForum?.forum_id);
    }
  };

  return (
    <div>
      <Table headers={headers} data={data} onRowClick={handleRowClick} />
    </div>
  );
};

export default ForumTable;

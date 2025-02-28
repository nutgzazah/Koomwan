'use client';

import React from "react";
import { useRouter } from "next/navigation";
import Table from "@/components/Table";
import forums from "@/data/forum.json";

const ForumTable: React.FC = () => {
  const router = useRouter();

  const headers = ["ลำดับ", "ชื่อบัญชีผู้ใช้", "หัวข้อรายงาน", "เนื้อหาโพส", "วันที่โพส", "จำนวนครั้งที่ถูกรายงาน"];

  const data = forums.map((forum, index) => [
    index + 1,
    forum.username,
    forum.title_report,
    forum.text,
    forum.date_and_time,
    forum.report_count ?? 0,
  ]);

  const columnAlignment = [
    "text-center", // ลำดับ
    "text-left",   // ชื่อบัญชีผู้ใช้
    "text-left",   // หัวข้อรายงาน
    "text-left",   // เนื้อหาโพส
    "text-center", // วันที่โพส
    "text-center", // จำนวนครั้งที่ถูกรายงาน
  ];

  const columnWidths = [
    "w-12",  // ลำดับ
    "w-24",  // ชื่อบัญชีผู้ใช้
    "w-20",  // หัวข้อรายงาน
    "w-44",  // เนื้อหาโพส
    "w-24",  // วันที่โพส
    "w-24",  // จำนวนครั้งที่ถูกรายงาน
  ];

  const handleRowClick = (rowData: React.ReactNode[]) => {
    const forumIndex = Number(rowData[0]) - 1;
    const selectedForum = forums[forumIndex];
    if (selectedForum && selectedForum.forum_id) {
      router.push(`/forumManagement/${selectedForum.forum_id}`);
    } else {
      console.warn("Invalid forum ID:", selectedForum?.forum_id);
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table 
  headers={headers} 
  data={data} 
  onRowClick={handleRowClick} 
  columnAlignment={columnAlignment} 
  columnWidths={columnWidths} 
  className="w-full table-fixed border-collapse" // Change to table-fixed
/>

    </div>
  );
};

export default ForumTable;

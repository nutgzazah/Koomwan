'use client';

import React from "react";
import { useRouter } from "next/navigation";
import Table from "@/components/Table";
import { ForumDataInterface } from "@/interfaces/forumInterface";
import { formatDate } from "@/utils/formatDate.";

interface ForumTableProps {
  forums: ForumDataInterface[];
}

const ForumTable: React.FC<ForumTableProps> = ({ forums }) => {
  const router = useRouter();

  const headers = [
    "ลำดับ", 
    "ชื่อบัญชีผู้ใช้", 
    "เนื้อหาโพสต์", 
    "วันที่โพสต์", 
    "จำนวนครั้งที่ถูกรายงาน"
  ];

  const data = forums.map((forum, index) => [
    index + 1,
    forum.postedBy?.username || "ไม่พบข้อมูล", 
    forum.title,
    forum.createdAt ? formatDate(forum.createdAt).toLocaleString() : "ไม่ระบุ",
    forum.reports?.count ?? 0,
  ]);

  const columnAlignment = [
    "text-center", // ลำดับ
    "text-left",   // ชื่อบัญชีผู้ใช้
    "text-left",   // เนื้อหาโพสต์
    "text-center", // วันที่โพสต์
    "text-center", // จำนวนครั้งที่ถูกรายงาน
  ];

  const columnWidths = [
    "w-12",  // ลำดับ
    "w-24",  // ชื่อบัญชีผู้ใช้
    "w-48",  // เนื้อหาโพสต์
    "w-32",  // วันที่โพสต์
    "w-24",  // จำนวนครั้งที่ถูกรายงาน
  ];

  const handleRowClick = (rowData: React.ReactNode[]) => {
    const forumIndex = Number(rowData[0]) - 1;
    const forum = forums[forumIndex];

    if (forum?._id) {
      router.push(`/forumManagement/${forum._id}`);
    } else {
      console.warn("Invalid forum ID:", forum?._id);
    }
  };

  return (
    <div>
      <Table 
        headers={headers} 
        data={data} 
        onRowClick={handleRowClick} 
        columnAlignment={columnAlignment} 
        columnWidths={columnWidths} 
      />
    </div>
  );
};

export default ForumTable;

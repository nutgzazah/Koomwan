'use client';

import React from "react";
import { useRouter } from "next/navigation";
import Table from "@/components/Table";
import forums from "@/data/forum.json";

const ForumTable: React.FC = () => {
  const router = useRouter();

  const headers = ["ลำดับ", "ชื่อบัญชีผู้ใช้", "หัวข้อรายงาน", "เนื้อหาโพส", "วันที่โพส"];

  const data = forums.map((forum, index) => [
    index + 1.,
    forum.username,
    forum.title_report,
    forum.text,
    forum.date_and_time,
  ]);

  const handleRowClick = (rowData: React.ReactNode[]) => {
    const forumIndex = Number(rowData[0]); 
    const selectedForum = forums[forumIndex - 1];
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

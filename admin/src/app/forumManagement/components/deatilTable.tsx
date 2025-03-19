'use client';

import React from "react";
import Table from "@/components/Table";
import { ForumReportTitle } from "@/utils/statusMapping";

interface ReportData {
  user?: {
    username?: string;
  };
  reason?: string;
}

interface DetailTableProps {
  forums?: ReportData[];
}

const DetailTable: React.FC<DetailTableProps> = ({ forums = [] }) => {
  const headers = [
    "ชื่อบัญชีผู้ใช้ที่ถูกรายงาน", 
    "ประเภทการรายงาน", 
  ];

  const columnAlignment = [
    "text-left",   // ชื่อบัญชีผู้ใช้
    "text-center", 
  ];

  const columnWidths = [
    "w-24",  // ชื่อบัญชีผู้ใช้
    "w-32", 
  ];

  const tableData = forums.map((report) => [
    report?.user?.username ?? "ไม่ระบุ",
    report?.reason && ForumReportTitle[report.reason] ? ForumReportTitle[report.reason] : "ไม่ระบุ",
  ]);  

  return (
    <div className="overflow-x-auto" style={{ maxHeight: forums.length > 4 ? '300px' : 'auto', overflowY: forums.length > 3 ? 'scroll' : 'visible' }}>
      <Table 
        headers={headers} 
        data={tableData} 
        columnAlignment={columnAlignment} 
        columnWidths={columnWidths} 
        className="w-full table-fixed border-collapse"
      />
    </div>
  );
};

export default DetailTable;

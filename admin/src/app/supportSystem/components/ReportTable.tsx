'use client';

import React from "react";
import { useRouter } from "next/navigation";
import Table from "@/components/Table";
import { ReportDataInterface } from "@/interfaces/reportInterface";

interface ReportTableProps {
  reports: ReportDataInterface[];
}

const ReportTable: React.FC<ReportTableProps> = ({ reports }) => {
  const router = useRouter();
  
  const isPending = reports.some(report => report.status === "pending");

  const headers = isPending
    ? ["ลำดับ", "ชื่อบัญชีผู้ใช้", "หัวข้อที่แจ้ง", "เนื้อหาที่แจ้ง", "วันที่แจ้ง"]
    : ["ลำดับ", "ชื่อบัญชีผู้ใช้", "หัวข้อที่แจ้ง", "เนื้อหาที่แจ้ง", "วันที่แจ้ง", "การตอบกลับ"];

  const data = reports.map((report, index) => {
    const row = [
      index + 1,
      report.user?.username || "N/A",
      report.title || "N/A",
      report.detail || "N/A",
      report.date || "N/A",
    ];
    if (!isPending) {
      row.push(report.response || "N/A");
    }
    return row;
  });

  const columnAlignment = isPending
    ? [
        "text-center", // ลำดับ
        "text-left",   // ชื่อบัญชีผู้ใช้
        "text-center", // หัวข้อที่แจ้ง
        "text-left",   // เนื้อหาที่แจ้ง
        "text-center", // วันที่แจ้ง
      ]
    : [
        "text-center", // ลำดับ
        "text-left",   // ชื่อบัญชีผู้ใช้
        "text-center", // หัวข้อที่แจ้ง
        "text-left",   // เนื้อหาที่แจ้ง
        "text-center", // วันที่แจ้ง
        "text-left",   // การตอบกลับ
      ];

  const columnWidths = isPending
    ? [
        "w-12",  // ลำดับ
        "w-24",  // ชื่อบัญชีผู้ใช้
        "w-20",  // หัวข้อที่แจ้ง
        "w-32",  // เนื้อหาที่แจ้ง	
        "w-24",  // วันที่แจ้ง	
      ]
    : [
        "w-12",  // ลำดับ
        "w-24",  // ชื่อบัญชีผู้ใช้
        "w-20",  // หัวข้อที่แจ้ง
        "w-32",  // เนื้อหาที่แจ้ง	
        "w-24",  // วันที่แจ้ง	
        "w-32",  // การตอบกลับ
      ];

  const handleRowClick = (rowData: (string | React.ReactNode)[]) => {
    const reportIndex = Number(rowData[0]) - 1;
    if (reportIndex >= 0 && reportIndex < reports.length) {
      const report = reports[reportIndex];
      
      if (report?._id) {
        router.push(`/supportSystem/${report._id}`); 
      } else {
        console.warn("Invalid report ID:", report);
      }
      
    } else {
      console.warn("Invalid report index:", reportIndex);
    }
  };

  return (
    <div className="w-full">
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

export default ReportTable;

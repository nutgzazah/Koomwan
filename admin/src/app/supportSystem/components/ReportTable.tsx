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
  
  const isPending = reports.some(report => report.resolved === "pending");

  const headers = isPending
    ? ["ลำดับ", "ชื่อบัญชีผู้ใช้", "หัวข้อที่แจ้ง", "เนื้อหาที่แจ้ง", "วันที่แจ้ง"]
    : ["ลำดับ", "ชื่อบัญชีผู้ใช้", "หัวข้อที่แจ้ง", "เนื้อหาที่แจ้ง", "วันที่แจ้ง", "การตอบกลับ"];

  const data = reports.map((report, index) => {
    const row = [
      index + 1,
      report.username,
      report.title,
      report.problem_details,
      report.report_date,
    ];
    if (!isPending) {
      row.push(report.response_to_user);
    }
    return row;
  });

  const handleRowClick = (rowData: (string | React.ReactNode)[]) => {
    const reportIndex = Number(rowData[0]);
    const report = reports[reportIndex - 1];
    if (report && report.report_id) {
      router.push(`/supportSystem/${report.report_id}`); 
    } else {
      console.warn("Invalid report ID:", report?.report_id);
    }
    
  };

  return (
    <div className="w-full">
      <Table headers={headers} data={data} onRowClick={handleRowClick} />
    </div>
  );
};

export default ReportTable;

'use client';

import React from "react";
import { useRouter } from "next/navigation";
import Table from "@/components/Table";

import { ReportDataInterface } from "@/interfaces/reportInterface";
import reports from "@/data/report.json";

const ReportTable: React.FC = () => {
  const router = useRouter();

  const headers = ["ลำดับ", "ชื่อบัญชีผู้ใช้", "หัวข้อที่แจ้ง", "เนื้อหาที่แจ้ง", "วันที่แจ้ง", "การตอบกลับ"];

  const sanitizedData: ReportDataInterface[] = reports.map((report) => ({
    user: report.user || "ไม่ระบุชื่อ",
    role: report.role || "ไม่ระบุบทบาท",
    title: report.title || "ไม่มีหัวข้อ",
    problem_details: report.problem_details || "ไม่มีรายละเอียด",
    report_date: report.report_date || "ไม่ระบุวันที่",
    response_to_user: report.response_to_user || "ยังไม่มีการตอบกลับ",
  }));

  const data: (string | React.ReactNode)[][] = sanitizedData.map((report, index) => [
    (index + 1).toString(),
    report.user,
    report.title,
    report.problem_details,
    report.report_date,
    report.response_to_user,
  ]);

  const handleRowClick = (rowData: React.ReactNode[]) => {
    const rowIndex = parseInt(rowData[0] as string, 10) - 1; 
    router.push(`/supportSystem/${rowIndex}`); 
  };

  return (
    <div>
      <Table headers={headers} data={data} onRowClick={handleRowClick} />
    </div>
  );
};

export default ReportTable;

'use client';

import React from "react";
import { useRouter } from "next/navigation";
import Table from "@/components/Table";

import { ReportDataInterface } from "@/interfaces/reportInterface";
import reports from "@/data/report.json";

const ReportTable: React.FC = () => {
  const router = useRouter();

  // Define headers for the table
  const headers = ["ลำดับ", "ชื่อบัญชีผู้ใช้", "หัวข้อที่แจ้ง", "เนื้อหาที่แจ้ง", "วันที่แจ้ง", "การตอบกลับ"];

  // Sanitize and transform data
  const sanitizedData: ReportDataInterface[] = reports.map((report) => ({
    user: report.user || "ไม่ระบุชื่อ",
    role: report.role || "ไม่ระบุบทบาท",
    title: report.title || "ไม่มีหัวข้อ",
    problem_details: report.problem_details || "ไม่มีรายละเอียด",
    report_date: report.report_date || "ไม่ระบุวันที่",
    response_to_user: report.response_to_user || "ยังไม่มีการตอบกลับ",
  }));

  // Map sanitized data to table rows
  const data: (string | React.ReactNode)[][] = sanitizedData.map((report, index) => [
    (index + 1).toString(), // Row number
    report.user, // User name
    report.title, // Report title
    report.problem_details, // Report details
    report.report_date, // Date of report
    report.response_to_user, // Response to user
  ]);

  // Handle row click event
  const handleRowClick = (rowData: React.ReactNode[]) => {
    const rowIndex = parseInt(rowData[0] as string, 10) - 1; // Extract index from rowData
    const selectedReport = sanitizedData[rowIndex]; // Match report data by index
    if (selectedReport) {
      router.push(`/supportSystem/${rowIndex + 1}`); // Navigate to the report detail page
    } else {
      console.warn("Invalid report ID:", selectedReport);
    }
  };

  return (
    <div>
      <Table headers={headers} data={data} onRowClick={handleRowClick} />
    </div>
  );
};

export default ReportTable;

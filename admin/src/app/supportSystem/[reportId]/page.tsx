'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ReportDataInterface } from "@/interfaces/reportInterface";
import reports from "../../../data/report.json";

const UserReportForm: React.FC = () => {
  const { reportId } = useParams(); 
  const [report, setReport] = useState<ReportDataInterface | null>(null);
  const reportList = reports as ReportDataInterface[];

  useEffect(() => {
    const index = parseInt(reportId || "-1", 10); 
    if (!isNaN(index) && index >= 0 && index < reportList.length) {
      setReport(reportList[index]); 
    } else {
      setReport(null); 
    }
  }, [reportId, reportList]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (report) {
      const { name, value } = e.target;
      setReport({
        ...report,
        [name]: value,
      });
    }
  };

  const handleSubmit = () => {
    if (report) {
      console.log("Updated Report:", report);
    }
  };

  if (!report) {
    return <div>Loading or Report Not Found...</div>;
  }

  return (
    <div className="p-8 w-full">
      <h2 className="text-2xl font-bold mb-6">ปัญหาที่พบโดยผู้ใช้</h2>

      <div className="mb-4">
        <label className="block font-semibold mb-1" htmlFor="user">ผู้ใช้</label>
        <input
          type="text"
          id="user"
          name="user"
          value={report.user}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:outline-none"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1" htmlFor="role">Role</label>
        <input
          type="text"
          id="role"
          name="role"
          value={report.role}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:outline-none"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1" htmlFor="title">หัวข้อ</label>
        <input
          type="text"
          id="title"
          name="title"
          value={report.title}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:outline-none"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1" htmlFor="problem_details">รายละเอียดของปัญหา</label>
        <textarea
          id="problem_details"
          name="problem_details"
          value={report.problem_details}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:outline-none h-32"
        ></textarea>
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1" htmlFor="report_date">วันที่แจ้ง</label>
        <input
          type="text"
          id="report_date"
          name="report_date"
          value={report.report_date}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:outline-none"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1" htmlFor="response_to_user">การตอบกลับไปยังผู้ใช้</label>
        <textarea
          id="response_to_user"
          name="response_to_user"
          value={report.response_to_user}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:outline-none h-20"
        ></textarea>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
        >
          ส่ง
        </button>
      </div>
    </div>
  );
};

export default UserReportForm;

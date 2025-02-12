'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ReportDataInterface } from "@/interfaces/reportInterface";
import reports from "../../../data/report.json";

const transformData = (data: ReportDataInterface[]) => {
  if (!Array.isArray(data)) return [];
  return data.map((item, index) => ({
    transID: index + 1,
    reportId: item.report_id,
    username: item.username,
    role: item.role,
    date_and_time: item.report_date,
    response_to_user: item.response_to_user || "",
    resolved: item.resolved,
    title: item.title || "ไม่ระบุ",
    problem_details: item.problem_details || ""
  }));
};

const UserReportForm: React.FC = () => {
  const { reportId } = useParams();
  const transformedReport = transformData(reports);
  const reportData = transformedReport.find((r) => String(r.reportId) === reportId);
  const router = useRouter();

  const [report, setReport] = useState(reportData || null);

  useEffect(() => {
    if (reportData) {
      setReport(reportData);
    }
  }, [reportId]);

  if (!report) {
    return (
      <div className="text-center p-4">
        <p className="text-secondary">ไม่พบข้อมูลการรายงาน</p>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setReport((prevReport) => (prevReport ? { ...prevReport, [name]: value } : null));
  };

  const handleSubmit = () => {
    console.log("Updated Report:", report);
    router.push("/supportSystem")
  };

  return (
    <div className="w-full flex flex-col gap-4 text-secondary">
      <p className="text-detail_3">แจ้งเมื่อ {report.date_and_time}</p>

      <div className="flex justify-start items-center w-full">
        <table className="w-full text-left">
          <tbody>
            <tr>
              <td className="text-bold_detail py-2 w-56">หมวดหมู่</td>
              <td>
                <button className="btn lightblue-btn short-btn rounded-md text-center">{report.title}</button>
              </td>
            </tr>
            <tr>
              <td className="text-bold_detail py-2 w-56">ชื่อบัญชีผู้ใช้</td>
              <td className="py-2 text-detail_2">{report.username}</td>
            </tr>
            <tr>
              <td className="text-bold_detail py-2 w-56">สถานะ</td>
              <td className="py-2 text-detail_2">{report.role}</td>
            </tr>
            <tr>
              <td className="text-bold_detail py-2 w-56">เนื้อหาที่แจ้ง</td>
              <td className="py-2 text-detail_2">{report.problem_details}</td>
            </tr>
            {report.resolved && report.response_to_user && (
              <tr>
                <td className="text-bold_detail py-2 w-56">การตอบกลับไปยังผู้ใช้</td>
                <td className="py-2 text-detail_2">{report.response_to_user}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {report.resolved === "pending" && (
        <div>
          <div>
            <label className="text-bold_detail" htmlFor="response_to_user">การตอบกลับไปยังผู้ใช้</label>
            <textarea
              id="response_to_user"
              name="response_to_user"
              placeholder="การตอบกลับไปยังผู้ใช้"
              value={report.response_to_user}
              onChange={handleChange}
              className="input h-64"
            ></textarea>
          </div>
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleSubmit}
              className="btn blue-btn short-btn"
            >
              ส่งบทความ
            </button>
            <button 
              onClick={() => router.back()}
              className="btn white-btn short-btn"
            >
              ยกเลิก
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserReportForm;

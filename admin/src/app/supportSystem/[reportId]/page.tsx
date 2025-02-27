'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ReportDataInterface } from "@/interfaces/reportInterface";
import axios from "axios";

const UserReportForm: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const reportId = params?.reportId || params?.id;

  const [report, setReport] = useState<ReportDataInterface | null>(null);
  
  useEffect(() => {
    const fetchReport = async () => {
      if (!reportId) return;

      try {
        const response = await axios.get(`http://localhost:8080/api/v1/admin/report/${reportId}`);
        console.log("Fetched report data:", response.data);
        setReport(response.data.data || response.data);
      } catch (error) {
        console.error("Error fetching report data:", error);
      }
    };

    fetchReport();
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

  const handleSubmit = async () => {
    if (!reportId || !report) return;
    
    try {
      await axios.put(`http://localhost:8080/api/v1/admin/editReport/response/${reportId}`, { response: report.response });
      console.log("Updated Report:", report);
      router.push("/supportSystem");
    } catch (error) {
      console.error("Error updating report:", error);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 text-secondary">
      <p className="text-detail_3">แจ้งเมื่อ {report.date}</p>

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
              <td className="py-2 text-detail_2">{report.user?.username}</td>
            </tr>
            <tr>
              <td className="text-bold_detail py-2 w-56">สถานะ</td>
              <td className="py-2 text-detail_2">{report.role}</td>
            </tr>
            <tr>
              <td className="text-bold_detail py-2 w-56">เนื้อหาที่แจ้ง</td>
              <td className="py-2 text-detail_2">{report.detail}</td>
            </tr>
            {report.status && report.response && (
              <tr>
                <td className="text-bold_detail py-2 w-56">การตอบกลับไปยังผู้ใช้</td>
                <td className="py-2 text-detail_2">{report.response}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {report.resolved === "pending" && (
        <div>
          <div>
            <label className="text-bold_detail" htmlFor="response">การตอบกลับไปยังผู้ใช้</label>
            <textarea
              id="response"
              name="response"
              placeholder="การตอบกลับไปยังผู้ใช้"
              value={report.response || ""}
              onChange={handleChange}
              className="input h-64"
            ></textarea>
          </div>
          <div className="flex justify-center space-x-4">
            <button onClick={handleSubmit} className="btn blue-btn short-btn">ส่งบทความ</button>
            <button onClick={() => router.back()} className="btn white-btn short-btn">ยกเลิก</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserReportForm;

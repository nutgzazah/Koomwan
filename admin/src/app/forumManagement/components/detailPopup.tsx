import PopupCard from "@/components/PopupCard";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ForumReportTitle } from "@/utils/statusMapping";
import DetailTable from "./deatilTable";

interface DetailPopupProps {
  onClose: () => void;
  forumId: string;
}

export default function DetailPopup({ onClose, forumId }: DetailPopupProps) {
  const [activeTab, setActiveTab] = useState<string>("ทั้งหมด");
  const [forum, setForum] = useState<any | null>(null);

  useEffect(() => {
    const fetchForumData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/admin/forum/reported/${forumId}`);
        setForum(response.data.data || response.data);
      } catch (error) {
        console.error("Error fetching forum data:", error);
      }
    };

    fetchForumData();
  }, [forumId]);

  if (!forum) {
    return (
      <PopupCard title="ไม่พบข้อมูล" onClose={onClose} className="w-[900px]">
        <div className="text-center p-4">
          <p className="text-secondary">ไม่มีข้อมูลฟอรั่มนี้</p>
        </div>
      </PopupCard>
    );
  }

  // Ensure reasons is an array
  const reportsArray = Array.isArray(forum.reports?.reasons) ? forum.reports.reasons : [];

  // Get all report categories from ForumReportTitle
  const reportCategories = ["ทั้งหมด", ...Object.keys(ForumReportTitle).map((key) => ForumReportTitle[key])];

  // Count reports for each category
  const reportCounts: { [key: string]: number } = reportCategories.reduce((acc, category) => {
    if (category === "ทั้งหมด") {
      acc[category] = reportsArray.length;
    } else {
      acc[category] = reportsArray.filter((r) => r?.reason && ForumReportTitle[r.reason] === category).length || 0;
    }
    return acc;
  }, {} as { [key: string]: number });

  // filter reported title
  const filteredReports = activeTab === "ทั้งหมด" 
    ? reportsArray 
    : reportsArray.filter((r) => r?.reason && ForumReportTitle[r.reason] === activeTab);

  return (
    <PopupCard title={`จำนวนครั้งที่ถูกรายงาน ${forum.reports?.count || 0} ครั้ง`} onClose={onClose} className="w-[1300px] min-h-[500px]">
      <div className="flex flex-col items-center w-full">
        {/* Tab Navigation */}
        <div className="flex w-full border-t pt-5">
          {reportCategories.map((category) => (
            <button
              key={category}
              className={`flex-1 text-center transition ${
                activeTab === category ? "btn shorted-btn blue-btn p-2 rounded-md" : "btn shorted-btn lightblue-btn p-2 rounded-md"
              }`}
              onClick={() => setActiveTab(category)}
            >
              {category} ({reportCounts[category]})
            </button>
          ))}
        </div>

        {/* Table Component */}
        <DetailTable forums={filteredReports} />
      </div>
    </PopupCard>
  );
}

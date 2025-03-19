import PopupCard from "@/components/PopupCard";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { ForumReportTitle } from "@/utils/statusMapping";
import DetailTable from "./deatilTable";

interface DetailPopupProps {
  onClose: () => void;
  forumId: string;
}

interface ForumData {
  reports?: {
    count?: number;
    reasons?: { reason?: string }[];
  };
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8080";

export default function DetailPopup({ onClose, forumId }: DetailPopupProps) {
  const [activeTab, setActiveTab] = useState<string>("ทั้งหมด");
  const [forum, setForum] = useState<ForumData | null>(null);

  const fetchForumData = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/admin/forum/reported/${forumId}`);
      setForum(response.data.data || response.data);
    } catch (error) {
      console.error("Error fetching forum data:", error);
    }
  }, [forumId]);

  useEffect(() => {
    fetchForumData();
  }, [fetchForumData]);

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

  // Get all report categories
  const reportCategories = ["ทั้งหมด", ...Object.values(ForumReportTitle)];

  // Count reports for each category efficiently
  const reportCounts: Record<string, number> = {
    ทั้งหมด: reportsArray.length,
    ...Object.values(ForumReportTitle).reduce((acc, category) => {
      acc[category] = reportsArray.filter((r) => r?.reason && ForumReportTitle[r.reason] === category).length || 0;
      return acc;
    }, {} as Record<string, number>),
  };

  // Filter reports based on the active tab
  const filteredReports =
    activeTab === "ทั้งหมด"
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
              {category} ({reportCounts[category] || 0})
            </button>
          ))}
        </div>

        {/* Table Component */}
        <DetailTable forums={filteredReports} />
      </div>
    </PopupCard>
  );
}
 
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { ForumDataInterface } from "@/interfaces/forumInterface";
import DeleteReasonPopup from "../components/deleteReason";
import ApprovePopup from "../components/ApprovePopup";
import DetailPopup from "../components/detailPopup";

const ForumID: React.FC = () => {
  const { forumId } = useParams();
  const [forum, setForum] = useState<ForumDataInterface | null>(null);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isApprovePopupOpen, setIsApprovePopupOpen] = useState(false);
  const [isDetailPopupOpen, setIsDetailPopupOpen] = useState(false);

  useEffect(() => {
    const fetchForum = async () => {
      if (!forumId || typeof forumId !== "string") return;

      try {
        const response = await axios.get(`http://localhost:8080/api/v1/admin/forum/reported/${forumId}`);
        console.log("Fetched forum data:", response.data);

        setForum(response.data.data || response.data);
      } catch (error) {
        console.error("Error fetching forum data:", error);
      }
    };

    fetchForum();
  }, [forumId]);

  if (!forum) {
    return (
      <div className="text-center p-4">
        <p className="text-secondary">ไม่พบข้อมูลฟอรั่ม</p>
      </div>
    );
  }

  const handleApprove = () => setIsApprovePopupOpen(true);

  return (
    <div className="w-full">
      <div className="flex items-center space-x-2">
        <p className='text-detail_3 text-secondary'>จำนวนครั้งที่ถูกรายงาน : </p>
        <p>{forum.reports?.count || 0} ครั้ง</p>
        <button className="btn lightblue-btn p-2 rounded-md" onClick={() => setIsDetailPopupOpen(true)}>
          คลิกเพื่อดูรายละเอียด
        </button>
      </div>
      <h2 className="text-headline_3 text-secondary">{forum.title}</h2>
      <p className="text-detail_3 text-secondary">เขียนเมื่อ {new Date(forum.createdAt).toLocaleString()}</p>
      {forum.image && typeof forum.image === "string" && (
        <div className="w-full h-auto mb-6">
          <img src={forum.image} alt="forum image" className="w-full h-auto object-cover rounded-md" />
        </div>
      )}
      <div className="flex w-full justify-center space-x-4 mt-4">
        <button className="btn green-btn short-btn" onClick={handleApprove}>อนุมัติ</button>
        <button className="btn red-btn short-btn" onClick={() => setIsDeletePopupOpen(true)}>ลบ</button>
      </div>

      {isDeletePopupOpen && typeof forumId === "string" && (
        <DeleteReasonPopup onClose={() => setIsDeletePopupOpen(false)} postId={forumId} />
      )}

      {isApprovePopupOpen && typeof forumId === "string" && (
        <ApprovePopup onClose={() => setIsApprovePopupOpen(false)} postId={forumId} />
      )}

      {isDetailPopupOpen && typeof forumId === "string" && (
        <DetailPopup onClose={() => setIsDetailPopupOpen(false)} forumId={forumId} />
      )}
    </div>
  );
};

export default ForumID;

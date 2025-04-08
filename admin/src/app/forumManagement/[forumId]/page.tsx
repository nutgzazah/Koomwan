"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { ForumDataInterface } from "@/interfaces/forumInterface";
import DeleteReasonPopup from "../components/deleteReason";
import ApprovePopup from "../components/ApprovePopup";
import DetailPopup from "../components/detailPopup";
import ForumImageHandler from "@/utils/forumImageHandler";
import Image from "next/image";
import { formatDate } from "@/utils/formatDate.";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8080";

const ForumID: React.FC = () => {
  const { forumId } = useParams();
  const [forum, setForum] = useState<ForumDataInterface | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isApprovePopupOpen, setIsApprovePopupOpen] = useState(false);
  const [isDetailPopupOpen, setIsDetailPopupOpen] = useState(false);

  useEffect(() => {
    const fetchForum = async () => {
      if (!forumId || typeof forumId !== "string") return;

      try {
        const response = await axios.get(`${BASE_URL}/api/v1/admin/forum/reported/${forumId}`);
        console.log("Fetched forum data:", response.data);

        setForum(response.data.data || response.data);
      } catch (error) {
        console.error("Error fetching forum data:", error);
      }
    };

    fetchForum();
  }, [forumId]);

  /** 🔹 Fetch forum image */
  useEffect(() => {
    const loadImageUrl = async () => {
      if (!forum?.image) {
        return;
      }
      try {
        console.log(`Fetching forum image using getCurrentForumImage: ${forum.image}`);
        const fetchedImageUrl = await ForumImageHandler.getCurrentForumImage(forum.image);
        
        setImageUrl(fetchedImageUrl || "/assets/forum-default.jpg"); 
      } catch (error) {
        console.error("Error fetching image URL:", error);
        setImageUrl("/assets/forum-default.jpg");
      }
    };

    if (forum?.image) {
      loadImageUrl();
    }
  }, [forum?.image]);

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
      <p className="text-detail_3 text-secondary">เขียนเมื่อ {formatDate(forum.createdAt).toLocaleString()}</p>
       
       {/* ✅ Display image only if `imageUrl` exists */}
       {imageUrl && (
        <div className="relative w-full max-w-full md:max-w-2xl lg:max-w-3xl h-[300px] mb-6 rounded-lg shadow-md overflow-hidden">
          <Image
            src={imageUrl}
            alt="forum image"
            fill
            className="object-cover"
          />
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

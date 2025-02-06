"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ForumDataInterface } from "@/interfaces/forumInterface";
import forums from "@/data/forum.json";
import DeleteReasonPopup from "../components/deleteReason";
import ApprovePopup from "../components/ApprovePopup";

const transformData = (data: ForumDataInterface[]) => {
  if (!Array.isArray(data)) return [];
  return data.map((item, index) => ({
    transID: index + 1,
    forumId: item.forum_id,
    user_id: item.user_id,
    username: item.username,
    text: item.text,
    date_and_time: item.date_and_time,
    like: item.like,
    doctor_id: item.doctor_id ?? undefined,
    doctor_comment: item.doctor_comment ?? undefined,
    title_report: item.title_report,
    reason_report: item.reason_report,
  }));
};

const ForumID: React.FC = () => {
  const { forumId } = useParams();
  const transformedForums = transformData(forums);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isApprovePopupOpen, setIsApprovePopupOpen] = useState(false);
  const router = useRouter();

  const forum = transformedForums.find((f) => String(f.forumId) === forumId);

  const handleApprove = () => {
    setIsApprovePopupOpen(true);
  };

  const handleDeleteConfirm = () => {
    setIsDeletePopupOpen(false);
    router.push("/forumManagement");
  };

  if (!forum) {
    return (
      <div className="text-center p-4">
        <p className="text-secondary">ไม่พบข้อมูลฟอรั่ม</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center space-x-2">
        <p className='text-detail_3 text-secondary'>หมวดหมู่ : </p>
          <p
            className="btn lightblue-btn p-2 rounded-md"
          >
            {forum.title_report}
          </p>
      </div>

      <h2 className="text-headline_3 text-secondary">{forum.username}</h2>
      <p className="text-detail_3 text-secondary">เขียนเมื่อ {forum.date_and_time}</p>

      <div>
        <p className="text-detail_2 text-secondary">
          {forum.text}
        </p>
      </div>

      {/* Image */}
      <div className="w-full h-auto mb-6">
        <img
          src={forum.image}
          alt="forum image"
          className="w-full h-auto object-cover rounded-md"
        />
      </div>

      <div className="flex w-full justify-center space-x-4 mt-4">
          <button
            className="btn green-btn short-btn"
            onClick={handleApprove}
          >
            อนุมัติ
          </button>
          <button
            className="btn red-btn short-btn"
            onClick={() => setIsDeletePopupOpen(true)}
          >
            ลบ
          </button>
      </div>

      {/* Delete Reason Popup */}
      {isDeletePopupOpen && (
        <DeleteReasonPopup
          onClose={() => setIsDeletePopupOpen(false)}
          onConfirm={handleDeleteConfirm}
        />
      )}

      {isApprovePopupOpen && (
        <ApprovePopup
          onClose={() => setIsApprovePopupOpen(false)}
        />
      )}

    </div>
  );
};

export default ForumID;

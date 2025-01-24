"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { ForumDataInterface } from "@/interfaces/forumInterface";
import forums from "@/data/forum.json";
import DeleteReasonPopup from "../components/deleteReason";

const transformData = (data: ForumDataInterface[]) => {
  if (!Array.isArray(data)) return [];
  return data.map((item, index) => ({
    transID: index + 1,
    forumId: item.forum_id,
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
  const [deleteReason, setDeleteReason] = useState("");

  const forum = transformedForums.find((f) => String(f.forumId) === forumId);

  const handleDelete = (reason: string) => {
    // Logic to delete the forum with the provided reason
    console.log("Deleting with reason:", reason);
    setDeleteReason(reason);
    setIsDeletePopupOpen(false);
  };

  if (!forum) {
    return (
      <div className="text-center p-4">
        <p className="text-red-500">ไม่พบข้อมูลของแพทย์</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between w-full py-2 px-10 gap-20 bg-blue-200">
        {/* Image Section */}
        <div className="w-2/5 h-96 flex justify-center items-center bg-slate-200">
          <p>Image</p>
        </div>

        {/* Details Section */}
        <div className="flex flex-col justify-start w-3/5">
          <div className="mb-4">
            <p className="font-bold">{forum.doctor_comment || "No Comment"}</p>
            <p className="text-gray-600 text-sm">{forum.date_and_time || "No Date Provided"}</p>
          </div>
          <div className="mb-4">
            <p>{forum.text || "No Content Available"}</p>
          </div>

          {/* Buttons Section */}
          <div className="flex space-x-4 mt-4">
            <button
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={() => alert("Approved")}
            >
              อนุมัติ
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={() => setIsDeletePopupOpen(true)}
            >
              ลบ
            </button>
          </div>
        </div>
      </div>

      {/* Delete Reason Popup */}
      {isDeletePopupOpen && (
        <DeleteReasonPopup
          onClose={() => setIsDeletePopupOpen(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};

export default ForumID;

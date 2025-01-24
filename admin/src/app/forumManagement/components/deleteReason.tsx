import PopupCard from "@/components/PopupCard";
import React, { useState } from "react";

interface DeleteReasonPopupProps {
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export default function DeleteReasonPopup({
  onClose,
  onConfirm,
}: DeleteReasonPopupProps) {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    if (reason.trim() === "") {
      alert("กรุณากรอกเหตุผล");
      return;
    }
    onConfirm(reason.trim());
  };

  return (
    <PopupCard title="แจ้งลบฟอรั่มนี้" onClose={onClose}>
      <div className="flex flex-col items-center space-y-4">
        <div className="w-full">
          <label className="block mb-2 font-bold text-gray-700">เนื่องจาก</label>
          <textarea
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
            rows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="รายละเอียด"
          />
        </div>
        <div className="flex space-x-4 mt-4">
          <button
            className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
            onClick={onClose}
          >
            ยกเลิก
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={handleConfirm}
          >
            ยืนยัน
          </button>
        </div>
      </div>
    </PopupCard>
  );
}

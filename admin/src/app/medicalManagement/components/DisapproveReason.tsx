import PopupCard from "@/components/PopupCard";
import React, { useState } from "react";

interface DisapproveReasonPopupProps {
  doctorName: string;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export default function DisapproveReasonPopup({
  doctorName,
  onClose,
  onConfirm,
}: DisapproveReasonPopupProps) {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    if (reason.trim() === "") {
      alert("กรุณากรอกเหตุผล");
      return;
    }
    onConfirm(reason);
  };

  return (
    <PopupCard title="ไม่อนุมัติ" onClose={onClose}>
      <div className="flex flex-col items-center space-y-4">
        <p className="font-title text-center"> {doctorName} </p>
        <div className="w-full">
          <label className="block mb-2 font-description text-secondary">เนื่องจาก</label>
          <textarea
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-slate-400"
            rows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="รายละเอียด"
          />
        </div>
        <div className="flex space-x-4 mt-4">
          <button
            className="px-4 py-2 bg-card text-secondary rounded hover:bg-hoverRead shadow-md"
            onClick={onClose}
          >
            ยกเลิก
          </button>
          <button
            className="px-4 py-2 bg-abnormal text-card rounded hover:bg-red-600 shadow-md"
            onClick={handleConfirm}
          >
            ยืนยัน
          </button>
        </div>
      </div>
    </PopupCard>
  );
}

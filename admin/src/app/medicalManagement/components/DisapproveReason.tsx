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
        <p className="text-detail_2 text-center"> {doctorName} </p>
        <div className="w-full">
          <label className="block mb-2 text-detail_2 text-secondary">เนื่องจาก</label>
          <textarea
            className="input"
            rows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="รายละเอียด"
          />
        </div>
        <div className="flex space-x-4 mt-4">
          <button
            className="btn white-btn short-btn"
            onClick={onClose}
          >
            ยกเลิก
          </button>
          <button
            className="btn red-btn short-btn"
            onClick={handleConfirm}
          >
            ยืนยัน
          </button>
        </div>
      </div>
    </PopupCard>
  );
}

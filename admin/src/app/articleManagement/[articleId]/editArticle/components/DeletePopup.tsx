import PopupCard from "@/components/PopupCard";
import React from "react";

interface DeletePopupProps {
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeletePopup({ onClose, onConfirm }: DeletePopupProps) {
  return (
    <PopupCard title="ต้องการลบบทความนี้?" onClose={onClose}>
      <div className="flex flex-col items-center space-y-4">
        <div className="flex space-x-4 mt-4">
          <button className="btn white-btn short-btn" onClick={onClose}>
            ยกเลิก
          </button>
          <button className="btn red-btn short-btn" onClick={onConfirm}>
            ยืนยัน
          </button>
        </div>
      </div>
    </PopupCard>
  );
}

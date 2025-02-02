import PopupCard from "@/components/PopupCard";
import React, { useEffect } from "react";

interface ApprovePopupProps {
  doctorName: string;
  onClose: () => void;
}

export default function ApprovePopup({
  doctorName,
  onClose,
}: ApprovePopupProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <PopupCard title="อนุมัติ" onClose={onClose}>
      <div className="flex flex-col items-center space-y-4">
        <p className="text-detail_2 text-center">{doctorName}</p>
        <p className="text-normal">สำเร็จ</p>
      </div>
    </PopupCard>
  );
}

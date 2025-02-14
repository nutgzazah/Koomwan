import PopupCard from "@/components/PopupCard";
import React from "react";
import { useRouter } from "next/navigation";

interface ApprovePopupProps {
  onClose: () => void;
}

export default function ApprovePopup({ onClose }: ApprovePopupProps) {
  const router = useRouter();

  const handleNavigate = () => {
    onClose(); 
    router.push("/forumManagement"); 
  };

  return (
    <PopupCard title="อนุมัติ" onClose={onClose}>
      <div className="flex flex-col items-center space-y-4">
        <p className="text-normal">สำเร็จ</p>
        <button 
          className="btn blue-btn short-btn"
          onClick={handleNavigate} 
        >
          กลับสู่หน้าหลัก
        </button>
      </div>
    </PopupCard>
  );
}

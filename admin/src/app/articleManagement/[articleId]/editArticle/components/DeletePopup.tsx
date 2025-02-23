import PopupCard from "@/components/PopupCard";
import React from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface DeletePopupProps {
  onClose: () => void;
  articleId: string;
}

export default function DeletePopup({ onClose, articleId }: DeletePopupProps) {
  
  const router = useRouter();

  const handleConfirm = async () => {
    if (!articleId) {
      console.error("Error: articleId is undefined or empty");
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/api/v1/admin/deleteBlog/${articleId}`);
      onClose();
      router.push("/articleManagement");
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };
  
  return (
    <PopupCard title="ต้องการลบบทความนี้?" onClose={onClose}>
      <div className="flex flex-col items-center space-y-4">
        <div className="flex space-x-4 mt-4">
          <button className="btn white-btn short-btn" onClick={onClose}>
            ยกเลิก
          </button>
          <button className="btn red-btn short-btn" onClick={handleConfirm}>
            ยืนยัน
          </button>
        </div>
      </div>
    </PopupCard>
  );
}

import PopupCard from "@/components/PopupCard";
import React from "react";
import axios from "axios";

interface DeletePopupProps {
  onClose: () => void;
  onConfirm: () => void;
  articleId: string;
}

export default function DeletePopup({ onClose, onConfirm, articleId }: DeletePopupProps) {
  
  const handleConfirm = async () => {
    console.log("Attempting to delete article with ID:", articleId);
  
    if (!articleId) {
      console.error("Error: articleId is undefined or empty");
      return;
    }
  
    try {
      const response = await axios.delete(`http://localhost:8080/api/v1/admin/deleteBlog/${articleId}`);
      console.log("Delete response:", response.data); 
  
      onConfirm();
      onClose();
    } catch (error) {
      console.error("Error deleting blog:", error);
      if (axios.isAxiosError(error)) {
        console.error("Backend Response:", error.response?.data);
      }
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

import PopupCard from "@/components/PopupCard";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface ApprovePopupProps {
  onClose: () => void;
  postId: string;
}

export default function ApprovePopup({ onClose, postId }: ApprovePopupProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApprove = async () => {
    if (!postId) {
      setError("Invalid post ID.");
      return;
    }
  
    console.log("Approving post with ID:", postId);
  
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`http://localhost:8080/api/v1/admin/forum/approve/${postId}`);
      console.log("Approval Response:", response.data);
      onClose();
      router.push("/forumManagement"); 
    } catch (error) {
      console.error("Error approving post:", error);
      setError("การอนุมัติล้มเหลว กรุณาลองอีกครั้ง");
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <PopupCard title="อนุมัติ" onClose={onClose}>
      <div className="flex flex-col items-center space-y-4">
        <p className="text-normal">ยืนยันการอนุมัติโพสต์นี้หรือไม่?</p>
        {error && <p className="text-red-500">{error}</p>}
        <button 
          className="btn blue-btn short-btn"
          onClick={handleApprove} 
          disabled={loading}
        >
          {loading ? "กำลังดำเนินการ..." : "อนุมัติ"}
        </button>
      </div>
    </PopupCard>
  );
}

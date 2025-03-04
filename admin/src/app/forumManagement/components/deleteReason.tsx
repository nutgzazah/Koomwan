import PopupCard from "@/components/PopupCard";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface DeleteReasonPopupProps {
  onClose: () => void;
  postId: string;
}

export default function DeleteReasonPopup({ onClose, postId }: DeleteReasonPopupProps) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleConfirm = async () => {
    if (reason.trim() === "") {
      alert("กรุณากรอกเหตุผล");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      await axios.delete(`http://localhost:8080/api/v1/admin/forum/deletePost/${postId}`, {
        data: { reason: reason.trim() }, 
      });
      console.log("Post deleted successfully");
      onClose();
      router.push("/forumManagement"); 
    } catch (error) {
      console.error("Error deleting post:", error);
      setError("การลบโพสต์ล้มเหลว กรุณาลองอีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PopupCard title="แจ้งลบฟอรั่มนี้" onClose={onClose}>
      <div className="flex flex-col items-center space-y-4">
        <div className="w-full">
          <label className="block text-bold_detail text-secondary">เนื่องจาก</label>
          <textarea
            className="input"
            rows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="รายละเอียด"
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex space-x-4 mt-4">
          <button className="btn white-btn short-btn" onClick={onClose} disabled={loading}>
            ยกเลิก
          </button>
          <button className="btn red-btn short-btn" onClick={handleConfirm} disabled={loading}>
            {loading ? "กำลังดำเนินการ..." : "ยืนยัน"}
          </button>
        </div>
      </div>
    </PopupCard>
  );
}

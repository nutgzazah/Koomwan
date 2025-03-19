import PopupCard from "@/components/PopupCard";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface DeletePopupProps {
  onClose: () => void;
  articleId: string;
}

export default function DeletePopup({ onClose, articleId }: DeletePopupProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);

    try {
      const blogResponse = await axios.get(`http://localhost:8080/api/v1/admin/blog/${articleId}`);
      const currentImageFileName = blogResponse.data.data?.image || null;
      console.log("Current blog image before delete:", currentImageFileName);

      await axios.delete(`http://localhost:8080/api/v1/admin/deleteBlog/${articleId}`);
      console.log("Blog deleted successfully");

      onClose();
      router.push("/articleManagement");
    } catch (err) {
      console.error("Error deleting blog:", err);
      setError("การลบบทความล้มเหลว กรุณาลองอีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PopupCard title="แจ้งลบบทความนี้" onClose={onClose}>
      <div className="flex flex-col items-center space-y-4">
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

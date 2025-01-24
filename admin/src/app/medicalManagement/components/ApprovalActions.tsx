import React, { useState } from "react";
import DisapproveReasonPopup from "./DisapproveReason";

interface ApprovalActionsProps {
  doctorId: string;
  doctorName: string;
  onApprove: (id: string) => void;
  onDisapprove: (id: string, reason: string) => void;
}

export default function ApprovalActions({
  doctorId,
  doctorName,
  onApprove,
  onDisapprove,
}: ApprovalActionsProps) {
  const [isDisapprovePopupOpen, setIsDisapprovePopupOpen] = useState(false);

  const handleApprove = () => {
    onApprove(doctorId);
  };

  const handleDisapproveConfirm = (reason: string) => {
    onDisapprove(doctorId, reason);
    setIsDisapprovePopupOpen(false);
  };

  return (
    <div className="flex space-x-4 mt-4">
      <button
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        onClick={handleApprove}
      >
        อนุมัติ
      </button>
      <button
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        onClick={() => setIsDisapprovePopupOpen(true)}
      >
        ไม่อนุมัติ
      </button>

      {isDisapprovePopupOpen && (
        <DisapproveReasonPopup
          doctorName={doctorName}
          onClose={() => setIsDisapprovePopupOpen(false)}
          onConfirm={handleDisapproveConfirm}
        />
      )}
    </div>
  );
}

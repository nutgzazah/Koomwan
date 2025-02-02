import React from "react";

interface StatusBadgeProps {
  status: "pending" | "approve" | "disapprove";
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const statusColor =
    status === "approve" ? "text-normal" : status === "disapprove" ? "text-abnormal" : "text-primary";

  return (
    <span className={`${statusColor} text-detail_2`}>
      {status === "pending" ? "รออนุมัติ" : status === "approve" ? "อนุมัติแล้ว" : "ไม่อนุมัติ"}
    </span>
  );
}

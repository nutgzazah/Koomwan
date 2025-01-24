import React from "react";

interface StatusBadgeProps {
  status: "pending" | "approve" | "disapprove";
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const statusColor =
    status === "approve" ? "text-green-500" : status === "disapprove" ? "text-red-500" : "text-gray-500";

  return (
    <span className={`${statusColor} font-bold`}>
      {status === "pending" ? "รออนุมัติ" : status === "approve" ? "อนุมัติแล้ว" : "ไม่อนุมัติ"}
    </span>
  );
}

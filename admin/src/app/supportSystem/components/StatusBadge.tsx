import React from "react";

interface StatusBadgeProps {
  status: "pending" | "handled";
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const statusColor = status === "handled" ? "text-green-500" : "text-yellow-500";

  return (
    <span className={`${statusColor} font-bold`}>
      {status === "pending" ? "รออนุมัติ" : "จัดการแล้ว"}
    </span>
  );
}

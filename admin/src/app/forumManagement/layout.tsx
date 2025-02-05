'use client';

import React, { ReactNode } from "react";

interface ForumManagementProps {
  children: ReactNode;
}

export default function ForumLayout({ children }: ForumManagementProps) {
  return (
    <div className="flex flex-col items-center min-h-screen space-y-4">
      <div className="w-full p-4">
        <h2 className="text-headline_2 text-secondary text-left border-b-2 border-ourGray pb-4 mb-4">จัดการฟอรั่ม</h2>
        {children}
      </div>
    </div>
  );
}

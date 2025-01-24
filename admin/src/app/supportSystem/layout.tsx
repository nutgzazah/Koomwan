'use client';

import React, { ReactNode } from "react";

interface SupportManagementProps {
  children: ReactNode;
}

export default function SupportLayout({ children }: SupportManagementProps) {
  return (
    <div className="flex flex-col items-center min-h-screen space-y-4">
      <div className="w-full p-4">
        <h2 className="text-display text-secondary text-left border-b-2 pb-4 mb-4">ปัญหาที่พบโดยผู้ใช้</h2>
        {children}
      </div>
    </div>
  );
}

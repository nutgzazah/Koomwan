'use client';

import React, { ReactNode } from "react";

interface MedicalManagementProps {
  children: ReactNode;
}

export default function MedicalLayout({ children }: MedicalManagementProps) {
  return (
    <div className="flex flex-col items-center min-h-screen space-y-4">
      <div className="w-full p-4">
        <h2 className="text-headline_2 text-secondary text-left border-b-2 border-ourGray pb-4 mb-4">จัดการแพทย์</h2>
        {children}
      </div>
    </div>
  );
}

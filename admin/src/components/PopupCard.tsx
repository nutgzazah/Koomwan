import React from "react";

interface PopupCardProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  className?: string;
}

export default function PopupCard({ title, children, onClose, className }: PopupCardProps) {
  return (
    <div className={"fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"}>
      <div className={`bg-white p-6 rounded-lg shadow-lg w-96 relative ${className || ''}`}>
        <div className="flex justify-between items-center w-full">
          <h2 className="text-lg font-semibold flex-1 text-center pb-2">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-red-500 absolute top-2 right-3"
          >
            ✖
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

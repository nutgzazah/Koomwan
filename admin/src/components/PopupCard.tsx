import React from "react";

interface PopupCardProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

export default function PopupCard({ title, children, onClose }: PopupCardProps) {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            ✖
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

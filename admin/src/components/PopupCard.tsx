import React from "react";

interface PopupCardProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

export default function PopupCard({ title, children, onClose }: PopupCardProps) {
  return (
    <div className="popup-overlay">
      <div className="popup-content relative">
        <div className="flex justify-between items-center w-full">
          <h2 className="text-headline_2 flex-1 text-center pb-2">{title}</h2>
          <button
            onClick={onClose}
            className="text-secondary hover:text-hoverAbnormal absolute top-2 right-3"
          >
            ✖
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

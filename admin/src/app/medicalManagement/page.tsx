'use client';

import React, { useState } from "react";
import DoctorTable from "./components/DoctorTable";
import { DoctorInterface } from "@/interfaces/doctorInterface";
import { statusMapping } from "@/utils/statusMapping";
import doctors from "../../data/doctors.json";

export default function MedicalManagement() {
  const doctorList = doctors as DoctorInterface[];

  const [filterStatus, setFilterStatus] = useState<string>("รออนุมัติ");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredDoctors = doctorList.filter((doctor) => {
    const status = Object.keys(statusMapping).find(
      (key) => statusMapping[key] === filterStatus
    );

    const searchInFields = [
      `${doctor.first_name} ${doctor.last_name}`
    ]
      .join(" ") 
      .toLowerCase();

    return (
      doctor.approval === status &&
      searchInFields.startsWith(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="flex flex-col items-center min-h-screen w-full space-y-4">
      
      {/* Filter Buttons */}
      <div className="flex w-full space-x-4">
        {Object.values(statusMapping).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`w-full ${
              filterStatus === status
                ? "btn blue-btn long-btn"
                : "btn white-btn long-btn"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <input
        type="text"
        placeholder="ค้นหาด้วยชื่อ-นามสกุล..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="input"
      />

      {/* Doctor Table */}
        <div className="w-full">
          <DoctorTable doctors={filteredDoctors} />
        </div>
  </div>
  );
}

'use client';

import React, { useState, useEffect } from "react";
import axios from "axios";
import DoctorTable from "./components/DoctorTable";
import { DoctorInterface } from "@/interfaces/doctorInterface";
import { statusMapping } from "@/utils/statusMapping";

export default function MedicalManagement() {
  const [doctorList, setDoctorList] = useState<DoctorInterface[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("รออนุมัติ");
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/v1/admin/doctor");
        console.log("Fetched doctor data:", response.data.data);
        setDoctorList(response.data.data);
      } catch (error) {
        console.error("Error fetching doctor data:", error);
      }
    };

    fetchDoctors();
  }, []);

  const filteredDoctors = doctorList.filter((doctor) => {
    const statusKey = Object.keys(statusMapping).find(
      (key) => key === doctor.approval.status 
    );
    const status = statusKey ? statusMapping[statusKey] : "";

    const searchInFields = [
      `${doctor.firstname} ${doctor.lastname}`
    ]
      .join(" ") 
      .toLowerCase();

    return (
      status === filterStatus &&
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

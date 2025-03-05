'use client';

import React, { useState, useEffect } from "react";
import ReportTable from "./components/ReportTable";
import axios from "axios";
import { ReportDataInterface } from "@/interfaces/reportInterface";
import { statusReport } from "@/utils/statusMapping";

export default function SupportSystem() {
  const [reportList, setReportList] = useState<ReportDataInterface[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>(statusReport.pending);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/v1/admin/report");
        console.log("Fetched report data:", response.data.data);
        setReportList(response.data.data);
      } catch (error) {
        console.error("Error fetching report data:", error);
      }
    };

    fetchReports();
  }, []);

  const filteredReport = reportList.filter((report) => {
    const statusKey = Object.keys(statusReport).find(
      (key) => statusReport[key] === filterStatus
    );
    return report.status === statusKey;
  });

  return (
    <div className="flex flex-col items-center min-h-screen w-full space-y-4">
      
      {/* Filter Buttons */}
      <div className="flex w-full space-x-4">
        {Object.values(statusReport).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`w-full ${
              filterStatus === status ? "btn blue-btn long-btn" : "btn white-btn long-btn"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <ReportTable reports={filteredReport} />
    </div>
  );
}

'use client';

import React, { useState } from "react";
import ReportTable from "./components/ReportTable";
import reports from "../../data/report.json";
import { ReportDataInterface } from "@/interfaces/reportInterface";
import { statusReport } from "@/utils/statusMapping";

export default function SupportSystem() {
  const reportList = reports as ReportDataInterface[];
  const [filterStatus, setFilterStatus] = useState<string>(statusReport.pending);

  const filteredReport = reportList.filter((report) => {
    const statusKey = Object.keys(statusReport).find(
      (key) => statusReport[key] === filterStatus
    );
    return report.resolved === statusKey;
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

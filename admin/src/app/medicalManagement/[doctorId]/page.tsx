"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { DoctorInterface } from "@/interfaces/doctorInterface";
import Image from "next/image";
import StatusBadge from "../components/StatusBadge";
import DisapproveReasonPopup from "../components/DisapproveReason";
import ApprovePopup from "../components/ApprovePopup";

const DoctorID: React.FC = () => {
  const params = useParams();
  const doctorId = params?.doctorId || params?.id;

  const [doctor, setDoctor] = useState<DoctorInterface | null>(null);
  const [isDisapprovePopupOpen, setIsDisapprovePopupOpen] = useState(false);
  const [isApprovePopupOpen, setIsApprovePopupOpen] = useState(false);

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!doctorId) return;

      try {
        const response = await axios.get(`http://localhost:8080/api/v1/admin/doctor/${doctorId}`);
        console.log("Fetched doctor data:", response.data);

        setDoctor(response.data.data || response.data);
      } catch (error) {
        console.error("Error fetching doctor data:", error);
      }
    };

    fetchDoctor();
  }, [doctorId]);

  if (!doctor) {
    return (
      <div className="text-center p-4">
        <p className="text-abnormal">ไม่พบข้อมูลของแพทย์</p>
      </div>
    );
  }

  const handleApprove = async () => {
    if (!doctorId) return;
  
    try {
      const response = await axios.put(`http://localhost:8080/api/v1/admin/doctor/status/${doctorId}`, {
        status: "approve",
      });
  
      console.log("Doctor approved:", response.data);
      setDoctor((prev) => prev ? { ...prev, approval: { ...prev.approval, status: "approve" } } : prev);
      setIsApprovePopupOpen(false);
    } catch (error) {
      console.error("Error approving doctor:", error);
    }
  };  

  const handleDisapprove = () => {
    setIsDisapprovePopupOpen(true);
  };

  const handleDisapproveConfirm = async (reason: string) => {
    if (!doctorId) return;
  
    try {
      const response = await axios.put(`http://localhost:8080/api/v1/admin/doctor/status/${doctorId}`, {
        status: "disapprove",
        reason: reason,
      });
  
      console.log("Doctor disapproved:", response.data);
      setDoctor((prev) => prev ? { ...prev, approval: { status: "disapprove", reason: reason } } : prev);
      setIsDisapprovePopupOpen(false);
    } catch (error) {
      console.error("Error disapproving doctor:", error);
    }
  };
  

  return (
    <div className="w-full">
      <div className="flex justify-between w-full py-2 px-10 gap-20">
        {/* Image Section */}
        <div className="w-2/5 h-96 flex justify-center items-center">
            <Image
              src="/assets/doctor-default.jpg"
              alt="Default profile"
              width={300}
              height={300}
              className="rounded-full"
            />
        
        {/* {doctor.image ? (
          <Image
            src={doctor.image}
            alt={`${doctor.firstname} ${doctor.lastname}'s profile`}
            width={300}
            height={300}
            className="rounded-full"
          />
          ) : (
            <Image
              src="/assets/doctor-default.jpg"
              alt="Default profile"
              width={300}
              height={300}
              className="rounded-full"
            />
          )
        } */}

        </div>

        {/* Details Section */}
        <div className="flex justify-start items-center w-3/5">
          <table className="w-full text-left text-secondary">
            <tbody>
              <tr>
                <td className="text-bold_detail py-2">ชื่อ-นามสกุล</td>
                <td className="py-2 text-detail_2">{doctor.firstname} {doctor.lastname}</td>
              </tr>
              <tr>
                <td className="text-bold_detail py-2">อาชีพ</td>
                <td className="py-2 text-detail_2">{doctor.occupation}</td>
              </tr>
              <tr>
                <td className="text-bold_detail py-2">เบอร์โทรศัพท์</td>
                <td className="py-2 text-detail_2">{doctor.phone}</td>
              </tr>
              <tr>
                <td className="text-bold_detail py-2">Username</td>
                <td className="py-2 text-detail_2">{doctor.username}</td>
              </tr>
              <tr>
                <td className="text-bold_detail py-2">ด้านที่เชี่ยวชาญ</td>
                <td className="py-2 text-detail_2">{doctor.expert || "ไม่มีข้อมูล"}</td>
              </tr>
              <tr>
                <td className="text-bold_detail py-2">เอกสารประกอบทางการแพทย์</td>
                <td className="py-2 text-detail_2">
                  <a
                    href={doctor.document || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    คลิกเพื่อดูรายละเอียด
                  </a>
                </td>
              </tr>
              <tr>
                <td className="text-bold_detail py-2">สถานะ</td>
                <td className="py-2 text-detail_2">
                  <StatusBadge status={doctor.approval.status} />
                </td>
              </tr>
              {doctor.approval.status === "disapprove" && doctor.approval.reason && (
                <tr>
                  <td className="font-bold py-2">เหตุผล</td>
                  <td className="py-2 text-detail_2 text-abnormal">{doctor.approval.reason}</td>
                </tr>
              )}
              <tr>
                <td className="text-bold_detail py-2">จัดการสถานะ</td>
                <td>
                  <div className="flex flex-row gap-5">
                    {doctor.approval.status === "pending" && (
                      <>
                        <button
                          className="btn green-btn short-btn"
                          onClick={handleApprove}
                        >
                          อนุมัติ
                        </button>
                        <button
                          className="btn red-btn short-btn"
                          onClick={handleDisapprove}
                        >
                          ไม่อนุมัติ
                        </button>
                      </>
                    )}

                    {doctor.approval.status === "approve" && (
                      <button
                        className="btn red-btn short-btn"
                        onClick={handleDisapprove}
                      >
                        ยกเลิกการอนุมัติ
                      </button>
                    )}

                    {doctor.approval.status === "disapprove" && (
                      <button
                        className="btn green-btn short-btn"
                        onClick={handleApprove}
                      >
                        แก้ไขเป็นอนุมัติ
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {isDisapprovePopupOpen && (
        <DisapproveReasonPopup
          doctorName={`${doctor.firstname} ${doctor.lastname}`}
          onClose={() => setIsDisapprovePopupOpen(false)}
          onConfirm={handleDisapproveConfirm}
        />
      )}

      {isApprovePopupOpen && (
        <ApprovePopup
          doctorName={`${doctor.firstname} ${doctor.lastname}`}
          onClose={() => setIsApprovePopupOpen(false)}
        />
      )}
    </div>
  );
};

export default DoctorID;

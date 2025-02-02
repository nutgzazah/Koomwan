"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { DoctorInterface } from "@/interfaces/doctorInterface";
import doctors from "@/data/doctors.json"
import Image from "next/image";
import StatusBadge from "../components/StatusBadge";
import DisapproveReasonPopup from "../components/DisapproveReason";
import ApprovePopup from "../components/ApprovePopup";

const transformData = (data: DoctorInterface[]) => {
  if (!Array.isArray(data)) return [];
  return data.map((item, index) => ({
    transID: index + 1,
    doctorId: item.doctor_id,
    username: item.username,
    email: item.email,
    phone: item.phone,
    name: `${item.first_name} ${item.last_name}`,
    occupation: item.occupation,
    expert: item.expert || "ไม่มีข้อมูล",
    hospital: item.hospital,
    document: item.document || "#",
    approval: item.approval,
    reason: item.reason || "",
    image: item.image || "/assets/doctor-default.jpg",
  }));
};

const DoctorID: React.FC = () => {
  const { doctorId } = useParams();
  const transformedDoctors = transformData(doctors);

  const [isDisapprovePopupOpen, setIsDisapprovePopupOpen] = useState(false);
  const [isApprovePopupOpen, setIsApprovePopupOpen] = useState(false);

  const doctor = transformedDoctors.find(
    (d) => String(d.doctorId) === doctorId
  );

  if (!doctor) {
    return (
      <div className="text-center p-4">
        <p className="text-abnormal">ไม่พบข้อมูลของแพทย์</p>
      </div>
    );
  }

  const handleApprove = () => {
    setIsApprovePopupOpen(true);
  };

  const handleDisapprove = () => {
    setIsDisapprovePopupOpen(true);
  };

  const handleDisapproveConfirm = (reason: string) => {
    console.log("Disapproving doctor with reason:", reason);
    setIsDisapprovePopupOpen(false);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between w-full py-2 px-10 gap-20">
        {/* Image Section */}
        <div className="w-2/5 h-96 flex justify-center items-center">
          <Image
            src={doctor.image}
            alt={`${doctor.name}'s profile`}
            width={300}
            height={300}
            className="rounded-full"
          />
        </div>

        {/* Details Section */}
        <div className="flex justify-start items-center w-3/5">
          <table className="w-full text-left">
            <tbody>
              <tr>
                <td className="text-bold_detail py-2">ชื่อ-นามสกุล</td>
                <td className="py-2 text-detail_2">{doctor.name}</td>
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
                <td className="py-2 text-detail_2">{doctor.expert}</td>
              </tr>
              <tr>
                <td className="text-bold_detail py-2">เอกสารประกอบทางการแพทย์</td>
                <td className="py-2 text-detail_2">
                  <a
                    href={doctor.document}
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
                  <StatusBadge status={doctor.approval} />
                </td>
              </tr>
              {doctor.approval === "disapprove" && doctor.reason && (
                <tr>
                  <td className="font-bold py-2">เหตุผล</td>
                  <td className="py-2 text-detail_2 text-abnormal">{doctor.reason}</td>
                </tr>
              )}
              <tr>
                <td className="text-bold_detail py-2">จัดการสถานะ</td>
                <td>
                  <div className="flex flex-row gap-5">
                    {doctor.approval === "pending" && (
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

                    {doctor.approval === "approve" && (
                      <button
                        className="btn red-btn short-btn"
                        onClick={handleDisapprove}
                      >
                        ยกเลิกการอนุมัติ
                      </button>
                    )}

                    {doctor.approval === "disapprove" && (
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
          doctorName={doctor.name}
          onClose={() => setIsDisapprovePopupOpen(false)}
          onConfirm={handleDisapproveConfirm}
        />
      )}

      {isApprovePopupOpen && (
        <ApprovePopup
          doctorName={doctor.name}
          onClose={() => setIsApprovePopupOpen(false)}
        />
      )}
    </div>
  );
};

export default DoctorID;

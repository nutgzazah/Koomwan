import React from "react";
import Table from "@/components/Table";
import { useRouter } from "next/navigation";
import { DoctorInterface } from "@/interfaces/doctorInterface";
import { statusMapping } from "@/utils/statusMapping";

interface DoctorTableProps {
  doctors: DoctorInterface[];
}

const DoctorTable: React.FC<DoctorTableProps> = ({ doctors }) => {
  const router = useRouter(); 

  const headers = ["ลำดับ", "ชื่อ-นามสกุล", "ชื่อบัญชีผู้ใช้", "อาชีพ", "เบอร์โทรศัพท์", "อีเมล", "สถานะ"];

  const data = doctors.map((doctor, index) => [
    index + 1, 
    `${doctor.firstname} ${doctor.lastname}`,
    doctor.username,
    doctor.occupation,
    doctor.phone,
    doctor.email,
    statusMapping[doctor.approval.status] || "สถานะไม่ทราบ",
  ]);

  const handleRowClick = (rowData: (string | React.ReactNode)[]) => {
    const doctorIndex = Number(rowData[0]) - 1;
    const doctor = doctors[doctorIndex]; 

    if (doctor?._id) {
      router.push(`/medicalManagement/${doctor._id}`); 
    } else {
      console.warn("Invalid doctor ID:", doctor?._id);
    }
  };

  return (
    <div>
      <Table headers={headers} data={data} onRowClick={handleRowClick} />
    </div>
  );
};

export default DoctorTable;

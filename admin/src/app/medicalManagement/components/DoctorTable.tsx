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
    `${doctor.first_name} ${doctor.last_name}`,
    doctor.username,
    doctor.occupation,
    doctor.phone,
    doctor.email,
    statusMapping[doctor.approval] || "สถานะไม่ทราบ",
  ]);

  const handleRowClick = (rowData: (string | React.ReactNode)[]) => {
    const doctorIndex = Number(rowData[0]); 
    const doctor = doctors[doctorIndex - 1]; 
    if (doctor && doctor.doctor_id) {
      router.push(`/medicalManagement/${doctor.doctor_id}`); 
    } else {
      console.warn("Invalid doctor ID:", doctor?.doctor_id);
    }
  };

  return (
    <div>
      <Table headers={headers} data={data} onRowClick={handleRowClick} />
    </div>
  );
};

export default DoctorTable;

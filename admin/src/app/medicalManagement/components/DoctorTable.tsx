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

  const columnAlignment = [
    "text-center", // ลำดับ
    "text-left",   // ชื่อ-นามสกุล	
    "text-left",   // ชื่อบัญชีผู้ใช้
    "text-center",   // อาชีพ
    "text-center", // เบอร์โทรศัพท์	
    "text-left", // อีเมล
    "text-center", // สถานะ
  ];

  const columnWidths = [
    "w-12",  // ลำดับ
    "w-36",  // ชื่อ-นามสกุล	
    "w-24",  // ชื่อบัญชีผู้ใช้
    "w-20",  // อาชีพ
    "w-24",  // เบอร์โทรศัพท์	
    "w-32",  // อีเมล
    "w-24", // สถานะ
  ];

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
      <Table 
        headers={headers} 
        data={data} 
        onRowClick={handleRowClick} 
        columnAlignment={columnAlignment} 
        columnWidths={columnWidths} 
      />
    </div>
  );
};

export default DoctorTable;

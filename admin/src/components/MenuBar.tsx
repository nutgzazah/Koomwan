'use client'

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MenuBar() {
    const currentPath = usePathname();

    const menuItems = [
        {
            href: "/medicalManagement",
            label: "จัดการแพทย์",
            icons: {
                default: "/assets/medicalBlack.png",
                active: "/assets/medicalBlue.png",
            },
        },
        {
            href: "/articleManagement",
            label: "จัดการบทความ",
            icons: {
                default: "/assets/resourceBlack.png",
                active: "/assets/resourceBlue.png",
            },
        },
        {
            href: "/forumManagement",
            label: "จัดการฟอรั่ม",
            icons: {
                default: "/assets/forumBlack.png",
                active: "/assets/forumBlue.png",
            },
        },
        {
            href: "/supportSystem",
            label: "ระบบให้ความช่วยเหลือ",
            icons: {
                default: "/assets/reportBlack.png",
                active: "/assets/reportBlue.png",
            },
        },
    ];

    return (
        <div className="flex flex-col items-center w-full h-full bg-white drop-shadow-md px-4">
            <div className="flex flex-col items-center w-full border-b-2 p-4">
                <div className="flex items-center justify-center mb-2">
                    <Image
                        src="/assets/koomwanIcon.png"
                        alt="logo"
                        width={64}
                        height={64}
                        className="w-16 h-16"
                    />
                </div>
                <h1 className="text-display text-secondary">คุมหวาน</h1>
                <p className="text-headline text-secondary">ระบบจัดการหลังบ้าน</p>
            </div>
            <div className="flex flex-col w-full">
                {menuItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex justify-start items-center h-12 px-2 text-description ${
                            currentPath === item.href
                                ? "text-primary border-b-4 border-primary font-semibold"
                                : "text-secondary hover:text-primary"
                        }`}
                    >
                        <Image
                            src={currentPath === item.href ? item.icons.active : item.icons.default}
                            alt={`${item.label} icon`}
                            width={24}
                            height={24}
                            className="w-5 h-5"
                        />
                        <span className="ml-2">{item.label}</span>
                    </Link>
                ))}
            </div>
            <div className="mt-auto w-full text-center py-4">
                <button className="w-full p-3 text-card text-sub-button bg-abnormal rounded hover:bg-red-500 hover:font-semibold">
                    ล็อกเอาท์
                </button>
            </div>
        </div>
    );
}

"use client";

import { usePathname } from "next/navigation";
import MenuBar from "@/components/MenuBar";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/authenrize/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex w-full h-screen">
      <div className="flex w-1/6 h-full"> 
        <MenuBar /> 
      </div>
      <div className="w-5/6 h-full overflow-auto">
        {children}
      </div>
    </div>
  );
}

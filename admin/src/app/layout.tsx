import type { Metadata } from "next";
import "./globals.css";
import MenuBar from "@/components/MenuBar";


export const metadata: Metadata = {
  title: "KoomWan Admin Panel",
  description: "Admin panel for managing KoomWan applications, built with Next.js.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex w-full h-screen">
        <div className="flex w-1/6 h-full"> 
          <MenuBar /> 
        </div>
        <div className="w-5/6 h-full overflow-auto">
          {children}
        </div>
      </body>
    </html>
  );
}

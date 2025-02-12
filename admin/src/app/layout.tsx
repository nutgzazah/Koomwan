import type { Metadata } from "next";
import LayoutWrapper from "@/components/LayoutWrapper";
import "./globals.css";

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
      <body>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}

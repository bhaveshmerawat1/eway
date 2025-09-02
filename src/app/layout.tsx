import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { EmployeeProvider } from "@/context/EmployeeContext";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "E-way",
  description: "E-way",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <body
        className={`${geistSans.variable} antialiased`}
        >
        <EmployeeProvider>{children}</EmployeeProvider>
        </body>
    </html>
  );
}

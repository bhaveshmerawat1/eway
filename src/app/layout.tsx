import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import localFont from "next/font/local";
import { AppProvider } from "@/context/AppContext";


const myFont = localFont({
  src: [
    {
      path: '../../public/fonts/TT-Norms-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/TT-Norms-Medium.otf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/TT-Norms-Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/TT-Norms-Extra-Bold.otf',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-myfont',
})

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
          className={`${myFont.variable} antialiased`}
        >
          <AppProvider>{children}</AppProvider>
        </body>
    </html>
  );
}

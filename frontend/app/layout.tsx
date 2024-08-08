import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SocketProvider } from "@/context/socketContext";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SendToGroup",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={"h-screen bg-gradient-to-t from-[#19191c] to-[#281a21]"}>
        <SocketProvider>
          <Toaster />
          <Navbar />
          {children}
        </SocketProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import { SocketProvider } from "@/context/socketContext";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";


export const metadata: Metadata = {
  title: "SendToGroup",
  description: "Send Files anywhere to group",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="">
        <SocketProvider>
          <Toaster />
          <Navbar />
          {children}
        </SocketProvider>
      </body>
    </html>
  );
}

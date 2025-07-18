import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./provider";
import { AppProvider } from "@/contexts/app";
import { ApiProvider } from "@/contexts/api";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LayoutNavbar from "@/components/ui/layout-navbar";
import AuthMiddleware from "./authMiddle";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Project Management",
  description: "Project Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html data-theme="dark" lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToastContainer />
        <Providers>
          <AppProvider>
            <ApiProvider>
                <LayoutNavbar>
                  <AuthMiddleware>{children}</AuthMiddleware>
                </LayoutNavbar>
            </ApiProvider>
          </AppProvider>
        </Providers>
      </body>
    </html>
  );
}

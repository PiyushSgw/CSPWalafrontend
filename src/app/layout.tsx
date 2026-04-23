import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ReduxProvider from "../components/ReduxProvider";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CSPWala — Operator Portal",
  description: "CSP Passbook Portal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} font-sans bg-slate-50 text-slate-800 min-h-screen`}
      >
        <ReduxProvider>
          {/* Toast Notifications */}
          <Toaster position="top-right" />

          {/* App Pages */}
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
"use client";

import { ReactNode } from "react";
import Header from "@/app/components/Header";
import Sidebar from "@/app/components/Sidebar";
import { AnalysisProvider } from "./context/AnalysisContext";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AnalysisProvider>
      <div className="min-h-screen" style={{ background: "var(--background)" }}>
        <Header />
        <Sidebar />
        <div
          className="fixed right-4 bottom-4 mt-1"
          style={{ left: "calc(var(--sidebar-width, 248px) + 28px)", top: 104 }}
        >
          <div className="card h-full w-full overflow-auto p-6">
            {children}
          </div>
        </div>
      </div>
    </AnalysisProvider>
  );
}

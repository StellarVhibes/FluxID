"use client";

import { ReactNode } from "react";
import Header from "@/app/components/Header";
import Sidebar from "@/app/components/Sidebar";
import { AnalysisProvider } from "./context/AnalysisContext";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AnalysisProvider>
      <div className="min-h-screen" style={{ background: "var(--background)" }}>
        <Sidebar />
        <div
          className="fixed left-4 right-4 bottom-[84px] top-[104px] lg:right-4 lg:bottom-4 transition-all duration-300"
          style={{ 
            "--lg-left": "calc(var(--sidebar-width, 248px) + 28px)"
          } as React.CSSProperties}
        >
          <style dangerouslySetInnerHTML={{__html: `
            @media (min-width: 1024px) {
              .dashboard-main { left: var(--lg-left) !important; bottom: 16px !important; }
            }
          `}} />
          <div className="card h-full w-full relative overflow-hidden dashboard-main" style={{ left: 0, bottom: 0 }}>
            {/* Background Image */}
            <div className="absolute inset-0 flex items-center justify-end pointer-events-none z-0">
              <img 
                src="/3d-imgs-assest/fluxid_hero_illustration.png" 
                alt="Dashboard Background" 
                className="w-[800px] md:w-[1200px] max-w-none object-contain opacity-[0.15] -rotate-12 blur-[2px] translate-x-32"
              />
            </div>

            {/* Scrollable Content */}
            <div className="absolute inset-0 overflow-auto p-6 z-10">
              {children}
            </div>
          </div>
        </div>
      </div>
    </AnalysisProvider>
  );
}

"use client";

import { ReactNode } from "react";
import Navbar from "./Navbar";
import AIChat from "./AIChat";
import { ToastProvider } from "./Toast";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <Navbar />
      {children}
      <AIChat />
    </ToastProvider>
  );
}

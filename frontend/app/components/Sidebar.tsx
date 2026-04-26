"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useAnimation } from "framer-motion";
import {
  LayoutDashboard,
  BarChart3,
  Settings,
  ArrowLeftRight,
  Sparkles,
  Bot,
  ChevronLeft,
  ChevronRight,
  Home,
  Activity,
} from "lucide-react";


const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  {
    href: "/dashboard/transactions",
    label: "Transactions",
    icon: ArrowLeftRight,
  },
  {
    href: "/dashboard/protocol",
    label: "Protocol Intelligence",
    icon: Activity,
  },
  { href: "/dashboard/insights", label: "Insights", icon: Sparkles },

  { href: "/dashboard/agent", label: "Agent Demo", icon: Bot },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function useSidebarWidth() {
  const [width, setWidth] = useState(248);

  useEffect(() => {
    const handleResize = () => {
      const sidebar = document.querySelector("[data-sidebar]");
      if (sidebar) {
        setWidth(sidebar.clientWidth);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 248 }}
      onUpdate={(latest) => {
        document.documentElement.style.setProperty(
          "--sidebar-width",
          `${latest.width}px`,
        );
      }}
      data-sidebar
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: 20,
      }}
      className="fixed left-4 top-[104px] bottom-4 mt-1 flex flex-col overflow-hidden z-30"
    >
      <nav className="flex-1 space-y-1 py-4 px-3 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                isActive
                  ? "bg-[var(--primary)] text-[var(--background)]"
                  : "text-[var(--foreground-muted)] hover:bg-[var(--surface)] hover:text-[var(--foreground)]"
              }`}
              style={isActive ? { fontWeight: 600 } : {}}
            >
              <Icon size={18} />
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{
                  opacity: collapsed ? 0 : 1,
                  width: collapsed ? 0 : "auto",
                }}
                transition={{ duration: 0.2 }}
                style={{
                  fontSize: 14,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                }}
              >
                {item.label}
              </motion.span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[var(--border)] pt-3 pb-3 px-3 space-y-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-[var(--foreground-muted)] hover:bg-[var(--surface)] hover:text-[var(--foreground)] transition-all"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{
              opacity: collapsed ? 0 : 1,
              width: collapsed ? 0 : "auto",
            }}
            transition={{ duration: 0.2 }}
            style={{
              fontSize: 14,
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            Collapse
          </motion.span>
        </button>

        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[var(--foreground-muted)] hover:bg-[var(--surface)] hover:text-[var(--foreground)] transition-all"
        >
          <Home size={18} />
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{
              opacity: collapsed ? 0 : 1,
              width: collapsed ? 0 : "auto",
            }}
            transition={{ duration: 0.2 }}
            style={{
              fontSize: 14,
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            Back to Home
          </motion.span>
        </Link>
      </div>
    </motion.aside>
  );
}

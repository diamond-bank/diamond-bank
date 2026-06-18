"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Send, 
  History, 
  CreditCard, 
  User, 
  LogOut, 
  Diamond,
  TrendingUp,
  Settings,
  ShieldCheck,
  HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/app/actions/auth";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: Send, label: "Transfer", href: "/dashboard/transfer" },
  { icon: History, label: "Transactions", href: "/dashboard/transactions" },
  { icon: CreditCard, label: "My Accounts", href: "/dashboard/accounts" },
  { icon: TrendingUp, label: "Investments", href: "/dashboard/investments" },
  { icon: ShieldCheck, label: "System Admin", href: "/dashboard/admin" },
  { icon: HelpCircle, label: "Customer Support", href: "/dashboard/support" },
  { icon: User, label: "Profile", href: "/dashboard/profile" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col sticky top-0">
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center space-x-3 text-blue-600">
          <Diamond size={32} />
          <span className="text-xl font-bold text-slate-900 tracking-tight">Diamond</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium",
              pathname === item.href
                ? "bg-blue-50 text-blue-600"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100 space-y-4">
        <div className="px-4 py-3 bg-slate-50 rounded-xl">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Network Status</span>
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="flex items-center text-xs font-bold text-green-600">
            <span>Secure Connection Active</span>
          </div>
        </div>
        
        <button
          onClick={() => logoutAction()}
          className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 font-medium"
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}

import { db } from "@/db";
import { accounts } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { formatCurrency } from "@/lib/utils";
import { ShieldCheck, Plus, CreditCard, ChevronRight } from "lucide-react";
import Link from "next/link";

export default async function AccountsPage() {
  const session = await getSession();
  const userAccounts = await db.query.accounts.findMany({
    where: eq(accounts.userId, session.user.id),
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Accounts</h1>
          <p className="text-slate-500">Manage your checking, savings and investment accounts.</p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold transition-colors shadow-sm">
          <Plus size={18} />
          <span>New Account</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {userAccounts.map((acc) => (
          <div key={acc.id} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-blue-300 transition-all">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-12">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                  <CreditCard size={24} />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.2em] mb-1">{acc.accountType}</p>
                  <div className="h-1.5 w-12 bg-blue-600 ml-auto rounded-full"></div>
                </div>
              </div>
              
              <div className="space-y-1 mb-8">
                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Account Balance</p>
                <p className="text-4xl font-extrabold text-slate-900 tracking-tight">{formatCurrency(acc.balance)}</p>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                <div className="space-y-0.5">
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Account Number</p>
                  <p className="font-mono text-slate-700 text-sm font-bold">{acc.accountNumber.replace(/(.{4})/g, '$1 ')}</p>
                </div>
                <button className="p-2 bg-slate-50 rounded-full text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
            
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-slate-50 rounded-full group-hover:scale-110 group-hover:bg-blue-50/50 transition-all duration-500"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

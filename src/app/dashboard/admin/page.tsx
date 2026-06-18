import { db } from "@/db";
import { accounts, users } from "@/db/schema";
import { formatCurrency } from "@/lib/utils";
import DepositForm from "@/components/DepositForm";

import { toggleBlockAction } from "@/app/actions/banking";
import { Lock, Unlock } from "lucide-react";
import BlockToggle from "@/components/BlockToggle";

export default async function AdminPage() {
  const allAccounts = await db.query.accounts.findMany({
    with: {
      user: true,
    },
    orderBy: (accounts, { desc }) => [desc(accounts.createdAt)],
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">System Management</h1>
        <p className="text-slate-500">Overview of all active accounts and financial controls.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100">
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Account Number</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Balance</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {allAccounts.map((acc) => (
              <tr key={acc.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                   <div className="font-medium text-slate-900">{acc.user.name}</div>
                   <div className="text-xs text-slate-400">{acc.accountType.toUpperCase()}</div>
                </td>
                <td className="px-6 py-4 text-slate-600 font-mono text-sm">{acc.accountNumber}</td>
                <td className="px-6 py-4">
                  {acc.isBlocked === 1 ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-red-50 text-red-600">
                      <Lock size={10} className="mr-1" /> BLOCKED
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-green-50 text-green-600">
                      <Unlock size={10} className="mr-1" /> ACTIVE
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 font-bold text-slate-900">{formatCurrency(acc.balance)}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end space-x-4">
                    <BlockToggle accountId={acc.id} isBlocked={acc.isBlocked === 1} />
                    <DepositForm accountId={acc.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

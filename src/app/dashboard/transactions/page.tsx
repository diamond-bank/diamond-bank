import { db } from "@/db";
import { accounts, transactions } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq, or, desc } from "drizzle-orm";
import { formatCurrency, cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownLeft, Search, Filter, Download } from "lucide-react";

export default async function TransactionsPage() {
  const session = await getSession();
  const userId = session.user.id;

  const userAccounts = await db.query.accounts.findMany({
    where: eq(accounts.userId, userId),
  });

  const accountIds = userAccounts.map(a => a.id);
  
  const allTransactions = await db.query.transactions.findMany({
    where: or(
      ...accountIds.map(id => eq(transactions.senderAccountId, id)),
      ...accountIds.map(id => eq(transactions.receiverAccountId, id))
    ),
    with: {
      senderAccount: { with: { user: true } },
      receiverAccount: { with: { user: true } },
    },
    orderBy: [desc(transactions.createdAt)],
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Transaction History</h1>
          <p className="text-slate-500">Track and manage your spending habits.</p>
        </div>
        <div className="flex space-x-2">
          <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 font-semibold hover:bg-slate-50 transition-colors">
            <Filter size={18} />
            <span>Filter</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 font-semibold hover:bg-slate-50 transition-colors">
            <Download size={18} />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search history..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100">
                <th className="px-6 py-4">Transaction</th>
                <th className="px-6 py-4">Account</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {allTransactions.map((tx) => {
                const isOutgoing = accountIds.includes(tx.senderAccountId!);
                const accountUsed = isOutgoing ? tx.senderAccount : tx.receiverAccount;
                
                return (
                  <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center",
                          isOutgoing ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
                        )}>
                          {isOutgoing ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                        </div>
                        <span className="font-bold text-slate-900">{tx.description}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600 font-medium">
                        {accountUsed?.accountType} •••• {accountUsed?.accountNumber.slice(-4)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(tx.createdAt).toLocaleDateString("en-US", { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        tx.type === 'deposit' ? "bg-blue-50 text-blue-600" : 
                        tx.type === 'transfer' ? "bg-purple-50 text-purple-600" :
                        "bg-slate-100 text-slate-600"
                      )}>
                        {tx.type}
                      </span>
                    </td>
                    <td className={cn(
                      "px-6 py-4 text-right font-bold",
                      isOutgoing ? "text-red-600" : "text-green-600"
                    )}>
                      {isOutgoing ? "-" : "+"}{formatCurrency(tx.amount)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {allTransactions.length === 0 && (
            <div className="p-12 text-center text-slate-400">
              No transactions found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

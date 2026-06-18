import { db } from "@/db";
import { accounts, transactions } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq, or, desc } from "drizzle-orm";
import { formatCurrency } from "@/lib/utils";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  Wallet, 
  TrendingUp, 
  ShieldCheck,
  History as HistoryIcon
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await getSession();
  const userId = session.user.id;

  const userAccounts = await db.query.accounts.findMany({
    where: eq(accounts.userId, userId),
  });

  const totalBalance = userAccounts.reduce((acc, curr) => acc + Number(curr.balance), 0);

  const accountIds = userAccounts.map(a => a.id);
  
  const recentTransactions = await db.query.transactions.findMany({
    where: or(
      ...accountIds.map(id => eq(transactions.senderAccountId, id)),
      ...accountIds.map(id => eq(transactions.receiverAccountId, id))
    ),
    with: {
      senderAccount: { with: { user: true } },
      receiverAccount: { with: { user: true } },
    },
    orderBy: [desc(transactions.createdAt)],
    limit: 5,
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-500">Welcome back, {session.user.name}!</p>
        </div>
        <div className="flex space-x-3">
          <Link 
            href="/dashboard/transfer"
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold transition-colors shadow-sm"
          >
            <Plus size={18} />
            <span>Send Money</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <Wallet className="text-blue-100/50" size={24} />
              <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">Total Balance</span>
            </div>
            <h2 className="text-3xl font-extrabold">{formatCurrency(totalBalance)}</h2>
            <div className="mt-4 flex items-center text-blue-100 text-sm">
              <TrendingUp size={16} className="mr-1" />
              <span>+2.4% from last month</span>
            </div>
          </div>
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <ArrowUpRight className="text-green-500" size={24} />
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">Monthly Income</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">{formatCurrency(12450.00)}</h2>
          <p className="mt-4 text-slate-500 text-sm">Target: $15,000</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <ArrowDownLeft className="text-red-500" size={24} />
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">Monthly Spending</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">{formatCurrency(8320.40)}</h2>
          <p className="mt-4 text-slate-500 text-sm">12% lower than last month</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Recent Transactions</h3>
            <Link href="/dashboard/transactions" className="text-blue-600 text-sm font-semibold hover:underline">View All</Link>
          </div>
          
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            {recentTransactions.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HistoryIcon className="text-slate-300" size={32} />
                </div>
                <p className="text-slate-500 font-medium">No transactions found</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentTransactions.map((tx) => {
                  const isOutgoing = accountIds.includes(tx.senderAccountId!);
                  return (
                    <div key={tx.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center",
                          isOutgoing ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
                        )}>
                          {isOutgoing ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{tx.description || "No description"}</p>
                          <p className="text-xs text-slate-500">{new Date(tx.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={cn(
                          "font-bold",
                          isOutgoing ? "text-red-600" : "text-green-600"
                        )}>
                          {isOutgoing ? "-" : "+"}{formatCurrency(tx.amount)}
                        </p>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{tx.type}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Cards */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-900">My Accounts</h3>
          <div className="space-y-4">
            {userAccounts.map((acc) => (
              <div key={acc.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 transition-colors group">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-blue-50 transition-colors">
                    <ShieldCheck className="text-slate-500 group-hover:text-blue-600" size={20} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{acc.accountType}</span>
                </div>
                <p className="text-slate-500 text-xs mb-1">Account Number</p>
                <p className="font-mono text-slate-900 font-bold mb-3">{acc.accountNumber.replace(/(.{4})/g, '$1 ')}</p>
                <div className="flex items-end justify-between">
                  <p className="text-xl font-bold text-slate-900">{formatCurrency(acc.balance)}</p>
                  <Link href={`/dashboard/accounts/${acc.id}`} className="text-blue-600 text-xs font-bold hover:underline">Details</Link>
                </div>
              </div>
            ))}
            
            <button className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold hover:border-blue-300 hover:text-blue-600 transition-all flex items-center justify-center space-x-2">
              <Plus size={20} />
              <span>Open New Account</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

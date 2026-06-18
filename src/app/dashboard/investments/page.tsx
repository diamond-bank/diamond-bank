import { TrendingUp, BarChart3, PieChart, ArrowUpRight, Target } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function InvestmentsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Investments</h1>
          <p className="text-slate-500">Grow your wealth with Diamond Bank.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold transition-colors shadow-sm">
          Invest Now
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Portfolio Value", value: 42500.00, change: "+8.4%", icon: PieChart, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Total Profit", value: 3420.50, change: "+12.2%", icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
          { label: "Dividend Yield", value: 850.20, change: "+2.1%", icon: Target, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Market Cap", value: "2.4T", change: "-0.5%", icon: BarChart3, color: "text-slate-600", bg: "bg-slate-50" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <span className={`text-xs font-bold ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>{stat.change}</span>
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900">{typeof stat.value === 'number' ? formatCurrency(stat.value) : stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm text-center">
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <TrendingUp size={40} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Start Your Investment Journey</h2>
          <p className="text-slate-500">Access stocks, bonds, and mutual funds with low commissions and expert guidance.</p>
          <div className="pt-4">
            <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-colors">
              Open Investment Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

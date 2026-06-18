"use client";

import { useState } from "react";
import { depositAction } from "@/app/actions/banking";
import { Loader2, Plus } from "lucide-react";

export default function DepositForm({ accountId }: { accountId: string }) {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");

  async function handleDeposit() {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return;
    
    setLoading(true);
    const formData = new FormData();
    formData.append("accountId", accountId);
    formData.append("amount", amount);
    
    const result = await depositAction(formData);
    setLoading(false);
    if (!result?.error) {
      setAmount("");
    }
  }

  return (
    <div className="flex items-center space-x-2 justify-end">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          className="w-24 pl-6 pr-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none"
        />
      </div>
      <button
        onClick={handleDeposit}
        disabled={loading || !amount}
        className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-lg disabled:opacity-50 transition-colors"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
      </button>
    </div>
  );
}

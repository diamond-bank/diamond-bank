"use client";

import { useState } from "react";
import { toggleBlockAction } from "@/app/actions/banking";
import { Lock, Unlock, Loader2 } from "lucide-react";

export default function BlockToggle({ accountId, isBlocked }: { accountId: string; isBlocked: boolean }) {
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);
    await toggleBlockAction(accountId, isBlocked);
    setLoading(false);
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      title={isBlocked ? "Unblock Account" : "Block Account"}
      className={`p-1.5 rounded-lg transition-colors ${
        isBlocked 
          ? "bg-red-100 text-red-600 hover:bg-red-200" 
          : "bg-slate-100 text-slate-400 hover:bg-slate-200"
      }`}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : isBlocked ? (
        <Lock size={16} />
      ) : (
        <Unlock size={16} />
      )}
    </button>
  );
}

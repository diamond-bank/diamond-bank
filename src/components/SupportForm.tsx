"use client";

import { useState } from "react";
import { sendSupportMessage } from "@/app/actions/banking";
import { Loader2, Send, CheckCircle } from "lucide-react";

export default function SupportForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const result = await sendSupportMessage(formData);
    setLoading(false);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Subject</label>
        <input
          name="subject"
          required
          placeholder="e.g. Transaction issue"
          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Message</label>
        <textarea
          name="message"
          required
          rows={4}
          placeholder="Describe your issue..."
          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
      </div>
      <button
        type="submit"
        disabled={loading || success}
        className={`w-full py-3 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all ${
          success 
            ? "bg-green-500 text-white" 
            : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-100"
        }`}
      >
        {loading ? (
          <Loader2 className="animate-spin" size={20} />
        ) : success ? (
          <>
            <CheckCircle size={20} />
            <span>Message Sent!</span>
          </>
        ) : (
          <>
            <Send size={18} />
            <span>Send Message</span>
          </>
        )}
      </button>
    </form>
  );
}

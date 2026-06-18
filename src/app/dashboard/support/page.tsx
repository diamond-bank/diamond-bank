import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { supportMessages } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { Headphones, Send, MessageSquare, Clock } from "lucide-react";
import SupportForm from "@/components/SupportForm";

export default async function SupportPage() {
  const session = await getSession();
  
  const messages = await db.query.supportMessages.findMany({
    where: eq(supportMessages.userId, session.user.id),
    orderBy: [desc(supportMessages.createdAt)],
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Customer Support</h1>
          <p className="text-slate-500">How can we help you today?</p>
        </div>
        <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
          <Headphones size={24} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Start a conversation</h3>
            <SupportForm />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Previous Inquiries</h3>
            {messages.length === 0 ? (
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-400">
                <MessageSquare className="mx-auto mb-2 opacity-20" size={32} />
                <p>No support tickets yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((m) => (
                  <div key={m.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-slate-900">{m.subject}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        m.status === 'open' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {m.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">{m.message}</p>
                    <div className="flex items-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      <Clock size={10} className="mr-1" />
                      {new Date(m.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-2">Emergency?</h3>
              <p className="text-slate-400 text-sm mb-4">If your card is lost or stolen, call our 24/7 hotline immediately.</p>
              <div className="text-xl font-bold text-blue-400">+1 (800) DIAMOND</div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl"></div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Helpful Resources</h3>
            <ul className="space-y-3">
              {['Resetting Password', 'International Transfers', 'Security Best Practices', 'Account Types'].map(link => (
                <li key={link}>
                  <a href="#" className="text-sm text-blue-600 hover:underline flex items-center">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></div>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-blue-600 p-6 rounded-2xl text-white shadow-lg">
             <div className="flex items-center space-x-3 mb-4">
                <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                <h3 className="font-bold">Live Chat Available</h3>
             </div>
             <p className="text-blue-100 text-xs mb-4">Connect with a representative in under 2 minutes.</p>
             <button className="w-full py-2 bg-white text-blue-600 rounded-xl font-bold text-sm">Start Session</button>
          </div>
        </div>
      </div>
    </div>
  );
}

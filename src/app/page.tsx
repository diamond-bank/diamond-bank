import Link from "next/link";
import { Diamond } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="flex flex-col items-center space-y-2">
          <div className="p-4 bg-blue-600 rounded-full text-white shadow-lg">
            <Diamond size={48} />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Diamond Bank</h1>
          <p className="text-slate-600 text-lg font-medium">Enterprise Secure Banking Portal</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-2xl border border-slate-200 space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-12 -mt-12"></div>
          
          <div className="space-y-4 relative z-10">
            <Link
              href="/login"
              className="block w-full py-4 px-4 bg-slate-900 hover:bg-black text-white font-bold rounded-2xl transition-all shadow-xl shadow-slate-200 text-center transform hover:-translate-y-1"
            >
              Access Secure Portal
            </Link>
            <Link
              href="/signup"
              className="block w-full py-4 px-4 bg-white border-2 border-slate-100 hover:border-blue-600 hover:text-blue-600 text-slate-700 font-bold rounded-2xl transition-all text-center"
            >
              Open Global Account
            </Link>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-2xl border border-green-100">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-bold text-green-700 uppercase tracking-widest">Encrypted Infrastructure Active</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-slate-400">
               <div className="text-center p-4 border border-slate-50 rounded-2xl">
                 <p className="text-slate-900 font-bold text-lg">99.9%</p>
                 <p className="text-[10px] uppercase font-bold tracking-widest">Availability</p>
               </div>
               <div className="text-center p-4 border border-slate-50 rounded-2xl">
                 <p className="text-slate-900 font-bold text-lg">256-bit</p>
                 <p className="text-[10px] uppercase font-bold tracking-widest">Encryption</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Bell, Lock, Globe, Eye, Smartphone, HelpCircle } from "lucide-react";

const settingsGroups = [
  {
    title: "Account Settings",
    items: [
      { icon: Lock, label: "Password & Security", desc: "Change your password and manage 2FA" },
      { icon: Bell, label: "Notifications", desc: "Choose what alerts you want to receive" },
      { icon: Globe, label: "Language & Region", desc: "English (US), USD ($)" },
    ]
  },
  {
    title: "Privacy & Visibility",
    items: [
      { icon: Eye, label: "Privacy Mode", desc: "Hide your balance from the main screen" },
      { icon: Smartphone, label: "Connected Devices", desc: "Manage where you are logged in" },
    ]
  },
  {
    title: "Support",
    items: [
      { icon: HelpCircle, label: "Help Center", desc: "Get help with your account" },
    ]
  }
];

export default function SettingsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500">Customize your Diamond Bank experience.</p>
      </div>

      <div className="space-y-8">
        {settingsGroups.map((group) => (
          <div key={group.title} className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-2">{group.title}</h3>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
              {group.items.map((item) => (
                <button key={item.label} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left group">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                      <item.icon size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-700">{item.label}</p>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                  <div className="w-6 h-6 rounded-full border border-slate-200 flex items-center justify-center text-slate-300 group-hover:border-blue-200 group-hover:text-blue-500">
                    <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 9L5 5L1 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { updateProfileAction } from "@/app/actions/banking";
import { Loader2, Camera, Check } from "lucide-react";

export default function ProfileForm({ user }: { user: any }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const result = await updateProfileAction(formData);
    setLoading(false);
    if (result.success) {
      setSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    }
  }

  return (
    <div className="relative flex justify-between items-end -mt-12 mb-8">
      <div className="flex items-end space-x-6">
        <div className="w-24 h-24 rounded-3xl bg-white p-1 shadow-lg relative group">
          <div className="w-full h-full rounded-2xl bg-blue-100 overflow-hidden flex items-center justify-center text-blue-600 text-3xl font-extrabold border-2 border-white">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              user.name.charAt(0)
            )}
          </div>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="absolute -bottom-2 -right-2 p-2 bg-white rounded-xl shadow-md border border-slate-100 text-slate-400 hover:text-blue-600 transition-colors"
          >
            <Camera size={16} />
          </button>
        </div>
        <div className="pb-2">
          <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
          <p className="text-sm text-slate-500">{user.email}</p>
        </div>
      </div>

      {isEditing ? (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xl absolute top-full left-0 mt-4 z-50 w-80">
          <form action={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Full Name</label>
              <input
                name="name"
                defaultValue={user.name}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Avatar URL</label>
              <input
                name="avatarUrl"
                defaultValue={user.avatarUrl || ""}
                placeholder="https://example.com/photo.jpg"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm flex items-center justify-center"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button 
          onClick={() => setIsEditing(true)}
          className={`px-6 py-2.5 rounded-xl font-bold transition-all flex items-center space-x-2 ${
            success ? "bg-green-50 text-green-600 border border-green-100" : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
          }`}
        >
          {success ? (
            <>
              <Check size={18} />
              <span>Updated</span>
            </>
          ) : (
            <span>Edit Profile</span>
          )}
        </button>
      )}
    </div>
  );
}

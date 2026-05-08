"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Shield, LogOut, Settings, Phone, Check, X, Key } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  
  // States for Editing Mode
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  
  // States for Password Change
  const [isChangingPwd, setIsChangingPwd] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    const activeUser = localStorage.getItem("aircast_active_user");
    if (!activeUser) {
      router.push("/auth");
    } else {
      const parsedUser = JSON.parse(activeUser);
      setUser(parsedUser);
      setEditName(parsedUser.name);
      setEditPhone(parsedUser.phone === "Not provided" ? "" : parsedUser.phone);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("aircast_active_user");
    window.dispatchEvent(new Event("auth_change"));
    router.push("/");
  };

  const handleSaveChanges = () => {
    if (!user) return;
    
    // 1. Get the main database
    const allUsers = JSON.parse(localStorage.getItem("aircast_users") || "[]");
    
    // 2. Find the current user and update their details
    const updatedUsers = allUsers.map((u: any) => {
      if (u.email === user.email) {
        return { 
          ...u, 
          name: editName, 
          phone: editPhone || "Not provided",
          password: newPassword ? newPassword : u.password // Update password if typed
        };
      }
      return u;
    });

    // 3. Create the new active user object
    const updatedActiveUser = {
      ...user,
      name: editName,
      phone: editPhone || "Not provided",
      password: newPassword ? newPassword : user.password
    };

    // 4. Save everything back to the database
    localStorage.setItem("aircast_users", JSON.stringify(updatedUsers));
    localStorage.setItem("aircast_active_user", JSON.stringify(updatedActiveUser));
    
    // 5. Update UI
    setUser(updatedActiveUser);
    setIsEditing(false);
    setIsChangingPwd(false);
    setNewPassword("");
    setSaveMessage("Profile updated successfully!");
    window.dispatchEvent(new Event("auth_change")); // Tell Navbar the name changed

    setTimeout(() => setSaveMessage(""), 3000); // Hide message after 3 seconds
  };

  if (!user) return <div className="p-8 text-center text-slate-500">Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-12 p-4">
      
      {saveMessage && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl font-medium flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-4">
          <Check size={20} /> {saveMessage}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Side: Avatar and Quick Actions */}
        <div className="w-full md:w-1/3 flex flex-col gap-4">
          <div className="glass-card rounded-3xl p-8 border border-slate-200 text-center shadow-sm relative overflow-hidden">
            {user.role === "System Administrator" && (
               <div className="absolute top-0 left-0 w-full bg-blue-600 text-white text-xs font-bold py-1 uppercase tracking-widest">Admin Account</div>
            )}
            
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-md mt-4 ${user.role === "System Administrator" ? "bg-slate-800 text-blue-400" : "bg-blue-100 text-blue-600"}`}>
              <User size={48} />
            </div>
            
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{user.name}</h2>
            <p className="text-blue-600 font-medium text-sm mt-1">{user.role}</p>
            
            {isEditing ? (
              <div className="flex gap-2 mt-6">
                <button onClick={handleSaveChanges} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2">
                  <Check size={18} /> Save
                </button>
                <button onClick={() => { setIsEditing(false); setIsChangingPwd(false); }} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2">
                  <X size={18} /> Cancel
                </button>
              </div>
            ) : (
              <button onClick={() => setIsEditing(true)} className="w-full mt-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2">
                <Settings size={18} /> Edit Profile
              </button>
            )}
          </div>

          <div className="glass-card rounded-3xl p-4 border border-slate-200 shadow-sm">
            <button 
              onClick={handleLogout}
              className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-bold py-3 rounded-2xl transition-colors flex items-center justify-center gap-2 border border-red-100"
            >
              <LogOut size={20} /> Sign Out
            </button>
          </div>
        </div>

        {/* Right Side: Detailed Information */}
        <div className="w-full md:w-2/3 glass-card rounded-3xl p-8 border border-slate-200 shadow-sm h-fit">
          <h3 className="text-xl font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100">Account Details</h3>
          
          <div className="space-y-6">
            
            {/* NAME FIELD */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-slate-50 rounded-xl text-slate-400 border border-slate-100">
                <User size={20} />
              </div>
              <div className="w-full">
                <p className="text-sm font-medium text-slate-500 mb-1">Full Name</p>
                {isEditing ? (
                  <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-blue-200 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-slate-800" />
                ) : (
                  <p className="text-lg font-semibold text-slate-800">{user.name}</p>
                )}
              </div>
            </div>

            {/* EMAIL FIELD (Always Read-Only) */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-slate-50 rounded-xl text-slate-400 border border-slate-100">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Email Address (Read-Only)</p>
                <p className="text-lg font-semibold text-slate-800">{user.email}</p>
              </div>
            </div>

            {/* PHONE FIELD */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-slate-50 rounded-xl text-slate-400 border border-slate-100">
                <Phone size={20} />
              </div>
              <div className="w-full">
                <p className="text-sm font-medium text-slate-500 mb-1">Phone Number</p>
                {isEditing ? (
                  <input type="text" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} placeholder="e.g. +91 98765 43210" className="w-full px-4 py-2 rounded-xl border border-blue-200 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-slate-800" />
                ) : (
                  <p className="text-lg font-semibold text-slate-800">{user.phone}</p>
                )}
              </div>
            </div>

            {/* SECURITY FIELD */}
            <div className="flex items-start gap-4 pt-4 border-t border-slate-100">
              <div className="p-3 bg-slate-50 rounded-xl text-slate-400 border border-slate-100">
                <Shield size={20} />
              </div>
              <div className="w-full">
                <p className="text-sm font-medium text-slate-500">Account Security</p>
                
                {isChangingPwd ? (
                  <div className="mt-2 flex gap-2">
                    <div className="relative w-full">
                      <Key size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="text" placeholder="Type new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-xl border border-orange-300 bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium text-slate-800" />
                    </div>
                    {/* If they are editing generally, the save button handles it. If not, give a specific save button */}
                    {!isEditing && (
                       <button onClick={handleSaveChanges} className="bg-orange-500 text-white px-4 rounded-xl font-bold hover:bg-orange-600 transition-colors">Update</button>
                    )}
                  </div>
                ) : (
                  <>
                    <p className="text-lg font-semibold text-slate-800">Password enabled</p>
                    <button onClick={() => setIsChangingPwd(true)} className="text-sm text-blue-600 font-bold mt-1 hover:underline">Change Password</button>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
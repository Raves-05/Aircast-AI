"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, User, ShieldCheck, AlertCircle } from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams(); // THIS is our URL watcher!
  
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // This watches the URL in real-time. If it changes, it flips the form!
  useEffect(() => {
    const mode = searchParams.get("mode");
    if (mode === "signup") {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [searchParams]);

const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const existingUsers = JSON.parse(localStorage.getItem("aircast_users") || "[]");
    
    // --- THE ADMIN EASTER EGG ---
    const isAdmin = email.toLowerCase() === "aaditya1001.be24@chitkarauniversity.edu.in";
    const assignedRole = isAdmin ? "System Administrator" : "Citizen Researcher";
    const assignedName = isAdmin ? "Aaditya" : name;

    if (isLogin) {
      // Secret Admin Login Bypass (Creates the admin account if it doesn't exist yet)
      if (isAdmin && password === "12345678") {
        let adminUser = existingUsers.find((u: any) => u.email === email);
        if (!adminUser) {
          adminUser = { name: "Aaditya", email, password, phone: "Not provided", role: "System Administrator" };
          existingUsers.push(adminUser);
          localStorage.setItem("aircast_users", JSON.stringify(existingUsers));
        }
        localStorage.setItem("aircast_active_user", JSON.stringify(adminUser));
        window.dispatchEvent(new Event("auth_change"));
        router.push("/");
        return;
      }

      // Normal Login Logic
      const user = existingUsers.find((u: any) => u.email === email && u.password === password);
      if (user) {
        localStorage.setItem("aircast_active_user", JSON.stringify(user));
        window.dispatchEvent(new Event("auth_change"));
        router.push("/");
      } else {
        setError("Invalid email or password.");
      }
    } else {
      // Normal Sign Up Logic
      const userExists = existingUsers.find((u: any) => u.email === email);
      if (userExists) {
        setError("This email is already registered. Please log in instead.");
        return;
      }

      const newUser = { name: assignedName, email, password, phone: "Not provided", role: assignedRole };
      existingUsers.push(newUser);
      
      localStorage.setItem("aircast_users", JSON.stringify(existingUsers));
      localStorage.setItem("aircast_active_user", JSON.stringify(newUser));
      window.dispatchEvent(new Event("auth_change"));
      router.push("/");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-4">
      <div className="glass-card rounded-3xl p-8 border border-slate-200 shadow-xl bg-white">
        
        <div className="text-center mb-8">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">{isLogin ? "Welcome Back" : "Create Account"}</h1>
          <p className="text-slate-500 mt-2 text-sm">Secure access to AirCast AI dashboards.</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm flex items-start gap-2">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" placeholder="John Doe" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" placeholder="john@example.com" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" placeholder="••••••••" />
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md transition-all mt-4">
            {isLogin ? "Sign In" : "Register"}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-100 pt-6">
          <p className="text-slate-500 text-sm">
            {isLogin ? "Don't have an account?" : "Already registered?"}
            <button onClick={() => { setIsLogin(!isLogin); setError(""); router.push(isLogin ? "/auth?mode=signup" : "/auth"); }} className="ml-2 text-blue-600 font-bold hover:underline">
              {isLogin ? "Sign Up" : "Log In"}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}
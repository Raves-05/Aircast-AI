"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { User, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false); // Mobile menu state

  // Your original Auth Logic!
  useEffect(() => {
    const checkUser = () => {
      const loggedInUser = localStorage.getItem("aircast_active_user");
      if (loggedInUser) {
        setUser(JSON.parse(loggedInUser));
      } else {
        setUser(null);
      }
    };

    checkUser();
    window.addEventListener("auth_change", checkUser);
    return () => window.removeEventListener("auth_change", checkUser);
  }, []);

  const navLinks = [
    { name: "Dashboard", href: "/" },
    { name: "Map View", href: "/map" },
    { name: "Analytics", href: "/analytics" },
    { name: "About", href: "/about" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/50 shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-all">
      <div className="max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between h-20 items-center">
          
          {/* Your Original Custom Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-xl shadow-sm shadow-blue-200 group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path>
              </svg>
            </div>
            <span className="text-2xl font-bold text-slate-800 tracking-tight">
              AirCast <span className="text-blue-600">AI</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-10">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className="text-slate-600 font-semibold hover:text-blue-600 transition-colors">
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <Link href="/profile" className="flex items-center gap-3 bg-white/50 hover:bg-white p-1.5 rounded-full transition-all pr-5 border border-white/60 shadow-sm">
                <div className="h-10 w-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                  <User size={20} />
                </div>
                <span className="font-bold text-slate-700">{user.name}</span>
              </Link>
            ) : (
              <>
                <a href="/auth" className="text-slate-600 font-semibold hover:text-blue-600 transition-colors">
                  Log In
                </a>
                <a href="/auth?mode=signup" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-7 py-2.5 rounded-full font-bold transition-all shadow-md shadow-blue-200 hover:shadow-lg hover:-translate-y-0.5">
                  Sign Up
                </a>
              </>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-xl border-b border-slate-200 overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-bold p-3 rounded-xl transition-colors text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-px bg-slate-100 my-2"></div>
              
              {/* Mobile Auth View */}
              {user ? (
                <Link href="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 bg-blue-50/50 rounded-xl">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <User size={20} />
                  </div>
                  <span className="font-bold text-slate-700">{user.name}</span>
                </Link>
              ) : (
                <div className="flex flex-col space-y-3 pt-2">
                  <a href="/auth" className="text-center text-slate-600 font-bold py-3 bg-slate-50 rounded-xl hover:bg-slate-100">
                    Log In
                  </a>
                  <a href="/auth?mode=signup" className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-xl shadow-md">
                    Sign Up
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
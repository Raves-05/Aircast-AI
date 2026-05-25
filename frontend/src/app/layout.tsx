"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cloud, Menu, X, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Dashboard", href: "/" },
    { name: "Map View", href: "/map" },
    { name: "Analytics", href: "/analytics" },
    { name: "About", href: "/about" },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-[90rem] mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-blue-600 p-2.5 rounded-2xl">
              <Cloud className="text-white" size={24} />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-800">
              AirCast <span className="text-blue-600">AI</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className={`text-sm font-bold transition-colors ${
                  pathname === link.href ? "text-blue-600" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop User Profile */}
          <div className="hidden md:flex items-center">
            <div className="flex items-center gap-3 px-4 py-2 rounded-full border border-slate-200 shadow-sm cursor-pointer hover:shadow-md transition-all">
              <div className="bg-blue-50 p-1.5 rounded-full text-blue-600">
                <User size={18} />
              </div>
              <span className="font-bold text-sm text-slate-700">Aaditya</span>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors"
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
            className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-lg font-bold p-3 rounded-xl transition-colors ${
                    pathname === link.href ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-px bg-slate-100 my-2"></div>
              <div className="flex items-center gap-3 p-3">
                <div className="bg-blue-50 p-2 rounded-full text-blue-600">
                  <User size={20} />
                </div>
                <span className="font-bold text-slate-700">Aaditya</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
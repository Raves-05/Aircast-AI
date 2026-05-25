import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./Navbar"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AirCast AI | Pollution Forecasting",
  description: "Academic Project Inspired by ISRO SIH",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col text-slate-900`}>
        
        <Navbar />

        <main className="flex-grow">
          {children}
        </main>

        <footer className="bg-white/50 backdrop-blur-md border-t border-white/60 mt-auto py-3 shadow-[0_-4px_30px_rgba(0,0,0,0.02)] z-10">
          <div className="max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12 flex justify-between items-center text-left">
            <div className="flex items-center gap-3">
              <p className="text-slate-800 font-bold text-sm tracking-tight">AirCast AI</p>
              <span className="hidden md:inline text-slate-300">|</span>
              <p className="hidden md:inline text-slate-500 font-medium text-xs">Advanced Air Pollution Forecasting System</p>
            </div>
            <div className="text-right">
              <p className="text-slate-400 font-medium text-xs">© {new Date().getFullYear()} Academic Project. Inspired by ISRO SIH.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
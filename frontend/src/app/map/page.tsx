"use client"; // <-- THIS IS THE FIX

import dynamic from "next/dynamic";

// This tells Next.js to completely skip the server build for the map
// and ONLY load it in the user's browser (ssr: false).
const DynamicMap = dynamic(() => import("./MapClient"), { 
  ssr: false,
  loading: () => (
    <div className="h-screen w-full flex items-center justify-center font-bold text-slate-500 tracking-widest text-xs">
      INITIALIZING SATELLITE LINK...
    </div>
  )
});

export default function MapPage() {
  return <DynamicMap />;
}
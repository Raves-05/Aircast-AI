"use client";
import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion"; 
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Wind, Activity, MapPin, ShieldAlert, HeartPulse, ShieldCheck, Clock } from "lucide-react";

const CITIES = ["Delhi", "Mumbai", "Bengaluru", "Chennai", "Kolkata"];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 } // Sped up the animation slightly to reduce lag
  }
};

const itemVariants: Variants = {
  hidden: { y: 15, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Dashboard() {
  const [city, setCity] = useState("Delhi");
  const [data, setData] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // NEW FEATURES: Time and Greeting States
  const [currentTime, setCurrentTime] = useState<string>("");
  const [greeting, setGreeting] = useState<string>("Overview");
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    // Check user for the greeting
    const activeUser = localStorage.getItem("aircast_active_user");
    if (activeUser) {
      setUserName(JSON.parse(activeUser).name);
    }

    // Live Clock & Greeting Logic
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' }));
      
      const hour = now.getHours();
      if (hour < 12) setGreeting("Good Morning");
      else if (hour < 18) setGreeting("Good Afternoon");
      else setGreeting("Good Evening");
    };
    
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [cityRes, forecastRes] = await Promise.all([
          fetch(`http://localhost:8000/city/${city}`),
          fetch(`http://localhost:8000/forecast/${city}`)
        ]);
        setData(await cityRes.json());
        setForecast(await forecastRes.json());
      } catch (error) {
        console.error("API Error", error);
      }
      setLoading(false);
    };
    fetchData();
  }, [city]);

  const getHealthAdvice = (aqi: number) => {
    if (aqi <= 50) return { text: "Perfect day for outdoor activities. Enjoy the fresh air!", color: "text-emerald-700", bg: "bg-gradient-to-r from-emerald-50 to-white", border: "border-emerald-200", icon: <ShieldCheck className="text-emerald-500" /> };
    if (aqi <= 100) return { text: "Air quality is acceptable. Sensitive individuals should consider limiting prolonged outdoor exertion.", color: "text-yellow-700", bg: "bg-gradient-to-r from-yellow-50 to-white", border: "border-yellow-200", icon: <HeartPulse className="text-yellow-600" /> };
    return { text: "Sensitive groups should wear a mask outdoors. Close windows to avoid dirty outdoor air.", color: "text-red-700", bg: "bg-gradient-to-r from-red-50 to-white", border: "border-red-200", icon: <ShieldAlert className="text-red-500" /> };
  };

  const advice = data ? getHealthAdvice(data.aqi) : null;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6 overflow-hidden">
      
      <motion.header 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4"
      >
        <div>
          {/* NEW: Dynamic Greeting */}
          <h1 className="text-3xl font-semibold text-slate-800 tracking-tight">
            {greeting}{userName ? `, ${userName}` : ""}
          </h1>
          
          {/* NEW: Live Telemetry Ticker */}
          <div className="flex items-center gap-2 mt-2 text-sm font-medium text-slate-500 bg-white/60 px-3 py-1 rounded-full border border-slate-200 w-fit">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-emerald-600 font-bold tracking-wider text-xs">LIVE</span>
            <span className="mx-1 opacity-50">|</span>
            <Clock size={14} className="text-slate-400" />
            <span className="tracking-widest font-mono text-xs">{currentTime}</span>
          </div>
        </div>

        {/* FIXED: City Selector with Pin */}
        <div className="relative group">
          {/* ADDED z-10 and changed color to text-slate-800 */}
          <MapPin className="absolute z-10 left-3.5 top-1/2 -translate-y-1/2 text-slate-800 group-hover:scale-110 transition-transform pointer-events-none" size={18} />
          <select 
            value={city} 
            onChange={(e) => setCity(e.target.value)}
            className="pl-11 pr-8 py-2.5 rounded-2xl border-2 border-white bg-white/80 backdrop-blur-md shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer min-w-[180px] text-slate-700 font-bold hover:bg-white hover:shadow-md"
          >
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {/* Custom dropdown arrow */}
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
             <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </div>
      </motion.header>

      {loading ? (
        <div className="animate-pulse space-y-6 mt-4">
          <div className="h-64 bg-slate-200/50 rounded-3xl w-full"></div>
        </div>
      ) : (
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="mt-4">
          
          {advice && (
            <motion.div variants={itemVariants} className={`flex items-center gap-4 p-4 rounded-2xl border ${advice.bg} ${advice.border} transition-all mb-6 shadow-sm hover:shadow-md`}>
              <div className="p-2 bg-white rounded-full shadow-sm">{advice.icon}</div>
              <p className={`font-medium ${advice.color}`}>{advice.text}</p>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <motion.div variants={itemVariants} className="lg:col-span-1 glass-card bg-gradient-to-br from-white to-blue-50/50 rounded-3xl p-6 flex flex-col justify-between group cursor-default">
              <div className="flex items-center space-x-2 text-slate-500 mb-4">
                <Wind size={20} className="text-blue-500 group-hover:rotate-12 transition-transform" />
                <span className="font-medium">Current AQI</span>
              </div>
              <div className="my-4">
                <h2 className="text-7xl font-bold text-slate-800 tracking-tighter drop-shadow-sm">{data?.aqi}</h2>
                <div className="inline-flex items-center mt-3 px-3 py-1.5 rounded-full bg-white shadow-sm border border-slate-100">
                  <div className={`w-2.5 h-2.5 rounded-full mr-2 animate-pulse ${data?.aqi > 100 ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
                  <p className="text-sm font-bold text-slate-700">{data?.status}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100/50">
                 <p className="text-sm text-slate-500">Primary Pollutant: <span className="font-bold text-blue-600 bg-blue-100/50 px-2 py-1 rounded-md">PM2.5</span></p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="lg:col-span-2 glass-card bg-gradient-to-bl from-white to-slate-50/50 rounded-3xl p-6 cursor-default">
              <h3 className="font-medium text-slate-700 mb-4 flex items-center gap-2">
                <Activity size={18} className="text-blue-400" />
                Air Pollutants Overview
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { label: "PM2.5", value: data?.pm25, unit: "µg/m³", desc: "Fine Particles" },
                  { label: "PM10", value: data?.pm10, unit: "µg/m³", desc: "Coarse Particles" },
                  { label: "O3", value: data?.o3, unit: "µg/m³", desc: "Ozone" },
                  { label: "NO2", value: data?.no2, unit: "µg/m³", desc: "Nitrogen Dioxide" },
                  { label: "SO2", value: data?.so2, unit: "µg/m³", desc: "Sulphur Dioxide" },
                  { label: "CO", value: data?.co, unit: "mg/m³", desc: "Carbon Monoxide" }
                ].map((item, i) => (
                  <div key={i} className="bg-white/80 p-4 rounded-2xl border border-slate-100 hover:border-blue-300 transition-all duration-300 hover:-translate-y-1 shadow-sm">
                    <p className="text-sm font-bold text-slate-700">{item.label}</p>
                    <p className="text-[10px] text-slate-400 mb-2 font-medium">{item.desc}</p>
                    <p className="text-xl font-black text-slate-800">{item.value} <span className="text-xs font-semibold text-slate-400">{item.unit}</span></p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="lg:col-span-3 glass-card bg-gradient-to-t from-white to-slate-50/30 rounded-3xl p-6 h-[380px] flex flex-col">
              <div className="flex items-center space-x-2 text-slate-500 mb-6">
                <Activity size={20} className="text-blue-500" />
                <h3 className="font-medium text-slate-700">24-Hour Forecast Trend</h3>
              </div>
              <div className="flex-grow w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={forecast} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 500}} dy={10} minTickGap={30} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 500}} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(8px)' }}
                      itemStyle={{ color: '#0f172a', fontWeight: '900' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="aqi" 
                      name="Predicted AQI"
                      stroke="#3b82f6" 
                      strokeWidth={4} 
                      dot={false}
                      activeDot={{ r: 8, fill: '#fff', stroke: '#3b82f6', strokeWidth: 3 }} 
                      animationDuration={1500}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

          </div>
        </motion.div>
      )}
    </div>
  );
}
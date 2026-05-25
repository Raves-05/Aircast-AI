"use client";
import { useState, useEffect } from "react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { Activity, BrainCircuit, Target, TrendingUp, Settings2 } from "lucide-react";

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await fetch("https://aircast-backend.onrender.com");
        const data = await res.json();
        setMetrics(data);
      } catch (error) {
        console.error("Failed to fetch metrics", error);
      }
      setLoading(false);
    };
    fetchMetrics();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
      
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-800 tracking-tight">Model Analytics</h1>
          <p className="text-slate-500 mt-1">Deep dive into LSTM forecasting performance and error metrics.</p>
        </div>
        {metrics && (
          <div className="flex items-center gap-2 text-sm text-slate-500 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
            <Settings2 size={16} />
            <span>Model: <strong>{metrics.model_type}</strong></span>
            <span className="mx-2">|</span>
            <span>Last trained: {metrics.last_trained}</span>
          </div>
        )}
      </header>

      {loading ? (
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-slate-200 rounded-3xl w-full"></div>
          <div className="h-96 bg-slate-200 rounded-3xl w-full"></div>
        </div>
      ) : (
        <>
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-3xl border border-slate-200 flex items-center gap-6 transition-all hover:shadow-md">
              <div className="bg-blue-100 p-4 rounded-2xl text-blue-600">
                <BrainCircuit size={32} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Confidence Score</p>
                <p className="text-3xl font-bold text-slate-800">{metrics.confidence_score}%</p>
                <p className="text-xs text-emerald-500 mt-1 font-medium">+2.4% from last epoch</p>
              </div>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-slate-200 flex items-center gap-6 transition-all hover:shadow-md">
              <div className="bg-orange-100 p-4 rounded-2xl text-orange-600">
                <Target size={32} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">RMSE (Root Mean Sq Error)</p>
                <p className="text-3xl font-bold text-slate-800">{metrics.rmse}</p>
                <p className="text-xs text-slate-400 mt-1 font-medium">Lower is better</p>
              </div>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-slate-200 flex items-center gap-6 transition-all hover:shadow-md">
              <div className="bg-purple-100 p-4 rounded-2xl text-purple-600">
                <Activity size={32} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">MAE (Mean Absolute Error)</p>
                <p className="text-3xl font-bold text-slate-800">{metrics.mae}</p>
                <p className="text-xs text-slate-400 mt-1 font-medium">Average deviation margin</p>
              </div>
            </div>
          </div>

          {/* Main Chart Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Accuracy Comparison Chart */}
            <div className="lg:col-span-2 glass-card p-6 rounded-3xl border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                <TrendingUp size={20} className="text-blue-500" />
                Predicted vs. Actual AQI (7-Day Trajectory)
              </h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={metrics.performance_history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.05)' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                    <Area type="monotone" dataKey="actual" name="Actual AQI" stroke="#94a3b8" strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" />
                    <Area type="monotone" dataKey="predicted" name="Model Prediction" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorPred)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Feature Importance Chart */}
            <div className="lg:col-span-1 glass-card p-6 rounded-3xl border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-6">Feature Importance Weighting</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  {/* FIX IS HERE: Increased left margin and YAxis width */}
                  <BarChart data={metrics.insights} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="feature" type="category" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 12, fontWeight: 500}} width={140} />
                    <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="importance" fill="#3b82f6" radius={[0, 8, 8, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
}
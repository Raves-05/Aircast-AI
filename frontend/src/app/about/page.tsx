import { Target, Lightbulb, Code2, Rocket, Server, Activity, ShieldCheck, Database } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-12 pb-20">
      
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto mt-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-medium text-sm mb-6 border border-blue-100">
          <ShieldCheck size={16} /> Academic Project
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 tracking-tight mb-6 leading-tight">
          Forecasting the Air We Breathe with <span className="text-blue-600">Machine Learning</span>
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          AirCast AI is an advanced, lightweight air pollution monitoring and forecasting dashboard. 
          Inspired by the problem statements of the ISRO Smart India Hackathon (SIH), this project aims to make complex environmental data accessible and actionable.
        </p>
      </section>

      {/* Objectives Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
        <div className="glass-card p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="bg-blue-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
            <Target size={28} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Project Objective</h2>
          <p className="text-slate-600 leading-relaxed">
            To develop a highly responsive, deterministic system that tracks primary pollutants (PM2.5, O3, NO2) across major Indian metropolitan areas. 
            The system provides 24-hour predictive trend analysis to help citizens make informed health decisions regarding outdoor activities.
          </p>
        </div>

        <div className="glass-card p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-white to-slate-50">
          <div className="bg-emerald-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-emerald-600">
            <Lightbulb size={28} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Why It Matters</h2>
          <p className="text-slate-600 leading-relaxed">
            With rapidly changing urban climates, static daily AQI readings are no longer sufficient. 
            AirCast provides hourly curve simulations based on traffic peaks and thermal inversions, 
            bridging the gap between raw meteorological data and public health awareness.
          </p>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">Architecture & Tech Stack</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col items-center text-center hover:border-blue-300 transition-colors">
            <Code2 size={32} className="text-slate-700 mb-4" />
            <h3 className="font-bold text-slate-800">Frontend UI</h3>
            <p className="text-sm text-slate-500 mt-2">Next.js 15, React, Tailwind CSS, Recharts</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col items-center text-center hover:border-green-300 transition-colors">
            <Server size={32} className="text-slate-700 mb-4" />
            <h3 className="font-bold text-slate-800">Backend API</h3>
            <p className="text-sm text-slate-500 mt-2">FastAPI (Python), Uvicorn, Pydantic</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col items-center text-center hover:border-purple-300 transition-colors">
            <Activity size={32} className="text-slate-700 mb-4" />
            <h3 className="font-bold text-slate-800">Machine Learning</h3>
            <p className="text-sm text-slate-500 mt-2">TensorFlow, Keras LSTM (Simulated MVP)</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col items-center text-center hover:border-orange-300 transition-colors">
            <Database size={32} className="text-slate-700 mb-4" />
            <h3 className="font-bold text-slate-800">Data & Storage</h3>
            <p className="text-sm text-slate-500 mt-2">SQLite, Deterministic Mock Data Generation</p>
          </div>

        </div>
      </section>

      {/* Future Scope */}
      <section className="glass-card p-8 rounded-3xl border border-slate-200 mt-16 bg-slate-800 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Rocket size={120} />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <Rocket size={24} className="text-blue-400" /> Future Scope
          </h2>
          <ul className="space-y-3 text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>Integration with live Central Pollution Control Board (CPCB) hardware APIs.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>Deploying the trained LSTM model for live, real-world predictive analysis.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>User authentication for personalized geographic alerts via SMS/Email.</span>
            </li>
          </ul>
        </div>
      </section>

    </div>
  );
}
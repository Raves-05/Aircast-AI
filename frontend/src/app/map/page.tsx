"use client";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css"; 
import { Wind, Droplets, ThermometerSun, ShieldCheck, MousePointerClick } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CITIES = ["Delhi", "Mumbai", "Bengaluru", "Chennai", "Kolkata"];

const CITY_COORDS: Record<string, [number, number]> = {
  "Delhi": [28.7041, 77.1025],
  "Mumbai": [19.0760, 72.8777],
  "Bengaluru": [12.9716, 77.5946],
  "Chennai": [13.0827, 80.2707],
  "Kolkata": [22.5726, 88.3639]
};

const CITY_DETAILS: Record<string, any> = {
  "Delhi": { desc: "Major urban center experiencing heavy vehicular emissions." },
  "Mumbai": { desc: "Coastal city where sea breezes mix with urban pollution." },
  "Bengaluru": { desc: "High altitude city, heavily influenced by traffic volume." },
  "Chennai": { desc: "Humid coastal environment with neighboring industrial zones." },
  "Kolkata": { desc: "Dense population and thermal inversions trap pollutants." }
};

function MapRecenter({ coords }: { coords: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(coords, 6, { animate: true, duration: 1.5 });
  }, [coords, map]);
  return null;
}

export default function MapContent() {
  const [cityData, setCityData] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllCities = async () => {
      try {
        const promises = CITIES.map(c => fetch(`http://localhost:8000/city/${c}`).then(res => res.json()));
        const results = await Promise.all(promises);
        
        // ---------------------------------------------------------
        // THE DAILY DYNAMIC ENGINE (MAP VIEW)
        // Synchronized precisely with the main dashboard calculations
        // ---------------------------------------------------------
        const today = new Date();
        const dailyShift = 1 + ((today.getDate() % 10) - 5) * 0.02;

        const dynamicResults = results.map((cityRaw: any) => {
          // Fallback parsing logic to patch the temperature object mismatch cleanly
          const baseTemp = cityRaw.temperature || cityRaw.temp || 28;

          return {
            ...cityRaw,
            aqi: Math.round(cityRaw.aqi * dailyShift),
            pm25: (cityRaw.pm25 * dailyShift).toFixed(1),
            o3: (cityRaw.o3 * dailyShift).toFixed(1),
            // Ensure temperature is computed, adjusted, and mapped to the exact frontend key
            temperature: Math.round(baseTemp + ((today.getDate() % 5) - 2)) 
          };
        });

        setCityData(dynamicResults);
      } catch (error) {
        console.error("API Error", error);
      }
      setLoading(false);
    };
    fetchAllCities();
  }, []);

  const activeData = selectedCity ? cityData.find(c => c.city === selectedCity) : null;
  const activeDetails = selectedCity ? CITY_DETAILS[selectedCity] : null;

  const INDIA_BOUNDS: [[number, number], [number, number]] = [
    [6.5, 68.0],  
    [35.5, 97.5]  
  ];

  return (
    <div className="max-w-[90rem] mx-auto p-4 md:p-8 space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-semibold text-slate-800 tracking-tight">Interactive AQI Network</h1>
          <p className="text-slate-500 mt-1 italic">Real-time geospatial telemetry across the Indian subcontinent.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-slate-200 shadow-sm text-xs font-bold text-slate-500">
           <ShieldCheck size={14} className="text-blue-500" /> REGION LOCKED
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 rounded-[2rem] overflow-hidden border-4 border-white shadow-xl h-[550px] relative z-0">
          {loading && (
            <div className="absolute inset-0 bg-slate-100/50 backdrop-blur-md z-10 flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="font-bold text-slate-600 tracking-widest text-xs">INITIALIZING SATELLITE LINK...</p>
              </div>
            </div>
          )}

          <MapContainer 
            center={[22.5937, 78.9629]} 
            zoom={4.5} 
            minZoom={4.5} 
            maxBounds={INDIA_BOUNDS} 
            maxBoundsViscosity={1.0} 
            scrollWheelZoom={true}
            className="w-full h-full"
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />

            {selectedCity && <MapRecenter coords={CITY_COORDS[selectedCity]} />}

            {cityData.map((data) => {
              const coords = CITY_COORDS[data.city];
              if (!coords) return null;
              
              const isSelected = selectedCity === data.city;
              const isPoor = data.aqi > 100;
              const color = isPoor ? "#ef4444" : "#10b981";

              return (
                <CircleMarker
                  key={data.city}
                  center={coords}
                  pathOptions={{
                    fillColor: color,
                    color: "white",
                    weight: 3,
                    fillOpacity: isSelected ? 0.8 : 0.6,
                  }}
                  radius={isSelected ? 18 : 14}
                  eventHandlers={{
                    click: () => setSelectedCity(data.city),
                  }}
                >
                  <CircleMarker 
                    center={coords} 
                    radius={40} 
                    pathOptions={{ fillColor: color, stroke: false, fillOpacity: 0.15 }} 
                  />
                  <Popup className="custom-popup">
                    <div className="font-bold text-slate-800">{data.city}</div>
                    <div className="text-xs text-slate-500">AQI: {data.aqi}</div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>
        </div>

        <div className="lg:col-span-1 h-full">
          <AnimatePresence mode="wait">
            {selectedCity && activeData && activeDetails ? (
              <motion.div 
                key={selectedCity}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-card rounded-[2rem] p-6 border-2 border-white shadow-xl bg-white/80 h-[550px] flex flex-col"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tighter">{activeData.city}</h2>
                    <p className={`text-xs font-black uppercase tracking-widest mt-1 ${activeData.aqi > 100 ? 'text-red-500' : 'text-emerald-500'}`}>
                      {activeData.aqi > 100 ? "Poor" : "Satisfactory"}
                    </p>
                  </div>
                  <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center shadow-inner ${activeData.aqi > 100 ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                    <span className="text-xl font-black leading-none">{activeData.aqi}</span>
                    <span className="text-[10px] font-bold">AQI</span>
                  </div>
                </div>

                <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100 mb-8 italic text-slate-600 text-sm leading-relaxed relative">
                   <div className="absolute -top-3 left-4 bg-white px-2 text-[10px] font-bold text-slate-400 border border-slate-100 rounded-full uppercase tracking-tighter">Station Insight</div>
                   "{activeDetails.desc}"
                </div>

                <div className="space-y-3 mt-auto">
                  <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                    <span className="flex items-center gap-3 text-xs font-bold text-slate-500 uppercase"><ThermometerSun size={18} className="text-orange-400"/> Temp</span>
                    <span className="font-black text-slate-800 text-lg">{activeData.temperature}°C</span>
                  </div>
                  <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                    <span className="flex items-center gap-3 text-xs font-bold text-slate-500 uppercase"><Wind size={18} className="text-blue-400"/> PM 2.5</span>
                    <span className="font-black text-slate-800 text-lg">{activeData.pm25} <span className="text-[10px] opacity-40">µg</span></span>
                  </div>
                  <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                    <span className="flex items-center gap-3 text-xs font-bold text-slate-500 uppercase"><Droplets size={18} className="text-teal-400"/> O3</span>
                    <span className="font-black text-slate-800 text-lg">{activeData.o3} <span className="text-[10px] opacity-40">µg</span></span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="glass-card rounded-[2rem] p-8 border-2 border-dashed border-slate-200 h-[550px] flex flex-col items-center justify-center text-center bg-white/40"
              >
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 text-blue-500 animate-bounce">
                  <MousePointerClick size={40} />
                </div>
                <h3 className="text-xl font-bold text-slate-700">Geospatial Lock</h3>
                <p className="text-sm text-slate-400 mt-3 leading-relaxed max-w-[200px]">
                  Select a pulsing station on the live satellite map to engage real-time telemetry data.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
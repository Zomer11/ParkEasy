
import React, { useEffect, useState } from 'react';
import { ParkingLot, Prediction } from '../types';
import { getPredictiveAnalysis, getNearbyAmenities } from '../services/geminiService';
import { BarChart, Bar, ResponsiveContainer, YAxis, Tooltip } from 'recharts';

interface LotDetailsProps {
  lot: ParkingLot;
  onReport: (status: 'leaving_now' | 'leaving_5min' | 'leaving_10min') => void;
}

const LotDetails: React.FC<LotDetailsProps> = ({ lot, onReport }) => {
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [amenities, setAmenities] = useState<{ text: string, sources: any[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [reported, setReported] = useState(false);

  useEffect(() => {
    setReported(false);
    setAmenities(null);
    const fetchData = async () => {
      setLoading(true);
      const [predRes, amenRes] = await Promise.all([
        getPredictiveAnalysis(lot),
        getNearbyAmenities(lot)
      ]);
      setPrediction(predRes);
      setAmenities(amenRes);
      setLoading(false);
    };
    fetchData();
  }, [lot]);

  const handleLocalReport = (status: 'leaving_now' | 'leaving_5min' | 'leaving_10min') => {
    setReported(true);
    onReport(status);
    setTimeout(() => setReported(false), 4000);
  };

  const historicalData = [
    { hour: '8a', spots: 20 },
    { hour: '10a', spots: 5 },
    { hour: '12p', spots: 2 },
    { hour: '2p', spots: 8 },
    { hour: '4p', spots: 15 },
    { hour: '6p', spots: 50 }
  ];

  return (
    <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-200 h-full overflow-y-auto custom-scrollbar">
      <div className="flex justify-between items-start mb-8">
        <div>
          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1 block">Selected Facility</span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">{lot.name}</h2>
          <div className="flex gap-2 mt-3">
            <span className="text-[10px] px-3 py-1 bg-slate-100 text-slate-600 rounded-full font-bold uppercase tracking-wider">{lot.type} Priority</span>
            <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider ${lot.occupancyTrend === 'decreasing' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
              Trend: {lot.occupancyTrend}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-4xl font-black text-indigo-600 tabular-nums tracking-tighter">{lot.availableSpots}</div>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Spots Open</div>
        </div>
      </div>

      <div className="bg-indigo-600 rounded-3xl p-6 mb-6 shadow-lg shadow-indigo-100 relative overflow-hidden">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-8 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-sm font-black text-white uppercase tracking-widest">Smart Prediction</h3>
        </div>
        
        {loading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-3 bg-white/20 rounded w-full"></div>
            <div className="h-3 bg-white/20 rounded w-4/5"></div>
          </div>
        ) : prediction ? (
          <div className="space-y-4">
            <p className="text-xs text-indigo-100 leading-relaxed font-medium italic">
              "{prediction.reasoning}"
            </p>
            <div className="flex items-center justify-between">
              <div className="bg-white/10 px-3 py-1 rounded-lg">
                <span className="text-[10px] text-white/70 uppercase font-black tracking-widest">Exp. Opening (30m)</span>
                <div className="text-lg font-black text-white">~{prediction.predictedAvailable}</div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-white/70 uppercase font-black tracking-widest">Confidence</span>
                <div className="text-lg font-black text-emerald-300">{Math.round(prediction.confidence * 100)}%</div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {amenities && (
        <div className="mb-8 p-5 bg-slate-50 rounded-2xl border border-slate-100 animate-in fade-in slide-in-from-top-2">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <svg className="w-3 h-3 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 2.88-2.88 7.19-5 9.88C9.92 16.21 7 11.85 7 9z" />
            </svg>
            Nearby Amenities
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            {amenities.text}
          </p>
        </div>
      )}

      <div className="mb-10">
        <h4 className="text-[10px] font-black text-slate-400 mb-6 uppercase tracking-widest flex items-center gap-2">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Availability Trends
        </h4>
        <div className="h-36 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={historicalData}>
              <Bar dataKey="spots" fill="#6366f1" radius={[6, 6, 0, 0]} />
              <YAxis hide />
              <Tooltip cursor={{fill: '#F1F5F9'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="space-y-4">
        {reported ? (
          <div className="flex flex-col items-center justify-center py-10 bg-emerald-50 rounded-[2rem] border-2 border-dashed border-emerald-200 animate-in zoom-in duration-500">
            <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mb-4 shadow-xl shadow-emerald-200">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-lg font-black text-emerald-800 tracking-tight">Report Verified</span>
          </div>
        ) : (
          <>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Are you leaving?</h4>
            <div className="grid grid-cols-1 gap-3">
              <button onClick={() => handleLocalReport('leaving_now')} className="group flex items-center justify-between px-6 py-5 bg-white hover:bg-slate-50 text-slate-900 rounded-2xl transition-all border border-slate-200 shadow-sm active:scale-95">
                <div className="flex items-center gap-4">
                  <span className="text-2xl group-hover:scale-125 transition-transform">🏎️</span>
                  <div>
                    <span className="font-black text-sm block">I'm leaving now</span>
                    <span className="text-[10px] text-slate-400 font-medium">Spot will open immediately</span>
                  </div>
                </div>
                <span className="text-[11px] font-black text-emerald-600">+50 PTS</span>
              </button>
              <button onClick={() => handleLocalReport('leaving_5min')} className="group flex items-center justify-between px-6 py-5 bg-white hover:bg-slate-50 text-slate-900 rounded-2xl transition-all border border-slate-200 shadow-sm active:scale-95">
                <div className="flex items-center gap-4">
                  <span className="text-2xl group-hover:scale-125 transition-transform">⏳</span>
                  <div>
                    <span className="font-black text-sm block">Leaving in 5-10m</span>
                    <span className="text-[10px] text-slate-400 font-medium">Giving others a heads up</span>
                  </div>
                </div>
                <span className="text-[11px] font-black text-indigo-600">+20 PTS</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LotDetails;


import React from 'react';
import { ParkingLot } from '../types';

interface ParkingMapProps {
  lots: ParkingLot[];
  onSelectLot: (lot: ParkingLot) => void;
  selectedLotId?: string;
}

const ParkingMap: React.FC<ParkingMapProps> = ({ lots, onSelectLot, selectedLotId }) => {
  return (
    <div className="relative w-full h-[540px] bg-[#E2E8F0] rounded-[2rem] overflow-hidden shadow-inner">
      {/* Aesthetic Grid Overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
      
      {/* Organic Campus Elements (Mock Buildings) */}
      <div className="absolute top-[20%] left-[15%] w-32 h-40 bg-white/40 rounded-3xl -rotate-12 border border-slate-300"></div>
      <div className="absolute top-[50%] right-[20%] w-48 h-32 bg-white/40 rounded-3xl rotate-6 border border-slate-300"></div>
      <div className="absolute bottom-[10%] left-[30%] w-64 h-24 bg-white/40 rounded-3xl -rotate-3 border border-slate-300"></div>
      
      {/* Interactive Legend */}
      <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-3xl shadow-lg border border-slate-200 z-10 hidden sm:block">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Occupancy Status</h4>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200"></div>
            <span className="text-[11px] font-bold text-slate-700">Plenty Available</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-200"></div>
            <span className="text-[11px] font-bold text-slate-700">Filling Up</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-200"></div>
            <span className="text-[11px] font-bold text-slate-700">Almost Full</span>
          </div>
        </div>
      </div>

      {/* Lot Markers */}
      <div className="relative w-full h-full p-12">
        {lots.map((lot, idx) => {
          const availability = (lot.availableSpots / lot.totalSpots) * 100;
          const statusColor = availability > 20 ? 'bg-emerald-500' : availability > 5 ? 'bg-amber-500' : 'bg-rose-500';
          const glowColor = availability > 20 ? 'shadow-emerald-200' : availability > 5 ? 'shadow-amber-200' : 'shadow-rose-200';
          const isSelected = selectedLotId === lot.id;

          // Deterministic but pseudo-random placement
          const positions = [
            { top: '25%', left: '20%' },
            { top: '40%', left: '70%' },
            { top: '70%', left: '35%' },
            { top: '15%', left: '60%' },
          ];
          const pos = positions[idx % positions.length];

          return (
            <button
              key={lot.id}
              onClick={() => onSelectLot(lot)}
              className={`absolute transition-all duration-500 transform group
                ${isSelected ? 'z-30 scale-125' : 'z-20 hover:scale-110'}`}
              style={{ top: pos.top, left: pos.left }}
            >
              {/* Marker Anchor */}
              <div className="flex flex-col items-center">
                <div className={`relative px-4 py-2 rounded-2xl shadow-2xl border-2 transition-all duration-300
                  ${isSelected ? 'bg-indigo-600 border-white ring-4 ring-indigo-100' : `${statusColor} border-white/80 shadow-lg ${glowColor}`}`}>
                  <div className="flex items-center gap-2">
                    <svg className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-white/90'}`} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 10l1.5-4.5h11L19 10H5z" />
                    </svg>
                    <span className="text-white text-xs font-black tabular-nums">{lot.availableSpots}</span>
                  </div>
                  
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                    </div>
                  )}
                </div>
                
                {/* Floating Label */}
                <div className={`mt-2 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-xl text-[10px] font-black text-slate-800 shadow-xl border border-slate-100 whitespace-nowrap transition-all duration-300
                  ${isSelected ? 'opacity-100 translate-y-0' : 'opacity-0 group-hover:opacity-100 group-hover:-translate-y-1'}`}>
                  {lot.name}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="absolute bottom-6 left-6 text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 bg-white/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Berkeley Main Campus Visualization
      </div>
    </div>
  );
};

export default ParkingMap;

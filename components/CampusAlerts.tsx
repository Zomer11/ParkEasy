
import React, { useEffect, useState } from 'react';
import { getCampusAlerts, CampusAlert } from '../services/geminiService';

const CampusAlerts: React.FC = () => {
  const [alert, setAlert] = useState<CampusAlert | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      const data = await getCampusAlerts();
      setAlert(data);
      setLoading(false);
    };
    fetchAlerts();
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 animate-pulse">
        <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
        <div className="h-2 bg-slate-100 rounded w-full mb-2"></div>
        <div className="h-2 bg-slate-100 rounded w-3/4"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 text-blue-600">
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      </div>
      <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
        <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-ping"></span>
        Live Campus Events
      </h3>
      <p className="text-sm text-slate-600 mb-4 leading-relaxed">
        {alert?.summary}
      </p>
      
      {alert?.sources && alert.sources.length > 0 && (
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sources</span>
          <div className="flex flex-wrap gap-2">
            {alert.sources.map((s, idx) => (
              <a 
                key={idx} 
                href={s.uri} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[10px] bg-slate-100 hover:bg-blue-50 text-blue-600 px-2 py-1 rounded transition-colors truncate max-w-[150px]"
              >
                {s.title}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CampusAlerts;

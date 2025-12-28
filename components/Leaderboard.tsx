
import React from 'react';

const MOCK_LEADERS = [
  { name: 'Sarah M.', points: 2450, spots: 42, avatar: 'https://picsum.photos/seed/sarah/40/40' },
  { name: 'Jason T.', points: 1980, spots: 35, avatar: 'https://picsum.photos/seed/jason/40/40' },
  { name: 'Elena R.', points: 1720, spots: 28, avatar: 'https://picsum.photos/seed/elena/40/40' },
  { name: 'David K.', points: 1400, spots: 22, avatar: 'https://picsum.photos/seed/david/40/40' },
  { name: 'You', points: 450, spots: 8, avatar: 'https://picsum.photos/seed/you/40/40', isUser: true }
];

const Leaderboard: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900">Top Spotters</h3>
        <span className="text-xs font-medium text-slate-400">Weekly Cycle</span>
      </div>

      <div className="space-y-4">
        {MOCK_LEADERS.map((leader, idx) => (
          <div 
            key={leader.name} 
            className={`flex items-center justify-between p-3 rounded-xl transition-all ${leader.isUser ? 'bg-blue-50 ring-1 ring-blue-100' : 'hover:bg-slate-50'}`}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src={leader.avatar} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt={leader.name} />
                <div className={`absolute -top-1 -left-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm
                  ${idx === 0 ? 'bg-amber-400' : idx === 1 ? 'bg-slate-300' : idx === 2 ? 'bg-amber-600' : 'bg-slate-200 text-slate-500'}`}>
                  {idx + 1}
                </div>
              </div>
              <div>
                <div className="text-sm font-bold text-slate-800">{leader.name}</div>
                <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{leader.spots} Spots Reported</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-blue-600">{leader.points}</div>
              <div className="text-[9px] font-bold text-slate-300 uppercase">Points</div>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-6 py-3 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
        View Full Leaderboard
      </button>
    </div>
  );
};

export default Leaderboard;

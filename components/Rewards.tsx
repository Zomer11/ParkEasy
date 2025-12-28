
import React from 'react';
import { RewardItem } from '../types';

const MOCK_REWARDS: RewardItem[] = [
  { id: '1', title: 'Free Daily Parking Pass', cost: 500, description: 'Redeem for one full day of parking in any Student lot.', category: 'Parking', image: '🎟️' },
  { id: '2', title: '50% Off Campus Cafe', cost: 200, description: 'Get half off any beverage or pastry at the Student Union.', category: 'Food', image: '☕' },
  { id: '3', title: 'ParkEasy Hoodie', cost: 2500, description: 'Exclusive premium hoodie for top-tier spotters.', category: 'Merch', image: '👕' },
  { id: '4', title: 'Reserved Spot (1hr)', cost: 1000, description: 'Guarantee a spot in Lot A for your next arrival.', category: 'Parking', image: '🅿️' },
];

interface RewardsProps {
  userPoints: number;
  onRedeem: (cost: number) => void;
}

const Rewards: React.FC<RewardsProps> = ({ userPoints, onRedeem }) => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-900">Rewards Marketplace</h2>
        <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-bold border border-emerald-100">
          {userPoints} Points Available
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_REWARDS.map(item => (
          <div key={item.id} className="group p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-md transition-all">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm border border-slate-100">
                {item.image}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-800 text-sm">{item.title}</h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-tight">{item.description}</p>
                <div className="mt-3 flex justify-between items-center">
                  <span className="text-xs font-black text-blue-600">{item.cost} PTS</span>
                  <button 
                    disabled={userPoints < item.cost}
                    onClick={() => onRedeem(item.cost)}
                    className={`text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider transition-all
                      ${userPoints >= item.cost 
                        ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95' 
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                  >
                    Redeem
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rewards;

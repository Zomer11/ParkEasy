
import React, { useState, useEffect } from 'react';
import { INITIAL_LOTS } from './constants';
import { ParkingLot, UserStats, AppNotification } from './types';
import ParkingMap from './components/ParkingMap';
import LotDetails from './components/LotDetails';
import Leaderboard from './components/Leaderboard';
import AssistantChat from './components/AssistantChat';
import CampusAlerts from './components/CampusAlerts';
import Rewards from './components/Rewards';
import VoiceAssistant from './components/VoiceAssistant';
import { generateBadgeImage } from './services/geminiService';

const App: React.FC = () => {
  const [lots, setLots] = useState<ParkingLot[]>(INITIAL_LOTS);
  const [selectedLot, setSelectedLot] = useState<ParkingLot | null>(null);
  const [activeTab, setActiveTab] = useState<'map' | 'rewards' | 'profile'>('map');
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [badges, setBadges] = useState<{name: string, url: string}[]>([]);
  const [generatingBadge, setGeneratingBadge] = useState(false);
  const [userStats, setUserStats] = useState<UserStats>({
    points: 450,
    spotsReported: 8,
    timeSaved: 120,
    rank: 12
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setLots(prev => prev.map(lot => {
        if (Math.random() > 0.8) {
          const change = Math.random() > 0.5 ? 1 : -1;
          const newValue = Math.max(0, Math.min(lot.totalSpots, lot.availableSpots + change));
          
          if (change === 1 && lot.availableSpots < 2) {
            addNotification({
              id: Date.now().toString(),
              title: 'Spot Alert!',
              message: `A spot just opened in ${lot.name}.`,
              type: 'success'
            });
          }
          return { ...lot, availableSpots: newValue };
        }
        return lot;
      }));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const addNotification = (notif: AppNotification) => {
    setNotifications(prev => [notif, ...prev].slice(0, 3));
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notif.id));
    }, 4000);
  };

  const handleReport = (status: 'leaving_now' | 'leaving_5min' | 'leaving_10min') => {
    if (!selectedLot) return;
    const pointsToAdd = status === 'leaving_now' ? 50 : 20;
    
    setLots(prev => prev.map(l => {
      if (l.id === selectedLot.id) {
        return { ...l, availableSpots: Math.min(l.totalSpots, l.availableSpots + 1) };
      }
      return l;
    }));

    setUserStats(prev => {
      const newStats = {
        ...prev,
        points: prev.points + pointsToAdd,
        spotsReported: prev.spotsReported + 1
      };
      
      // Unlock badge milestone
      if (newStats.spotsReported === 10) {
        handleUnlockBadge("Campus Legend");
      }
      return newStats;
    });
    
    addNotification({
      id: Date.now().toString(),
      title: 'Awesome!',
      message: `+${pointsToAdd} pts earned. Thanks for helping out!`,
      type: 'success'
    });
  };

  const handleUnlockBadge = async (name: string) => {
    setGeneratingBadge(true);
    const imageUrl = await generateBadgeImage(name);
    if (imageUrl) {
      setBadges(prev => [...prev, { name, url: imageUrl }]);
      addNotification({
        id: 'badge-' + Date.now(),
        title: 'New Achievement!',
        message: `You unlocked the ${name} badge!`,
        type: 'success'
      });
    }
    setGeneratingBadge(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      <VoiceAssistant />

      <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3 w-80">
        {notifications.map(n => (
          <div key={n.id} className="bg-white/80 backdrop-blur-md border border-slate-200 p-4 rounded-2xl shadow-xl animate-in slide-in-from-right duration-500">
            <div className="flex gap-3">
              <div className="h-10 w-10 bg-indigo-600 rounded-full flex items-center justify-center text-white shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{n.title}</h4>
                <p className="text-xs text-slate-500 leading-snug">{n.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <nav className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-slate-200 z-50 px-6 py-4">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-black tracking-tight text-slate-900">ParkEasy</h1>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2 p-1 bg-slate-100 rounded-xl">
              <button onClick={() => setActiveTab('map')} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'map' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>Map</button>
              <button onClick={() => setActiveTab('rewards')} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'rewards' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>Rewards</button>
              <button onClick={() => setActiveTab('profile')} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'profile' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>Profile</button>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-4">
              <div className="text-right">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Rank</div>
                <div className="text-lg font-black text-indigo-600">Top {userStats.rank}%</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Balance</div>
                <div className="text-lg font-black text-emerald-600">{userStats.points} pts</div>
              </div>
            </div>
            <img src="https://picsum.photos/seed/parker/80/80" className="w-10 h-10 rounded-full border-2 border-white shadow-md cursor-pointer hover:ring-2 ring-indigo-500 transition-all" alt="Profile" onClick={() => setActiveTab('profile')} />
          </div>
        </div>
      </nav>

      <main className="max-w-[1440px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-8">
            {activeTab === 'map' && (
              <>
                <section className="bg-white p-3 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-200 relative overflow-hidden">
                  <ParkingMap lots={lots} onSelectLot={setSelectedLot} selectedLotId={selectedLot?.id} />
                </section>
                <CampusAlerts />
              </>
            )}
            
            {activeTab === 'rewards' && (
              <Rewards userPoints={userStats.points} onRedeem={(cost) => {
                setUserStats(prev => ({ ...prev, points: prev.points - cost }));
                addNotification({ id: Date.now().toString(), title: 'Success!', message: 'Reward redeemed!', type: 'success' });
              }} />
            )}

            {activeTab === 'profile' && (
              <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-xl space-y-8">
                <div className="flex items-center gap-6">
                  <img src="https://picsum.photos/seed/parker/160/160" className="w-24 h-24 rounded-3xl border-4 border-slate-50 shadow-xl" />
                  <div>
                    <h2 className="text-3xl font-black text-slate-900">Student Commuter</h2>
                    <p className="text-slate-500 font-medium">UC Berkeley Class of 2026</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <div className="text-3xl font-black text-indigo-600">{userStats.spotsReported}</div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Total Reports</div>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <div className="text-3xl font-black text-emerald-600">{userStats.points}</div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Reputation</div>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <div className="text-3xl font-black text-blue-600">{userStats.timeSaved}m</div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Time Saved</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-black text-slate-900 mb-6">Digital Badges</h3>
                  <div className="flex flex-wrap gap-6">
                    {badges.map((b, i) => (
                      <div key={i} className="flex flex-col items-center gap-2 group">
                        <div className="w-24 h-24 bg-slate-50 rounded-full p-2 border border-slate-100 shadow-inner group-hover:scale-110 transition-transform">
                          <img src={b.url} className="w-full h-full object-contain" />
                        </div>
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{b.name}</span>
                      </div>
                    ))}
                    {generatingBadge && (
                      <div className="w-24 h-24 bg-slate-50 rounded-full border-4 border-dashed border-slate-200 animate-pulse flex items-center justify-center">
                        <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 4v16m8-8H4" strokeWidth={2} /></svg>
                      </div>
                    )}
                    {badges.length === 0 && !generatingBadge && (
                      <p className="text-sm text-slate-400 italic">Report more spots to unlock AI-generated badges!</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-28 space-y-6">
              {selectedLot ? (
                <div className="animate-in slide-in-from-bottom duration-500">
                  <LotDetails lot={selectedLot} onReport={handleReport} />
                </div>
              ) : (
                <AssistantChat lots={lots} />
              )}
              <Leaderboard />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;

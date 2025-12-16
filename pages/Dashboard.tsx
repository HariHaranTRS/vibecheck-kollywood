import React, { useEffect, useState } from 'react';
import { useStore } from '../store';
import { GlassCard, NeonButton } from '../components/NeonComponents';
import { getDailyQuiz, getLeaderboard } from '../services/db';
import { Play, Calendar, Trophy, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LeaderboardEntry } from '../types';

const Dashboard = () => {
  const { user, setCurrentQuiz } = useStore();
  const navigate = useNavigate();
  const [topUsers, setTopUsers] = useState<LeaderboardEntry[]>([]);
  const [quizReady, setQuizReady] = useState(false);

  useEffect(() => {
    // Check for daily quiz
    getDailyQuiz().then(quiz => {
      if (quiz) {
        setCurrentQuiz(quiz);
        setQuizReady(true);
      }
    });

    // Fetch mini leaderboard
    getLeaderboard().then(data => {
      setTopUsers(data.slice(0, 5));
    });
  }, [setCurrentQuiz]);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Welcome Section */}
      <section className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-2">
            Vanakkam, <span className="text-kolly-cyan">{user?.cinemaAlias}</span>
          </h1>
          <p className="text-gray-400">Ready to test your Kollywood IQ?</p>
        </div>
        {user?.isAdmin && (
           <NeonButton variant="secondary" onClick={() => navigate('/admin')}>
             Director Panel
           </NeonButton>
        )}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Event: Daily Quiz */}
        <div className="lg:col-span-2">
          <GlassCard className="h-full flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-kolly-violet/20 to-transparent opacity-50"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <Zap className="text-yellow-400 w-8 h-8" />
                <h2 className="text-2xl font-display font-bold">DAILY CHALLENGE</h2>
              </div>
              
              <div className="mb-8">
                <p className="text-4xl font-bold mb-2">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                <p className="text-gray-300">Answer 5 questions. Beat the clock. Top the charts.</p>
              </div>
            </div>

            <div className="relative z-10">
              {quizReady ? (
                <NeonButton className="w-full py-4 text-xl" onClick={() => navigate('/quiz/daily')}>
                  <Play className="w-6 h-6 fill-current" /> PLAY NOW
                </NeonButton>
              ) : (
                 <div className="text-center p-4 border border-dashed border-gray-600 rounded-lg">
                   No Quiz Set for Today. Check back later or ask Admin!
                 </div>
              )}
            </div>
          </GlassCard>
        </div>

        {/* Sidebar: Leaderboard & Archive */}
        <div className="space-y-8">
          {/* Mini Leaderboard */}
          <GlassCard>
            <div className="flex items-center gap-2 mb-4 text-kolly-cyan">
              <Trophy className="w-5 h-5" />
              <h3 className="font-bold tracking-wider">TOP SCORERS</h3>
            </div>
            <div className="space-y-3">
              {topUsers.length === 0 && <p className="text-gray-500 text-sm">No scores yet. Be the first!</p>}
              {topUsers.map((u, i) => (
                <div key={i} className="flex justify-between items-center text-sm border-b border-white/5 pb-2 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${i === 0 ? 'bg-yellow-400 text-black' : 'bg-gray-700'}`}>
                      {u.rank}
                    </span>
                    <span className="truncate max-w-[120px]">{u.userName}</span>
                  </div>
                  <span className="font-mono text-kolly-violet">{u.totalScore}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <button onClick={() => navigate('/leaderboard')} className="text-xs text-gray-400 hover:text-white underline">View Full Board</button>
            </div>
          </GlassCard>

          {/* Archive Link */}
          <GlassCard className="cursor-pointer hover:bg-white/5 transition-colors" >
             <div onClick={() => navigate('/archive')} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="text-kolly-violet w-6 h-6" />
                  <div>
                    <h3 className="font-bold">Archives</h3>
                    <p className="text-xs text-gray-400">Play previous quizzes</p>
                  </div>
                </div>
                <div className="text-2xl text-gray-600">&rarr;</div>
             </div>
          </GlassCard>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;

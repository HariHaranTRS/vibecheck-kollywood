import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard, NeonButton } from '../components/NeonComponents';
import { useStore } from '../store';
import {
  getDailyQuiz,
  getArchivedQuizzes,
  getDailyLeaderboard,
  getAllTimeLeaderboard
} from '../services/db';
import { Trophy, Play, Archive } from 'lucide-react';
import { LeaderboardEntry, Quiz } from '../types';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, setCurrentQuiz } = useStore();

  const [dailyQuiz, setDailyQuiz] = useState<Quiz | null>(null);
  const [archives, setArchives] = useState<Quiz[]>([]);
  const [dailyLeaders, setDailyLeaders] = useState<LeaderboardEntry[]>([]);
  const [allTimeLeaders, setAllTimeLeaders] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    getDailyQuiz().then(q => {
      setDailyQuiz(q);
      if (q) setCurrentQuiz(q);
    });

    getArchivedQuizzes().then(setArchives);
    getDailyLeaderboard().then(setDailyLeaders);
    getAllTimeLeaderboard().then(setAllTimeLeaders);
  }, [setCurrentQuiz]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-10">
      
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-display font-bold">
            Vanakkam, <span className="text-kolly-cyan">{user?.cinemaAlias}</span>
          </h1>
          <p className="text-gray-400">Your daily dose of Cyber Tamil vibes</p>
        </div>

        {user?.isAdmin && (
          <NeonButton variant="secondary" onClick={() => navigate('/admin')}>
            Director Panel
          </NeonButton>
        )}
      </div>

      {/* DAILY QUIZ */}
      <GlassCard>
        <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
          <Play /> Daily Vibe
        </h2>

        {dailyQuiz ? (
          <NeonButton
            className="w-full text-xl py-4"
            onClick={() => navigate('/quiz/daily')}
          >
            Play Today’s Quiz
          </NeonButton>
        ) : (
          <p className="text-gray-400">No quiz published for today.</p>
        )}
      </GlassCard>

      {/* ARCHIVES */}
      <GlassCard>
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
          <Archive /> Archives
        </h2>

        {archives.length === 0 && (
          <p className="text-gray-500">No archived quizzes yet.</p>
        )}

        <div className="grid gap-3">
          {archives.map(q => (
            <div
              key={q.id}
              className="flex justify-between items-center p-3 rounded bg-white/5 hover:bg-white/10 cursor-pointer"
              onClick={() => {
                setCurrentQuiz(q);
                navigate('/quiz/daily');
              }}
            >
              <span>{q.title}</span>
              <span className="text-xs text-gray-400">{q.date}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* LEADERBOARDS */}
      <div className="grid md:grid-cols-2 gap-6">
        
        <GlassCard>
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <Trophy className="text-yellow-400" /> Daily Top
          </h3>
          {dailyLeaders.map(l => (
            <div key={l.rank} className="flex justify-between text-sm">
              <span>{l.rank}. {l.userName}</span>
              <span className="text-kolly-violet">{l.totalScore}</span>
            </div>
          ))}
        </GlassCard>

        <GlassCard>
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <Trophy /> All-Time Legends
          </h3>
          {allTimeLeaders.map(l => (
            <div key={l.rank} className="flex justify-between text-sm">
              <span>{l.rank}. {l.userName}</span>
              <span className="text-kolly-violet">{l.totalScore}</span>
            </div>
          ))}
        </GlassCard>

      </div>
    </div>
  );
};

export default Dashboard;

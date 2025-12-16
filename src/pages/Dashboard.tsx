import React, { useEffect, useState } from 'react';
import { useStore } from '../store';
import { GlassCard, NeonButton } from '../components/NeonComponents';
import { getDailyQuiz, getArchivedQuizzes } from '../services/db';
import { Play, Calendar, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Quiz } from '../types';

const Dashboard = () => {
  const { user, setCurrentQuiz } = useStore();
  const navigate = useNavigate();

  const [todayQuiz, setTodayQuiz] = useState<Quiz | null>(null);
  const [archives, setArchives] = useState<Quiz[]>([]);

  useEffect(() => {
    getDailyQuiz().then(q => {
      if (q) {
        setTodayQuiz(q);
        setCurrentQuiz(q);
      }
    });

    getArchivedQuizzes().then(setArchives);
  }, [setCurrentQuiz]);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-display">
            Vanakkam, <span className="text-kolly-cyan">{user?.cinemaAlias}</span>
          </h1>
          <p className="text-gray-400">Daily dose of Cyber-Tamil Pop Culture ⚡</p>
        </div>

        {user?.isAdmin && (
          <NeonButton variant="secondary" onClick={() => navigate('/admin')}>
            Director Panel
          </NeonButton>
        )}
      </div>

      {/* Daily Quiz */}
      <GlassCard>
        <div className="flex items-center gap-3 mb-4">
          <Play className="text-kolly-violet" />
          <h2 className="text-2xl font-bold">Today’s Quiz</h2>
        </div>

        {todayQuiz ? (
          <NeonButton
            className="w-full text-lg py-4"
            onClick={() => navigate('/quiz/daily')}
          >
            Play Now
          </NeonButton>
        ) : (
          <p className="text-gray-500">No quiz published for today.</p>
        )}
      </GlassCard>

      {/* Archive */}
      <GlassCard>
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="text-kolly-cyan" />
          <h2 className="text-xl font-bold">Archive</h2>
        </div>

        {archives.length === 0 && (
          <p className="text-gray-500">No previous quizzes.</p>
        )}

        <div className="space-y-2">
          {archives.map(q => (
            <div
              key={q.id}
              className="flex justify-between items-center p-2 border border-white/10 rounded cursor-pointer hover:bg-white/5"
              onClick={() => {
                setCurrentQuiz(q);
                navigate('/quiz/daily');
              }}
            >
              <span>{q.title}</span>
              <span className="text-sm text-gray-400">{q.date}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Leaderboard */}
      <GlassCard className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Trophy className="text-yellow-400" />
          <span className="font-bold">Leaderboard</span>
        </div>
        <NeonButton variant="outline" onClick={() => navigate('/leaderboard')}>
          View
        </NeonButton>
      </GlassCard>

    </div>
  );
};

export default Dashboard;

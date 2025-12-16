import React, { useState } from 'react';
import { Header } from './components/Header';
import { QuizPlayer } from './components/QuizPlayer';
import { Leaderboard } from './components/Leaderboard';
import { AdminDashboard } from './components/AdminDashboard';
import { SuggestionBox } from './components/SuggestionBox';
import { User, ViewState } from './types';
import { MOCK_USER, TODAY_QUIZ, LEADERBOARD_DATA } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = () => {
    // Mock login logic
    setUser(MOCK_USER);
  };

  const handleQuizComplete = (score: number) => {
    console.log(`Quiz completed! Score: ${score}`);
    if (user) {
        setUser({ ...user, totalPoints: user.totalPoints + score });
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white font-sans selection:bg-neon-pink selection:text-white">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-purple/20 rounded-full blur-[120px] animate-pulse-fast" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-teal/10 rounded-full blur-[120px]" />
      </div>

      <Header 
        user={user} 
        currentView={currentView} 
        onNavigate={setCurrentView} 
        onLogin={handleLogin} 
      />

      <main className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        {currentView === 'HOME' && (
            <div className="space-y-8">
                <div className="text-center space-y-2 mb-12">
                    <span className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-neon-teal mb-4">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </span>
                    <h1 className="text-4xl md:text-6xl font-display font-bold text-white leading-tight">
                        TODAY'S <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-pink">CHALLENGE</span>
                    </h1>
                    <p className="text-gray-400 max-w-lg mx-auto">
                        Test your knowledge on the latest beats, mass dialogues, and iconic scenes from Kollywood.
                    </p>
                </div>
                
                {user ? (
                   <QuizPlayer quiz={TODAY_QUIZ} onComplete={handleQuizComplete} />
                ) : (
                   <div className="max-w-md mx-auto glass-panel p-8 rounded-2xl text-center border-t-4 border-neon-teal">
                        <h3 className="text-xl font-bold mb-4">Login to Play</h3>
                        <p className="text-gray-400 mb-6">Join the leaderboard and prove you are the biggest fan.</p>
                        <button 
                            onClick={handleLogin}
                            className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-neon-teal transition-colors"
                        >
                            LOGIN WITH GOOGLE
                        </button>
                   </div>
                )}
            </div>
        )}

        {currentView === 'LEADERBOARD' && <Leaderboard data={LEADERBOARD_DATA} />}
        
        {currentView === 'ADMIN' && <AdminDashboard />}

        {currentView === 'SUGGEST' && <SuggestionBox />}
      </main>
      
      <footer className="relative z-10 border-t border-white/5 py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm font-mono">
            <p>&copy; 2024 VibeCheck Kollywood. Built for the fans.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;

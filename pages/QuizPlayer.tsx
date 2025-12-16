import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { GlassCard, NeonButton } from '../components/NeonComponents';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Music, Image as ImageIcon, CheckCircle, XCircle, Trophy } from 'lucide-react';
import { submitScore } from '../services/db';

const QuizPlayer = () => {
  const { currentQuiz, user } = useStore();
  const navigate = useNavigate();
  
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | string[]>('');
  const [timeLeft, setTimeLeft] = useState(60); // 60s total for quiz or per question? Let's do per question for intensity
  const [totalScore, setTotalScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  // Protection: if no quiz loaded
  useEffect(() => {
    if (!currentQuiz) {
      navigate('/');
    }
  }, [currentQuiz, navigate]);

  // Timer Logic
  useEffect(() => {
    if (isFinished || feedback) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleNext(true); // Auto skip on timeout
          return 15; // Reset for next
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentQIndex, isFinished, feedback]);

  const currentQuestion = currentQuiz?.questions[currentQIndex];

  const handleAnswerSelect = (opt: string) => {
    if (feedback) return; // Prevent changing after submission
    if (currentQuestion?.questionType === 'CHECKBOX') {
        const current = Array.isArray(selectedAnswer) ? selectedAnswer : [];
        if (current.includes(opt)) {
            setSelectedAnswer(current.filter(i => i !== opt));
        } else {
            setSelectedAnswer([...current, opt]);
        }
    } else {
        setSelectedAnswer(opt);
    }
  };

  const calculatePoints = () => {
    if (!currentQuestion) return 0;
    const basePoints = currentQuestion.points;
    const multiplier = Math.max(0.1, timeLeft / 15); // Simple multiplier based on speed
    return Math.round(basePoints + (basePoints * multiplier));
  };

  const handleNext = async (isTimeout = false) => {
    if (!currentQuestion) return;

    let isCorrect = false;
    
    // Check answer logic
    if (!isTimeout) {
      if (Array.isArray(currentQuestion.correctAnswer)) {
         // simplified array check logic
         isCorrect = JSON.stringify((selectedAnswer as string[]).sort()) === JSON.stringify(currentQuestion.correctAnswer.sort());
      } else {
         isCorrect = selectedAnswer === currentQuestion.correctAnswer;
      }
    }

    if (isCorrect) {
      const points = calculatePoints();
      setTotalScore(prev => prev + points);
      setFeedback('correct');
    } else {
      setFeedback('wrong');
    }

    // Delay to show feedback
    setTimeout(async () => {
      setFeedback(null);
      setSelectedAnswer('');
      setTimeLeft(15); // Reset timer default

      if (currentQIndex < (currentQuiz?.questions.length || 0) - 1) {
        setCurrentQIndex(prev => prev + 1);
      } else {
        setIsFinished(true);
        // Save Score
        if (user && currentQuiz) {
           await submitScore({
               quizId: currentQuiz.id,
               userId: user.uid,
               userName: user.cinemaAlias || user.displayName,
               score: totalScore + (isCorrect ? calculatePoints() : 0), // Add last question score
               timestamp: Date.now()
           });
        }
      }
    }, 1500);
  };

  if (isFinished) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <GlassCard className="text-center max-w-lg w-full">
           <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-6" />
           <h2 className="text-4xl font-display font-bold mb-4">QUIZ COMPLETE</h2>
           <p className="text-gray-400 mb-8">Great performance, Thalaiva!</p>
           
           <div className="bg-white/5 rounded-lg p-6 mb-8">
             <div className="text-sm text-gray-400 uppercase tracking-widest">Final Score</div>
             <div className="text-6xl font-bold text-kolly-cyan mt-2">{totalScore}</div>
           </div>

           <NeonButton onClick={() => navigate('/')} className="w-full">
             Back to Dashboard
           </NeonButton>
        </GlassCard>
      </div>
    );
  }

  if (!currentQuestion) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      
      {/* HUD */}
      <div className="w-full max-w-3xl flex justify-between items-center mb-6">
         <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">Question</span>
            <span className="font-bold text-xl">{currentQIndex + 1} <span className="text-gray-500 text-sm">/ {currentQuiz?.questions.length}</span></span>
         </div>
         <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full border border-white/10">
            <Timer className={`w-5 h-5 ${timeLeft < 5 ? 'text-red-500 animate-pulse' : 'text-kolly-cyan'}`} />
            <span className={`font-mono font-bold ${timeLeft < 5 ? 'text-red-500' : 'text-white'}`}>{timeLeft}s</span>
         </div>
         <div className="text-kolly-violet font-mono">Score: {totalScore}</div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="w-full max-w-3xl"
        >
          <GlassCard className={`relative overflow-hidden transition-colors duration-500 ${feedback === 'correct' ? 'border-green-500/50 bg-green-500/10' : feedback === 'wrong' ? 'border-red-500/50 bg-red-500/10' : ''}`}>
            
            {/* Media Placeholder */}
            {currentQuestion.mediaType !== 'NONE' && (
               <div className="mb-6 h-48 bg-black/40 rounded-lg flex items-center justify-center border border-white/5">
                  {currentQuestion.mediaType === 'IMAGE' && <ImageIcon className="w-12 h-12 text-gray-600" />}
                  {currentQuestion.mediaType === 'AUDIO' && <Music className="w-12 h-12 text-gray-600" />}
                  <span className="ml-2 text-sm text-gray-500">Media Playback Placeholder</span>
               </div>
            )}

            <h2 className="text-2xl md:text-3xl font-bold mb-8 leading-tight">{currentQuestion.text}</h2>

            <div className="grid grid-cols-1 gap-4 mb-8">
              {currentQuestion.options?.map((opt) => {
                 const isSelected = Array.isArray(selectedAnswer) ? selectedAnswer.includes(opt) : selectedAnswer === opt;
                 return (
                  <button
                    key={opt}
                    onClick={() => handleAnswerSelect(opt)}
                    className={`
                      p-4 rounded-lg border text-left transition-all duration-200 flex items-center justify-between
                      ${isSelected 
                        ? 'bg-kolly-violet text-white border-kolly-violet shadow-[0_0_10px_rgba(139,92,246,0.3)]' 
                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30 text-gray-300'}
                    `}
                  >
                    <span>{opt}</span>
                    {isSelected && <div className="w-3 h-3 rounded-full bg-white shadow-lg" />}
                  </button>
                 );
              })}
            </div>

            <div className="flex justify-end">
               <NeonButton 
                 onClick={() => handleNext()} 
                 disabled={!selectedAnswer || !!feedback}
                 className="px-12"
               >
                 {feedback ? (feedback === 'correct' ? <CheckCircle /> : <XCircle />) : 'LOCK ANSWER'}
               </NeonButton>
            </div>

          </GlassCard>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default QuizPlayer;

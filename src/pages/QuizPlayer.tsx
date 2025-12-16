import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard, NeonButton } from '../components/NeonComponents';
import { useStore } from '../store';
import { submitScore } from '../services/db';
import { Timer, CheckCircle, XCircle, Trophy } from 'lucide-react';
import { Question } from '../types';

const QUESTION_TIME = 15; // seconds
const MAX_POINTS = 100;
const PENALTY_PER_SEC = 3;

const QuizPlayer = () => {
  const navigate = useNavigate();
  const { currentQuiz, user } = useStore();

  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<string | string[]>('');
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [finished, setFinished] = useState(false);

  const question: Question | undefined = currentQuiz?.questions[index];

  useEffect(() => {
    if (!currentQuiz) navigate('/');
  }, [currentQuiz, navigate]);

  useEffect(() => {
    if (finished || feedback) return;

    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          handleSubmit(true);
          return QUESTION_TIME;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [index, feedback, finished]);

  const calculateScore = () => {
    const timeTaken = QUESTION_TIME - timeLeft;
    return Math.max(10, MAX_POINTS - timeTaken * PENALTY_PER_SEC);
  };

  const isCorrectAnswer = () => {
    if (!question) return false;

    if (Array.isArray(question.correctAnswer)) {
      return (
        Array.isArray(answer) &&
        JSON.stringify(answer.sort()) ===
          JSON.stringify(question.correctAnswer.sort())
      );
    }
    return answer === question.correctAnswer;
  };

  const handleSubmit = async (timeout = false) => {
    if (!question) return;

    const correct = !timeout && isCorrectAnswer();

    if (correct) {
      setScore(s => s + calculateScore());
      setFeedback('correct');
    } else {
      setFeedback('wrong');
    }

    setTimeout(async () => {
      setFeedback(null);
      setAnswer('');
      setTimeLeft(QUESTION_TIME);

      if (index < currentQuiz!.questions.length - 1) {
        setIndex(i => i + 1);
      } else {
        setFinished(true);

        if (user && currentQuiz) {
          await submitScore({
            quizId: currentQuiz.id,
            userId: user.uid,
            userName: user.cinemaAlias || user.displayName,
            score: score + (correct ? calculateScore() : 0),
            timestamp: Date.now(),
          });
        }
      }
    }, 1200);
  };

  if (finished) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <GlassCard className="max-w-md w-full text-center">
          <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-3xl font-display font-bold mb-4">
            Quiz Completed
          </h2>
          <p className="text-gray-400 mb-6">Final Score</p>
          <div className="text-6xl font-bold text-kolly-cyan mb-6">
            {score}
          </div>
          <NeonButton className="w-full" onClick={() => navigate('/')}>
            Back to Dashboard
          </NeonButton>
        </GlassCard>
      </div>
    );
  }

  if (!question) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* HUD */}
      <div className="w-full max-w-3xl flex justify-between mb-6">
        <span>
          Question {index + 1}/{currentQuiz?.questions.length}
        </span>
        <div className="flex items-center gap-2">
          <Timer className={timeLeft <= 5 ? 'text-red-500 animate-pulse' : ''} />
          <span>{timeLeft}s</span>
        </div>
        <span className="text-kolly-violet">Score: {score}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          className="w-full max-w-3xl"
        >
          <GlassCard>
            <h2 className="text-2xl font-bold mb-6">{question.text}</h2>

            <div className="space-y-3 mb-6">
              {question.options?.map(opt => {
                const selected = Array.isArray(answer)
                  ? answer.includes(opt)
                  : answer === opt;

                return (
                  <button
                    key={opt}
                    onClick={() =>
                      question.questionType === 'CHECKBOX'
                        ? setAnswer(prev =>
                            Array.isArray(prev)
                              ? prev.includes(opt)
                                ? prev.filter(v => v !== opt)
                                : [...prev, opt]
                              : [opt]
                          )
                        : setAnswer(opt)
                    }
                    className={`w-full p-3 rounded border text-left ${
                      selected
                        ? 'bg-kolly-violet border-kolly-violet'
                        : 'bg-white/5 border-white/10'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end">
              <NeonButton
                disabled={!answer || feedback !== null}
                onClick={() => handleSubmit()}
              >
                {feedback === 'correct' ? (
                  <CheckCircle />
                ) : feedback === 'wrong' ? (
                  <XCircle />
                ) : (
                  'Lock Answer'
                )}
              </NeonButton>
            </div>
          </GlassCard>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default QuizPlayer;

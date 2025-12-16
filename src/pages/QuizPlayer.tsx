import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, CheckCircle, XCircle, Trophy } from 'lucide-react';

import { useStore } from '../store';
import { GlassCard, NeonButton, InputField } from '../components/NeonComponents';
import { QuestionType } from '../types';
import { submitScore } from '../services/db';

const QUESTION_TIME = 15;
const MAX_POINTS = 10;
const PENALTY_PER_SEC = 0.5;

const QuizPlayer = () => {
  const { currentQuiz, user } = useStore();
  const navigate = useNavigate();

  const [index, setIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [answer, setAnswer] = useState<any>('');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [finished, setFinished] = useState(false);

  const question = currentQuiz?.questions[index];

  /* =========================
     GUARDS
  ========================== */
  useEffect(() => {
    if (!currentQuiz) navigate('/');
  }, [currentQuiz, navigate]);

  /* =========================
     TIMER
  ========================== */
  useEffect(() => {
    if (finished || feedback) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmit(true);
          return QUESTION_TIME;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [index, feedback, finished]);

  /* =========================
     HELPERS
  ========================== */
  const calculatePoints = () => {
    const timeTaken = QUESTION_TIME - timeLeft;
    return Math.max(1, Math.round(MAX_POINTS - timeTaken * PENALTY_PER_SEC));
  };

  const isCorrectAnswer = () => {
    if (!question) return false;

    if (question.questionType === QuestionType.TEXT) {
      return (
        String(answer).trim().toLowerCase() ===
        String(question.correctAnswer).trim().toLowerCase()
      );
    }

    if (question.questionType === QuestionType.CHECKBOX) {
      return (
        JSON.stringify([...answer].sort()) ===
        JSON.stringify([...(question.correctAnswer as string[])].sort())
      );
    }

    return answer === question.correctAnswer;
  };

  /* =========================
     SUBMIT
  ========================== */
  const handleSubmit = (timeout = false) => {
    if (!question) return;

    const correct = !timeout && isCorrectAnswer();

    if (correct) {
      setScore(prev => prev + calculatePoints());
      setFeedback('correct');
    } else {
      setFeedback('wrong');
    }

    setTimeout(() => {
      setFeedback(null);
      setAnswer('');
      setTimeLeft(QUESTION_TIME);

      if (index < currentQuiz!.questions.length - 1) {
        setIndex(prev => prev + 1);
      } else {
        finishQuiz(correct);
      }
    }, 1200);
  };

  const finishQuiz = async (lastCorrect: boolean) => {
    setFinished(true);

    if (user && currentQuiz) {
      await submitScore({
        quizId: currentQuiz.id,
        userId: user.uid,
        userName: user.cinemaAlias || user.displayName,
        score: score + (lastCorrect ? calculatePoints() : 0),
        timestamp: Date.now()
      });
    }
  };

  /* =========================
     FINISHED SCREEN
  ========================== */
  if (finished) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <GlassCard className="text-center max-w-md w-full">
          <Trophy className="w-20 h-20 mx-auto text-yellow-400 mb-4" />
          <h2 className="text-3xl font-bold mb-2">QUIZ COMPLETE</h2>
          <p className="text-gray-400 mb-6">Great job, Thalaiva!</p>

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

  /* =========================
     UI
  ========================== */
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* HUD */}
      <div className="w-full max-w-3xl flex justify-between mb-4">
        <div>
          Question {index + 1} / {currentQuiz!.questions.length}
        </div>
        <div className="flex items-center gap-2">
          <Timer className={timeLeft <= 5 ? 'text-red-500 animate-pulse' : ''} />
          {timeLeft}s
        </div>
        <div>Score: {score}</div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          className="w-full max-w-3xl"
        >
          <GlassCard
            className={`transition ${
              feedback === 'correct'
                ? 'border-green-500/50 bg-green-500/10'
                : feedback === 'wrong'
                ? 'border-red-500/50 bg-red-500/10'
                : ''
            }`}
          >
            <h2 className="text-2xl font-bold mb-6">{question.text}</h2>

            {/* ANSWERS */}
            {question.questionType === QuestionType.TEXT && (
              <InputField
                label="Your Answer"
                value={answer}
                onChange={(e: any) => setAnswer(e.target.value)}
              />
            )}

            {question.options?.map(opt => {
              const selected =
                question.questionType === QuestionType.CHECKBOX
                  ? answer.includes?.(opt)
                  : answer === opt;

              return (
                <button
                  key={opt}
                  onClick={() => {
                    if (question.questionType === QuestionType.CHECKBOX) {
                      setAnswer((prev: string[]) =>
                        prev.includes(opt)
                          ? prev.filter(o => o !== opt)
                          : [...prev, opt]
                      );
                    } else {
                      setAnswer(opt);
                    }
                  }}
                  className={`w-full p-4 mb-3 rounded border text-left ${
                    selected
                      ? 'bg-kolly-violet text-white'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  {opt}
                </button>
              );
            })}

            <div className="flex justify-end mt-4">
              <NeonButton
                disabled={!answer || !!feedback}
                onClick={() => handleSubmit()}
              >
                {feedback ? (
                  feedback === 'correct' ? (
                    <CheckCircle />
                  ) : (
                    <XCircle />
                  )
                ) : (
                  'LOCK ANSWER'
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

import React, { useEffect, useState } from 'react';
import { useStore } from '../store';
import { GlassCard, NeonButton } from '../components/NeonComponents';
import { useNavigate } from 'react-router-dom';
import { Timer, CheckCircle, XCircle } from 'lucide-react';
import { submitScore } from '../services/db';
import { QuestionType } from '../types';

const TIME_LIMIT = 15;
const MAX_SCORE = 100;
const PENALTY = 5;

const QuizPlayer = () => {
  const { currentQuiz, user } = useStore();
  const navigate = useNavigate();

  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<any>('');
  const [time, setTime] = useState(TIME_LIMIT);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const question = currentQuiz?.questions[index];

  useEffect(() => {
    if (!currentQuiz) navigate('/');
  }, [currentQuiz, navigate]);

  useEffect(() => {
    if (feedback) return;

    const t = setInterval(() => {
      setTime(prev => {
        if (prev === 1) {
          handleNext(true);
          return TIME_LIMIT;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(t);
  }, [feedback]);

  const calculateScore = () =>
    Math.max(0, MAX_SCORE - (TIME_LIMIT - time) * PENALTY);

  const isCorrect = () => {
    if (!question) return false;
    if (question.questionType === QuestionType.TEXT)
      return answer.toLowerCase() === question.correctAnswer.toLowerCase();

    if (Array.isArray(question.correctAnswer))
      return JSON.stringify([...answer].sort()) ===
        JSON.stringify([...question.correctAnswer].sort());

    return answer === question.correctAnswer;
  };

  const handleNext = async (timeout = false) => {
    const correct = !timeout && isCorrect();

    if (correct) {
      setScore(s => s + calculateScore());
      setFeedback('correct');
    } else {
      setFeedback('wrong');
    }

    setTimeout(async () => {
      setFeedback(null);
      setAnswer('');
      setTime(TIME_LIMIT);

      if (index < (currentQuiz?.questions.length || 0) - 1) {
        setIndex(i => i + 1);
      } else {
        if (user && currentQuiz) {
          await submitScore({
            quizId: currentQuiz.id,
            userId: user.uid,
            userName: user.cinemaAlias || user.displayName,
            score,
            timestamp: Date.now()
          });
        }
        navigate('/');
      }
    }, 1200);
  };

  if (!question) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <GlassCard className="w-full max-w-3xl">

        {/* HUD */}
        <div className="flex justify-between mb-4">
          <div>Q {index + 1} / {currentQuiz?.questions.length}</div>
          <div className="flex items-center gap-2">
            <Timer className={time < 5 ? 'text-red-500' : 'text-kolly-cyan'} />
            {time}s
          </div>
          <div className="text-kolly-violet">Score: {score}</div>
        </div>

        <h2 className="text-2xl font-bold mb-6">{question.text}</h2>

        {/* ANSWERS */}
        {question.questionType === QuestionType.TEXT && (
          <input
            className="w-full p-3 bg-black/40 border border-white/20 rounded"
            value={answer}
            onChange={e => setAnswer(e.target.value)}
          />
        )}

        {(question.questionType === QuestionType.RADIO ||
          question.questionType === QuestionType.CHECKBOX) && (
          <div className="space-y-3">
            {question.options?.map(opt => (
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
                className={`w-full text-left p-3 rounded border ${
                  (Array.isArray(answer)
                    ? answer.includes(opt)
                    : answer === opt)
                    ? 'bg-kolly-violet text-white'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <NeonButton
            disabled={!answer || !!feedback}
            onClick={() => handleNext()}
          >
            {feedback
              ? feedback === 'correct'
                ? <CheckCircle />
                : <XCircle />
              : 'Lock Answer'}
          </NeonButton>
        </div>

      </GlassCard>
    </div>
  );
};

export default QuizPlayer;

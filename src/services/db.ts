import { Quiz, Score, LeaderboardEntry } from '../types';

/* =====================
   LocalStorage Keys
===================== */
const QUIZ_KEY = 'ck_quizzes';
const SCORE_KEY = 'ck_scores';

/* =====================
   Helpers
===================== */
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const getAllQuizzes = (): Quiz[] =>
  JSON.parse(localStorage.getItem(QUIZ_KEY) || '[]');

const saveAllQuizzes = (quizzes: Quiz[]) =>
  localStorage.setItem(QUIZ_KEY, JSON.stringify(quizzes));

/* =====================
   QUIZ
===================== */
export const saveQuiz = async (quiz: Quiz) => {
  await delay(200);

  const quizzes = getAllQuizzes();
  quizzes.push(quiz); // ✅ DO NOT overwrite
  saveAllQuizzes(quizzes);
};

export const getDailyQuiz = async (): Promise<Quiz | null> => {
  await delay(200);
  const today = new Date().toISOString().split('T')[0];

  return (
    getAllQuizzes().find(q => q.date === today && q.published) || null
  );
};

export const getArchivedQuizzes = async (): Promise<Quiz[]> => {
  await delay(200);
  const today = new Date().toISOString().split('T')[0];

  return getAllQuizzes().filter(q => q.date < today && q.published);
};

/* =====================
   SCORES
===================== */
export const submitScore = async (score: Score) => {
  await delay(200);
  const scores: Score[] = JSON.parse(localStorage.getItem(SCORE_KEY) || '[]');
  scores.push(score);
  localStorage.setItem(SCORE_KEY, JSON.stringify(scores));
};

export const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  await delay(200);
  const scores: Score[] = JSON.parse(localStorage.getItem(SCORE_KEY) || '[]');

  const totals: Record<string, number> = {};
  const names: Record<string, string> = {};

  scores.forEach(s => {
    totals[s.userId] = (totals[s.userId] || 0) + s.score;
    names[s.userId] = s.userName;
  });

  return Object.keys(totals)
    .map(id => ({
      userName: names[id],
      totalScore: totals[id],
      rank: 0,
    }))
    .sort((a, b) => b.totalScore - a.totalScore)
    .map((e, i) => ({ ...e, rank: i + 1 }));
};

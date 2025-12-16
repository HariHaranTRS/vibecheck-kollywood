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
   Quiz Logic
===================== */
export const saveQuiz = async (quiz: Quiz) => {
  await delay(300);
  const quizzes = getAllQuizzes();
  const index = quizzes.findIndex(q => q.id === quiz.id);

  if (index >= 0) quizzes[index] = quiz;
  else quizzes.push(quiz);

  saveAllQuizzes(quizzes);
};

export const getTodayQuiz = async (): Promise<Quiz | null> => {
  await delay(300);
  const today = new Date().toISOString().split('T')[0];
  return getAllQuizzes().find(q => q.date === today && q.published) || null;
};

export const getArchivedQuizzes = async (): Promise<Quiz[]> => {
  await delay(300);
  const today = new Date().toISOString().split('T')[0];
  return getAllQuizzes().filter(q => q.date < today && q.published);
};

/* =====================
   Score Logic
===================== */
export const submitScore = async (score: Score) => {
  await delay(200);
  const scores: Score[] = JSON.parse(localStorage.getItem(SCORE_KEY) || '[]');
  scores.push(score);
  localStorage.setItem(SCORE_KEY, JSON.stringify(scores));
};

export const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  await delay(300);
  const scores: Score[] = JSON.parse(localStorage.getItem(SCORE_KEY) || '[]');

  const map: Record<string, number> = {};

  scores.forEach(s => {
    map[s.userName] = (map[s.userName] || 0) + s.score;
  });

  return Object.entries(map)
    .map(([userName, totalScore], i) => ({
      rank: i + 1,
      userName,
      totalScore
    }))
    .sort((a, b) => b.totalScore - a.totalScore)
    .map((e, i) => ({ ...e, rank: i + 1 }));
};

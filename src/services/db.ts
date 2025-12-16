import { Quiz, Score, LeaderboardEntry } from '../types';

/**
 * STORAGE KEYS
 */
const KEY_QUIZZES = 'ck_quizzes';
const KEY_SCORES = 'ck_scores';

/**
 * Helpers
 */
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
const todayISO = () => new Date().toISOString().split('T')[0];

/**
 * =========================
 * QUIZ MANAGEMENT
 * =========================
 */

export const saveQuiz = async (quiz: Quiz): Promise<void> => {
  await delay(200);
  const quizzes: Quiz[] = JSON.parse(localStorage.getItem(KEY_QUIZZES) || '[]');
  const idx = quizzes.findIndex(q => q.id === quiz.id);

  if (idx >= 0) quizzes[idx] = quiz;
  else quizzes.push(quiz);

  localStorage.setItem(KEY_QUIZZES, JSON.stringify(quizzes));
};

export const getDailyQuiz = async (): Promise<Quiz | null> => {
  await delay(200);
  const quizzes: Quiz[] = JSON.parse(localStorage.getItem(KEY_QUIZZES) || '[]');
  return quizzes.find(q => q.date === todayISO() && q.published) || null;
};

export const getArchivedQuizzes = async (): Promise<Quiz[]> => {
  await delay(200);
  const quizzes: Quiz[] = JSON.parse(localStorage.getItem(KEY_QUIZZES) || '[]');
  return quizzes.filter(q => q.date < todayISO() && q.published);
};

/**
 * =========================
 * SCORING
 * =========================
 */

export const submitScore = async (score: Score): Promise<void> => {
  await delay(100);
  const scores: Score[] = JSON.parse(localStorage.getItem(KEY_SCORES) || '[]');
  scores.push(score);
  localStorage.setItem(KEY_SCORES, JSON.stringify(scores));
};

/**
 * DAILY LEADERBOARD (today only)
 */
export const getDailyLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  await delay(200);
  const scores: Score[] = JSON.parse(localStorage.getItem(KEY_SCORES) || '[]');

  const today = todayISO();
  const filtered = scores.filter(s => s.quizId.includes(today));

  return buildLeaderboard(filtered);
};

/**
 * ALL-TIME LEADERBOARD
 */
export const getAllTimeLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  await delay(200);
  const scores: Score[] = JSON.parse(localStorage.getItem(KEY_SCORES) || '[]');
  return buildLeaderboard(scores);
};

/**
 * =========================
 * INTERNAL
 * =========================
 */

const buildLeaderboard = (scores: Score[]): LeaderboardEntry[] => {
  const totals: Record<string, number> = {};

  scores.forEach(s => {
    totals[s.userName] = (totals[s.userName] || 0) + s.score;
  });

  return Object.entries(totals)
    .map(([userName, totalScore]) => ({ userName, totalScore, rank: 0 }))
    .sort((a, b) => b.totalScore - a.totalScore)
    .map((e, i) => ({ ...e, rank: i + 1 }));
};

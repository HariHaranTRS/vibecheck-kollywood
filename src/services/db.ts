import { Quiz, Score, User, LeaderboardEntry } from '../types';
import { INITIAL_QUESTIONS } from '../constants';

/* ===========================
   LocalStorage Keys
=========================== */
const QUIZ_KEY = 'ck_quizzes';
const SCORE_KEY = 'ck_scores';
const USER_KEY = 'ck_users';

/* ===========================
   Helpers
=========================== */
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

/* ===========================
   USER
=========================== */
export const saveUser = async (user: User) => {
  const users = JSON.parse(localStorage.getItem(USER_KEY) || '{}');
  users[user.uid] = user;
  localStorage.setItem(USER_KEY, JSON.stringify(users));
};

export const getUser = async (uid: string): Promise<User | null> => {
  const users = JSON.parse(localStorage.getItem(USER_KEY) || '{}');
  return users[uid] || null;
};

/* ===========================
   QUIZ
=========================== */
export const saveQuiz = async (quiz: Quiz) => {
  await delay(300);
  const quizzes: Quiz[] = JSON.parse(localStorage.getItem(QUIZ_KEY) || '[]');

  const index = quizzes.findIndex(q => q.id === quiz.id);
  if (index >= 0) quizzes[index] = quiz;
  else quizzes.push(quiz);

  localStorage.setItem(QUIZ_KEY, JSON.stringify(quizzes));
};

export const getDailyQuiz = async (): Promise<Quiz | null> => {
  await delay(300);
  const today = new Date().toISOString().split('T')[0];
  const quizzes: Quiz[] = JSON.parse(localStorage.getItem(QUIZ_KEY) || '[]');

  let quiz = quizzes.find(q => q.date === today && q.published);

  // Auto-create demo quiz on first run
  if (!quiz && quizzes.length === 0) {
    const demo: Quiz = {
      id: 'demo-daily',
      date: today,
      title: 'Daily Kollywood Blast',
      questions: INITIAL_QUESTIONS as any,
      published: true
    };
    await saveQuiz(demo);
    return demo;
  }

  return quiz || null;
};

export const getArchivedQuizzes = async (): Promise<Quiz[]> => {
  await delay(300);
  const today = new Date().toISOString().split('T')[0];
  const quizzes: Quiz[] = JSON.parse(localStorage.getItem(QUIZ_KEY) || '[]');
  return quizzes.filter(q => q.date < today && q.published);
};

export const deleteQuiz = async (id: string) => {
  const quizzes: Quiz[] = JSON.parse(localStorage.getItem(QUIZ_KEY) || '[]');
  const updated = quizzes.filter(q => q.id !== id);
  localStorage.setItem(QUIZ_KEY, JSON.stringify(updated));
};

/* ===========================
   SCORE & LEADERBOARD
=========================== */
export const submitScore = async (score: Score) => {
  await delay(200);
  const scores: Score[] = JSON.parse(localStorage.getItem(SCORE_KEY) || '[]');
  scores.push(score);
  localStorage.setItem(SCORE_KEY, JSON.stringify(scores));
};

export const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  await delay(300);
  const scores: Score[] = JSON.parse(localStorage.getItem(SCORE_KEY) || '[]');

  const totals: Record<string, { name: string; total: number }> = {};

  scores.forEach(s => {
    if (!totals[s.userId]) {
      totals[s.userId] = { name: s.userName, total: 0 };
    }
    totals[s.userId].total += s.score;
  });

  return Object.values(totals)
    .sort((a, b) => b.total - a.total)
    .map((u, i) => ({
      rank: i + 1,
      userName: u.name,
      totalScore: u.total
    }));
};

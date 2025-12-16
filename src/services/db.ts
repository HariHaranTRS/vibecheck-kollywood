import { Quiz, Score, User, LeaderboardEntry } from '../types';
import { INITIAL_QUESTIONS } from '../constants';

const KEY_QUIZZES = 'ck_quizzes';
const KEY_SCORES = 'ck_scores';
const KEY_USERS = 'ck_users';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// USER
export const saveUser = async (user: User): Promise<void> => {
  const users = JSON.parse(localStorage.getItem(KEY_USERS) || '{}');
  users[user.uid] = user;
  localStorage.setItem(KEY_USERS, JSON.stringify(users));
};

export const getUser = async (uid: string): Promise<User | null> => {
  const users = JSON.parse(localStorage.getItem(KEY_USERS) || '{}');
  return users[uid] || null;
};

// QUIZ
export const getDailyQuiz = async (): Promise<Quiz | null> => {
  await delay(300);
  const today = new Date().toISOString().split('T')[0];
  const quizzes: Quiz[] = JSON.parse(localStorage.getItem(KEY_QUIZZES) || '[]');

  let quiz = quizzes.find(q => q.date === today && q.published);

  if (!quiz && quizzes.length === 0) {
    const mockQuiz: Quiz = {
      id: 'demo',
      date: today,
      title: 'Daily Kollywood Blast',
      questions: INITIAL_QUESTIONS as any,
      published: true
    };
    quizzes.push(mockQuiz);
    localStorage.setItem(KEY_QUIZZES, JSON.stringify(quizzes));
    return mockQuiz;
  }

  return quiz || null;
};

export const saveQuiz = async (quiz: Quiz): Promise<void> => {
  const quizzes: Quiz[] = JSON.parse(localStorage.getItem(KEY_QUIZZES) || '[]');
  const index = quizzes.findIndex(q => q.id === quiz.id);
  index >= 0 ? (quizzes[index] = quiz) : quizzes.push(quiz);
  localStorage.setItem(KEY_QUIZZES, JSON.stringify(quizzes));
};

// SCORES
export const submitScore = async (score: Score): Promise<void> => {
  const scores: Score[] = JSON.parse(localStorage.getItem(KEY_SCORES) || '[]');
  scores.push(score);
  localStorage.setItem(KEY_SCORES, JSON.stringify(scores));
};

export const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  const scores: Score[] = JSON.parse(localStorage.getItem(KEY_SCORES) || '[]');
  const totals: Record<string, number> = {};

  scores.forEach(s => {
    totals[s.userName] = (totals[s.userName] || 0) + s.score;
  });

  return Object.entries(totals)
    .map(([name, score], i) => ({ rank: i + 1, userName: name, totalScore: score }))
    .sort((a, b) => b.totalScore - a.totalScore);
};

import { Quiz, Score, User, Question, LeaderboardEntry } from '../types';
import { INITIAL_QUESTIONS } from '../constants';

// Keys for LocalStorage
const KEY_QUIZZES = 'ck_quizzes';
const KEY_SCORES = 'ck_scores';
const KEY_USERS = 'ck_users';

// Helper to simulate delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- User Logic ---
export const saveUser = async (user: User): Promise<void> => {
  const users = JSON.parse(localStorage.getItem(KEY_USERS) || '{}');
  users[user.uid] = user;
  localStorage.setItem(KEY_USERS, JSON.stringify(users));
};

export const getUser = async (uid: string): Promise<User | null> => {
  const users = JSON.parse(localStorage.getItem(KEY_USERS) || '{}');
  return users[uid] || null;
};

// --- Quiz Logic ---
export const getDailyQuiz = async (): Promise<Quiz | null> => {
  await delay(500);
  const today = new Date().toISOString().split('T')[0];
  const allQuizzes: Quiz[] = JSON.parse(localStorage.getItem(KEY_QUIZZES) || '[]');
  
  // Find quiz for today
  let quiz = allQuizzes.find(q => q.date === today && q.published);
  
  // If no quiz exists for today, let's create a mock one for the demo experience if array is empty
  if (!quiz && allQuizzes.length === 0) {
     const mockQuiz: Quiz = {
         id: 'daily-demo',
         date: today,
         title: 'Daily Kollywood Blast',
         questions: INITIAL_QUESTIONS as any, // Cast for simplicty in mock
         published: true
     };
     await saveQuiz(mockQuiz);
     return mockQuiz;
  }
  
  return quiz || null;
};

export const getArchivedQuizzes = async (): Promise<Quiz[]> => {
  await delay(500);
  const today = new Date().toISOString().split('T')[0];
  const allQuizzes: Quiz[] = JSON.parse(localStorage.getItem(KEY_QUIZZES) || '[]');
  return allQuizzes.filter(q => q.date < today && q.published);
};

export const saveQuiz = async (quiz: Quiz): Promise<void> => {
    await delay(300);
    const allQuizzes: Quiz[] = JSON.parse(localStorage.getItem(KEY_QUIZZES) || '[]');
    const existingIndex = allQuizzes.findIndex(q => q.id === quiz.id);
    
    if (existingIndex >= 0) {
        allQuizzes[existingIndex] = quiz;
    } else {
        allQuizzes.push(quiz);
    }
    
    localStorage.setItem(KEY_QUIZZES, JSON.stringify(allQuizzes));
};

// --- Score & Leaderboard Logic ---
export const submitScore = async (score: Score): Promise<void> => {
  await delay(300);
  const scores: Score[] = JSON.parse(localStorage.getItem(KEY_SCORES) || '[]');
  scores.push(score);
  localStorage.setItem(KEY_SCORES, JSON.stringify(scores));
};

export const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  await delay(500);
  const scores: Score[] = JSON.parse(localStorage.getItem(KEY_SCORES) || '[]');
  
  // Aggregate scores by user
  const userTotals: Record<string, { name: string, total: number }> = {};
  
  scores.forEach(s => {
    if (!userTotals[s.userId]) {
      userTotals[s.userId] = { name: s.userName, total: 0 };
    }
    userTotals[s.userId].total += s.score;
  });

  const leaderboard: LeaderboardEntry[] = Object.values(userTotals)
    .map(u => ({
      userName: u.name,
      totalScore: u.total,
      rank: 0
    }))
    .sort((a, b) => b.totalScore - a.totalScore)
    .map((entry, index) => ({ ...entry, rank: index + 1 }));

  return leaderboard;
};

export const deleteQuiz = async (id: string): Promise<void> => {
    const allQuizzes: Quiz[] = JSON.parse(localStorage.getItem(KEY_QUIZZES) || '[]');
    const newQuizzes = allQuizzes.filter(q => q.id !== id);
    localStorage.setItem(KEY_QUIZZES, JSON.stringify(newQuizzes));
}

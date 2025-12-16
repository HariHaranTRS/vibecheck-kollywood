// Question & Answer Types
export enum QuestionType {
  RADIO = 'RADIO',        // Single correct
  CHECKBOX = 'CHECKBOX',  // Multiple correct
  TEXT = 'TEXT',          // Typed answer
}

export enum MediaType {
  NONE = 'NONE',
  IMAGE = 'IMAGE',
  AUDIO = 'AUDIO',
  VIDEO = 'VIDEO',
}

// Core Question Model
export interface Question {
  id: string;
  text: string;

  mediaType: MediaType;
  mediaUrl?: string;

  questionType: QuestionType;
  options?: string[];

  correctAnswer: string | string[];
  points: number;
}

// Quiz Model
export interface Quiz {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  questions: Question[];
  published: boolean;
}

// User Model
export interface User {
  uid: string;
  email: string;
  displayName: string;
  cinemaAlias: string;
  isAdmin: boolean;
}

// Score Model
export interface Score {
  quizId: string;
  userId: string;
  userName: string;
  score: number;
  timestamp: number;
}

// Leaderboard
export interface LeaderboardEntry {
  rank: number;
  userName: string;
  totalScore: number;
}

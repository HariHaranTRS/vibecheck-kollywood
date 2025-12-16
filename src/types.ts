export enum QuestionType {
  TEXT = 'TEXT',
  RADIO = 'RADIO',
  CHECKBOX = 'CHECKBOX',
}

export enum MediaType {
  NONE = 'NONE',
  IMAGE = 'IMAGE',
  AUDIO = 'AUDIO',
  VIDEO = 'VIDEO',
}

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

export interface Quiz {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  questions: Question[];
  published: boolean;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  cinemaAlias?: string;
  isAdmin?: boolean;
}

export interface Score {
  quizId: string;
  userId: string;
  userName: string;
  score: number;
  timestamp: number;
}

export interface LeaderboardEntry {
  rank: number;
  userName: string;
  totalScore: number;
}

export enum QuestionType {
  TEXT = 'TEXT',
  RADIO = 'RADIO',
  CHECKBOX = 'CHECKBOX'
}

export enum MediaType {
  NONE = 'NONE',
  IMAGE = 'IMAGE',
  AUDIO = 'AUDIO',
  VIDEO = 'VIDEO'
}

export interface Question {
  id: string;
  text: string;
  mediaType: MediaType;
  mediaUrl?: string; // For demo, we might use Base64 or external URLs
  questionType: QuestionType;
  options?: string[]; // For Radio/Checkbox
  correctAnswer: string | string[]; // Single string or array of strings for checkbox
  points: number;
}

export interface Quiz {
  id: string;
  date: string; // ISO Date string YYYY-MM-DD
  title: string;
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

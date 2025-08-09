export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'user';
  totalRuns: number;
  totalDistance: number;
  avgPace: string;
  badges: string[];
}

export interface Run {
  id: string;
  title: string;
  distance: number;
  difficulty: 'easy' | 'moderate' | 'hard';
  pace: string;
  location: string;
  time: string;
  participants: string[];
  maxParticipants: number;
  description: string;
}

export interface Post {
  id: string;
  userId: string;
  content: string;
  likes: number;
  comments: number;
  createdAt: string;
}

export interface Tip {
  id: string;
  title: string;
  category: 'technique' | 'nutrition' | 'recovery' | 'training' | 'mindset';
  content: string;
  image: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}
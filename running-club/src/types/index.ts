export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  totalRuns: number;
  totalDistance: number;
  averagePace: string;
  badges: string[];
  isAdmin: boolean;
  joinedAt: Date;
}

export interface Run {
  id: number;
  title: string;
  description: string;
  distance: number;
  difficulty: string;
  pace: string;
  location: string;
  dateTime: Date;
  maxParticipants: number;
  participants: number[];
  createdBy: number;
  image: string;
}

export interface Post {
  id: number;
  userId: number;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  createdAt: Date;
}

export interface Comment {
  id: number;
  postId: number;
  userId: number;
  content: string;
  createdAt: Date;
}

export interface Article {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  readTime: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User>) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}
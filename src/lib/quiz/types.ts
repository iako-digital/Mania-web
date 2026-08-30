export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface QuizAttempt {
  id: string;
  courseId: string;
  studentId: string;
  score: number;
  total: number;
  submittedAt: string;
}

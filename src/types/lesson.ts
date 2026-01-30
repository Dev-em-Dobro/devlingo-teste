export interface LessonQuestionOption {
  id: string;
  option_text: string;
  is_correct: boolean;
  position: number;
}

export interface LessonQuestion {
  id: string;
  question_text: string;
  position: number;
  lesson_question_options: LessonQuestionOption[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  xp: number;
  completed?: boolean;
  lesson_questions?: LessonQuestion[];
}
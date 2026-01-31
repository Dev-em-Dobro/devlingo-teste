import { Lesson } from "./lesson";

export interface Unit {
  id: string;
  title: string;
  description: string;
  status: 'locked' | 'available' | 'completed';
  lessons: Lesson[];
}

export interface SupabaseLessonData {
  id: string;
  title: string;
  description: string;
  xp_reward: number;
  unit_id: string;
}

export interface ProcessedLesson {
  id: string;
  title: string;
  description: string;
  xp: number;
  completed: boolean;
}

export interface UnitStatusData {
  lessons: ProcessedLesson[];
  isFirstUnit: boolean;
  previousUnitCompleted?: boolean;
}
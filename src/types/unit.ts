import { Lesson } from "./lesson";

export interface Unit {
  id: string | number;
  title: string;
  description: string;
  status: 'locked' | 'available' | 'completed';
  lessons: Lesson[];
}
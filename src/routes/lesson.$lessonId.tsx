import { createFileRoute } from '@tanstack/react-router';
import LessonScreen from '../components/LessonScreen';

export const Route = createFileRoute('/lesson/$lessonId')({
  component: () => <LessonScreen />,
});
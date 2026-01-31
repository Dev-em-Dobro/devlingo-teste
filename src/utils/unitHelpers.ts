import { SupabaseLessonData, ProcessedLesson, UnitStatusData } from '../types/unit';

/**
 * Processa lições do Supabase adicionando status de completude
 */
export function processLessons(
  lessons: SupabaseLessonData[],
  completedLessonsMap: Set<string>
): ProcessedLesson[] {
  return lessons.map((lesson) => ({
    id: lesson.id,
    title: lesson.title,
    description: lesson.description,
    xp: lesson.xp_reward || 10,
    completed: completedLessonsMap.has(lesson.id),
  }));
}

/**
 * Verifica se uma unidade está completa (todas as lições completadas)
 */
export function isUnitComplete(
  lessons: { id: string }[],
  completedLessonsMap: Set<string>
): boolean {
  return lessons.length > 0 && 
    lessons.every(lesson => completedLessonsMap.has(lesson.id));
}

/**
 * Calcula o status de uma unidade baseado no seu progresso e da unidade anterior
 */
export function calculateUnitStatus(data: UnitStatusData): 'locked' | 'available' | 'completed' {
  const { lessons, isFirstUnit, previousUnitCompleted } = data;

  // Verificar se todas as lições foram completadas
  const allLessonsCompleted = lessons.length > 0 && 
    lessons.every(lesson => lesson.completed);

  // Unidade está completa se todas as lições foram concluídas
  if (allLessonsCompleted) {
    return 'completed';
  }

  // Primeira unidade sempre está disponível
  if (isFirstUnit) {
    return 'available';
  }

  // Unidades subsequentes dependem da conclusão da anterior
  return previousUnitCompleted ? 'available' : 'locked';
}

import { Unit } from '../types/unit';
import { supabase } from './supabaseClient';

interface SupabaseLessonData {
  id: string;
  title: string;
  description: string;
  xp_reward: number;
  unit_id: string;
}

interface SupabaseUnitData {
  id: string;
  title: string;
  description: string;
  created_at: string;
  lessons: SupabaseLessonData[];
}

export async function getUnits(): Promise<Unit[]> {
  try {
    // Obter usuário autenticado
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.warn('Usuário não autenticado');
      return [];
    }

    // Buscar todas as unidades com lições aninhadas
    const { data: unitsData, error: unitsError } = await supabase
      .from('units')
      .select(`
        *,
        lessons(
          id,
          title,
          description,
          xp_reward,
          unit_id
        )
      `)
      .order('created_at', { ascending: true });

    if (unitsError) throw unitsError;
    if (!unitsData) return [];

    // Buscar progresso do usuário em todas as unidades
    const { data: userUnitsData, error: userUnitsError } = await supabase
      .from('user_units')
      .select('unit_id, is_completed')
      .eq('user_id', user.id);

    if (userUnitsError) throw userUnitsError;

    // Buscar progresso do usuário em todas as lições
    const { data: userLessonsData, error: userLessonsError } = await supabase
      .from('user_lessons')
      .select('lesson_id, is_completed')
      .eq('user_id', user.id);

    if (userLessonsError) throw userLessonsError;

    // Criar mapas para acesso rápido
    const completedUnitsMap = new Set(
      userUnitsData?.map((uu) => uu.unit_id) || [],
    );
    const completedLessonsMap = new Set(
      userLessonsData?.map((ul) => ul.lesson_id) || [],
    );

    // Converter os dados do Supabase para o tipo Unit com status correto
    const units: Unit[] = (unitsData as SupabaseUnitData[]).map((unit, index) => {
      // Mapear lições com status de progresso
      const lessons = unit.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        xp: lesson.xp_reward || 10,
        completed: completedLessonsMap.has(lesson.id),
      }));

      // Verificar se todas as lições da unidade foram completadas
      const allLessonsCompleted = lessons.length > 0 && 
        lessons.every((lesson) => lesson.completed);

      let status: 'locked' | 'available' | 'completed' = 'available';

      // Se a unidade foi completada na tabela user_units OU todas as lições foram completadas
      if (completedUnitsMap.has(unit.id) || allLessonsCompleted) {
        status = 'completed';
      } else if (index > 0) {
        // Se não é a primeira unidade, verificar se a anterior foi completada
        const previousUnit = (unitsData as SupabaseUnitData[])[index - 1];
        
        const previousLessons = previousUnit.lessons.map((lesson) => ({
          id: lesson.id,
          completed: completedLessonsMap.has(lesson.id),
        }));

        const previousAllCompleted = previousLessons.length > 0 && 
          previousLessons.every((lesson) => lesson.completed);
        
        if (!completedUnitsMap.has(previousUnit.id) && !previousAllCompleted) {
          status = 'locked';
        }
      }

      return {
        id: unit.id,
        title: unit.title,
        description: unit.description,
        status,
        lessons,
      };
    });

    return units;
  } catch (error) {
    console.error('Erro ao buscar unidades:', error);
    return [];
  }
}
import { Unit, SupabaseLessonData } from '../types/unit';
import { supabase } from './supabaseClient';
import { 
  processLessons, 
  calculateUnitStatus 
} from '../utils/unitHelpers';

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

    // Buscar todas as unidades com lições
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

    // Buscar progresso do usuário em todas as lições (ainda precisa ser separado devido à estrutura)
    const { data: userLessonsData, error: userLessonsError } = await supabase
      .from('user_lessons')
      .select('lesson_id, is_completed')
      .eq('user_id', user.id);

    if (userLessonsError) throw userLessonsError;

    // Criar mapa para acesso rápido O(1) às lições completadas
    const completedLessonsMap = new Set(
      userLessonsData?.map((ul) => ul.lesson_id) || [],
    );

    // Converter os dados do Supabase para o tipo Unit com status calculado
    const units: Unit[] = (unitsData as SupabaseUnitData[]).map((unit, index) => {
      // Processar lições com status de progresso
      const lessons = processLessons(unit.lessons, completedLessonsMap);

      // Calcular status da unidade anterior (se existir)
      let previousUnitCompleted: boolean | undefined;
      if (index > 0) {
        const previousUnit = (unitsData as SupabaseUnitData[])[index - 1];
        // Verificar se todas as lições da unidade anterior estão completas
        previousUnitCompleted = previousUnit.lessons.length > 0 && 
          previousUnit.lessons.every(lesson => completedLessonsMap.has(lesson.id));
      }

      // Calcular status da unidade atual
      const status = calculateUnitStatus({
        lessons,
        isFirstUnit: index === 0,
        previousUnitCompleted,
      });

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
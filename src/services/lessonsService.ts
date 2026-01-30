import { supabase } from './supabaseClient';
import { Lesson } from '../types/lesson';

export async function getLessonById(lessonId: string): Promise<Lesson | null> {
  try {
    // Obter usuário autenticado
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.warn('Usuário não autenticado');
      return null;
    }

    // Buscar lição com questões e opções aninhadas
    const { data: lessonData, error: lessonError } = await supabase
      .from('lessons')
      .select(`
        id,
        title,
        description,
        xp_reward,
        lesson_questions (
          id,
          question_text,
          position,
          lesson_question_options (
            id,
            option_text,
            is_correct,
            position
          )
        )
      `)
      .eq('id', lessonId)
      .single();

    if (lessonError) {
      console.error('Erro ao buscar lição:', lessonError);
      throw lessonError;
    }
    if (!lessonData) return null;

    // Buscar progresso do usuário nesta lição
    const { data: userLessonData } = await supabase
      .from('user_lessons')
      .select('is_completed')
      .eq('user_id', user.id)
      .eq('lesson_id', lessonId)
      .single();

    // Ordenar questões por position
    const sortedQuestions = (lessonData.lesson_questions || [])
      .map((q: any) => ({
        ...q,
        lesson_question_options: (q.lesson_question_options || []).sort(
          (a: any, b: any) => a.position - b.position
        ),
      }))
      .sort((a: any, b: any) => a.position - b.position);

    return {
      id: lessonData.id,
      title: lessonData.title,
      description: lessonData.description,
      xp: lessonData.xp_reward || 10,
      completed: userLessonData?.is_completed || false,
      lesson_questions: sortedQuestions,
    };
  } catch (error) {
    console.error('Erro ao buscar lição:', error);
    return null;
  }
}

export async function completeLessonWithSuccess(
  lessonId: string,
  xpEarned: number
): Promise<boolean> {
  try {
    // Obter usuário autenticado
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.warn('Usuário não autenticado');
      return false;
    }

    // Verificar se já existe um registro para esta lição
    const { data: existingRecord } = await supabase
      .from('user_lessons')
      .select('id')
      .eq('user_id', user.id)
      .eq('lesson_id', lessonId)
      .single();

    if (existingRecord) {
      // Atualizar registro existente
      const { error: updateError } = await supabase
        .from('user_lessons')
        .update({
          is_completed: true,
          xp_earned: xpEarned,
          completed_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId);

      if (updateError) {
        console.error('Erro ao atualizar progresso da lição:', updateError);
        return false;
      }
    } else {
      // Criar novo registro
      const { error: insertError } = await supabase
        .from('user_lessons')
        .insert({
          user_id: user.id,
          lesson_id: lessonId,
          is_completed: true,
          xp_earned: xpEarned,
          completed_at: new Date().toISOString(),
        });

      if (insertError) {
        console.error('Erro ao criar progresso da lição:', insertError);
        return false;
      }
    }

    // Atualizar total_xp no user_profiles
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('total_xp')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Erro ao buscar perfil do usuário:', profileError);
      // Não retornar false aqui, a lição já foi salva
    } else {
      const currentXP = userProfile?.total_xp || 0;
      const newTotalXP = currentXP + xpEarned;

      const { error: updateProfileError } = await supabase
        .from('user_profiles')
        .update({ total_xp: newTotalXP })
        .eq('id', user.id);

      if (updateProfileError) {
        console.error('Erro ao atualizar XP do usuário:', updateProfileError);
      }
    }

    return true;
  } catch (error) {
    console.error('Erro ao completar lição:', error);
    return false;
  }
}

-- ========================================
-- MIGRATION: Remover tabela user_units
-- ========================================

-- 1. Dropar políticas RLS
DROP POLICY IF EXISTS "Users can view own units" ON public.user_units;
DROP POLICY IF EXISTS "Users can insert own units" ON public.user_units;
DROP POLICY IF EXISTS "Users can update own units" ON public.user_units;

-- 2. Dropar tabela user_units
DROP TABLE IF EXISTS public.user_units;

-- ========================================
-- OPCIONAL: Adicionar índices para performance
-- ========================================

-- Índice para buscar lições de um usuário rapidamente
CREATE INDEX IF NOT EXISTS idx_user_lessons_user_id 
ON public.user_lessons(user_id);

-- Índice para buscar lições completadas
CREATE INDEX IF NOT EXISTS idx_user_lessons_completed 
ON public.user_lessons(user_id, is_completed) 
WHERE is_completed = TRUE;

-- Índice para buscar lições de uma unidade específica
CREATE INDEX IF NOT EXISTS idx_lessons_unit_id 
ON public.lessons(unit_id);

-- ========================================
-- COMENTÁRIOS
-- ========================================

/*
MOTIVO DA REMOÇÃO:

A tabela user_units era redundante porque:
1. O status de uma unidade pode ser calculado baseado nas lições completadas
2. Causava inconsistências (unidade marcada como completa mas lições incompletas)
3. Requeria queries e lógica extra desnecessária

NOVA ABORDAGEM:
- Unidade está completa = todas as suas lições estão completas
- Fonte única de verdade: tabela user_lessons
- Cálculo feito no TypeScript ou em uma VIEW se necessário

IMPACTO:
- Código TypeScript ~40% mais simples
- Queries mais rápidas (menos JOINs)
- Impossível ter dados inconsistentes
*/

-- ============================================
-- POLÍTICAS RLS (Row Level Security) PARA SUPABASE
-- ============================================
-- Execute este script no SQL Editor do Supabase
-- para habilitar acesso público às tabelas
-- ============================================

-- Habilitar RLS nas tabelas
ALTER TABLE public.contas_mestre ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendas ENABLE ROW LEVEL SECURITY;

-- Políticas para tabela contas_mestre
-- Permite leitura pública (SELECT)
CREATE POLICY "Acesso publico select contas" 
ON public.contas_mestre 
FOR SELECT 
USING (true);

-- Permite atualização pública (UPDATE)
CREATE POLICY "Acesso publico update contas" 
ON public.contas_mestre 
FOR UPDATE 
USING (true);

-- Políticas para tabela vendas
-- Permite inserção pública (INSERT)
CREATE POLICY "Acesso publico insert vendas" 
ON public.vendas 
FOR INSERT 
WITH CHECK (true);

-- Permite leitura pública (SELECT)
CREATE POLICY "Acesso publico select vendas" 
ON public.vendas 
FOR SELECT 
USING (true);

-- ============================================
-- NOTA DE SEGURANÇA:
-- Estas políticas permitem acesso público.
-- Em produção, você deve restringir o acesso
-- baseado em autenticação e roles de usuário.
-- ============================================


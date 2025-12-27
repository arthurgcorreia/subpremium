import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Variáveis de ambiente - devem ser configuradas no .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Classe de erro customizada para erros de configuração
export class SupabaseConfigError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SupabaseConfigError'
    Object.setPrototypeOf(this, SupabaseConfigError.prototype)
  }
}

// Verificar se Supabase está configurado
export const isSupabaseConfigured = (): boolean => {
  return !!(supabaseUrl && supabaseAnonKey && supabaseUrl.trim() !== '' && supabaseAnonKey.trim() !== '')
}

// Função para validar configuração e lançar erro se necessário
export const validateSupabaseConfig = (): void => {
  if (!supabaseUrl || supabaseUrl.trim() === '') {
    throw new SupabaseConfigError(
      'VITE_SUPABASE_URL não está configurada. Configure a variável de ambiente VITE_SUPABASE_URL no arquivo .env'
    )
  }
  
  if (!supabaseAnonKey || supabaseAnonKey.trim() === '') {
    throw new SupabaseConfigError(
      'VITE_SUPABASE_ANON_KEY não está configurada. Configure a variável de ambiente VITE_SUPABASE_ANON_KEY no arquivo .env'
    )
  }
}

// Criar cliente Supabase com tratamento de erro
let supabaseClient: SupabaseClient

try {
  // Validar configuração antes de criar o cliente
  validateSupabaseConfig()
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
} catch (error) {
  // Se houver erro de configuração, criar um cliente "mock" que falhará graciosamente
  // Isso evita quebrar a aplicação, mas as queries falharão
  console.error('⚠️ Erro ao configurar Supabase:', error instanceof Error ? error.message : error)
  console.warn('⚠️ Criando cliente Supabase com valores vazios. As queries falharão até que as variáveis sejam configuradas.')
  
  // Criar cliente com valores vazios (vai falhar nas queries, mas não quebra o módulo)
  supabaseClient = createClient('', '')
}

// Exportar o cliente
export const supabase = supabaseClient

// Função helper para obter cliente de forma segura (retorna null se não configurado)
export const getSupabaseSafe = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) {
    return null
  }
  return supabase
}

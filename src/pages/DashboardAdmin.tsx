import { useState, useEffect } from 'react'
import { Music, Film, Youtube, Headphones, AlertCircle, Plus, Inbox, Settings } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

interface ContaMestre {
  id: string
  servico: 'spotify' | 'netflix' | 'youtube' | 'deezer'
  email_mestre: string
  limite_slots: number
  slots_ocupados: number
  status: 'ativo' | 'cheio'
  data_renovacao: string
}

const getServicoIcon = (servico: string) => {
  switch (servico) {
    case 'spotify':
      return <Music className="w-6 h-6" />
    case 'netflix':
      return <Film className="w-6 h-6" />
    case 'youtube':
      return <Youtube className="w-6 h-6" />
    case 'deezer':
      return <Headphones className="w-6 h-6" />
    default:
      return <Music className="w-6 h-6" />
  }
}

const getServicoNome = (servico: string) => {
  switch (servico) {
    case 'spotify':
      return 'Spotify'
    case 'netflix':
      return 'Netflix'
    case 'youtube':
      return 'YouTube'
    case 'deezer':
      return 'Deezer'
    default:
      return servico
  }
}


export default function DashboardAdmin() {
  const [lotes, setLotes] = useState<ContaMestre[]>([])
  const [loading, setLoading] = useState(true)
  const [connectionError, setConnectionError] = useState(false)

  useEffect(() => {
    buscarLotes()
  }, [])

  const buscarLotes = async () => {
    // Verificar se Supabase está configurado
    if (!isSupabaseConfigured()) {
      setConnectionError(true)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setConnectionError(false)

      const { data, error: supabaseError } = await supabase
        .from('contas_mestre')
        .select('*')
        .order('data_renovacao', { ascending: true })

      if (supabaseError) {
        throw supabaseError
      }

      if (data) {
        setLotes(data as ContaMestre[])
      } else {
        setLotes([])
      }
    } catch (err) {
      console.error('Erro ao buscar lotes:', err)
      setConnectionError(true)
      setLotes([])
    } finally {
      setLoading(false)
    }
  }

  const handleNovoLote = () => {
    console.log('Novo Lote - Funcionalidade em desenvolvimento')
  }

  const handleConfigurarConexao = () => {
    alert(
      'Para configurar a conexão:\n\n' +
      '1. Crie um arquivo .env na raiz do projeto\n' +
      '2. Adicione:\n' +
      '   VITE_SUPABASE_URL=sua_url_do_supabase\n' +
      '   VITE_SUPABASE_ANON_KEY=sua_chave_anonima\n' +
      '3. Reinicie o servidor de desenvolvimento'
    )
  }

  const isLoteCheio = (lote: ContaMestre) => {
    return lote.slots_ocupados >= lote.limite_slots
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white p-4 md:p-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header com Botão Novo Lote */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Dashboard Admin - Gestão de Lotes
          </h1>
          <button
            onClick={handleNovoLote}
            className="flex items-center gap-2 bg-[#1DB954] hover:bg-[#1ed760] text-white font-semibold py-2.5 px-5 rounded-lg transition-all duration-300 shadow-lg shadow-[#1DB954]/30 hover:shadow-[#1DB954]/50"
          >
            <Plus className="w-5 h-5" />
            Novo Lote
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1DB954] mb-4"></div>
            <p className="text-gray-400 text-lg">Carregando lotes...</p>
          </div>
        )}

        {/* Empty State - Erro de Conexão ou Sem Dados */}
        {!loading && (connectionError || lotes.length === 0) && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-[#1a1a1a] rounded-full p-6 mb-6 border border-white/10">
              <Inbox className="w-16 h-16 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-white">
              {connectionError ? 'Conexão não configurada' : 'Nenhum lote encontrado'}
            </h2>
            <p className="text-gray-400 mb-8 max-w-md">
              {connectionError
                ? 'Configure as variáveis de ambiente do Supabase para visualizar os lotes.'
                : 'Comece criando seu primeiro lote para gerenciar as assinaturas compartilhadas.'}
            </p>
            {connectionError ? (
              <button
                onClick={handleConfigurarConexao}
                className="flex items-center gap-2 bg-[#1DB954] hover:bg-[#1ed760] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg shadow-[#1DB954]/30 text-lg"
              >
                <Settings className="w-6 h-6" />
                Configurar Conexão
              </button>
            ) : (
              <button
                onClick={handleNovoLote}
                className="flex items-center gap-2 bg-[#1DB954] hover:bg-[#1ed760] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg shadow-[#1DB954]/30 text-lg"
              >
                <Plus className="w-6 h-6" />
                Criar Primeiro Lote
              </button>
            )}
          </div>
        )}

        {/* Grid de Cards */}
        {!loading && !connectionError && lotes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lotes.map((lote) => {
              const cheio = isLoteCheio(lote)
              const porcentagem = (lote.slots_ocupados / lote.limite_slots) * 100

              return (
                <div
                  key={lote.id}
                  className={`
                    relative bg-[#1a1a1a] rounded-xl p-6 border-2 transition-all duration-300
                    ${cheio
                      ? 'border-red-500 bg-red-900/10 animate-pulse'
                      : 'border-white/10 hover:border-[#1DB954]/50 hover:shadow-lg hover:shadow-[#1DB954]/20'
                    }
                  `}
                >
                  {/* Cabeçalho: Ícone do Serviço + Email Mestre */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`p-2.5 rounded-lg ${cheio ? 'bg-red-500/20' : 'bg-[#1DB954]/20'}`}>
                      <div className={cheio ? 'text-red-400' : 'text-[#1DB954]'}>
                        {getServicoIcon(lote.servico)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-white mb-1">{getServicoNome(lote.servico)}</h3>
                      <p
                        className="text-xs text-gray-400 truncate"
                        title={lote.email_mestre}
                      >
                        {lote.email_mestre}
                      </p>
                    </div>
                    {cheio && (
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    )}
                  </div>

                  {/* Corpo: Barra de Progresso + Texto X/Y Vagas */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-400">Ocupação</span>
                      <span className={`text-2xl font-bold ${cheio ? 'text-red-400' : 'text-[#1DB954]'}`}>
                        {lote.slots_ocupados}/{lote.limite_slots} Vagas
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-[#0a0a0a] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          cheio
                            ? 'bg-gradient-to-r from-red-500 to-red-600'
                            : 'bg-gradient-to-r from-[#1DB954] to-[#1ed760]'
                        }`}
                        style={{ width: `${porcentagem}%` }}
                      />
                    </div>
                  </div>

                  {/* Rodapé: Data de Renovação */}
                  <div className="flex items-center gap-2 text-sm text-gray-400 pt-4 border-t border-white/10">
                    <span>Renovação: {new Date(lote.data_renovacao).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

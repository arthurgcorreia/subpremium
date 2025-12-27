import { useState, useEffect } from 'react'
import { Music, Film, Youtube, Headphones, AlertCircle, Plus, Inbox, Calendar } from 'lucide-react'
import { supabase } from '../lib/supabase'
import Toast from '../components/Toast'

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
      return <Music className="w-8 h-8" />
    case 'netflix':
      return <Film className="w-8 h-8" />
    case 'youtube':
      return <Youtube className="w-8 h-8" />
    case 'deezer':
      return <Headphones className="w-8 h-8" />
    default:
      return <Music className="w-8 h-8" />
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
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' | 'info' } | null>(null)

  useEffect(() => {
    buscarLotes()
  }, [])

  const buscarLotes = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: supabaseError } = await supabase
        .from('contas_mestre')
        .select('*')
        .order('data_renovacao', { ascending: true })

      if (supabaseError) {
        throw supabaseError
      }

      if (data) {
        setLotes(data as ContaMestre[])
      }
    } catch (err) {
      console.error('Erro ao buscar lotes:', err)
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Erro ao conectar com o banco de dados. Verifique sua conexão.'
      
      setError(errorMessage)
      setToast({
        message: 'Não foi possível carregar os lotes. Verifique sua conexão.',
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleNovoLote = () => {
    console.log('Novo Lote - Funcionalidade em desenvolvimento')
    setToast({
      message: 'Funcionalidade em desenvolvimento',
      type: 'info',
    })
  }

  const isLoteCheio = (lote: ContaMestre) => {
    return lote.slots_ocupados >= lote.limite_slots || lote.status === 'cheio'
  }

  return (
    <div className="min-h-screen bg-background text-white p-4 md:p-8 relative z-10">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Dashboard Admin - Gestão de Lotes
          </h1>
          <button
            onClick={handleNovoLote}
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow-lg shadow-primary/30"
          >
            <Plus className="w-5 h-5" />
            Novo Lote
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
            <p className="text-gray-400 text-lg">Carregando lotes...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && lotes.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="glass-strong rounded-full p-6 mb-6 border border-white/10">
              <Inbox className="w-16 h-16 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-300">Nenhum lote encontrado</h2>
            <p className="text-gray-400 mb-8 max-w-md">
              Comece criando seu primeiro lote para gerenciar as assinaturas compartilhadas.
            </p>
            <button
              onClick={handleNovoLote}
              className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-lg shadow-primary/30 text-lg"
            >
              <Plus className="w-6 h-6" />
              Criar Primeiro Lote
            </button>
          </div>
        )}

        {/* Grid de Cards */}
        {!loading && lotes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {lotes.map((lote) => {
              const cheio = isLoteCheio(lote)
              const porcentagem = (lote.slots_ocupados / lote.limite_slots) * 100

              return (
                <div
                  key={lote.id}
                  className={`
                    relative glass rounded-xl p-6 border-2 transition-all duration-300
                    ${cheio 
                      ? 'border-red-500 bg-red-500/10 animate-pulse shadow-lg shadow-red-500/30' 
                      : 'border-white/10 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20'
                    }
                  `}
                >
                  {/* Ícone de Alerta quando cheio */}
                  {cheio && (
                    <div className="absolute top-4 right-4">
                      <AlertCircle className="w-6 h-6 text-red-500" />
                    </div>
                  )}

                  {/* Header do Card */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`p-3 rounded-lg ${cheio ? 'bg-red-500/20' : 'bg-primary/20'}`}>
                      <div className={cheio ? 'text-red-400' : 'text-primary'}>
                        {getServicoIcon(lote.servico)}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{getServicoNome(lote.servico)}</h3>
                      <p className="text-xs text-gray-400 truncate max-w-[150px]" title={lote.email_mestre}>
                        {lote.email_mestre}
                      </p>
                    </div>
                  </div>

                  {/* Barra de Progresso */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Ocupação</span>
                      <span className={`text-lg font-bold ${cheio ? 'text-red-400' : 'text-primary'}`}>
                        {lote.slots_ocupados}/{lote.limite_slots} Vagas
                      </span>
                    </div>
                    <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          cheio
                            ? 'bg-gradient-to-r from-red-500 to-red-600'
                            : 'bg-gradient-to-r from-primary to-primary-light'
                        }`}
                        style={{ width: `${porcentagem}%` }}
                      />
                    </div>
                  </div>

                  {/* Data de Renovação no Rodapé */}
                  <div className="flex items-center gap-2 text-sm text-gray-400 pt-4 border-t border-white/10">
                    <Calendar className="w-4 h-4" />
                    <span>Renovação: {new Date(lote.data_renovacao).toLocaleDateString('pt-BR')}</span>
                  </div>

                  {/* Status Badge */}
                  <div className="mt-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        cheio
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-green-500/20 text-green-400 border border-green-500/30'
                      }`}
                    >
                      {cheio ? 'Lote Cheio' : 'Ativo'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Toast de Erro */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  )
}

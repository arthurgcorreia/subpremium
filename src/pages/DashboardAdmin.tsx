import { useState, useEffect } from 'react'
import { Music, Film, Youtube, Headphones, AlertCircle, Plus } from 'lucide-react'
import { supabase } from '../lib/supabase'

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
  const [error, setError] = useState<string | null>(null)

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
      setError(err instanceof Error ? err.message : 'Erro ao carregar lotes')
    } finally {
      setLoading(false)
    }
  }

  const handleNovoLote = () => {
    console.log('Novo Lote - Funcionalidade em desenvolvimento')
  }

  const isLoteCheio = (lote: ContaMestre) => {
    return lote.slots_ocupados >= lote.limite_slots || lote.status === 'cheio'
  }

  return (
    <div className="min-h-screen bg-background text-white p-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Dashboard Admin - Gestão de Lotes</h1>
          <button
            onClick={handleNovoLote}
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Novo Lote
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg">
            <p className="text-red-400">Erro: {error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Carregando lotes...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lotes.map((lote) => {
            const cheio = isLoteCheio(lote)
            return (
              <div
                key={lote.id}
                className={`
                  relative bg-background-light rounded-lg p-6 border-2 transition-all duration-300
                  ${cheio ? 'border-red-500 shadow-lg shadow-red-500/50 animate-pulse' : 'border-gray-700 hover:border-primary'}
                `}
              >
                {cheio && (
                  <div className="absolute top-2 right-2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className="text-primary">{getServicoIcon(lote.servico)}</div>
                  <h3 className="text-xl font-bold">{getServicoNome(lote.servico)}</h3>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Slots Ocupados:</span>
                    <span className={`font-bold ${cheio ? 'text-red-400' : 'text-primary'}`}>
                      {lote.slots_ocupados} / {lote.limite_slots}
                    </span>
                  </div>

                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        cheio ? 'bg-red-500' : 'bg-primary'
                      }`}
                      style={{
                        width: `${(lote.slots_ocupados / lote.limite_slots) * 100}%`,
                      }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Status:</span>
                    <span
                      className={`font-semibold ${
                        cheio ? 'text-red-400' : 'text-green-400'
                      }`}
                    >
                      {lote.status === 'cheio' ? 'Lote Cheio' : 'Ativo'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">E-mail Mestre:</span>
                    <span className="text-gray-300 truncate ml-2" title={lote.email_mestre}>
                      {lote.email_mestre}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Renovação:</span>
                    <span className="text-gray-300">
                      {new Date(lote.data_renovacao).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>

                {cheio && (
                  <div className="mt-4 p-3 bg-red-500/20 border border-red-500 rounded-lg">
                    <p className="text-red-400 text-sm font-semibold text-center">
                      ⚠️ Lote Completo - Criar Novo Lote
                    </p>
                  </div>
                )}
              </div>
            )
          })}
          </div>
        )}

        {!loading && lotes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Nenhum lote encontrado</p>
          </div>
        )}
      </div>
    </div>
  )
}


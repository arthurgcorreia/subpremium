import { useState, useEffect } from 'react'
import { Music, Film, Youtube, Headphones, AlertCircle } from 'lucide-react'

interface ContaMestre {
  id: string
  servico: 'spotify' | 'netflix' | 'youtube' | 'deezer'
  email_mestre: string
  limite_slots: number
  slots_ocupados: number
  status: 'ativo' | 'cheio'
  data_renovacao: string
}

// Mock data - será substituído por dados do Supabase
const mockLotes: ContaMestre[] = [
  {
    id: '1',
    servico: 'spotify',
    email_mestre: 'spotify1@example.com',
    limite_slots: 5,
    slots_ocupados: 5,
    status: 'cheio',
    data_renovacao: '2025-01-15',
  },
  {
    id: '2',
    servico: 'spotify',
    email_mestre: 'spotify2@example.com',
    limite_slots: 5,
    slots_ocupados: 3,
    status: 'ativo',
    data_renovacao: '2025-01-20',
  },
  {
    id: '3',
    servico: 'netflix',
    email_mestre: 'netflix1@example.com',
    limite_slots: 4,
    slots_ocupados: 4,
    status: 'cheio',
    data_renovacao: '2025-01-18',
  },
  {
    id: '4',
    servico: 'netflix',
    email_mestre: 'netflix2@example.com',
    limite_slots: 4,
    slots_ocupados: 2,
    status: 'ativo',
    data_renovacao: '2025-01-25',
  },
  {
    id: '5',
    servico: 'youtube',
    email_mestre: 'youtube1@example.com',
    limite_slots: 5,
    slots_ocupados: 1,
    status: 'ativo',
    data_renovacao: '2025-01-22',
  },
  {
    id: '6',
    servico: 'deezer',
    email_mestre: 'deezer1@example.com',
    limite_slots: 5,
    slots_ocupados: 0,
    status: 'ativo',
    data_renovacao: '2025-01-30',
  },
]

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

  useEffect(() => {
    // TODO: Buscar dados do Supabase
    setLotes(mockLotes)
  }, [])

  const isLoteCheio = (lote: ContaMestre) => {
    return lote.slots_ocupados >= lote.limite_slots
  }

  return (
    <div className="min-h-screen bg-background text-white p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-8">Dashboard Admin - Gestão de Lotes</h1>

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

        {lotes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Nenhum lote encontrado</p>
          </div>
        )}
      </div>
    </div>
  )
}


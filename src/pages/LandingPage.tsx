import { useState, useEffect, useRef } from 'react'
import { Music, Film, Youtube, Headphones, Sparkles, TrendingDown } from 'lucide-react'
import { supabase } from '../lib/supabase'
import CheckoutModal from '../components/CheckoutModal'

interface Produto {
  id: string
  nome: string
  icone: React.ReactNode
  preco: string
  descricao: string
  servico: 'spotify' | 'netflix' | 'youtube' | 'deezer'
  emoji: string
}

interface VagasInfo {
  ocupadas: number
  total: number
  disponiveis: number
}

const produtos: Produto[] = [
  {
    id: '1',
    nome: 'Spotify Premium',
    icone: <Music className="w-8 h-8" />,
    preco: 'R$ 15,90/mês',
    descricao: 'Plano Família - Acesso completo',
    servico: 'spotify',
    emoji: '🎵',
  },
  {
    id: '2',
    nome: 'Netflix',
    icone: <Film className="w-8 h-8" />,
    preco: 'R$ 12,90/mês',
    descricao: '4 Perfis por conta',
    servico: 'netflix',
    emoji: '🎬',
  },
  {
    id: '3',
    nome: 'YouTube Premium',
    icone: <Youtube className="w-8 h-8" />,
    preco: 'R$ 14,90/mês',
    descricao: 'Plano Família - Sem anúncios',
    servico: 'youtube',
    emoji: '📺',
  },
  {
    id: '4',
    nome: 'Deezer Premium',
    icone: <Headphones className="w-8 h-8" />,
    preco: 'R$ 13,90/mês',
    descricao: 'Plano Família - Alta qualidade',
    servico: 'deezer',
    emoji: '🎧',
  },
]

export default function LandingPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null)
  const [vagasInfo, setVagasInfo] = useState<Record<string, VagasInfo>>({})
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({})

  useEffect(() => {
    buscarVagasDisponiveis()
    const interval = setInterval(buscarVagasDisponiveis, 30000) // Atualizar a cada 30s
    return () => clearInterval(interval)
  }, [])

  const buscarVagasDisponiveis = async () => {
    try {
      const servicos = ['spotify', 'netflix', 'youtube', 'deezer']
      const info: Record<string, VagasInfo> = {}

      for (const servico of servicos) {
        const { data } = await supabase
          .from('contas_mestre')
          .select('limite_slots, slots_ocupados')
          .eq('servico', servico)
          .eq('status', 'ativo')

        if (data) {
          const total = data.reduce((sum, conta) => sum + conta.limite_slots, 0)
          const ocupadas = data.reduce((sum, conta) => sum + conta.slots_ocupados, 0)
          info[servico] = {
            ocupadas,
            total,
            disponiveis: total - ocupadas,
          }
        }
      }

      setVagasInfo(info)
    } catch (error) {
      console.error('Erro ao buscar vagas:', error)
    }
  }

  const handleCardClick = (produto: Produto) => {
    setProdutoSelecionado(produto)
    setModalOpen(true)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, produtoId: string) => {
    const card = cardRefs.current[produtoId]
    if (!card) return

    const rect = card.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    card.style.setProperty('--mouse-x', `${x}%`)
    card.style.setProperty('--mouse-y', `${y}%`)
  }

  return (
    <div className="min-h-screen text-white relative z-10">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 text-center relative">
        <div className="max-w-4xl mx-auto">
          {/* Badge de Economia */}
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6 border border-primary/30">
            <TrendingDown className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Economize até 80%</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-primary to-white bg-clip-text text-transparent">
              Assinaturas Premium
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary via-primary-light to-primary bg-clip-text text-transparent">
              por uma Fração do Preço
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Acesse os melhores serviços de streaming e música{' '}
            <span className="text-primary font-semibold">compartilhando planos familiares</span> premium
          </p>

          {/* Área de Vídeo IA com Moldura Neon */}
          <div className="relative max-w-3xl mx-auto mb-12 mt-16">
            <div className="relative glass-strong rounded-2xl p-1 border-2 border-primary/50 shadow-[0_0_40px_rgba(29,185,84,0.3)]">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-background">
                {/* Placeholder para vídeo - pode ser substituído por um vídeo real */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Sparkles className="w-16 h-16 text-primary mx-auto mb-4 animate-pulse" />
                    <p className="text-gray-400 text-sm">Vídeo de Apresentação IA</p>
                  </div>
                </div>
                {/* Overlay gradiente */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              </div>
              {/* Brilho animado na borda */}
              <div className="absolute inset-0 rounded-2xl border-2 border-primary/30 animate-pulse pointer-events-none" />
            </div>
          </div>

          {/* Features com Emojis */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 glass px-4 py-2 rounded-lg border border-white/10">
              <span className="text-xl">⚡</span>
              <span className="text-gray-300">Acesso imediato</span>
            </div>
            <div className="flex items-center gap-2 glass px-4 py-2 rounded-lg border border-white/10">
              <span className="text-xl">🔒</span>
              <span className="text-gray-300">100% seguro</span>
            </div>
            <div className="flex items-center gap-2 glass px-4 py-2 rounded-lg border border-white/10">
              <span className="text-xl">💬</span>
              <span className="text-gray-300">Suporte garantido</span>
            </div>
            <div className="flex items-center gap-2 glass px-4 py-2 rounded-lg border border-white/10">
              <span className="text-xl">✨</span>
              <span className="text-gray-300">Sem compromisso</span>
            </div>
          </div>
        </div>
      </section>

      {/* Grid de Produtos com Glassmorphism */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Escolha Seu Plano
            </span>
          </h2>
          <p className="text-gray-400 text-lg">Planos familiares premium com economia garantida</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {produtos.map((produto) => {
            const vagas = vagasInfo[produto.servico] || { ocupadas: 0, total: 0, disponiveis: 0 }
            const porcentagemOcupada = vagas.total > 0 ? (vagas.ocupadas / vagas.total) * 100 : 0
            const quaseEsgotado = porcentagemOcupada >= 80

            return (
              <div
                key={produto.id}
                ref={(el) => (cardRefs.current[produto.id] = el)}
                onMouseMove={(e) => handleMouseMove(e, produto.id)}
                className="card-glow relative glass rounded-2xl p-6 border border-white/10 cursor-pointer transition-all duration-300 hover:scale-105 hover:border-primary/50 group"
                onClick={() => handleCardClick(produto)}
              >
                {/* Efeito de brilho no hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/10 group-hover:via-primary/5 group-hover:to-primary/10 transition-all duration-500 pointer-events-none" />

                <div className="relative z-10">
                  {/* Header do Card */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-3xl">{produto.emoji}</div>
                    <div className="text-primary">{produto.icone}</div>
                  </div>

                  <h3 className="text-xl font-bold mb-2">{produto.nome}</h3>
                  <p className="text-gray-400 text-sm mb-4">{produto.descricao}</p>

                  {/* Barra de Progresso de Vagas */}
                  {vagas.total > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="text-gray-400">Vagas disponíveis</span>
                        <span className={`font-semibold ${quaseEsgotado ? 'text-red-400' : 'text-primary'}`}>
                          {vagas.disponiveis} de {vagas.total}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            quaseEsgotado
                              ? 'bg-gradient-to-r from-red-500 to-orange-500'
                              : 'bg-gradient-to-r from-primary to-primary-light'
                          }`}
                          style={{ width: `${porcentagemOcupada}%` }}
                        />
                      </div>
                      {quaseEsgotado && (
                        <p className="text-xs text-red-400 mt-1 font-semibold">⚠️ Últimas vagas!</p>
                      )}
                    </div>
                  )}

                  <p className="text-3xl font-bold text-primary mb-4">{produto.preco}</p>

                  <button className="w-full bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg shadow-primary/30 group-hover:shadow-primary/50">
                    Assinar Agora
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-400 text-sm mt-20">
        <p>© 2025 SGA - Sistema de Gestão de Assinaturas. Todos os direitos reservados.</p>
      </footer>

      {/* Modal de Checkout */}
      <CheckoutModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
          buscarVagasDisponiveis() // Atualizar vagas após checkout
        }}
        produto={produtoSelecionado}
      />
    </div>
  )
}

import { useState } from 'react'
import { Music, Film, Youtube, Headphones, CheckCircle, X } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface Produto {
  id: string
  nome: string
  icone: React.ReactNode
  preco: string
  descricao: string
  servico: 'spotify' | 'netflix' | 'youtube' | 'deezer'
  temGlow?: boolean
}

const produtos: Produto[] = [
  {
    id: '1',
    nome: 'Spotify Premium',
    icone: <Music className="w-12 h-12" />,
    preco: 'R$ 15,90/mês',
    descricao: 'Plano Família - Acesso completo',
    servico: 'spotify',
    temGlow: true,
  },
  {
    id: '2',
    nome: 'Netflix',
    icone: <Film className="w-12 h-12" />,
    preco: 'R$ 12,90/mês',
    descricao: '4 Perfis por conta',
    servico: 'netflix',
  },
  {
    id: '3',
    nome: 'YouTube Premium',
    icone: <Youtube className="w-12 h-12" />,
    preco: 'R$ 14,90/mês',
    descricao: 'Plano Família - Sem anúncios',
    servico: 'youtube',
  },
  {
    id: '4',
    nome: 'Deezer Premium',
    icone: <Headphones className="w-12 h-12" />,
    preco: 'R$ 13,90/mês',
    descricao: 'Plano Família - Alta qualidade',
    servico: 'deezer',
  },
]

export default function LandingPage() {
  const [formData, setFormData] = useState({
    nome: '',
    whatsapp: '',
    email: '',
    produtoSelecionado: '',
  })
  const [loading, setLoading] = useState(false)
  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMensagem(null)

    try {
      // 1. Identificar qual serviço o usuário escolheu
      const produtoSelecionado = produtos.find(p => p.id === formData.produtoSelecionado)
      if (!produtoSelecionado) {
        throw new Error('Produto não encontrado')
      }

      const servico = produtoSelecionado.servico

      // 2. Buscar contas mestres ativas do serviço
      const { data: todasContas, error: errorContas } = await supabase
        .from('contas_mestre')
        .select('*')
        .eq('servico', servico)
        .eq('status', 'ativo')

      if (errorContas) {
        throw errorContas
      }

      // Filtrar contas com slots disponíveis (slots_ocupados < limite_slots)
      const contasDisponiveis = todasContas?.filter(
        conta => conta.slots_ocupados < conta.limite_slots
      ) || []

      // 3. Lógica de Estoque
      if (contasDisponiveis.length === 0) {
        // Estoque esgotado
        setMensagem({
          tipo: 'erro',
          texto: 'Estoque esgotado para este serviço. Tente novamente mais tarde.',
        })
        return
      }

      // Pegar a primeira conta disponível
      const contaMestre = contasDisponiveis[0]

      // 4. Inserir venda na tabela vendas
      const { error: errorVenda } = await supabase
        .from('vendas')
        .insert({
          conta_mestre_id: contaMestre.id,
          cliente_nome: formData.nome,
          cliente_email_servico: formData.email,
          cliente_whatsapp: formData.whatsapp,
          status_pagamento: 'pendente',
          status_entrega: 'pendente',
        })

      if (errorVenda) {
        throw errorVenda
      }

      // 5. Incrementar slots_ocupados da conta mestre
      const novoSlotsOcupados = contaMestre.slots_ocupados + 1
      const novoStatus = novoSlotsOcupados >= contaMestre.limite_slots ? 'cheio' : 'ativo'

      const { error: errorUpdate } = await supabase
        .from('contas_mestre')
        .update({
          slots_ocupados: novoSlotsOcupados,
          status: novoStatus,
        })
        .eq('id', contaMestre.id)

      if (errorUpdate) {
        throw errorUpdate
      }

      // 6. Sucesso - limpar formulário e exibir mensagem
      setFormData({
        nome: '',
        whatsapp: '',
        email: '',
        produtoSelecionado: '',
      })

      setMensagem({
        tipo: 'sucesso',
        texto: 'Pedido Realizado com sucesso! Você receberá as informações de acesso em breve.',
      })

      // Limpar mensagem após 5 segundos
      setTimeout(() => {
        setMensagem(null)
      }, 5000)
    } catch (error) {
      console.error('Erro no checkout:', error)
      setMensagem({
        tipo: 'erro',
        texto: error instanceof Error ? error.message : 'Erro ao processar pedido. Tente novamente.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
          Economize até 80% nas suas Assinaturas
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Acesse os melhores serviços de streaming e música compartilhando planos familiares premium
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
          <span>✓ Sem compromisso</span>
          <span>✓ Acesso imediato</span>
          <span>✓ Suporte garantido</span>
        </div>
      </section>

      {/* Grid de Produtos */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-12">Nossos Planos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {produtos.map((produto) => (
            <div
              key={produto.id}
              className={`
                relative bg-background-light rounded-lg p-6 border-2 transition-all duration-300
                hover:scale-105 hover:border-primary
                ${produto.temGlow ? 'border-primary shadow-glow hover:shadow-glow-lg' : 'border-gray-700'}
              `}
            >
              {produto.temGlow && (
                <div className="absolute inset-0 rounded-lg bg-primary opacity-10 blur-xl animate-pulse" />
              )}
              <div className="relative z-10">
                <div className="text-primary mb-4 flex justify-center">
                  {produto.icone}
                </div>
                <h3 className="text-xl font-bold mb-2">{produto.nome}</h3>
                <p className="text-gray-400 text-sm mb-4">{produto.descricao}</p>
                <p className="text-2xl font-bold text-primary mb-4">{produto.preco}</p>
                <button
                  onClick={() => setFormData(prev => ({ ...prev, produtoSelecionado: produto.id }))}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Assinar Agora
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Formulário de Checkout */}
      <section className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="bg-background-light rounded-lg p-8 border border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-center">Finalizar Assinatura</h2>

          {/* Mensagens de Feedback */}
          {mensagem && (
            <div
              className={`mb-6 p-4 rounded-lg border-2 flex items-center gap-3 ${
                mensagem.tipo === 'sucesso'
                  ? 'bg-green-500/20 border-green-500 text-green-400'
                  : 'bg-red-500/20 border-red-500 text-red-400'
              }`}
            >
              {mensagem.tipo === 'sucesso' ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <X className="w-5 h-5 flex-shrink-0" />
              )}
              <p className="flex-1">{mensagem.texto}</p>
              <button
                onClick={() => setMensagem(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <form onSubmit={handleCheckout} className="space-y-4">
            <div>
              <label htmlFor="produto" className="block text-sm font-medium mb-2">
                Produto
              </label>
              <select
                id="produto"
                name="produtoSelecionado"
                value={formData.produtoSelecionado}
                onChange={handleInputChange}
                className="w-full bg-background border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                required
              >
                <option value="">Selecione um produto</option>
                {produtos.map((produto) => (
                  <option key={produto.id} value={produto.id}>
                    {produto.nome} - {produto.preco}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="nome" className="block text-sm font-medium mb-2">
                Nome Completo
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                className="w-full bg-background border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                placeholder="Seu nome completo"
                required
              />
            </div>

            <div>
              <label htmlFor="whatsapp" className="block text-sm font-medium mb-2">
                WhatsApp
              </label>
              <input
                type="tel"
                id="whatsapp"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleInputChange}
                className="w-full bg-background border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                placeholder="(00) 00000-0000"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                E-mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-background border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                placeholder="seu@email.com"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors mt-6"
            >
              {loading ? 'Processando...' : 'Finalizar Compra'}
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-400 text-sm">
        <p>© 2025 SGA - Sistema de Gestão de Assinaturas. Todos os direitos reservados.</p>
      </footer>
    </div>
  )
}


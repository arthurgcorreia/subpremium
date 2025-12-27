import { useState, useEffect } from 'react'
import { X, CheckCircle, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  produto: {
    id: string
    nome: string
    preco: string
    servico: 'spotify' | 'netflix' | 'youtube' | 'deezer'
  } | null
}

export default function CheckoutModal({ isOpen, onClose, produto }: CheckoutModalProps) {
  const [formData, setFormData] = useState({
    nome: '',
    whatsapp: '',
    email: '',
  })
  const [loading, setLoading] = useState(false)
  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
      // Reset form quando fechar
      setFormData({ nome: '', whatsapp: '', email: '' })
      setMensagem(null)
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!produto) return

    setLoading(true)
    setMensagem(null)

    try {
      const servico = produto.servico

      // Buscar contas mestres ativas do serviço
      const { data: todasContas, error: errorContas } = await supabase
        .from('contas_mestre')
        .select('*')
        .eq('servico', servico)
        .eq('status', 'ativo')

      if (errorContas) {
        throw errorContas
      }

      // Filtrar contas com slots disponíveis
      const contasDisponiveis = todasContas?.filter(
        conta => conta.slots_ocupados < conta.limite_slots
      ) || []

      if (contasDisponiveis.length === 0) {
        setMensagem({
          tipo: 'erro',
          texto: 'Estoque esgotado para este serviço. Tente novamente mais tarde.',
        })
        setLoading(false)
        return
      }

      const contaMestre = contasDisponiveis[0]

      // Inserir venda
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

      // Incrementar slots
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

      // Sucesso
      setFormData({ nome: '', whatsapp: '', email: '' })
      setMensagem({
        tipo: 'sucesso',
        texto: 'Pedido Realizado com sucesso! Você receberá as informações de acesso em breve.',
      })

      setTimeout(() => {
        onClose()
      }, 2000)
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

  if (!isOpen || !produto) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md glass-strong rounded-2xl p-8 border border-primary/30 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              Finalizar Assinatura
            </h2>
            <p className="text-sm text-gray-400 mt-1">{produto.nome}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mensagens */}
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
            <p className="flex-1 text-sm">{mensagem.texto}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleCheckout} className="space-y-4">
          <div>
            <label htmlFor="modal-nome" className="block text-sm font-medium mb-2 text-gray-300">
              Nome Completo
            </label>
            <input
              type="text"
              id="modal-nome"
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              className="w-full glass border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
              placeholder="Seu nome completo"
              required
            />
          </div>

          <div>
            <label htmlFor="modal-whatsapp" className="block text-sm font-medium mb-2 text-gray-300">
              WhatsApp
            </label>
            <input
              type="tel"
              id="modal-whatsapp"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleInputChange}
              className="w-full glass border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
              placeholder="(00) 00000-0000"
              required
            />
          </div>

          <div>
            <label htmlFor="modal-email" className="block text-sm font-medium mb-2 text-gray-300">
              E-mail
            </label>
            <input
              type="email"
              id="modal-email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full glass border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-primary/30"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processando...
                </>
              ) : (
                `Finalizar Compra - ${produto.preco}`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


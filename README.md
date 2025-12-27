# SGA - Sistema de Gestão de Assinaturas

Sistema completo para gestão de assinaturas compartilhadas de serviços de streaming e música, desenvolvido com React, TypeScript, Tailwind CSS e Supabase.

## 🚀 Tecnologias

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS v4
- **Backend:** Supabase (PostgreSQL + Auth)
- **Roteamento:** React Router v7
- **Ícones:** Lucide React

## 🎨 Design

- **Tema:** Premium Dark Mode (#121212)
- **Cor Primária:** Verde Spotify (#1DB954)
- **UI:** Componentes modernos e responsivos

## 📋 Funcionalidades

### Landing Page
- Hero Section com foco em conversão
- Grid de produtos com destaque visual (Spotify com efeito glow)
- Formulário de checkout simplificado (Nome, WhatsApp, E-mail)
- Sistema de alocação automática de slots

### Dashboard Admin
- Visualização de lotes em cards
- Indicadores visuais para lotes cheios (borda vermelha, animação pulsante)
- Informações detalhadas: slots ocupados/limite, status, e-mail mestre, data de renovação
- Botão para criar novos lotes

### Lógica de Negócio
- **Spotify/YouTube/Deezer:** Planos Família (6 total) - 1 Admin + 5 Clientes
- **Netflix:** 4 perfis por conta mestre
- Alocação automática de slots disponíveis
- Controle de estoque em tempo real

## 🗄️ Estrutura do Banco de Dados

### Tabela: `contas_mestre`
- `id` (UUID)
- `servico` (spotify | netflix | youtube | deezer)
- `email_mestre` (string)
- `senha_criptografada` (string)
- `limite_slots` (integer)
- `slots_ocupados` (integer)
- `status` ('ativo' | 'cheio')
- `data_renovacao` (date)

### Tabela: `vendas`
- `id` (UUID)
- `conta_mestre_id` (FK → contas_mestre)
- `cliente_nome` (string)
- `cliente_email_servico` (string)
- `cliente_whatsapp` (string)
- `status_pagamento` (string)
- `status_entrega` (string)

## 🛠️ Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/subpremium.git
cd subpremium
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` e adicione:
```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

4. Execute as políticas RLS no Supabase:
- Abra o SQL Editor no Supabase Dashboard
- Execute o conteúdo do arquivo `supabase-rls-policies.sql`

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## 📦 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Preview do build de produção

## 🔒 Segurança

⚠️ **Importante:** As políticas RLS configuradas no arquivo `supabase-rls-policies.sql` permitem acesso público para desenvolvimento. Em produção, você deve restringir o acesso baseado em autenticação e roles de usuário.

## 📝 Regras de Negócio

- **Privacidade:** Nunca solicitar senha pessoal do cliente para serviços de convite (apenas e-mail)
- **Netflix:** Entregar credencial criptografada
- **Notificações:** Todas as notificações vão para o Admin (sem automação direta para cliente)

## 🎯 Roadmap

- [ ] Autenticação de usuários
- [ ] Sistema de pagamentos
- [ ] Notificações automáticas
- [ ] Dashboard de métricas
- [ ] Exportação de relatórios

## 📄 Licença

Este projeto é privado e proprietário.

## 👤 Autor

Desenvolvido para gestão de assinaturas compartilhadas.

---

**Versão:** 1.0.0  
**Última atualização:** Dezembro 2025


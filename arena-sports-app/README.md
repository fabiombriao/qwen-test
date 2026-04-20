# Arena Sports App - Aplicativo para Gestão de Arenas Esportivas

## Visão Geral
Aplicativo completo para gestão de arenas de quadras esportivas, com módulos para clientes e administradores.

## Estrutura do Projeto

```
arena-sports-app/
├── apps/
│   ├── client/          # App/PWA do Cliente
│   └── admin/           # Dashboard da Arena (Web App)
├── packages/
│   ├── database/        # Configurações do banco de dados (Supabase)
│   ├── ui/              # Componentes UI compartilhados
│   └── shared/          # Tipos, utilitários e lógica compartilhada
└── README.md
```

## Módulos

### 📱 Módulo do Cliente (App / PWA)

1. **Onboarding e Login**
   - Login via WhatsApp (OTP) ou Nome + Celular
   - Perfil criado automaticamente no primeiro agendamento

2. **Home e Seleção de Reserva**
   - Escolha: Esporte → Data → Horário Disponível
   - Horários bloqueados/reservados permanentemente não aparecem
   - Destaque para promoções de última hora

3. **Checkout e Pagamento**
   - Pagamento parcial configurável (ex: 50%) via Pix ou Cartão
   - Saldo devedor automático para cobrança na arena

4. **Confirmação e Política de Cancelamento**
   - QR Code da reserva
   - Cancelamento disponível até 24h antes
   - Reembolso automático em até 30 minutos

5. **Minhas Reservas e Histórico**
   - Reservas futuras e passadas
   - Botões: Cancelar (se dentro da janela) e Ver Comanda

6. **Comanda Digital** ⭐
   - Aba Individual: consumações pessoais
   - Aba Grupo: consumações da quadra
   - Divisão de conta: "Dividir igual" ou "Pagar só o meu"

7. **Perfil e Notificações**
   - Dados pessoais, preferências, métodos de pagamento
   - Central de notificações

### 🖥️ Módulo da Arena (Dashboard Web)

1. **Dashboard Principal**
   - Faturamento dia/mês, ocupação, horários vagos
   - Alertas de inadimplência

2. **Agenda e Gestão de Quadras**
   - Grade: dias x horários x quadras
   - Cores: Reserva Avulsa, Permanente, Bloqueio Interno
   - Sobreposição de reservas com prioridade
   - Lançamento manual rápido

3. **Gestão de Comandas (Bar)**
   - Busca rápida por cliente ou quadra
   - Lançamento em 2 cliques
   - Vinculação: Cliente específico ou Comanda Geral
   - Fechamento: QR Code ou recebimento presencial

4. **CRM e Base de Clientes**
   - Histórico completo (gastos, visitas, última visita)
   - Tags automáticas: Aleatório, Recorrente, Permanente
   - Tags manuais: Nível A, Nível B
   - Filtros: Aniversariantes, Top 10 clientes

5. **Campanhas e Remarketing**
   - Disparo via WhatsApp integrado
   - Campanha de Aniversário automática
   - Divulgação de horários ociosos (com limite de frequência)

6. **Relatórios Financeiros e Operacionais**
   - Filtros por período, quadra, serviço
   - Métricas: Faturamento (Quadra vs Bar), ticket médio, cancelamentos, rankings

7. **Configurações da Arena**
   - Cadastro de Quadras, Esportes, Produtos do Bar
   - Configuração de Permanentes
   - Regras de Pagamento (% sinal, regra de cancelamento)

8. **Integração WhatsApp**
   - Configuração da API
   - Bot de atendimento automático com link do app

## Tecnologias Sugeridas

- **Frontend Cliente:** React Native / Expo ou Next.js (PWA)
- **Frontend Admin:** Next.js + TailwindCSS
- **Backend:** Node.js com Supabase (PostgreSQL + Auth + Realtime)
- **Banco de Dados:** Supabase (PostgreSQL)
- **Pagamentos:** Integração com APIs de Pix e Cartão
- **WhatsApp:** API oficial ou soluções como Twilio/Z-API

## Próximos Passos

1. Configurar ambiente de desenvolvimento
2. Modelar banco de dados no Supabase
3. Implementar autenticação
4. Desenvolver módulo de reservas
5. Implementar sistema de pagamentos
6. Criar gestão de comandas
7. Desenvolver dashboard administrativo
8. Integrar WhatsApp

## Licença
MIT

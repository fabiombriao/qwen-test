-- Arena Sports App - Schema do Banco de Dados (Supabase/PostgreSQL)

-- ============================================
-- EXTENSÕES
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- ENUMS
-- ============================================
CREATE TYPE reservation_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed', 'no_show');
CREATE TYPE payment_status AS ENUM ('pending', 'partial', 'paid', 'refunded', 'failed');
CREATE TYPE payment_method AS ENUM ('pix', 'credit_card', 'debit_card', 'cash');
CREATE TYPE customer_type AS ENUM ('random', 'recurring', 'permanent');
CREATE TYPE booking_type AS ENUM ('regular', 'permanent', 'internal_block');

-- ============================================
-- TABELAS PRINCIPAIS
-- ============================================

-- 1. Arenas (cada arena tem seu próprio ambiente)
CREATE TABLE arenas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18),
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(2),
    logo_url TEXT,
    cover_image_url TEXT,
    settings JSONB DEFAULT '{}', -- Configurações gerais da arena
    whatsapp_api_config JSONB, -- Configuração da API do WhatsApp
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Usuários (clientes e administradores)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    arena_id UUID REFERENCES arenas(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    birth_date DATE,
    avatar_url TEXT,
    preferences JSONB DEFAULT '{}', -- Preferências de esportes, notificações, etc.
    customer_type customer_type DEFAULT 'random',
    manual_tags TEXT[], -- Tags manuais: "Nível A", "Nível B"
    total_spent DECIMAL(10,2) DEFAULT 0,
    total_visits INTEGER DEFAULT 0,
    last_visit_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(arena_id, phone)
);

-- 3. Quadras
CREATE TABLE courts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    arena_id UUID REFERENCES arenas(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    sport_type VARCHAR(50) NOT NULL, -- futebol, vôlei, basquete, etc.
    description TEXT,
    image_url TEXT,
    price_per_hour DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Produtos do Bar
CREATE TABLE bar_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    arena_id UUID REFERENCES arenas(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100), -- bebidas, comidas, etc.
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    cost DECIMAL(10,2), -- custo para cálculo de lucro
    is_active BOOLEAN DEFAULT true,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Reservas
CREATE TABLE reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    arena_id UUID REFERENCES arenas(id) ON DELETE CASCADE,
    court_id UUID REFERENCES courts(id) ON DELETE RESTRICT,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    booking_type booking_type DEFAULT 'regular',
    sport_type VARCHAR(50) NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status reservation_status DEFAULT 'pending',
    total_price DECIMAL(10,2) NOT NULL,
    paid_amount DECIMAL(10,2) DEFAULT 0,
    pending_amount DECIMAL(10,2) GENERATED ALWAYS (total_price - paid_amount) STORED,
    payment_percentage_required INTEGER DEFAULT 50, -- % de sinal exigido
    cancellation_policy_hours INTEGER DEFAULT 24, -- horas mínimas para cancelamento
    notes TEXT,
    qr_code TEXT, -- QR Code da reserva
    cancelled_at TIMESTAMP WITH TIME ZONE,
    refund_amount DECIMAL(10,2),
    refunded_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Índice para busca rápida por horário
    INDEX idx_reservations_time (start_time, end_time),
    INDEX idx_reservations_arena_court (arena_id, court_id, start_time),
    INDEX idx_reservations_user (user_id),
    
    -- Restrição para evitar sobreposição de horários na mesma quadra
    CONSTRAINT no_overlap EXCLUDE USING GIST (
        court_id WITH =,
        tsrange(start_time, end_time) WITH &&
    ) WHERE (status != 'cancelled')
);

-- 6. Pagamentos
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    arena_id UUID REFERENCES arenas(id) ON DELETE CASCADE,
    reservation_id UUID REFERENCES reservations(id) ON DELETE SET NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method payment_method NOT NULL,
    payment_status payment_status DEFAULT 'pending',
    transaction_id VARCHAR(255), -- ID da transação no gateway de pagamento
    pix_code TEXT, -- Código Pix (copia e cola)
    pix_expiration TIMESTAMP WITH TIME ZONE,
    card_last_four VARCHAR(4),
    receipt_url TEXT,
    refund_reason TEXT,
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    INDEX idx_payments_reservation (reservation_id),
    INDEX idx_payments_user (user_id),
    INDEX idx_payments_status (payment_status)
);

-- 7. Comandas (Consumações do Bar)
CREATE TABLE tab_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    arena_id UUID REFERENCES arenas(id) ON DELETE CASCADE,
    reservation_id UUID REFERENCES reservations(id) ON DELETE SET NULL,
    court_id UUID REFERENCES courts(id) ON DELETE SET NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- cliente específico ou NULL para comanda geral
    table_number VARCHAR(50), -- número identificador da mesa/quadra
    status VARCHAR(50) DEFAULT 'open', -- open, closed, paid
    total_amount DECIMAL(10,2) DEFAULT 0,
    paid_amount DECIMAL(10,2) DEFAULT 0,
    split_type VARCHAR(50), -- 'individual', 'equal_split', 'custom'
    notes TEXT,
    opened_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    closed_at TIMESTAMP WITH TIME ZONE,
    paid_at TIMESTAMP WITH TIME ZONE,
    
    INDEX idx_tab_orders_reservation (reservation_id),
    INDEX idx_tab_orders_user (user_id),
    INDEX idx_tab_orders_status (status)
);

-- 8. Itens da Comanda
CREATE TABLE tab_order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tab_order_id UUID REFERENCES tab_orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES bar_products(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    notes TEXT, -- observações do item (ex: sem gelo)
    created_by UUID REFERENCES users(id), -- atendente que lançou
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Pagamentos da Comanda
CREATE TABLE tab_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tab_order_id UUID REFERENCES tab_orders(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- quem pagou (para divisão)
    amount DECIMAL(10,2) NOT NULL,
    payment_method payment_method NOT NULL,
    payment_status payment_status DEFAULT 'paid',
    transaction_id VARCHAR(255),
    pix_code TEXT,
    receipt_url TEXT,
    paid_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    INDEX idx_tab_payments_tab_order (tab_order_id),
    INDEX idx_tab_payments_user (user_id)
);

-- 10. Campanhas de Marketing
CREATE TABLE marketing_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    arena_id UUID REFERENCES arenas(id) ON DELETE CASCADE,
    campaign_type VARCHAR(50) NOT NULL, -- 'birthday', 'idle_hours', 'tournament', 'custom'
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    target_audience JSONB, -- filtros de público alvo
    scheduled_for TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'draft', -- draft, scheduled, sending, completed, cancelled
    total_recipients INTEGER DEFAULT 0,
    total_sent INTEGER DEFAULT 0,
    total_delivered INTEGER DEFAULT 0,
    total_clicked INTEGER DEFAULT 0,
    frequency_limit_days INTEGER DEFAULT 1, -- limite de frequência de envio
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    INDEX idx_campaigns_arena (arena_id),
    INDEX idx_campaigns_status (status)
);

-- 11. Mensagens de Campanha (log de envios)
CREATE TABLE campaign_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES marketing_campaigns(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    phone VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, sent, delivered, failed
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    INDEX idx_campaign_messages_campaign (campaign_id),
    INDEX idx_campaign_messages_user (user_id)
);

-- 12. Notificações
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    arena_id UUID REFERENCES arenas(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50), -- 'reservation_reminder', 'promotion', 'birthday', 'tournament_invite', etc.
    related_entity_type VARCHAR(50), -- 'reservation', 'payment', 'campaign', etc.
    related_entity_id UUID,
    is_read BOOLEAN DEFAULT false,
    sent_via_whatsapp BOOLEAN DEFAULT false,
    sent_via_push BOOLEAN DEFAULT false,
    sent_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    INDEX idx_notifications_user (user_id, is_read),
    INDEX idx_notifications_arena (arena_id)
);

-- 13. Configurações da Arena (detalhado)
CREATE TABLE arena_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    arena_id UUID REFERENCES arenas(id) ON DELETE CASCADE UNIQUE,
    payment_default_percentage INTEGER DEFAULT 50, -- % padrão de sinal
    cancellation_policy_hours INTEGER DEFAULT 24,
    refund_processing_minutes INTEGER DEFAULT 30,
    auto_confirm_reservations BOOLEAN DEFAULT true,
    allow_manual_override BOOLEAN DEFAULT true, -- permitir sobreposição manual
    max_idle_hours_campaign_frequency INTEGER DEFAULT 1, -- freq máxima de campanha de horários ociosos
    business_hours JSONB, -- horários de funcionamento
    holidays JSONB, -- feriados
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- VIEWS ÚTEIS
-- ============================================

-- View: Resumo de Clientes
CREATE VIEW customer_summary AS
SELECT 
    u.id,
    u.name,
    u.phone,
    u.customer_type,
    u.manual_tags,
    u.total_spent,
    u.total_visits,
    u.last_visit_at,
    COUNT(r.id) as total_reservations,
    COUNT(CASE WHEN r.status = 'completed' THEN 1 END) as completed_reservations,
    COUNT(CASE WHEN r.status = 'cancelled' THEN 1 END) as cancelled_reservations,
    MAX(r.start_time) as last_reservation_date
FROM users u
LEFT JOIN reservations r ON u.id = r.user_id
GROUP BY u.id;

-- View: Faturamento Diário
CREATE VIEW daily_revenue AS
SELECT 
    DATE(p.processed_at) as date,
    a.id as arena_id,
    a.name as arena_name,
    COUNT(DISTINCT p.reservation_id) as reservation_count,
    SUM(CASE WHEN p.reservation_id IS NOT NULL THEN p.amount ELSE 0 END) as court_revenue,
    SUM(CASE WHEN tp.tab_order_id IS NOT NULL THEN p.amount ELSE 0 END) as bar_revenue,
    SUM(p.amount) as total_revenue
FROM payments p
JOIN arenas a ON p.arena_id = a.id
LEFT JOIN tab_payments tp ON p.id = tp.id
WHERE p.payment_status = 'paid'
GROUP BY DATE(p.processed_at), a.id, a.name
ORDER BY date DESC;

-- View: Horários Ociosos (próximos 7 dias)
CREATE VIEW idle_hours AS
SELECT 
    c.arena_id,
    c.id as court_id,
    c.name as court_name,
    c.sport_type,
    generate_series(
        CURRENT_DATE,
        CURRENT_DATE + INTERVAL '7 days',
        INTERVAL '1 hour'
    )::timestamp as time_slot,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM reservations r 
            WHERE r.court_id = c.id 
            AND r.status NOT IN ('cancelled')
            AND r.start_time <= generate_series(
                CURRENT_DATE,
                CURRENT_DATE + INTERVAL '7 days',
                INTERVAL '1 hour'
            )::timestamp
            AND r.end_time > generate_series(
                CURRENT_DATE,
                CURRENT_DATE + INTERVAL '7 days',
                INTERVAL '1 hour'
            )::timestamp
        ) THEN false
        ELSE true
    END as is_available
FROM courts c
WHERE c.is_active = true;

-- ============================================
-- FUNCTIONS E TRIGGERS
-- ============================================

-- Função: Atualizar stats do usuário após reserva completada
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
        UPDATE users 
        SET 
            total_visits = total_visits + 1,
            total_spent = total_spent + NEW.total_price,
            last_visit_at = NEW.start_time,
            updated_at = NOW()
        WHERE id = NEW.user_id;
        
        -- Atualizar tipo de cliente baseado em frequência
        UPDATE users
        SET customer_type = CASE
            WHEN total_visits >= 10 THEN 'permanent'
            WHEN total_visits >= 3 THEN 'recurring'
            ELSE 'random'
        END
        WHERE id = NEW.user_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_user_stats
AFTER UPDATE ON reservations
FOR EACH ROW
EXECUTE FUNCTION update_user_stats();

-- Função: Processar reembolso automático
CREATE OR REPLACE FUNCTION process_refund()
RETURNS TRIGGER AS $$
DECLARE
    refund_settings RECORD;
BEGIN
    IF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
        -- Verificar se está dentro da política de cancelamento
        IF NEW.cancelled_at >= (NEW.start_time - (NEW.cancellation_policy_hours || ' hours')::interval) THEN
            -- Dentro do prazo, processar reembolso
            UPDATE payments
            SET 
                payment_status = 'refunded',
                refund_amount = paid_amount,
                refunded_at = NOW(),
                updated_at = NOW()
            WHERE reservation_id = NEW.id;
            
            -- Atualizar valor pago na reserva
            NEW.paid_amount = 0;
            NEW.refund_amount = OLD.paid_amount;
            NEW.refunded_at = NOW();
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_process_refund
BEFORE UPDATE ON reservations
FOR EACH ROW
EXECUTE FUNCTION process_refund();

-- Função: Atualizar total da comanda
CREATE OR REPLACE FUNCTION update_tab_total()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE tab_orders
        SET 
            total_amount = (SELECT COALESCE(SUM(subtotal), 0) FROM tab_order_items WHERE tab_order_id = NEW.tab_order_id),
            updated_at = NOW()
        WHERE id = NEW.tab_order_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE tab_orders
        SET 
            total_amount = (SELECT COALESCE(SUM(subtotal), 0) FROM tab_order_items WHERE tab_order_id = OLD.tab_order_id),
            updated_at = NOW()
        WHERE id = OLD.tab_order_id;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_tab_total
AFTER INSERT OR UPDATE OR DELETE ON tab_order_items
FOR EACH ROW
EXECUTE FUNCTION update_tab_total();

-- ============================================
-- ÍNDICES ADICIONAIS PARA PERFORMANCE
-- ============================================
CREATE INDEX idx_users_customer_type ON users(customer_type);
CREATE INDEX idx_users_tags ON users USING GIN(manual_tags);
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_reservations_created ON reservations(created_at DESC);
CREATE INDEX idx_courts_arena ON courts(arena_id, is_active);
CREATE INDEX idx_bar_products_arena ON bar_products(arena_id, is_active);
CREATE INDEX idx_tab_orders_arena ON tab_orders(arena_id, status);

-- ============================================
-- COMENTÁRIOS NAS TABELAS
-- ============================================
COMMENT ON TABLE arenas IS 'Informações das arenas esportivas';
COMMENT ON TABLE users IS 'Clientes e administradores do sistema';
COMMENT ON TABLE courts IS 'Quadras disponíveis nas arenas';
COMMENT ON TABLE bar_products IS 'Produtos vendidos no bar';
COMMENT ON TABLE reservations IS 'Reservas de quadras';
COMMENT ON TABLE payments IS 'Pagamentos de reservas';
COMMENT ON TABLE tab_orders IS 'Comandas de consumo do bar';
COMMENT ON TABLE tab_order_items IS 'Itens consumidos nas comandas';
COMMENT ON TABLE tab_payments IS 'Pagamentos de comandas';
COMMENT ON TABLE marketing_campaigns IS 'Campanhas de marketing e remarketing';
COMMENT ON TABLE campaign_messages IS 'Log de mensagens enviadas nas campanhas';
COMMENT ON TABLE notifications IS 'Notificações para usuários';
COMMENT ON TABLE arena_settings IS 'Configurações detalhadas de cada arena';

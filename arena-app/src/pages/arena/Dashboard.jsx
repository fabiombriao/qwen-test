import { useState } from 'react';
import { mockStats, mockClients } from '../../utils/mockData';

export default function ArenaDashboard() {
  const [period, setPeriod] = useState('today');

  return (
    <div className="app-container">
      <div className="flex justify-between items-center mb-2">
        <h2>🏟️ Dashboard da Arena</h2>
        <select 
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}
        >
          <option value="today">Hoje</option>
          <option value="week">Esta Semana</option>
          <option value="month">Este Mês</option>
        </select>
      </div>

      {/* Cards de Estatísticas */}
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-value">R$ {mockStats.dailyRevenue.toLocaleString('pt-BR')}</div>
          <div className="stat-label">Faturamento Hoje</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{mockStats.dailyOccupancy}%</div>
          <div className="stat-label">Ocupação Hoje</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{mockStats.activeReservations}</div>
          <div className="stat-label">Reservas Ativas</div>
        </div>

        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--danger-color)' }}>{mockStats.pendingPayments}</div>
          <div className="stat-label">Pagamentos Pendentes</div>
        </div>
      </div>

      {/* Alertas de Inadimplência */}
      {mockStats.pendingPayments > 0 && (
        <div className="card mb-2" style={{ background: '#fee2e2', border: '1px solid #ef4444' }}>
          <h3 style={{ color: '#991b1b', marginBottom: '1rem' }}>⚠️ Alerta de Inadimplência</h3>
          <p style={{ color: '#991b1b', marginBottom: '1rem' }}>
            Existem {mockStats.pendingPayments} consumações não pagas do dia anterior.
          </p>
          <button className="btn btn-danger">
            Ver Detalhes
          </button>
        </div>
      )}

      {/* Horários Vagos */}
      <div className="card mb-2">
        <h3 className="mb-1">📅 Horários Vagos - Próximos 7 Dias</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
          Oportunidades para campanhas de remarketing
        </p>

        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {[
            { date: '15/01', time: '14:00', court: 'Quadra 1' },
            { date: '15/01', time: '15:00', court: 'Quadra 2' },
            { date: '16/01', time: '09:00', court: 'Quadra 3' },
            { date: '17/01', time: '10:00', court: 'Quadra 1' },
          ].map((slot, index) => (
            <div key={index} className="card" style={{ padding: '0.75rem', marginBottom: 0 }}>
              <div className="flex justify-between items-center">
                <div>
                  <strong>{slot.date} às {slot.time}</strong>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>{slot.court}</p>
                </div>
                <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                  Divulgar
                </button>
              </div>
            </div>
          ))}
        </div>

        <button className="btn btn-primary btn-block mt-2">
          Criar Campanha de Remarketing
        </button>
      </div>

      {/* Resumo por Tipo de Serviço */}
      <div className="card mb-2">
        <h3 className="mb-1">📊 Faturamento por Tipo</h3>
        
        <div style={{ marginBottom: '1rem' }}>
          <div className="flex justify-between mb-1">
            <span>Quadras</span>
            <strong>R$ 1.850,00</strong>
          </div>
          <div style={{ height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: '75%', height: '100%', background: 'var(--primary-color)' }}></div>
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <div className="flex justify-between mb-1">
            <span>Bar/Consumação</span>
            <strong>R$ 600,00</strong>
          </div>
          <div style={{ height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: '25%', height: '100%', background: 'var(--secondary-color)' }}></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span>Total</span>
            <strong>R$ 2.450,00</strong>
          </div>
        </div>
      </div>

      {/* Top Clientes */}
      <div className="card">
        <h3 className="mb-1">🏆 Top 5 Clientes do Mês</h3>
        
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {mockClients.slice(0, 5).map((client, index) => (
            <div key={client.id} className="card" style={{ padding: '0.75rem', marginBottom: 0 }}>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    background: index === 0 ? '#fbbf24' : index === 1 ? '#9ca3af' : index === 2 ? '#b45309' : 'var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    color: index < 3 ? 'white' : 'var(--text-secondary)'
                  }}>
                    {index + 1}
                  </div>
                  <div>
                    <strong>{client.name}</strong>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
                      {client.visits} visitas
                    </p>
                  </div>
                </div>
                <strong style={{ color: 'var(--primary-color)' }}>
                  R$ {client.totalSpent.toLocaleString('pt-BR')}
                </strong>
              </div>
            </div>
          ))}
        </div>

        <button className="btn btn-outline btn-block mt-2">
          Ver Todos os Clientes
        </button>
      </div>
    </div>
  );
}

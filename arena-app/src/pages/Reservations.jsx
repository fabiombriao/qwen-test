import { useState } from 'react';
import { format, isBefore, addHours } from 'date-fns';
import { mockReservations } from '../utils/mockData';

export default function Reservations() {
  const [filter, setFilter] = useState('future'); // 'future' ou 'past'
  
  const futureReservations = mockReservations.filter(r => r.status === 'confirmed');
  const pastReservations = mockReservations.filter(r => r.status === 'completed');
  
  const canCancel = (reservationDate) => {
    const now = new Date();
    const reservationDateTime = new Date(`${reservationDate}T19:00`);
    const cancelDeadline = addHours(reservationDateTime, -24);
    return isBefore(now, cancelDeadline);
  };

  const handleCancel = (id) => {
    if (confirm('Tem certeza que deseja cancelar esta reserva? O reembolso será processado em até 30 minutos.')) {
      alert('Cancelamento solicitado. Reembolso será processado.');
    }
  };

  return (
    <div className="app-container">
      <h2 className="mb-2">Minhas Reservas</h2>

      {/* Filtros */}
      <div className="comanda-tabs mb-2">
        <button
          className={`comanda-tab ${filter === 'future' ? 'active' : ''}`}
          onClick={() => setFilter('future')}
        >
          Futuras
        </button>
        <button
          className={`comanda-tab ${filter === 'past' ? 'active' : ''}`}
          onClick={() => setFilter('past')}
        >
          Histórico
        </button>
      </div>

      {/* Lista de Reservas */}
      <div>
        {(filter === 'future' ? futureReservations : pastReservations).map(reservation => {
          const isCancelable = filter === 'future' && canCancel(reservation.date);
          
          return (
            <div key={reservation.id} className="card mb-2">
              <div className="flex justify-between items-center mb-1">
                <span className={`badge ${
                  reservation.status === 'confirmed' ? 'badge-success' : 
                  reservation.status === 'completed' ? 'badge-warning' : 'badge-danger'
                }`}>
                  {reservation.status === 'confirmed' ? 'Confirmada' : 
                   reservation.status === 'completed' ? 'Finalizada' : 'Cancelada'}
                </span>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  #{reservation.id}
                </span>
              </div>

              <h3 className="mb-1">Quadra {reservation.courtId}</h3>
              
              <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                {new Date(reservation.date).toLocaleDateString('pt-BR')} às {reservation.time}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Total</div>
                  <div style={{ fontWeight: 'bold' }}>R$ {reservation.totalValue}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Pago</div>
                  <div style={{ fontWeight: 'bold', color: 'var(--success-text)' }}>R$ {reservation.paidValue}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Saldo</div>
                  <div style={{ fontWeight: 'bold', color: reservation.balance > 0 ? 'var(--danger-color)' : 'var(--success-text)' }}>
                    R$ {reservation.balance}
                  </div>
                </div>
              </div>

              {/* Ações para reservas futuras */}
              {filter === 'future' && (
                <div className="flex gap-2">
                  {isCancelable && (
                    <button
                      className="btn btn-danger"
                      onClick={() => handleCancel(reservation.id)}
                      style={{ flex: 1 }}
                    >
                      Cancelar
                    </button>
                  )}
                  {!isCancelable && (
                    <button
                      className="btn btn-outline"
                      disabled
                      style={{ flex: 1 }}
                    >
                      Cancelamento indisponível
                    </button>
                  )}
                  
                  <button
                    className="btn btn-primary"
                    onClick={() => console.log('Ver comanda', reservation.id)}
                    style={{ flex: 1 }}
                  >
                    Ver Comanda
                  </button>
                </div>
              )}

              {/* Detalhes para reservas passadas */}
              {filter === 'past' && reservation.items.length > 0 && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                  <strong>Consumação:</strong>
                  <ul className="comanda-items mt-1">
                    {reservation.items.map(item => (
                      <li key={item.id} className="comanda-item">
                        <span>{item.quantity}x {item.name}</span>
                        <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}

        {(filter === 'future' ? futureReservations : pastReservations).length === 0 && (
          <div className="card text-center" style={{ padding: '3rem 1rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
              {filter === 'future' ? '📅' : '📜'}
            </div>
            <p style={{ color: 'var(--text-secondary)' }}>
              {filter === 'future' 
                ? 'Nenhuma reserva futura encontrada.' 
                : 'Nenhuma reserva no histórico.'}
            </p>
            {filter === 'future' && (
              <button className="btn btn-primary mt-2" onClick={() => window.location.href = '/home'}>
                Fazer Reserva
              </button>
            )}
          </div>
        )}
      </div>

      {/* Informação sobre política de cancelamento */}
      {filter === 'future' && (
        <div className="card mt-2" style={{ fontSize: '0.875rem', background: '#fef3c7' }}>
          <strong>ℹ️ Política de Cancelamento:</strong>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            O cancelamento é gratuito até 24h antes da reserva. Após esse período, o sinal não será reembolsado.
          </p>
        </div>
      )}
    </div>
  );
}

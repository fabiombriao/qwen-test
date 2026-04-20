import { useState } from 'react';
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { mockCourts } from '../../utils/mockData';

export default function ArenaCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('week'); // 'day' ou 'week'
  
  const weekDays = [0, 1, 2, 3, 4, 5, 6].map(offset => addDays(currentDate, offset));
  const timeSlots = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];

  // Mock de reservas
  const reservations = [
    { courtId: 1, date: format(new Date(), 'yyyy-MM-dd'), time: '19:00', type: 'reserved', client: 'João Silva' },
    { courtId: 1, date: format(new Date(), 'yyyy-MM-dd'), time: '20:00', type: 'permanent', client: 'Time ABC (Fixo)' },
    { courtId: 2, date: format(new Date(), 'yyyy-MM-dd'), time: '19:00', type: 'blocked', reason: 'Manutenção' },
    { courtId: 3, date: format(addDays(new Date(), 1), 'yyyy-MM-dd'), time: '18:00', type: 'reserved', client: 'Maria Santos' },
  ];

  const getReservation = (courtId, date, time) => {
    return reservations.find(r => 
      r.courtId === courtId && 
      r.date === format(date, 'yyyy-MM-dd') && 
      r.time === time
    );
  };

  const handleManualReservation = () => {
    alert('Abrir modal de reserva manual');
  };

  return (
    <div className="app-container">
      <div className="flex justify-between items-center mb-2" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
        <h2>📅 Agenda de Quadras</h2>
        
        <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
          <select 
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}
          >
            <option value="day">Dia</option>
            <option value="week">Semana</option>
          </select>

          <button className="btn btn-outline" onClick={() => setCurrentDate(new Date())}>
            Hoje
          </button>

          <button className="btn btn-primary" onClick={handleManualReservation}>
            + Reserva Manual
          </button>
        </div>
      </div>

      {/* Legenda */}
      <div className="card mb-2" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <strong>Legenda:</strong>
        <span className="badge" style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb' }}>Reserva Avulsa</span>
        <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>Reserva Permanente</span>
        <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>Bloqueio Interno</span>
      </div>

      {/* Calendário Grid */}
      <div style={{ overflowX: 'auto' }}>
        <div className="calendar-grid" style={{ minWidth: '800px' }}>
          {/* Header - Quadras */}
          <div className="calendar-header">Horário</div>
          {mockCourts.slice(0, 4).map(court => (
            <div key={court.id} className="calendar-header">
              {court.name}
              <div style={{ fontSize: '0.75rem', fontWeight: 'normal', color: 'var(--text-secondary)' }}>
                {court.sport}
              </div>
            </div>
          ))}

          {/* Linhas de Horário */}
          {timeSlots.map(time => (
            <>
              <div className="calendar-cell" style={{ fontWeight: 'bold', textAlign: 'center' }}>
                {time}
              </div>
              
              {mockCourts.slice(0, 4).map(court => {
                const reservation = getReservation(court.id, currentDate, time);
                
                return (
                  <div 
                    key={`${court.id}-${time}`}
                    className={`calendar-cell ${
                      reservation?.type === 'reserved' ? 'reserved' :
                      reservation?.type === 'permanent' ? 'permanent' :
                      reservation?.type === 'blocked' ? 'blocked' : ''
                    }`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => !reservation && handleManualReservation()}
                  >
                    {reservation && (
                      <div style={{ fontSize: '0.75rem' }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                          {reservation.client || reservation.reason}
                        </div>
                        <div style={{ fontSize: '0.625rem', color: 'var(--text-secondary)' }}>
                          {reservation.type === 'permanent' && '🔄 Fixo'}
                          {reservation.type === 'blocked' && '🚫 Bloqueado'}
                          {reservation.type === 'reserved' && '📋 Avulsa'}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          ))}
        </div>
      </div>

      {/* Instruções */}
      <div className="card mt-2" style={{ fontSize: '0.875rem', background: '#f0f9ff' }}>
        <strong>💡 Dicas:</strong>
        <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem', color: 'var(--text-secondary)' }}>
          <li>Clique em um horário vazio para criar uma reserva manual</li>
          <li>Reservas permanentes se repetem semanalmente</li>
          <li>Bloqueios internos impedem reservas de clientes</li>
          <li>Use filtros para visualizar períodos específicos</li>
        </ul>
      </div>
    </div>
  );
}

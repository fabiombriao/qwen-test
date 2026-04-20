import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { mockSports, mockCourts, generateTimeSlots } from '../utils/mockData';

export default function Home() {
  const navigate = useNavigate();
  const [selectedSport, setSelectedSport] = useState(null);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  
  const dates = [0, 1, 2, 3, 4, 5, 6].map(offset => addDays(new Date(), offset));
  const timeSlots = selectedCourt ? generateTimeSlots(selectedDate) : [];

  const filteredCourts = selectedSport 
    ? mockCourts.filter(court => court.sport === selectedSport)
    : mockCourts;

  const handleSelectTime = (time) => {
    if (!time.available) return;
    setSelectedTime(time);
  };

  const handleProceedToCheckout = () => {
    if (selectedTime && selectedCourt) {
      navigate('/checkout', {
        state: {
          court: selectedCourt,
          date: selectedDate,
          time: selectedTime.time,
          price: selectedTime.price
        }
      });
    }
  };

  return (
    <div className="app-container">
      {/* Seleção de Esporte */}
      <section className="mb-2">
        <h2 className="mb-1">Escolha o Esporte</h2>
        <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {mockSports.map(sport => (
            <button
              key={sport.id}
              className={`btn ${selectedSport === sport.name ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => {
                setSelectedSport(selectedSport === sport.name ? null : sport.name);
                setSelectedCourt(null);
                setSelectedTime(null);
              }}
              style={{ whiteSpace: 'nowrap' }}
            >
              {sport.icon} {sport.name}
            </button>
          ))}
        </div>
      </section>

      {/* Seleção de Data */}
      <section className="mb-2">
        <h2 className="mb-1">Selecione a Data</h2>
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {dates.map((date, index) => {
            const isSelected = format(date, 'yyyy-MM-dd') === selectedDate;
            return (
              <button
                key={index}
                className={`btn ${isSelected ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => {
                  setSelectedDate(format(date, 'yyyy-MM-dd'));
                  setSelectedTime(null);
                }}
                style={{ 
                  minWidth: '80px', 
                  flexDirection: 'column',
                  padding: '0.5rem'
                }}
              >
                <span style={{ fontSize: '0.75rem' }}>{format(date, 'EEE', { locale: ptBR })}</span>
                <span style={{ fontWeight: 'bold' }}>{format(date, 'dd')}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Seleção de Quadra */}
      <section className="mb-2">
        <h2 className="mb-1">Escolha a Quadra</h2>
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {filteredCourts.map(court => (
            <div
              key={court.id}
              className={`card ${selectedCourt?.id === court.id ? 'selected' : ''}`}
              onClick={() => {
                setSelectedCourt(court);
                setSelectedTime(null);
              }}
              style={{ 
                cursor: 'pointer',
                border: selectedCourt?.id === court.id ? '2px solid var(--primary-color)' : 'none'
              }}
            >
              <div className="flex justify-between items-center">
                <div>
                  <strong>{court.name}</strong>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    Capacidade: {court.capacity} pessoas
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="badge badge-success">R$ {court.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Seleção de Horário */}
      {selectedCourt && (
        <section className="mb-2">
          <h2 className="mb-1">Horários Disponíveis - {format(new Date(selectedDate), "dd 'de' MMMM", { locale: ptBR })}</h2>
          
          <div className="time-grid">
            {timeSlots.map(slot => (
              <div
                key={slot.id}
                className={`time-slot ${
                  !slot.available ? 'unavailable' :
                  selectedTime?.time === slot.time ? 'selected' :
                  slot.promotion ? 'promotion' : 'available'
                }`}
                onClick={() => handleSelectTime(slot)}
              >
                <div style={{ fontWeight: 'bold' }}>{slot.time}</div>
                {!slot.available && <div style={{ fontSize: '0.75rem' }}>Indisponível</div>}
                {slot.promotion && slot.available && (
                  <div style={{ fontSize: '0.75rem' }}>Promoção!</div>
                )}
                {slot.available && !slot.promotion && (
                  <div style={{ fontSize: '0.75rem' }}>R$ {slot.price}</div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Botão de Checkout */}
      {selectedTime && selectedCourt && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '1rem', background: 'var(--surface)', boxShadow: '0 -2px 10px rgba(0,0,0,0.1)', zIndex: 99 }}>
          <div className="flex justify-between items-center mb-2" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div>
              <div style={{ fontWeight: 'bold' }}>{selectedCourt.name}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                {format(new Date(selectedDate), "dd/MMM")} às {selectedTime.time}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>R$ {selectedTime.price}</div>
              <button 
                className="btn btn-primary"
                onClick={handleProceedToCheckout}
              >
                Reservar Agora
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ height: selectedTime ? '100px' : '0' }}></div>
    </div>
  );
}

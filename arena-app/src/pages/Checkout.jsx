import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { court, date, time, price } = location.state || {};
  
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  
  const depositPercentage = 50; // Configuração da arena
  const depositValue = (price * depositPercentage) / 100;
  const balance = price - depositValue;

  const handleConfirmPayment = () => {
    setProcessing(true);
    
    // Simula processamento de pagamento
    setTimeout(() => {
      setProcessing(false);
      setCompleted(true);
    }, 2000);
  };

  if (!court) {
    return (
      <div className="app-container text-center">
        <p>Nenhuma reserva selecionada.</p>
        <button className="btn btn-primary mt-2" onClick={() => navigate('/home')}>
          Voltar para Home
        </button>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="app-container text-center">
        <div className="card">
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
          <h2 className="mb-2">Reserva Confirmada!</h2>
          
          <div className="mb-2">
            <QRCodeSVG 
              value={`RESERVA-${court.id}-${date}-${time}`}
              size={200}
              style={{ margin: '1rem auto' }}
            />
          </div>

          <div className="card mb-2" style={{ background: 'var(--background)', textAlign: 'left' }}>
            <strong>Detalhes da Reserva:</strong>
            <p className="mt-1"><strong>Quadra:</strong> {court.name}</p>
            <p><strong>Data:</strong> {new Date(date).toLocaleDateString('pt-BR')}</p>
            <p><strong>Horário:</strong> {time}</p>
            <p><strong>Valor Total:</strong> R$ {price.toFixed(2)}</p>
            <p><strong>Pago (Sinal {depositPercentage}%):</strong> R$ {depositValue.toFixed(2)}</p>
            <p><strong>Saldo na Arena:</strong> R$ {balance.toFixed(2)}</p>
          </div>

          <div className="card mb-2" style={{ background: '#fef3c7', border: '1px solid #f59e0b' }}>
            <strong>⚠️ Política de Cancelamento:</strong>
            <p className="mt-1" style={{ fontSize: '0.875rem' }}>
              Cancelamento gratuito até 24h antes da reserva. Após esse período, o sinal não será reembolsado.
            </p>
          </div>

          <button 
            className="btn btn-primary btn-block"
            onClick={() => navigate('/reservas')}
          >
            Ver Minhas Reservas
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <h2 className="mb-2">Checkout</h2>

      {/* Resumo da Reserva */}
      <div className="card mb-2">
        <h3 className="mb-1">Resumo da Reserva</h3>
        <div className="flex justify-between mb-1">
          <span>Quadra:</span>
          <strong>{court.name}</strong>
        </div>
        <div className="flex justify-between mb-1">
          <span>Data:</span>
          <strong>{new Date(date).toLocaleDateString('pt-BR')}</strong>
        </div>
        <div className="flex justify-between mb-1">
          <span>Horário:</span>
          <strong>{time}</strong>
        </div>
        <hr style={{ margin: '1rem 0', border: 'none', borderTop: '1px solid var(--border-color)' }} />
        <div className="flex justify-between" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
          <span>Total:</span>
          <span>R$ {price.toFixed(2)}</span>
        </div>
      </div>

      {/* Pagamento Parcial */}
      <div className="card mb-2">
        <h3 className="mb-1">Pagamento do Sinal ({depositPercentage}%)</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
          Valor a pagar agora: <strong>R$ {depositValue.toFixed(2)}</strong>
        </p>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Saldo restante na arena: <strong>R$ {balance.toFixed(2)}</strong>
        </p>

        <div className="mt-2">
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Forma de Pagamento:</label>
          
          <div 
            className={`card mb-1 ${paymentMethod === 'pix' ? 'selected' : ''}`}
            onClick={() => setPaymentMethod('pix')}
            style={{ cursor: 'pointer', border: paymentMethod === 'pix' ? '2px solid var(--primary-color)' : '1px solid var(--border-color)' }}
          >
            <div className="flex justify-between items-center">
              <div>
                <strong>💠 Pix</strong>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Confirmação imediata</p>
              </div>
              <input type="radio" checked={paymentMethod === 'pix'} readOnly />
            </div>
          </div>

          <div 
            className={`card mb-1 ${paymentMethod === 'card' ? 'selected' : ''}`}
            onClick={() => setPaymentMethod('card')}
            style={{ cursor: 'pointer', border: paymentMethod === 'card' ? '2px solid var(--primary-color)' : '1px solid var(--border-color)' }}
          >
            <div className="flex justify-between items-center">
              <div>
                <strong>💳 Cartão de Crédito</strong>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Até 12x</p>
              </div>
              <input type="radio" checked={paymentMethod === 'card'} readOnly />
            </div>
          </div>
        </div>
      </div>

      {/* Termos */}
      <div className="card mb-2" style={{ fontSize: '0.875rem', background: '#fef3c7' }}>
        <strong>📋 Regras Importantes:</strong>
        <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem', color: 'var(--text-secondary)' }}>
          <li>Pagamento parcial obrigatório de {depositPercentage}%</li>
          <li>Saldo restante deve ser pago na chegada ou via comanda</li>
          <li>Cancelamento gratuito até 24h antes</li>
          <li>Reembolso processado em até 30 minutos</li>
        </ul>
      </div>

      {/* Botão de Confirmação */}
      <button
        className="btn btn-primary btn-block"
        onClick={handleConfirmPayment}
        disabled={processing}
        style={{ padding: '1rem', fontSize: '1.125rem' }}
      >
        {processing ? 'Processando...' : `Pagar R$ ${depositValue.toFixed(2)} e Confirmar`}
      </button>

      <button
        className="btn btn-outline btn-block mt-2"
        onClick={() => navigate(-1)}
      >
        Voltar
      </button>
    </div>
  );
}

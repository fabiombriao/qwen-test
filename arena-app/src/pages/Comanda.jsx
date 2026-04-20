import { useState } from 'react';
import { mockBarProducts, mockReservations } from '../utils/mockData';

export default function Comanda() {
  const [activeTab, setActiveTab] = useState('individual'); // 'individual' ou 'grupo'
  const [selectedReservation, setSelectedReservation] = useState(mockReservations[0]);
  
  // Mock de consumações
  const individualItems = [
    { id: 1, name: 'Cerveja Lata', quantity: 3, price: 8, paidBy: 'eu' },
    { id: 2, name: 'Água', quantity: 2, price: 5, paidBy: 'eu' },
    { id: 3, name: 'Batata Frita', quantity: 1, price: 18, paidBy: 'eu' }
  ];

  const grupoItems = [
    { id: 1, name: 'Cerveja Lata', quantity: 6, price: 8, paidBy: 'João' },
    { id: 2, name: 'Cerveja 600ml', quantity: 4, price: 12, paidBy: 'Maria' },
    { id: 3, name: 'Refrigerante', quantity: 3, price: 6, paidBy: 'Pedro' },
    { id: 4, name: 'Hambúrguer', quantity: 2, price: 25, paidBy: 'João' },
    { id: 5, name: 'Nuggets', quantity: 1, price: 20, paidBy: 'Maria' },
    { id: 6, name: 'Açaí', quantity: 2, price: 15, paidBy: 'eu' }
  ];

  const calculateTotal = (items) => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateMyShare = (items) => {
    return items
      .filter(item => item.paidBy === 'eu')
      .reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleSplitEqually = () => {
    const total = calculateTotal(grupoItems);
    const people = 4; // Simula 4 pessoas
    const perPerson = total / people;
    alert(`Dividindo R$ ${total.toFixed(2)} entre ${people} pessoas: R$ ${perPerson.toFixed(2)} por pessoa`);
  };

  const handlePayMyShare = () => {
    const myShare = calculateMyShare(grupoItems);
    alert(`Pagando sua parte: R$ ${myShare.toFixed(2)}`);
  };

  const currentItems = activeTab === 'individual' ? individualItems : grupoItems;
  const totalValue = activeTab === 'individual' 
    ? calculateTotal(individualItems)
    : calculateTotal(grupoItems);
  const myShare = activeTab === 'grupo' ? calculateMyShare(grupoItems) : totalValue;

  return (
    <div className="app-container">
      <h2 className="mb-2">Comanda Digital</h2>

      {/* Seleção de Reserva */}
      <div className="input-group mb-2">
        <label>Selecione a Reserva</label>
        <select 
          value={selectedReservation?.id || ''}
          onChange={(e) => setSelectedReservation(mockReservations.find(r => r.id === e.target.value))}
        >
          {mockReservations.map(res => (
            <option key={res.id} value={res.id}>
              Quadra {res.courtId} - {new Date(res.date).toLocaleDateString('pt-BR')} às {res.time}
            </option>
          ))}
        </select>
      </div>

      {/* Tabs Individual/Grupo */}
      <div className="comanda-tabs mb-2">
        <button
          className={`comanda-tab ${activeTab === 'individual' ? 'active' : ''}`}
          onClick={() => setActiveTab('individual')}
        >
          👤 Minha Consumação
        </button>
        <button
          className={`comanda-tab ${activeTab === 'grupo' ? 'active' : ''}`}
          onClick={() => setActiveTab('grupo')}
        >
          👥 Comanda do Grupo
        </button>
      </div>

      {/* Resumo Financeiro */}
      <div className="card mb-2" style={{ background: 'var(--primary-color)', color: 'white' }}>
        <div className="flex justify-between items-center">
          <div>
            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Total da Comanda</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>R$ {totalValue.toFixed(2)}</div>
          </div>
          {activeTab === 'grupo' && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Sua Parte</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>R$ {myShare.toFixed(2)}</div>
            </div>
          )}
        </div>
      </div>

      {/* Lista de Itens */}
      <div className="card mb-2">
        <h3 className="mb-1">
          {activeTab === 'individual' ? 'Meus Pedidos' : 'Pedidos do Grupo'}
        </h3>
        
        {currentItems.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem 0' }}>
            Nenhum item consumido ainda.
          </p>
        ) : (
          <ul className="comanda-items">
            {currentItems.map(item => (
              <li key={item.id} className="comanda-item">
                <div>
                  <strong>{item.quantity}x {item.name}</strong>
                  {activeTab === 'grupo' && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      Por: {item.paidBy}
                    </div>
                  )}
                </div>
                <strong>R$ {(item.price * item.quantity).toFixed(2)}</strong>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Opções de Divisão (apenas para grupo) */}
      {activeTab === 'grupo' && grupoItems.length > 0 && (
        <div className="card mb-2">
          <h3 className="mb-1">Dividir Conta</h3>
          
          <button
            className="btn btn-outline btn-block mb-1"
            onClick={handleSplitEqually}
          >
            ⚖️ Dividir igualmente entre todos
          </button>
          
          <button
            className="btn btn-primary btn-block"
            onClick={handlePayMyShare}
          >
            💳 Pagar apenas o meu
          </button>

          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '1rem', textAlign: 'center' }}>
            O saldo da quadra será atualizado conforme os clientes pagam suas partes.
          </p>
        </div>
      )}

      {/* Botão de Fechamento */}
      <button
        className="btn btn-secondary btn-block"
        onClick={() => alert('Fechamento da comanda iniciado!')}
      >
        ✅ Fechar Comanda
      </button>

      {/* Informação sobre saldo */}
      {selectedReservation && selectedReservation.balance > 0 && (
        <div className="card mt-2" style={{ background: '#fee2e2', border: '1px solid #ef4444' }}>
          <strong style={{ color: '#991b1b' }}>⚠️ Saldo Pendente da Quadra:</strong>
          <span style={{ marginLeft: '0.5rem', fontWeight: 'bold', color: '#991b1b' }}>
            R$ {selectedReservation.balance.toFixed(2)}
          </span>
          <p style={{ fontSize: '0.75rem', color: '#991b1b', marginTop: '0.5rem' }}>
            Este valor pode ser pago individualmente ou dividido entre o grupo.
          </p>
        </div>
      )}
    </div>
  );
}

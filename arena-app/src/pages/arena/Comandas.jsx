import { useState } from 'react';
import { mockBarProducts, mockReservations } from '../../utils/mockData';

export default function ArenaComandas() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showProductSelector, setShowProductSelector] = useState(false);
  const [cart, setCart] = useState([]);

  const filteredReservations = mockReservations.filter(r => 
    r.status === 'confirmed' &&
    (r.id.includes(searchTerm) || `Quadra ${r.courtId}`.includes(searchTerm))
  );

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleLaunchItems = () => {
    if (!selectedReservation) {
      alert('Selecione uma reserva primeiro');
      return;
    }
    
    alert(`Lançando ${cart.length} itens na comanda da Quadra ${selectedReservation.courtId}\nTotal: R$ ${calculateTotal().toFixed(2)}`);
    setCart([]);
    setShowProductSelector(false);
  };

  return (
    <div className="app-container">
      <h2 className="mb-2">🍺 Gestão de Comandas (Bar)</h2>

      {/* Busca Rápida */}
      <div className="card mb-2">
        <div className="input-group" style={{ marginBottom: 0 }}>
          <label>Buscar por Nome ou Quadra</label>
          <input
            type="text"
            placeholder="Digite nome do cliente ou número da quadra..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ fontSize: '1rem', padding: '1rem' }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {/* Lista de Reservas Ativas */}
        <div>
          <h3 className="mb-1">Reservas Ativas</h3>
          
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {filteredReservations.map(reservation => (
              <div
                key={reservation.id}
                className={`card ${selectedReservation?.id === reservation.id ? 'selected' : ''}`}
                onClick={() => setSelectedReservation(reservation)}
                style={{ 
                  cursor: 'pointer',
                  border: selectedReservation?.id === reservation.id ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                  padding: '0.75rem'
                }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <strong>Quadra {reservation.courtId}</strong>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
                      {new Date(reservation.date).toLocaleDateString('pt-BR')} às {reservation.time}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="badge badge-success">Ativa</span>
                    {reservation.balance > 0 && (
                      <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--danger-color)' }}>
                        Saldo: R$ {reservation.balance}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {filteredReservations.length === 0 && (
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem 0' }}>
                Nenhuma reserva encontrada.
              </p>
            )}
          </div>
        </div>

        {/* Lançamento de Produtos */}
        <div>
          <h3 className="mb-1">
            {selectedReservation ? `Comanda - Quadra ${selectedReservation.courtId}` : 'Selecione uma Reserva'}
          </h3>

          {selectedReservation && (
            <>
              <button
                className="btn btn-primary btn-block mb-2"
                onClick={() => setShowProductSelector(!showProductSelector)}
              >
                + Adicionar Produto
              </button>

              {/* Seletor de Produtos */}
              {showProductSelector && (
                <div className="card mb-2" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  <h4 className="mb-1">Produtos do Bar</h4>
                  
                  {mockBarProducts.map(product => (
                    <div
                      key={product.id}
                      className="card mb-1"
                      onClick={() => addToCart(product)}
                      style={{ 
                        cursor: 'pointer', 
                        padding: '0.75rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <strong>{product.name}</strong>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
                          R$ {product.price.toFixed(2)}
                        </p>
                      </div>
                      <span className="badge badge-success">+ Add</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Carrinho / Itens Selecionados */}
              {cart.length > 0 && (
                <div className="card mb-2">
                  <h4 className="mb-1">Itens a Lançar</h4>
                  
                  <ul className="comanda-items">
                    {cart.map(item => (
                      <li key={item.id} className="comanda-item">
                        <div>
                          <strong>{item.quantity}x {item.name}</strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            R$ {item.price.toFixed(2)} un.
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <strong>R$ {(item.price * item.quantity).toFixed(2)}</strong>
                          <button
                            className="btn btn-danger"
                            onClick={() => removeFromCart(item.id)}
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                          >
                            ✕
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                    <div className="flex justify-between mb-2">
                      <strong>Total:</strong>
                      <strong style={{ fontSize: '1.25rem' }}>R$ {calculateTotal().toFixed(2)}</strong>
                    </div>

                    <div className="input-group">
                      <label>Vincular a:</label>
                      <select style={{ padding: '0.5rem' }}>
                        <option>Comanda Geral da Quadra</option>
                        <option>Cliente Específico</option>
                      </select>
                    </div>

                    <button
                      className="btn btn-secondary btn-block"
                      onClick={handleLaunchItems}
                    >
                      ✅ Lançar na Comanda
                    </button>
                  </div>
                </div>
              )}

              {/* Histórico da Comanda */}
              <div className="card">
                <h4 className="mb-1">Consumações já Lançadas</h4>
                
                {selectedReservation.items && selectedReservation.items.length > 0 ? (
                  <ul className="comanda-items">
                    {selectedReservation.items.map(item => (
                      <li key={item.id} className="comanda-item">
                        <span>{item.quantity}x {item.name}</span>
                        <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem 0' }}>
                    Nenhum item lançado ainda.
                  </p>
                )}
              </div>
            </>
          )}

          {!selectedReservation && (
            <div className="card text-center" style={{ padding: '3rem 1rem' }}>
              <p style={{ color: 'var(--text-secondary)' }}>
                Selecione uma reserva ao lado para gerenciar a comanda.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Fechamento de Caixa */}
      {selectedReservation && selectedReservation.balance > 0 && (
        <div className="card mt-2" style={{ background: '#fef3c7', border: '1px solid #f59e0b' }}>
          <h3 style={{ marginBottom: '1rem' }}>💰 Opções de Pagamento do Saldo</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <button className="btn btn-primary">
              📱 Gerar QR Code Pix
            </button>
            
            <button className="btn btn-secondary">
              💵 Receber em Dinheiro/Cartão
            </button>
          </div>

          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '1rem', textAlign: 'center' }}>
            Ao receber o pagamento, o saldo será baixado automaticamente no sistema.
          </p>
        </div>
      )}
    </div>
  );
}

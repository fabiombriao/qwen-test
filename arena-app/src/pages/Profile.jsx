import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'promotion', message: 'Horários vagos amanhã às 19h com 30% OFF!', read: false },
    { id: 2, type: 'birthday', message: '🎉 Parabéns! Hoje é seu dia. Ganhe uma bebida grátis!', read: false },
    { id: 3, type: 'tournament', message: 'Inscrições abertas para o Torneio de Futebol - Dezembro', read: true }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  return (
    <div className="app-container">
      <h2 className="mb-2">Perfil</h2>

      {/* Informações do Usuário */}
      <div className="card mb-2 text-center">
        <div style={{ 
          width: '80px', 
          height: '80px', 
          borderRadius: '50%', 
          background: 'var(--primary-color)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          fontWeight: 'bold',
          margin: '0 auto 1rem'
        }}>
          {user?.name?.charAt(0) || 'U'}
        </div>
        
        <h3>{user?.name || 'Cliente'}</h3>
        <p style={{ color: 'var(--text-secondary)' }}>{user?.phone || '(00) 00000-0000'}</p>
        
        <button className="btn btn-outline mt-2" onClick={logout}>
          Sair
        </button>
      </div>

      {/* Preferências */}
      <div className="card mb-2">
        <h3 className="mb-1">Preferências</h3>
        
        <div className="input-group">
          <label>Esportes Favoritos</label>
          <select multiple style={{ minHeight: '100px' }}>
            <option value="futebol" selected>Futebol</option>
            <option value="volei">Vôlei</option>
            <option value="basquete">Basquete</option>
            <option value="tenis">Tênis</option>
            <option value="beach-tennis">Beach Tennis</option>
          </select>
        </div>

        <button className="btn btn-primary btn-block">
          Salvar Preferências
        </button>
      </div>

      {/* Métodos de Pagamento */}
      <div className="card mb-2">
        <h3 className="mb-1">Métodos de Pagamento</h3>
        
        <div className="card mb-1" style={{ background: 'var(--background)' }}>
          <div className="flex justify-between items-center">
            <div>
              <strong>💠 Pix</strong>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Chave: (11) 99999-1111</p>
            </div>
            <span className="badge badge-success">Padrão</span>
          </div>
        </div>

        <div className="card mb-1" style={{ background: 'var(--background)' }}>
          <div className="flex justify-between items-center">
            <div>
              <strong>💳 Cartão terminando em 4242</strong>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Visa</p>
            </div>
          </div>
        </div>

        <button className="btn btn-outline btn-block mt-2">
          + Adicionar Método
        </button>
      </div>

      {/* Notificações */}
      <div className="card mb-2">
        <div className="flex justify-between items-center mb-1">
          <h3>Notificações</h3>
          {unreadCount > 0 && (
            <span className="badge badge-danger">{unreadCount} novas</span>
          )}
        </div>

        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`card mb-1 ${!notification.read ? 'selected' : ''}`}
            onClick={() => handleMarkAsRead(notification.id)}
            style={{ 
              cursor: 'pointer',
              border: !notification.read ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
              padding: '0.75rem'
            }}
          >
            <div className="flex justify-between items-start">
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: !notification.read ? 600 : 400 }}>
                  {notification.type === 'promotion' && '🏷️ '}
                  {notification.type === 'birthday' && '🎂 '}
                  {notification.type === 'tournament' && '🏆 '}
                  {notification.message}
                </p>
              </div>
              {!notification.read && (
                <div style={{ 
                  width: '8px', 
                  height: '8px', 
                  borderRadius: '50%', 
                  background: 'var(--primary-color)',
                  flexShrink: 0,
                  marginLeft: '0.5rem'
                }}></div>
              )}
            </div>
          </div>
        ))}

        {notifications.length === 0 && (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem 0' }}>
            Nenhuma notificação.
          </p>
        )}
      </div>

      {/* Configurações */}
      <div className="card mb-2">
        <h3 className="mb-1">Configurações</h3>
        
        <button className="btn btn-outline btn-block mb-1" style={{ justifyContent: 'flex-start' }}>
          ⚙️ Configurações da Conta
        </button>
        
        <button className="btn btn-outline btn-block mb-1" style={{ justifyContent: 'flex-start' }}>
          🔒 Privacidade e Segurança
        </button>
        
        <button className="btn btn-outline btn-block" style={{ justifyContent: 'flex-start' }}>
          ❓ Ajuda e Suporte
        </button>
      </div>

      {/* Versão */}
      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
        Arena App v1.0.0
      </p>
    </div>
  );
}

import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import Reservations from './pages/Reservations';
import Comanda from './pages/Comanda';
import Profile from './pages/Profile';
import ArenaDashboard from './pages/arena/Dashboard';
import ArenaCalendar from './pages/arena/Calendar';
import ArenaComandas from './pages/arena/Comandas';

// Componente de Navegação para Cliente
function ClientNav() {
  const location = useLocation();
  const { logout, user } = useAuth();

  const isActive = (path) => location.pathname === path ? 'selected' : '';

  return (
    <>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '70px' }}>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/reservas" element={<Reservations />} />
          <Route path="/comanda" element={<Comanda />} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </div>

      {/* Bottom Navigation */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'var(--surface)',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '0.5rem 0',
        zIndex: 100
      }}>
        <Link to="/home" className={isActive('/home')} style={{ 
          textDecoration: 'none', 
          color: location.pathname === '/home' ? 'var(--primary-color)' : 'var(--text-secondary)',
          textAlign: 'center',
          fontSize: '0.75rem',
          flex: 1
        }}>
          <div style={{ fontSize: '1.5rem' }}>🏠</div>
          <div>Home</div>
        </Link>

        <Link to="/reservas" className={isActive('/reservas')} style={{ 
          textDecoration: 'none', 
          color: location.pathname === '/reservas' ? 'var(--primary-color)' : 'var(--text-secondary)',
          textAlign: 'center',
          fontSize: '0.75rem',
          flex: 1
        }}>
          <div style={{ fontSize: '1.5rem' }}>📅</div>
          <div>Reservas</div>
        </Link>

        <Link to="/comanda" className={isActive('/comanda')} style={{ 
          textDecoration: 'none', 
          color: location.pathname === '/comanda' ? 'var(--primary-color)' : 'var(--text-secondary)',
          textAlign: 'center',
          fontSize: '0.75rem',
          flex: 1
        }}>
          <div style={{ fontSize: '1.5rem' }}>🍺</div>
          <div>Comanda</div>
        </Link>

        <Link to="/perfil" className={isActive('/perfil')} style={{ 
          textDecoration: 'none', 
          color: location.pathname === '/perfil' ? 'var(--primary-color)' : 'var(--text-secondary)',
          textAlign: 'center',
          fontSize: '0.75rem',
          flex: 1
        }}>
          <div style={{ fontSize: '1.5rem' }}>👤</div>
          <div>Perfil</div>
        </Link>
      </nav>
    </>
  );
}

// Componente de Navegação para Arena
function ArenaNav() {
  const location = useLocation();
  const { logout, user } = useAuth();

  const isActive = (path) => location.pathname.startsWith(path);

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {/* Header Arena */}
      <header className="header">
        <div className="header-content">
          <div className="logo">🏟️ Arena Manager</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              {user?.name}
            </span>
            <button 
              className="btn btn-outline" 
              style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
              onClick={handleLogout}
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 60px)' }}>
        {/* Sidebar Desktop */}
        <aside style={{
          width: '250px',
          background: 'var(--surface)',
          borderRight: '1px solid var(--border-color)',
          padding: '1rem',
          display: 'none'
        }} className="desktop-only">
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Link to="/arena/dashboard" style={{
              textDecoration: 'none',
              color: isActive('/arena/dashboard') ? 'var(--primary-color)' : 'var(--text-primary)',
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              background: isActive('/arena/dashboard') ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
              fontWeight: isActive('/arena/dashboard') ? 600 : 400
            }}>
              📊 Dashboard
            </Link>

            <Link to="/arena/calendario" style={{
              textDecoration: 'none',
              color: isActive('/arena/calendario') ? 'var(--primary-color)' : 'var(--text-primary)',
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              background: isActive('/arena/calendario') ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
              fontWeight: isActive('/arena/calendario') ? 600 : 400
            }}>
              📅 Agenda
            </Link>

            <Link to="/arena/comandas" style={{
              textDecoration: 'none',
              color: isActive('/arena/comandas') ? 'var(--primary-color)' : 'var(--text-primary)',
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              background: isActive('/arena/comandas') ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
              fontWeight: isActive('/arena/comandas') ? 600 : 400
            }}>
              🍺 Comandas
            </Link>

            <Link to="/arena/clientes" style={{
              textDecoration: 'none',
              color: isActive('/arena/clientes') ? 'var(--primary-color)' : 'var(--text-primary)',
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              background: isActive('/arena/clientes') ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
              fontWeight: isActive('/arena/clientes') ? 600 : 400
            }}>
              👥 Clientes
            </Link>

            <Link to="/arena/campanhas" style={{
              textDecoration: 'none',
              color: isActive('/arena/campanhas') ? 'var(--primary-color)' : 'var(--text-primary)',
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              background: isActive('/arena/campanhas') ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
              fontWeight: isActive('/arena/campanhas') ? 600 : 400
            }}>
              📢 Campanhas
            </Link>

            <Link to="/arena/relatorios" style={{
              textDecoration: 'none',
              color: isActive('/arena/relatorios') ? 'var(--primary-color)' : 'var(--text-primary)',
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              background: isActive('/arena/relatorios') ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
              fontWeight: isActive('/arena/relatorios') ? 600 : 400
            }}>
              📈 Relatórios
            </Link>

            <Link to="/arena/configuracoes" style={{
              textDecoration: 'none',
              color: isActive('/arena/configuracoes') ? 'var(--primary-color)' : 'var(--text-primary)',
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              background: isActive('/arena/configuracoes') ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
              fontWeight: isActive('/arena/configuracoes') ? 600 : 400
            }}>
              ⚙️ Configurações
            </Link>
          </nav>
        </aside>

        {/* Conteúdo Principal */}
        <main style={{ flex: 1, background: 'var(--background)' }}>
          <Routes>
            <Route path="/arena/dashboard" element={<ArenaDashboard />} />
            <Route path="/arena/calendario" element={<ArenaCalendar />} />
            <Route path="/arena/comandas" element={<ArenaComandas />} />
            <Route path="/arena/*" element={
              <div className="app-container text-center" style={{ padding: '3rem' }}>
                <h2>Em Desenvolvimento</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Esta página estará disponível em breve.</p>
                <Link to="/arena/dashboard" className="btn btn-primary mt-2">
                  Voltar ao Dashboard
                </Link>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </>
  );
}

// Router Principal
function AppRouter() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  // Redireciona baseado no role do usuário
  if (user?.role === 'arena') {
    return <ArenaNav />;
  }

  return <ClientNav />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app">
          <AppRouter />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

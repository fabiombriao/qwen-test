import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [loginType, setLoginType] = useState('client'); // 'client', 'arena'
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const result = await login(email, null, password);
    
    if (result.success) {
      if (result.user.role === 'arena') {
        navigate('/arena/dashboard');
      } else {
        navigate('/home');
      }
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
      alert(`Código OTP enviado para ${phone}: 123456`);
    }, 1000);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (otp === '123456') {
      const result = await login(phone);
      if (result.success) {
        navigate('/home');
      }
    } else {
      setError('Código inválido. Tente novamente.');
    }
    
    setLoading(false);
  };

  const handleSimpleLogin = async (e) => {
    e.preventDefault();
    if (!name || !phone) {
      setError('Preencha nome e celular');
      return;
    }
    
    setLoading(true);
    const result = await login(phone);
    if (result.success) {
      navigate('/home');
    }
    setLoading(false);
  };

  return (
    <div className="app-container" style={{ maxWidth: '400px', marginTop: '2rem' }}>
      <div className="card text-center">
        <h1 className="mb-2" style={{ color: 'var(--primary-color)' }}>⚽ Arena App</h1>
        
        {/* Seletor de Tipo de Login */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <button
            onClick={() => { setLoginType('client'); setError(''); }}
            style={{
              flex: 1,
              padding: '0.75rem',
              border: 'none',
              borderRadius: '0.5rem',
              background: loginType === 'client' ? 'var(--primary-color)' : 'var(--surface)',
              color: loginType === 'client' ? '#fff' : 'var(--text-primary)',
              cursor: 'pointer',
              fontWeight: loginType === 'client' ? 600 : 400
            }}
          >
            🧑 Cliente
          </button>
          <button
            onClick={() => { setLoginType('arena'); setError(''); }}
            style={{
              flex: 1,
              padding: '0.75rem',
              border: 'none',
              borderRadius: '0.5rem',
              background: loginType === 'arena' ? 'var(--primary-color)' : 'var(--surface)',
              color: loginType === 'arena' ? '#fff' : 'var(--text-primary)',
              cursor: 'pointer',
              fontWeight: loginType === 'arena' ? 600 : 400
            }}
          >
            🏟️ Arena
          </button>
        </div>

        {error && (
          <div style={{ 
            background: '#fee2e2', 
            color: '#dc2626', 
            padding: '0.75rem', 
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            fontSize: '0.875rem'
          }}>
            {error}
          </div>
        )}

        {loginType === 'arena' ? (
          /* Login Arena (E-mail e Senha) */
          <form onSubmit={handleEmailLogin}>
            <div className="input-group mt-2">
              <label>E-mail</label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Senha</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              className="btn btn-primary btn-block mb-2"
              type="submit"
              disabled={loading || !email || !password}
            >
              {loading ? 'Entrando...' : 'Entrar na Arena'}
            </button>

            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>
              <p><strong>Usuário de teste:</strong></p>
              <p>fabiomoralesbriao@gmail.com</p>
              <p>Senha: R4d4m4n7178</p>
            </div>
          </form>
        ) : (
          /* Login Cliente */
          <>
            {step === 1 && (
              <>
                <div className="input-group mt-2">
                  <label>Celular (WhatsApp)</label>
                  <input
                    type="tel"
                    placeholder="(00) 00000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    maxLength={15}
                  />
                </div>

                <button
                  className="btn btn-primary btn-block mb-2"
                  onClick={handleSendOTP}
                  disabled={loading || !phone}
                >
                  {loading ? 'Enviando...' : 'Enviar Código via WhatsApp'}
                </button>

                <div style={{ margin: '1rem 0', color: 'var(--text-secondary)' }}>ou</div>

                <div className="input-group">
                  <label>Nome Completo</label>
                  <input
                    type="text"
                    placeholder="Seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <button
                  className="btn btn-outline btn-block"
                  onClick={handleSimpleLogin}
                  disabled={loading || !name || !phone}
                >
                  {loading ? 'Entrando...' : 'Entrar Rapidamente'}
                </button>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>
                  <p><strong>Ou use e-mail/senha:</strong></p>
                  <p>fabiobriaoenergiasolar@gmail.com</p>
                  <p>Senha: R4d4m4n7178</p>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <p className="mb-2">Digite o código enviado para {phone}</p>
                
                <div className="input-group">
                  <label>Código OTP</label>
                  <input
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem' }}
                  />
                </div>

                <button
                  className="btn btn-primary btn-block mb-2"
                  onClick={handleVerifyOTP}
                  disabled={loading || otp.length !== 6}
                >
                  {loading ? 'Verificando...' : 'Confirmar'}
                </button>

                <button
                  className="btn btn-outline btn-block"
                  onClick={() => setStep(1)}
                >
                  Voltar
                </button>
              </>
            )}
          </>
        )}
      </div>

      <div className="card mt-2" style={{ fontSize: '0.875rem' }}>
        <strong>Como funciona:</strong>
        <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem', color: 'var(--text-secondary)' }}>
          <li>Login rápido via WhatsApp ou nome/celular</li>
          <li>Sem cadastro longo prévio</li>
          <li>Perfil criado automaticamente na primeira reserva</li>
        </ul>
      </div>
    </div>
  );
}

import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

// Usuários hardcoded para teste
const HARDCODED_USERS = [
  {
    id: 'admin-1',
    name: 'Fabio Morales Briao',
    email: 'fabiomoralesbriao@gmail.com',
    password: 'R4d4m4n7178',
    phone: null,
    role: 'arena'
  },
  {
    id: 'client-1',
    name: 'Fabio Briao',
    email: 'fabiobriaoenergiasolar@gmail.com',
    password: 'R4d4m4n7178',
    phone: null,
    role: 'client'
  }
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const login = async (identifier, otp = null, password = null) => {
    setLoading(true);
    try {
      // Verifica se é login por e-mail/senha
      if (identifier.includes('@') && password) {
        const foundUser = HARDCODED_USERS.find(u => u.email === identifier && u.password === password);
        
        if (foundUser) {
          const userWithoutPassword = { ...foundUser };
          delete userWithoutPassword.password;
          setUser(userWithoutPassword);
          return { success: true, user: userWithoutPassword };
        } else {
          return { success: false, error: 'E-mail ou senha inválidos' };
        }
      }
      
      // Login via WhatsApp/OTP ou nome/celular (fluxo original)
      const mockUser = {
        id: '1',
        name: 'Cliente Teste',
        phone: identifier,
        email: null,
        role: 'client'
      };
      setUser(mockUser);
      return { success: true, user: mockUser };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };
  
  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

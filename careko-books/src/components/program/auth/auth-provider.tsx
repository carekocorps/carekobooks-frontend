'use client';
import { ReactNode, useEffect, useState, createContext, useContext } from 'react';
import {
  initializeAuth,
  cleanupAuth,
  logout as keycloakLogout,
  retryLogin
} from '@/services/auth.service';

interface AuthContextData {
  logout: () => void;
}

const AuthContext = createContext<AuthContextData | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [authStatus, setAuthStatus] = useState<'loading' | 'authenticated' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const logout = () => keycloakLogout();

  useEffect(() => {
    initializeAuth(
      () => setAuthStatus('authenticated'),
      (msg) => {
        setErrorMessage(msg);
        setAuthStatus('error');
      }
    );

    return () => cleanupAuth();
  }, []);

  if (authStatus === 'authenticated') {
    return (
      <AuthContext.Provider value={{ logout }}>
        {children}
      </AuthContext.Provider>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        {authStatus === 'loading' ? (
          <>
            <div className="flex justify-center">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-xl font-semibold text-center text-gray-800">Carregando...</h2>
            <p className="text-center text-gray-600">Por favor, aguarde enquanto conectamos você ao sistema.</p>
          </>
        ) : (
          <>
            <div className="flex justify-center text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-center text-gray-800">Erro na autenticação</h2>
            <p className="text-center text-gray-600">{errorMessage}</p>
            <button
              onClick={retryLogin}
              className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Fazer login novamente
            </button>
          </>
        )}
      </div>
    </div>
  );
}

'use client';
import { ReactNode, useEffect, useState, useRef, createContext, useContext } from 'react';
import Keycloak from 'keycloak-js';
import api from '@/services/api';

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
  const keycloakRef = useRef<Keycloak | null>(null);
  const refreshTokenInterval = useRef<NodeJS.Timeout | null>(null);

  const logout = () => {
    if (keycloakRef.current) {
      keycloakRef.current.logout();
    }
  };

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_KEYCLOAK_URL;
    const realm = process.env.NEXT_PUBLIC_KEYCLOAK_REALM;
    const clientId = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID;

    if (!url || !realm || !clientId) {
      setAuthStatus('error');
      setErrorMessage('Configuração do Keycloak ausente ou incorreta.');
      return;
    }

    const kc = new Keycloak({
      url,
      realm,
      clientId,
    });
    keycloakRef.current = kc;

    const initializeAuth = async () => {
      setAuthStatus('loading');
      setErrorMessage(null);
      try {
        const authenticated = await kc.init({
          onLoad: 'login-required',
          pkceMethod: 'S256',
          checkLoginIframe: false,
        });

        if (!authenticated) {
          await kc.login();
          return;
        }

        if (kc.token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${kc.token}`;
          setAuthStatus('authenticated');
        }

        refreshTokenInterval.current = setInterval(() => {
          if (kc.token) {
            kc.updateToken(70).then((refreshed) => {
              if (refreshed) {
                api.defaults.headers.common['Authorization'] = `Bearer ${kc.token}`;
              }
            }).catch(() => {
              setAuthStatus('error');
              setErrorMessage('Sua sessão expirou. Por favor, faça login novamente.');
              kc.logout();
            });
          }
        }, 60000);

        kc.onTokenExpired = () => {
          kc.updateToken(30).then((updated) => {
            if (updated && kc.token) {
              api.defaults.headers.common['Authorization'] = `Bearer ${kc.token}`;
            }
          }).catch(() => {
            setAuthStatus('error');
            setErrorMessage('Sua sessão expirou. Por favor, faça login novamente.');
            kc.logout();
          });
        };
      } catch (err: any) {
        console.error('Keycloak init error:', err);
        setAuthStatus('error');
        setErrorMessage(err?.message || 'Falha na autenticação. Por favor, tente novamente.');
      }
    };

    initializeAuth();

    return () => {
      if (refreshTokenInterval.current) {
        clearInterval(refreshTokenInterval.current);
      }
      delete api.defaults.headers.common['Authorization'];
    };
  }, []);

  const handleRetry = () => {
    if (keycloakRef.current) {
      keycloakRef.current.login();
    }
  };

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
            <h2 className="text-xl font-semibold text-center text-gray-800">Autenticando...</h2>
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
              onClick={handleRetry}
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

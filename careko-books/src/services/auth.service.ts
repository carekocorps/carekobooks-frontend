import Keycloak from 'keycloak-js';
import api from './api';
import {jwtDecode} from 'jwt-decode';

let keycloak: Keycloak | null = null;
let refreshTokenInterval: NodeJS.Timeout | null = null;

export function getKeycloakInstance() {
  if (!keycloak) throw new Error('Keycloak não inicializado');
  return keycloak;
}

export async function initializeAuth(
  onAuthenticated: () => void,
  onError: (msg: string) => void
) {
  const url = process.env.NEXT_PUBLIC_KEYCLOAK_URL;
  const realm = process.env.NEXT_PUBLIC_KEYCLOAK_REALM;
  const clientId = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID;

  if (!url || !realm || !clientId) {
    onError('Configuração do Keycloak ausente ou incorreta.');
    return;
  }

  keycloak = new Keycloak({ url, realm, clientId });

  try {
    const authenticated = await keycloak.init({
      onLoad: 'login-required',
      pkceMethod: 'S256',
      checkLoginIframe: false,
    });

    if (!authenticated) {
      await keycloak.login();
      return;
    }

    if (keycloak.token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${keycloak.token}`;
      onAuthenticated();
    }

    refreshTokenInterval = setInterval(() => {
      keycloak!.updateToken(70)
        .then((refreshed) => {
          if (refreshed && keycloak!.token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${keycloak!.token}`;
          }
        })
        .catch(() => {
          onError('Sua sessão expirou. Por favor, faça login novamente.');
          keycloak!.logout();
        });
    }, 60000);

    keycloak.onTokenExpired = () => {
      keycloak!.updateToken(30)
        .then((updated) => {
          if (updated && keycloak!.token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${keycloak!.token}`;
          }
        })
        .catch(() => {
          onError('Sua sessão expirou. Por favor, faça login novamente.');
          keycloak!.logout();
        });
    };
  } catch (err: any) {
    console.error('Keycloak init error:', err);
    onError(err?.message || 'Falha na autenticação. Por favor, tente novamente.');
  }
}

export function cleanupAuth() {
  if (refreshTokenInterval) {
    clearInterval(refreshTokenInterval);
    refreshTokenInterval = null;
  }
  delete api.defaults.headers.common['Authorization'];
}

export function logout() {
  if (keycloak) {
    keycloak.logout();
  }
}

export function retryLogin() {
  if (keycloak) {
    keycloak.login();
  }
}

export function getDecodedToken<T = any>(): T | null {
  if (!keycloak || !keycloak.token) return null;
  try {
    return jwtDecode<T>(keycloak.token);
  } catch (err) {
    console.error('Erro ao decodificar o token:', err);
    return null;
  }
}

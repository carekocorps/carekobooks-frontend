import { getCookie, setCookie, deleteCookie } from 'cookies-next';

export const CookieService = {
  get: (key: string) => getCookie(key),
  set: (key: string, value: string, options?: any) => {
    setCookie(key, value, options);
  },
  remove: (key: string) => {
    deleteCookie(key);
  },
};
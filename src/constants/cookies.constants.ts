export const COOKIE_KEYS = {
  AUTH_TOKEN: 'adele_auth_token',
  REFRESH_TOKEN: 'adele_refresh_token',
  USER: 'adele_user',
  THEME: 'adele_theme',
} as const;

export const AUTH_COOKIE_NAME = COOKIE_KEYS.AUTH_TOKEN;
export const REFRESH_COOKIE_NAME = COOKIE_KEYS.REFRESH_TOKEN;
export const USER_COOKIE_NAME = COOKIE_KEYS.USER;
export const THEME_COOKIE_NAME = COOKIE_KEYS.THEME;

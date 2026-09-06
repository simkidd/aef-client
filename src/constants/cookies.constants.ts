export const COOKIE_KEYS = {
  AUTH_TOKEN: "aef_auth_token",
  REFRESH_TOKEN: "aef_refresh_token",
  USER: "aef_user",
  THEME: "aef_theme",
} as const;

export const AUTH_COOKIE_NAME = COOKIE_KEYS.AUTH_TOKEN;
export const REFRESH_COOKIE_NAME = COOKIE_KEYS.REFRESH_TOKEN;
export const USER_COOKIE_NAME = COOKIE_KEYS.USER;
export const THEME_COOKIE_NAME = COOKIE_KEYS.THEME;

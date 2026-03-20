import Cookies from 'js-cookie';

/**
 * Check if user has valid authentication tokens
 */
export const hasValidAuthTokens = (): boolean => {
  const accessToken = Cookies.get('access_token');
  const refreshToken = Cookies.get('refresh_token');
  
  return !!accessToken || !!refreshToken;
};

/**
 * Get the current access token
 */
export const getAccessToken = (): string | undefined => {
  return Cookies.get('access_token');
};

/**
 * Get the current refresh token
 */
export const getRefreshToken = (): string | undefined => {
  return Cookies.get('refresh_token');
};

/**
 * Clear all auth tokens (logout)
 */
export const clearAuthTokens = (): void => {
  Cookies.remove('access_token');
  Cookies.remove('refresh_token');
};

/**
 * Debug function to log current auth state
 */
export const debugAuthState = (): void => {
  console.log('🔐 Auth State Debug:', {
    hasAccessToken: !!getAccessToken(),
    hasRefreshToken: !!getRefreshToken(),
    accessTokenLength: getAccessToken()?.length || 0,
    refreshTokenLength: getRefreshToken()?.length || 0,
    allCookies: Cookies.get(),
  });
};

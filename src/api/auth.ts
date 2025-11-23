import api from '../lib/api';
import { removeToken } from '../utils/jwt';

/**
 * Google OAuth 로그인 URL로 리다이렉트
 * 백엔드로 바로 이동하여 OAuth 플로우 시작
 */
export const startGoogleLogin = (): void => {
  const backendUrl = import.meta.env.VITE_API_BASE_URL || 'https://sketchcheck.shop';
  
  // 백엔드의 Google OAuth 시작 엔드포인트로 리다이렉트
  // 백엔드가 Google로 리다이렉트하고, 최종적으로 /callback?token=xxx로 돌아옴
  window.location.href = `${backendUrl}/api/auth/google`;
};

/**
 * 로그아웃
 * localStorage에서 토큰 제거 및 백엔드 로그아웃 호출
 */
export const logout = async (): Promise<void> => {
  try {
    // localStorage에서 토큰 제거
    removeToken();
    
    // 백엔드에 로그아웃 API가 있다면 호출
    await api.post('/api/auth/logout', {}, { withCredentials: true });
  } catch (error) {
    console.error('로그아웃 요청 실패:', error);
    // 로그아웃은 클라이언트에서도 가능하므로 에러를 무시
  }
};


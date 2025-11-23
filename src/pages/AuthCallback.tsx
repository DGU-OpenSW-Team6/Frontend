import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { decodeJWT } from '../utils/jwt';
import './AuthCallback.css';

interface AuthCallbackProps {
  onSuccess: () => void;
  onError: () => void;
}

const AuthCallback: React.FC<AuthCallbackProps> = ({ onSuccess, onError }) => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { login, setError } = useAuthStore();

  useEffect(() => {
    const processCallback = async () => {
      try {
        // URL에서 token 파라미터 추출
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const error = urlParams.get('error');

        if (error) {
          throw new Error(`OAuth Error: ${error}`);
        }

        if (!token) {
          throw new Error('Token이 없습니다.');
        }

        // JWT 토큰을 localStorage에 저장
        localStorage.setItem('accessToken', token);

        // JWT 토큰에서 사용자 정보 디코딩
        const userInfo = decodeJWT(token);
        
        if (!userInfo) {
          throw new Error('유효하지 않은 토큰입니다.');
        }

        // Zustand 스토어에 사용자 정보 저장
        login({
          id: userInfo.sub || userInfo.user_id || 'unknown',
          email: userInfo.email || '',
          name: userInfo.name || userInfo.email || 'User',
          picture: userInfo.picture,
        });

        setStatus('success');
        
        // 성공 후 약간의 딜레이를 주고 다음 화면으로 이동
        setTimeout(() => {
          onSuccess();
        }, 1000);

      } catch (err: any) {
        console.error('인증 처리 실패:', err);
        const message = err.message || '로그인 처리 중 오류가 발생했습니다.';
        setErrorMessage(message);
        setError(message);
        setStatus('error');

        // 에러 후 3초 뒤 로그인 페이지로 복귀
        setTimeout(() => {
          onError();
        }, 3000);
      }
    };

    processCallback();
  }, [login, setError, onSuccess, onError]);

  return (
    <div className="auth-callback-page">
      <div className="auth-callback-container">
        {status === 'loading' && (
          <div className="auth-callback-content">
            <div className="auth-callback-spinner"></div>
            <h2 className="auth-callback-title">로그인 중...</h2>
            <p className="auth-callback-description">
              Google 계정으로 인증하고 있습니다.
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="auth-callback-content">
            <div className="auth-callback-success-icon">✓</div>
            <h2 className="auth-callback-title">로그인 성공!</h2>
            <p className="auth-callback-description">
              잠시 후 메인 페이지로 이동합니다.
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="auth-callback-content">
            <div className="auth-callback-error-icon">✕</div>
            <h2 className="auth-callback-title">로그인 실패</h2>
            <p className="auth-callback-description auth-callback-error">
              {errorMessage}
            </p>
            <p className="auth-callback-description">
              잠시 후 로그인 페이지로 돌아갑니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;


# Google OAuth Token 기반 인증 플로우

## 🔄 변경 사항

기존의 `code` 기반 OAuth 플로우를 **token 기반**으로 변경했습니다.

### 이전 방식 (Code 기반)
```
사용자 → Google 로그인 → 백엔드 → code 전달 → 프론트 
→ 프론트가 code를 백엔드로 전송 → JWT 발급
```

### 현재 방식 (Token 기반) ✅
```
사용자 → 백엔드 → Google 로그인 → 백엔드에서 JWT 발급 
→ 프론트로 token과 함께 리다이렉트
```

---

## 🎯 인증 플로우

### 1. 로그인 시작
사용자가 "Continue with Google" 버튼 클릭

```typescript
// src/api/auth.ts
export const startGoogleLogin = (): void => {
  const backendUrl = 'https://sketchcheck.shop';
  window.location.href = `${backendUrl}/api/auth/google`;
};
```

### 2. 백엔드 처리
- 백엔드가 Google OAuth 인증 처리
- JWT 토큰 발급
- 프론트로 리다이렉트: `https://mysketchcheck.netlify.app/callback?token={jwt_token}`

### 3. 프론트 Callback 처리

```typescript
// src/pages/AuthCallback.tsx
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

// 1. localStorage에 토큰 저장
localStorage.setItem('accessToken', token);

// 2. JWT 디코딩하여 사용자 정보 추출
const userInfo = decodeJWT(token);

// 3. Zustand 스토어에 저장
login({
  id: userInfo.sub,
  email: userInfo.email,
  name: userInfo.name,
  picture: userInfo.picture,
});

// 4. 홈/업로드 페이지로 이동
onSuccess();
```

---

## 📁 변경된 파일

### 1. `src/pages/AuthCallback.tsx`
- ✅ `code` 대신 `token` 파라미터 읽기
- ✅ `localStorage.setItem('accessToken', token)` 저장
- ✅ JWT 디코딩하여 사용자 정보 추출
- ✅ 인증 완료 후 홈으로 이동
- ❌ `handleGoogleCallback(code)` API 호출 제거

### 2. `src/api/auth.ts`
- ✅ `startGoogleLogin()`: 백엔드 `/api/auth/google`로 리다이렉트
- ❌ `handleGoogleCallback(code)` 함수 제거 (더 이상 불필요)
- ✅ `logout()`: localStorage에서 토큰 제거

### 3. `src/utils/jwt.ts` (NEW)
- ✅ `decodeJWT(token)`: JWT 디코딩
- ✅ `isTokenExpired(token)`: 토큰 만료 확인
- ✅ `getToken()`: localStorage에서 토큰 가져오기
- ✅ `removeToken()`: localStorage에서 토큰 제거

### 4. `src/App.tsx`
- ✅ URL에서 `token` 파라미터 확인 (기존 `code` 대신)
- ✅ `token`이 있으면 callback 페이지로 이동

### 5. `public/_redirects` (NEW)
- ✅ Netlify SPA 라우팅 설정
- ✅ `/callback` 경로가 React 앱으로 라우팅되도록 설정

---

## 🔐 JWT 구조

백엔드에서 발급하는 JWT는 다음과 같은 payload를 포함해야 합니다:

```json
{
  "sub": "user-unique-id",
  "email": "user@example.com",
  "name": "User Name",
  "picture": "https://...",
  "exp": 1234567890,
  "iat": 1234567890
}
```

---

## 🗂️ 프로젝트 구조

```
Frontend/
├── public/
│   └── _redirects              # Netlify SPA 라우팅 설정
├── src/
│   ├── api/
│   │   └── auth.ts             # 간소화된 인증 API
│   ├── pages/
│   │   └── AuthCallback.tsx    # Token 기반 callback 처리
│   ├── utils/
│   │   └── jwt.ts              # JWT 디코딩 유틸리티 (NEW)
│   ├── store/
│   │   └── authStore.ts        # Zustand 인증 스토어
│   └── App.tsx                 # 라우팅 (token 감지)
└── .env                        # 환경변수
```

---

## 🧪 테스트 방법

### 1. 로컬 테스트
```bash
npm run dev
```

브라우저에서 http://localhost:5177 접속

### 2. 로그인 테스트
1. "Continue with Google" 버튼 클릭
2. 백엔드로 리다이렉트 → Google 로그인
3. `/callback?token=xxx` 로 돌아오는지 확인
4. localStorage에 `accessToken`이 저장되는지 확인 (개발자 도구 → Application → Local Storage)
5. 업로드 페이지로 이동하는지 확인

### 3. 토큰 확인
```javascript
// 브라우저 콘솔에서
const token = localStorage.getItem('accessToken');
console.log(token);

// JWT 디코딩 확인
const parts = token.split('.');
const payload = JSON.parse(atob(parts[1]));
console.log(payload);
```

---

## 🚀 배포 (Netlify)

### 1. `_redirects` 파일이 포함되었는지 확인
```bash
ls -la public/_redirects
```

### 2. 빌드 시 `_redirects`가 포함되는지 확인
```bash
npm run build
ls -la dist/_redirects
```

### 3. Netlify 환경변수 설정
Netlify 대시보드 → Site settings → Environment variables:
```
VITE_API_BASE_URL=https://sketchcheck.shop
```

---

## 🐛 트러블슈팅

### 문제: "Token이 없습니다" 에러
**원인**: 백엔드에서 token을 전달하지 않음

**해결**: 
1. 백엔드 로그 확인
2. 리다이렉트 URL 확인: `https://mysketchcheck.netlify.app/callback?token=xxx`

### 문제: "유효하지 않은 토큰입니다" 에러
**원인**: JWT 형식이 잘못됨

**해결**:
1. 브라우저 콘솔에서 토큰 확인
2. JWT 디코딩 테스트: https://jwt.io

### 문제: 로그인 후 페이지가 리다이렉트되지 않음
**원인**: `_redirects` 파일이 배포되지 않음

**해결**:
1. `public/_redirects` 파일 존재 확인
2. 빌드 후 `dist/_redirects` 생성 확인
3. Netlify에서 재배포

---

## ✅ 완료 체크리스트

- [x] AuthCallback.tsx에서 `token` 파라미터 읽기
- [x] localStorage에 토큰 저장
- [x] JWT 디코딩 유틸리티 작성
- [x] auth.ts에서 불필요한 코드 제거
- [x] App.tsx에서 `token` 감지
- [x] Netlify `_redirects` 파일 생성
- [x] 타입 에러 수정
- [x] Lint 에러 없음

---

## 📝 참고

- JWT 디코딩: Base64 URL 디코딩 사용
- localStorage: XSS 공격에 주의 (민감한 정보는 httpOnly 쿠키 권장)
- 토큰 만료: `isTokenExpired()` 함수로 확인 가능


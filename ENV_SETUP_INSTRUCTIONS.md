# 환경변수 설정 가이드

## 📁 `.env` 파일 생성

프로젝트 루트의 `Frontend/` 폴더에 `.env` 파일을 생성하세요:

```bash
cd /Users/minhyukpark/SketchCheck/Frontend
```

다음 내용으로 `.env` 파일 생성:

```env
VITE_API_BASE_URL=https://sketchcheck.shop
```

## 🔧 환경변수 설명

### `VITE_API_BASE_URL`
백엔드 API 서버 주소

**로컬 개발**:
```env
VITE_API_BASE_URL=https://sketchcheck.shop
```

**프로덕션 (Netlify)**:
Netlify 대시보드 → Site settings → Environment variables에서 설정

---

## ⚠️ 중요 참고사항

### 1. 이전에 필요했던 환경변수 (더 이상 불필요)

다음 환경변수들은 **token 기반 플로우**에서 더 이상 사용되지 않습니다:

```env
# ❌ 더 이상 필요 없음
VITE_GOOGLE_CLIENT_ID=...
VITE_GOOGLE_REDIRECT_URI=...
```

**이유**: 백엔드에서 Google OAuth를 직접 처리하므로 프론트에서는 Client ID가 필요 없습니다.

### 2. Git에 커밋하지 마세요

`.env` 파일은 이미 `.gitignore`에 포함되어 있습니다. 절대 Git에 커밋하지 마세요!

---

## 🧪 환경변수 확인

브라우저 콘솔에서 확인:

```javascript
console.log(import.meta.env.VITE_API_BASE_URL);
// 출력: https://sketchcheck.shop
```

---

## 🚀 Netlify 배포 시 설정

### Netlify 환경변수 설정 방법

1. Netlify 대시보드 접속
2. 프로젝트 선택
3. **Site settings** → **Environment variables**
4. **Add a variable** 클릭
5. 다음 변수 추가:

```
Key: VITE_API_BASE_URL
Value: https://sketchcheck.shop
```

6. **Save** 클릭
7. 사이트 재배포


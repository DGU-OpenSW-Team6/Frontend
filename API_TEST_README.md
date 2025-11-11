# 🧪 API 연동 테스트 가이드

FastAPI 백엔드와 axios 연동이 완료되었습니다!

## 📡 백엔드 정보

- **주소**: `http://52.78.81.44:8000`
- **엔드포인트**:
  - `POST /upload` - 이미지 파일 업로드
  - `GET /returnScore` - 점수 조회

## 🚀 테스트 방법

### 방법 1: 테스트 전용 UI 사용 (권장)

1. **main.tsx 수정** (임시로 TestApp 사용)
```typescript
// src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import TestApp from './TestApp.tsx'  // App 대신 TestApp

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TestApp />
  </StrictMode>,
)
```

2. **개발 서버 실행**
```bash
npm run dev
```

3. **브라우저에서 확인**
   - http://localhost:5173 접속
   - F12 (또는 Cmd+Option+I) 눌러서 콘솔 열기
   - 파일 업로드 또는 점수 조회 버튼 클릭
   - 콘솔에서 📤, 📊, ✅, ❌ 로그 확인

### 방법 2: 기존 컴포넌트에서 직접 사용

```typescript
import { uploadFile } from './api/upload';
import { getScore } from './api/returnScore';

// 파일 업로드 예시
const handleUpload = async (file: File) => {
  try {
    const result = await uploadFile(file);
    console.log('업로드 결과:', result);
  } catch (error) {
    console.error('업로드 실패:', error);
  }
};

// 점수 조회 예시
useEffect(() => {
  const fetchScore = async () => {
    try {
      const score = await getScore();
      console.log('점수:', score);
      setScore(score);
    } catch (error) {
      console.error('점수 조회 실패:', error);
    }
  };
  fetchScore();
}, []);
```

## 📁 생성된 파일

```
Frontend/src/
├── lib/
│   └── api.ts              ✅ axios 인스턴스 (baseURL: http://52.78.81.44:8000)
├── api/
│   ├── upload.ts           ✅ POST /upload (FormData, key: "file")
│   └── returnScore.ts      ✅ GET /returnScore
├── components/
│   └── ApiTestPanel.tsx    🧪 테스트 UI 컴포넌트
└── TestApp.tsx             🧪 테스트 전용 앱
```

## 🔍 콘솔 로그 확인 사항

### 업로드 성공 시
```
📤 업로드 요청 시작: example.jpg
✅ 업로드 성공: { ... 서버 응답 데이터 ... }
```

### 업로드 실패 시
```
📤 업로드 요청 시작: example.jpg
❌ 업로드 실패: { error: "..." }
전체 에러 객체: { ... }
```

### 점수 조회 성공 시
```
📊 점수 조회 요청 시작
✅ 점수 조회 성공: { score: 86, ... }
```

### 점수 조회 실패 시
```
📊 점수 조회 요청 시작
❌ 점수 조회 실패: { error: "..." }
전체 에러 객체: { ... }
```

## ⚙️ API 함수 상세

### upload.ts
```typescript
export const uploadFile = async (file: File)
```
- **매개변수**: `file` - 업로드할 File 객체
- **반환값**: 서버 응답 데이터
- **에러**: try-catch로 처리, `err.response?.data` 콘솔 출력
- **FormData key**: `"file"`

### returnScore.ts
```typescript
export const getScore = async ()
```
- **매개변수**: 없음
- **반환값**: 점수 데이터
- **에러**: try-catch로 처리, `err.response?.data` 콘솔 출력

## 🔧 문제 해결

### CORS 에러가 발생하는 경우
백엔드에서 CORS 설정이 필요합니다:
```python
# FastAPI
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 네트워크 에러가 발생하는 경우
1. 백엔드 서버가 실행 중인지 확인
2. 방화벽 설정 확인
3. `http://52.78.81.44:8000/docs` 접속해서 서버 상태 확인

## 📝 테스트 완료 후

테스트가 완료되면 `src/main.tsx`를 원래대로 되돌리세요:

```typescript
// src/main.tsx
import App from './App.tsx'  // TestApp 대신 App으로 변경
```

## 💡 팁

- 브라우저 Network 탭에서도 실제 HTTP 요청을 확인할 수 있습니다
- axios 인스턴스의 timeout은 10초로 설정되어 있습니다
- 모든 요청은 콘솔에 자동으로 로그가 남습니다


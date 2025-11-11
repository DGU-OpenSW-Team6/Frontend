# API 사용 가이드

이 디렉토리에는 FastAPI 백엔드와 통신하기 위한 API 함수들이 포함되어 있습니다.

## 📁 파일 구조

```
src/
├── lib/
│   └── api.ts              # axios 인스턴스
├── api/
│   ├── index.ts            # 통합 export
│   ├── upload.ts           # POST /upload
│   └── returnScore.ts      # GET /returnScore
└── types/
    └── api.ts              # TypeScript 타입
```

## 🚀 사용 방법

### 1. 파일 업로드 (POST /upload)

```typescript
import { uploadFile } from '@/api';

const handleUpload = async (file: File) => {
  const result = await uploadFile(file);
  
  if (result.success) {
    console.log('✅ 업로드 성공:', result.data);
    // 예상 응답: { task_id: '123', message: 'File uploaded' }
  } else {
    console.error('❌ 업로드 실패:', result.error);
    alert(`업로드 실패: ${result.error}`);
  }
};
```

### 2. 점수 조회 (GET /returnScore)

#### 방법 1: 쿼리 파라미터 사용

```typescript
import { getScore } from '@/api';

const handleGetScore = async () => {
  const taskId = '123'; // 선택사항
  const result = await getScore(taskId);
  
  if (result.success) {
    console.log('✅ 점수 조회 성공:', result.data);
    // 예상 응답: { score: 86, rating: 'Good', issues: [...] }
  } else {
    console.error('❌ 점수 조회 실패:', result.error);
  }
};
```

#### 방법 2: URL 경로에 ID 포함

```typescript
import { getScoreById } from '@/api';

const handleGetScoreById = async () => {
  const id = '123';
  const result = await getScoreById(id);
  
  if (result.success) {
    console.log('✅ 점수 조회 성공:', result.data);
  } else {
    console.error('❌ 점수 조회 실패:', result.error);
  }
};
```

## 🔄 실제 워크플로우 예시

```typescript
import { uploadFile, getScore } from '@/api';

const handleCompleteFlow = async (file: File) => {
  // 1단계: 파일 업로드
  const uploadResult = await uploadFile(file);
  
  if (!uploadResult.success) {
    alert(`업로드 실패: ${uploadResult.error}`);
    return;
  }
  
  console.log('파일 업로드 완료:', uploadResult.data);
  const taskId = uploadResult.data.task_id;
  
  // 2단계: 점수 조회 (폴링 또는 지연 후)
  await new Promise(resolve => setTimeout(resolve, 3000)); // 3초 대기
  
  const scoreResult = await getScore(taskId);
  
  if (scoreResult.success) {
    console.log('분석 완료:', scoreResult.data);
    // 점수 UI 업데이트
  } else {
    console.error('점수 조회 실패:', scoreResult.error);
  }
};
```

## 🎯 React 컴포넌트 통합 예시

```tsx
import React, { useState } from 'react';
import { uploadFile, getScore } from './api';

const UploadPage: React.FC = () => {
  const [uploading, setUploading] = useState(false);
  const [taskId, setTaskId] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    
    try {
      const result = await uploadFile(file);
      
      if (result.success) {
        console.log('업로드 성공:', result.data);
        setTaskId(result.data.task_id);
        
        // 3초 후 점수 조회
        setTimeout(async () => {
          const scoreResult = await getScore(result.data.task_id);
          if (scoreResult.success) {
            console.log('점수:', scoreResult.data);
            // 결과 페이지로 이동
          }
        }, 3000);
      } else {
        alert(`업로드 실패: ${result.error}`);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {uploading ? (
        <p>업로드 중...</p>
      ) : (
        <input 
          type="file" 
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload(file);
          }}
        />
      )}
    </div>
  );
};

export default UploadPage;
```

## ⚙️ 환경 변수

`.env` 파일에 백엔드 URL을 설정하세요:

```bash
VITE_API_BASE_URL=http://localhost:8000
```

## 🛠️ 에러 처리

모든 API 함수는 다음 형식으로 응답합니다:

```typescript
// 성공
{
  success: true,
  data: { ... }
}

// 실패
{
  success: false,
  error: "에러 메시지"
}
```

## 📝 타입 정의

`src/types/api.ts`에서 타입을 확인하세요:

```typescript
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}
```


// API 응답 공통 타입
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// Health Check 응답 타입
export interface HealthResponse {
  status: string;
  message?: string;
}

// 분석 요청 응답 타입
export interface AnalyzeResponse {
  task_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  message?: string;
}

// 분석 결과 타입
export interface AnalysisResult {
  score: number;
  rating: 'Good' | 'Medium' | 'Poor';
  summary: string;
  issues: Issue[];
}

// 이슈 타입
export interface Issue {
  id: string;
  title: string;
  description: string;
  severity: 'High' | 'Medium' | 'Low';
  category?: string;
}

// 분석 상태 응답 타입
export interface AnalysisStatusResponse {
  task_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number;
  result?: AnalysisResult;
  error?: string;
}


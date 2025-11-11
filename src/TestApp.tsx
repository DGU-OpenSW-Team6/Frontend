import ApiTestPanel from './components/ApiTestPanel';

/**
 * API 테스트 전용 앱
 * 
 * 사용 방법:
 * 1. src/main.tsx에서 App 대신 TestApp을 import
 * 2. 개발 서버 실행: npm run dev
 * 3. 브라우저 콘솔을 열어서 API 요청/응답 확인
 */
function TestApp() {
  return <ApiTestPanel />;
}

export default TestApp;


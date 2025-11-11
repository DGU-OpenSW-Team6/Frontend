import React, { useState, useEffect } from 'react';
import { uploadFile } from '../api/upload';
import { getScore } from '../api/returnScore';

/**
 * API 테스트용 컴포넌트
 * 콘솔을 열어서 요청/응답을 확인하세요 (F12 또는 Cmd+Option+I)
 */
const ApiTestPanel: React.FC = () => {
  const [uploadStatus, setUploadStatus] = useState<string>('대기 중');
  const [scoreData, setScoreData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // 컴포넌트 마운트 시 서버 연결 테스트
  useEffect(() => {
    console.log('🚀 API 테스트 패널 초기화');
    console.log('📡 백엔드 주소: http://52.78.81.44:8000');
    console.log('💡 콘솔에서 요청/응답을 확인하세요!');
  }, []);

  // 파일 업로드 테스트
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log('\n=== 파일 업로드 테스트 시작 ===');
    setLoading(true);
    setUploadStatus('업로드 중...');

    try {
      const result = await uploadFile(file);
      setUploadStatus(`업로드 성공! 결과: ${JSON.stringify(result)}`);
      console.log('\n=== 파일 업로드 테스트 완료 ===\n');
    } catch (error: any) {
      setUploadStatus(`업로드 실패: ${error.message}`);
      console.log('\n=== 파일 업로드 테스트 실패 ===\n');
    } finally {
      setLoading(false);
    }
  };

  // 점수 조회 테스트
  const handleGetScore = async () => {
    console.log('\n=== 점수 조회 테스트 시작 ===');
    setLoading(true);
    setScoreData(null);

    try {
      const score = await getScore();
      setScoreData(score);
      console.log('\n=== 점수 조회 테스트 완료 ===\n');
    } catch (error: any) {
      setScoreData({ error: error.message });
      console.log('\n=== 점수 조회 테스트 실패 ===\n');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      padding: '30px',
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: 'Inter, sans-serif'
    }}>
      <h1 style={{ marginBottom: '10px' }}>🧪 API 연동 테스트 패널</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        콘솔을 열어서 요청/응답을 확인하세요 (F12 또는 Cmd+Option+I)
      </p>

      {/* 백엔드 정보 */}
      <div style={{
        background: '#f0f0f0',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '30px'
      }}>
        <h3 style={{ marginTop: 0 }}>📡 백엔드 정보</h3>
        <p><strong>주소:</strong> http://52.78.81.44:8000</p>
        <p style={{ marginBottom: 0 }}>
          <strong>엔드포인트:</strong><br />
          • POST /upload<br />
          • GET /returnScore
        </p>
      </div>

      {/* 파일 업로드 테스트 */}
      <div style={{
        border: '2px solid #e0e0e0',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <h2 style={{ marginTop: 0 }}>📤 1. 파일 업로드 테스트</h2>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          disabled={loading}
          style={{
            marginBottom: '10px',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            width: '100%'
          }}
        />
        <p style={{
          padding: '10px',
          background: uploadStatus.includes('성공') ? '#d4edda' : 
                     uploadStatus.includes('실패') ? '#f8d7da' : '#e7f3ff',
          borderRadius: '4px',
          color: uploadStatus.includes('성공') ? '#155724' :
                 uploadStatus.includes('실패') ? '#721c24' : '#004085'
        }}>
          <strong>상태:</strong> {uploadStatus}
        </p>
      </div>

      {/* 점수 조회 테스트 */}
      <div style={{
        border: '2px solid #e0e0e0',
        borderRadius: '8px',
        padding: '20px'
      }}>
        <h2 style={{ marginTop: 0 }}>📊 2. 점수 조회 테스트</h2>
        <button
          onClick={handleGetScore}
          disabled={loading}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            background: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: '15px'
          }}
        >
          {loading ? '조회 중...' : '점수 가져오기'}
        </button>

        {scoreData && (
          <div style={{
            background: '#f8f9fa',
            padding: '15px',
            borderRadius: '4px',
            overflow: 'auto'
          }}>
            <strong>📥 응답 데이터:</strong>
            <pre style={{
              marginTop: '10px',
              background: '#fff',
              padding: '10px',
              borderRadius: '4px',
              overflow: 'auto'
            }}>
              {JSON.stringify(scoreData, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* 콘솔 안내 */}
      <div style={{
        marginTop: '30px',
        padding: '15px',
        background: '#fff3cd',
        borderRadius: '8px',
        border: '1px solid #ffc107'
      }}>
        <h3 style={{ marginTop: 0 }}>💡 콘솔 확인 방법</h3>
        <ul style={{ marginBottom: 0 }}>
          <li><strong>Chrome/Edge:</strong> F12 또는 Cmd+Option+I (Mac)</li>
          <li><strong>Safari:</strong> Cmd+Option+C (Mac, 개발자 메뉴 활성화 필요)</li>
          <li>Console 탭에서 📤, 📊, ✅, ❌ 이모지로 시작하는 로그를 확인하세요</li>
        </ul>
      </div>
    </div>
  );
};

export default ApiTestPanel;


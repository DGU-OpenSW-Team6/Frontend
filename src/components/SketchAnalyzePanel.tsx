import React, { useState } from 'react';
import { uploadFile } from '../api/upload';
import { getScore } from '../api/returnScore';

const SketchAnalyzePanel: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState<any>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setScore(null);

    try {
      await uploadFile(file);
      const scoreData = await getScore();
      setScore(scoreData);
    } catch (err: any) {
      setError(err.message || '분석 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>스케치 분석</h2>
      
      <input 
        type="file" 
        accept="image/*"
        onChange={handleFileChange}
        disabled={loading}
      />

      {loading && <p>분석 중...</p>}
      
      {error && <p style={{ color: 'red' }}>에러: {error}</p>}
      
      {score && (
        <div>
          <h3>분석 결과</h3>
          <pre>{JSON.stringify(score, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default SketchAnalyzePanel;


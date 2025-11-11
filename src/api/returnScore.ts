import api from '../lib/api';

export const getScore = async () => {
  try {
    console.log('📊 점수 조회 요청 시작');
    
    const response = await api.get('/returnScore');
    
    console.log('✅ 점수 조회 성공:', response.data);
    return response.data;
  } catch (err: any) {
    console.error('❌ 점수 조회 실패:', err.response?.data || err.message);
    console.error('전체 에러 객체:', err);
    throw err;
  }
};

// 사용 예시:
// useEffect(() => {
//   const fetchScore = async () => {
//     try {
//       const score = await getScore();
//       console.log('받아온 점수:', score);
//       setScore(score);
//     } catch (error) {
//       console.error('점수 가져오기 실패:', error);
//     }
//   };
//   fetchScore();
// }, []);


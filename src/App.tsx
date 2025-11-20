import { useState } from 'react'
import Login from './pages/Login'
import WebUpload from './pages/WebUpload'
import Analyzing from './pages/Analyzing'
import Result from './pages/Result'
import AccountPanel from './components/AccountPanel'
import { uploadFile, getScore } from './api'
import './App.css'

type AppState = 'login' | 'upload' | 'analyzing' | 'results'

interface UploadHistory {
  id: string;
  fileName: string;
  uploadDate: Date;
  score: number;
}

function App() {
  const [appState, setAppState] = useState<AppState>('login')
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [userEmail, setUserEmail] = useState<string>('')
  const [userName, setUserName] = useState<string>('')
  const [isAccountPanelOpen, setIsAccountPanelOpen] = useState<boolean>(false)
  const [uploadHistory, setUploadHistory] = useState<UploadHistory[]>([])
  const [_taskId, setTaskId] = useState<string | null>(null)
  const [_error, setError] = useState<string | null>(null)

  const handleLogin = () => {
    // TODO: 실제 Google 로그인 로직 구현
    console.log('Login successful')
    // 임시로 더미 데이터 설정 (실제로는 Google OAuth에서 받아옴)
    setUserName('Alex Johnson')
    setUserEmail('alex.johnson@example.com')
    setIsAuthenticated(true)
    setAppState('upload')
  }

  const getUserInitial = () => {
    if (!userName) return 'A'
    return userName.charAt(0).toUpperCase()
  }

  const handleProfileClick = () => {
    setIsAccountPanelOpen(true)
  }

  const handleCloseAccountPanel = () => {
    setIsAccountPanelOpen(false)
  }

  const handleUpload = async (file: File) => {
    console.log('File uploaded:', file)
    setAppState('analyzing')
    setError(null)
    
    try {
      // 1. 파일 업로드
      const uploadResult = await uploadFile(file)
      
      console.log('Upload success:', uploadResult)
      const uploadedTaskId = uploadResult?.task_id
      setTaskId(uploadedTaskId)
      
      // 2. 3초 후 점수 조회 (실제로는 서버에서 완료 신호를 받거나 폴링 사용)
      setTimeout(async () => {
        try {
          const scoreResult = await getScore()
          console.log('Score retrieved:', scoreResult)
          
          // 히스토리에 추가
          const newHistoryItem: UploadHistory = {
            id: uploadedTaskId || Date.now().toString(),
            fileName: file.name,
            uploadDate: new Date(),
            score: scoreResult?.score || 0
          }
          setUploadHistory(prev => [newHistoryItem, ...prev])
          
          setAppState('results')
        } catch (scoreErr: any) {
          if (scoreErr.response) {
            const data = scoreErr.response.data;
            const dataStr = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
            console.error(`❌ Failed to get score [${scoreErr.response.status}]:`, dataStr);
          } else {
            console.error('❌ Failed to get score (네트워크 에러):', scoreErr.message);
          }
          setError('Failed to get score')
          alert('점수 조회 실패')
          setAppState('upload')
        }
      }, 3000)
      
    } catch (err: any) {
      if (err.response) {
        const data = err.response.data;
        const dataStr = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
        console.error(`❌ Unexpected error [${err.response.status}]:`, dataStr);
      } else {
        console.error('❌ Unexpected error (네트워크 에러):', err.message);
      }
      setError('Unexpected error occurred')
      setAppState('upload')
      alert('예상치 못한 오류가 발생했습니다.')
    }
  }

  const handleReset = () => {
    setAppState('upload')
    setTaskId(null)
    setError(null)
  }

  return (
    <>
      {appState === 'login' && <Login onLogin={handleLogin} />}
      {appState === 'upload' && isAuthenticated && (
        <WebUpload 
          onUpload={handleUpload} 
          userInitial={getUserInitial()} 
          onProfileClick={handleProfileClick}
        />
      )}
      {appState === 'analyzing' && isAuthenticated && (
        <Analyzing 
          userInitial={getUserInitial()} 
          onProfileClick={handleProfileClick}
        />
      )}
      {appState === 'results' && isAuthenticated && (
        <Result 
          onReset={handleReset} 
          userInitial={getUserInitial()} 
          onProfileClick={handleProfileClick}
        />
      )}
      
      {/* Account Panel */}
      {isAuthenticated && (
        <AccountPanel
          isOpen={isAccountPanelOpen}
          onClose={handleCloseAccountPanel}
          userName={userName}
          userEmail={userEmail}
          userInitial={getUserInitial()}
          uploadHistory={uploadHistory}
        />
      )}
    </>
  )
}

export default App

import { useState } from 'react'
import WebUpload from './pages/WebUpload'
import Analyzing from './pages/Analyzing'
import Result from './pages/Result'
import { uploadFile, getScore } from './api'
import './App.css'

type AppState = 'upload' | 'analyzing' | 'results'

function App() {
  const [appState, setAppState] = useState<AppState>('upload')
  const [taskId, setTaskId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleUpload = async (file: File) => {
    console.log('File uploaded:', file)
    setAppState('analyzing')
    setError(null)
    
    try {
      // 1. 파일 업로드
      const uploadResult = await uploadFile(file)
      
      if (!uploadResult.success) {
        console.error('Upload failed:', uploadResult.error)
        setError(uploadResult.error || 'Upload failed')
        setAppState('upload')
        alert(`업로드 실패: ${uploadResult.error}`)
        return
      }
      
      console.log('Upload success:', uploadResult.data)
      const uploadedTaskId = uploadResult.data?.task_id
      setTaskId(uploadedTaskId)
      
      // 2. 3초 후 점수 조회 (실제로는 서버에서 완료 신호를 받거나 폴링 사용)
      setTimeout(async () => {
        const scoreResult = await getScore(uploadedTaskId)
        
        if (scoreResult.success) {
          console.log('Score retrieved:', scoreResult.data)
          setAppState('results')
        } else {
          console.error('Failed to get score:', scoreResult.error)
          setError(scoreResult.error || 'Failed to get score')
          alert(`점수 조회 실패: ${scoreResult.error}`)
          setAppState('upload')
        }
      }, 3000)
      
    } catch (err) {
      console.error('Unexpected error:', err)
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
      {appState === 'upload' && <WebUpload onUpload={handleUpload} />}
      {appState === 'analyzing' && <Analyzing />}
      {appState === 'results' && <Result onReset={handleReset} />}
    </>
  )
}

export default App

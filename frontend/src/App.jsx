import { useEffect, useState } from 'react'
import './App.css'

const BACKEND_URL = 'http://localhost:5063'

function App() {
  const [status, setStatus] = useState('checking')
  const [message, setMessage] = useState('백엔드 연결 확인 중...')
  const [details, setDetails] = useState('')

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/health`)
      .then(async (response) => {
        const data = await response.json().catch(() => null)

        if (!response.ok) {
          throw new Error(data?.message || '응답 상태가 올바르지 않습니다.')
        }

        setStatus('connected')
        setMessage('백엔드 연결 성공')
        setDetails(`응답: ${JSON.stringify(data)}`)
      })
      .catch((error) => {
        setStatus('error')
        setMessage('백엔드 연결 실패')
        setDetails(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.')
      })
  }, [])

  return (
    <main className="app-shell">
      <section className="hero-card">
        <p className="eyebrow">2-week internship portfolio project</p>
        <h1>StockFolio</h1>
        <p className="description">
          가상 자산으로 주식을 사고파는 모의 투자 앱을 만들며, 인증·거래·외부 API 연동을 한 번에 경험해보는 프로젝트입니다.
        </p>

        <div className={`status-box ${status}`}>
          <span>백엔드 상태</span>
          <strong>{message}</strong>
        </div>

        {details ? <p className="details">{details}</p> : null}
      </section>
    </main>
  )
}

export default App

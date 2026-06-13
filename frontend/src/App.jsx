import { useState } from 'react'
import axios from 'axios'
import Controls from './components/Controls'
import Stage from './components/Stage'

export default function App() {
  const [company, setCompany] = useState('Infosys')
  const [startDate, setStartDate] = useState('2024-01-01')
  const [endDate, setEndDate] = useState('2024-06-01')
  const [danceStyle, setDanceStyle] = useState('hip-hop')
  const [danceParams, setDanceParams] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  const generateSeed = (company, start, end, style) => {
    let hash = 0
    const str = company + start + end + style
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash + str.charCodeAt(i)) & 0xffffffff
    }
    return '#' + (hash >>> 0).toString(16).slice(-8).toUpperCase().padStart(8, '0').replace(/(.{6})/, '$1').replace(/^#(.)/, '#0$1')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await axios.post('http://localhost:8000/api/analyze', {
        company_name: company,
        start_date: startDate,
        end_date: endDate,
        dance_style: danceStyle,
      })

      setDanceParams(response.data.dance_parameters)
    } catch (error) {
      console.error('Failed to fetch dance parameters', error)
    } finally {
      setIsLoading(false)
    }
  }

  const renderDNA = (params) => {
    if (!params) return null

    const metrics = [
      { label: 'VOLATILITY', value: params.volatility || 0 },
      { label: 'MOMENTUM', value: Math.abs(params.momentum) || 0 },
      { label: 'VOLUME', value: params.volume_intensity || 0 },
      { label: 'TREND', value: Math.abs(params.trend_direction) || 0 },
      { label: 'ENERGY', value: (params.volatility || 0) * 0.4 + (params.volume_intensity || 0) * 0.6 },
      { label: 'TEMPO', value: (params.volume_intensity || 0) },
    ]

    return (
      <div style={{ width: '100%' }}>
        <p style={{
          color: '#00ff88',
          fontFamily: "'Orbitron', monospace",
          fontSize: 11,
          letterSpacing: 4,
          marginBottom: 16,
          textTransform: 'uppercase'
        }}>DANCE DNA</p>
        {metrics.map(m => (
          <div key={m.label} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ color: '#555', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase' }}>{m.label}</span>
              <span style={{ color: '#00ff88', fontSize: 10, fontFamily: "'Orbitron', monospace" }}>{Math.round(m.value * 100)}%</span>
            </div>
            <div style={{ background: '#1e1e2e', height: 4, borderRadius: 2, overflow: 'hidden' }}>
              <div style={{
                width: `${Math.round(m.value * 100)}%`,
                height: 4,
                borderRadius: 2,
                background: 'linear-gradient(90deg, #00ff88, #00d4ff)',
                transition: 'width 1s ease'
              }} />
            </div>
          </div>
        ))}
        <div style={{ height: 1, background: '#1e1e2e', margin: '24px 0' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#555', fontSize: 10 }}>STYLE</span>
            <span style={{ color: '#ccc', fontSize: 10 }}>{danceStyle}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#555', fontSize: 10 }}>COMPANY</span>
            <span style={{ color: '#ccc', fontSize: 10 }}>{company}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#555', fontSize: 10 }}>PERIOD</span>
            <span style={{ color: '#ccc', fontSize: 10 }}>{startDate} - {endDate}</span>
          </div>
        </div>
        <div style={{ height: 1, background: '#1e1e2e', margin: '24px 0' }} />
        <p style={{ color: '#555', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>CHOREOGRAPHY SEED</p>
        <p style={{ color: '#00ff88', fontFamily: "'Orbitron', monospace", fontSize: 14, margin: 0 }}>{generateSeed(company, startDate, endDate, danceStyle)}</p>
        <p style={{ color: '#444', fontSize: 10, margin: 0 }}>Dance speed and music adapt to market volatility</p>
      </div>
    )
  }

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', color: '#e0e0e0', fontFamily: "'Inter', sans-serif" }}>
      <header style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '24px 48px' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: 42,
            letterSpacing: 6,
            margin: 0
          }}>
            <span style={{ color: '#fff' }}>TICKER</span>
            <span style={{ color: '#00ff88' }}>DANCE</span>
          </h1>
          <p style={{ color: '#555', fontSize: 14, letterSpacing: 3, marginTop: 4 }}>Every Stock Has a Personality</p>
        </div>
      </header>

      <main style={{
        display: 'grid',
        gridTemplateColumns: '260px 1fr 260px',
        gap: '16px',
        padding: '0 16px 16px 16px',
        width: '100%',
        boxSizing: 'border-box',
        height: 'calc(100vh - 120px)'
      }}>
        <div style={{ width: '100%', overflowY: 'auto' }}>
          <Controls
            company={company}
            setCompany={setCompany}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            danceStyle={danceStyle}
            setDanceStyle={setDanceStyle}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
<div style={{ width: '100%', height: '100%', minHeight: '500px' }}>
           <Stage danceParams={danceParams} danceStyle={danceStyle} color="#00ff88" isPlaying={!!danceParams && !isMuted} isMuted={isMuted} onMute={setIsMuted} company={company} startDate={startDate} endDate={endDate} />
         </div>
        <div style={{ width: '100%', overflowY: 'auto' }}>
          <div style={{ background: '#111118', border: '1px solid #1e1e2e', borderRadius: 12, padding: 24 }}>
            {renderDNA(danceParams)}
          </div>
        </div>
      </main>
    </div>
  )
}
import { useState } from 'react'
import axios from 'axios'
import Controls from './components/Controls'
import Stage from './components/Stage'
import BattleMode from './components/BattleMode'

export default function App() {
  const [mode, setMode] = useState('solo')
  const [companyA, setCompanyA] = useState('Infosys')
  const [companyB, setCompanyB] = useState('Apple')
  const [startDateA, setStartDateA] = useState('2024-01-01')
  const [endDateA, setEndDateA] = useState('2024-06-01')
  const [startDateB, setStartDateB] = useState('2024-01-01')
  const [endDateB, setEndDateB] = useState('2024-06-01')
  const [danceStyle, setDanceStyle] = useState('hip-hop')
  const [paramsA, setParamsA] = useState(null)
  const [paramsB, setParamsB] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

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
      if (mode === 'solo') {
        const resA = await axios.post('http://localhost:8000/api/analyze', {
          company_name: companyA,
          start_date: startDateA,
          end_date: endDateA,
          dance_style: danceStyle,
        })
        setParamsA(resA.data.dance_parameters)
        setParamsB(null)
      } else {
        const [resA, resB] = await Promise.all([
          axios.post('http://localhost:8000/api/analyze', {
            company_name: companyA,
            start_date: startDateA,
            end_date: endDateA,
            dance_style: danceStyle,
          }),
          axios.post('http://localhost:8000/api/analyze', {
            company_name: companyB,
            start_date: startDateB,
            end_date: endDateB,
            dance_style: danceStyle,
          })
        ])
        setParamsA(resA.data.dance_parameters)
        setParamsB(resB.data.dance_parameters)
      }
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
            <span style={{ color: '#ccc', fontSize: 10 }}>{companyA}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#555', fontSize: 10 }}>PERIOD</span>
            <span style={{ color: '#ccc', fontSize: 10 }}>{startDateA} - {endDateA}</span>
          </div>
        </div>
        <div style={{ height: 1, background: '#1e1e2e', margin: '24px 0' }} />
        <p style={{ color: '#555', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>CHOREOGRAPHY SEED</p>
        <p style={{ color: '#00ff88', fontFamily: "'Orbitron', monospace", fontSize: 14, margin: 0 }}>{generateSeed(companyA, startDateA, endDateA, danceStyle)}</p>
        <p style={{ color: '#444', fontSize: 10, margin: 0 }}>Same inputs always generate same dance</p>
      </div>
    )
  }

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', color: '#e0e0e0', fontFamily: "'Inter', sans-serif" }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 48px' }}>
        <div style={{ textAlign: 'center', flex: 1 }}>
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
        <div style={{ display: 'flex', gap: 24 }}>
          <button
            onClick={() => setMode('solo')}
            style={{
              background: 'transparent',
              border: 'none',
              color: mode === 'solo' ? '#00ff88' : '#444',
              fontFamily: "'Orbitron', monospace",
              fontSize: 12,
              letterSpacing: 2,
              padding: '8px 0',
              borderBottom: mode === 'solo' ? '2px solid #00ff88' : '2px solid transparent',
              cursor: 'pointer'
            }}
          >SOLO</button>
          <button
            onClick={() => setMode('battle')}
            style={{
              background: 'transparent',
              border: 'none',
              color: mode === 'battle' ? '#00ff88' : '#444',
              fontFamily: "'Orbitron', monospace",
              fontSize: 12,
              letterSpacing: 2,
              padding: '8px 0',
              borderBottom: mode === 'battle' ? '2px solid #00ff88' : '2px solid transparent',
              cursor: 'pointer'
            }}
          >BATTLE</button>
        </div>
      </header>

      <main style={{ padding: '24px 48px' }}>
        {mode === 'solo' ? (
          <div style={{ display: 'flex', gap: 24 }}>
            <div style={{ flex: '0 0 24%' }}>
              <Controls
                company={companyA}
                setCompany={setCompanyA}
                startDate={startDateA}
                setStartDate={setStartDateA}
                endDate={endDateA}
                setEndDate={setEndDateA}
                danceStyle={danceStyle}
                setDanceStyle={setDanceStyle}
                onSubmit={handleSubmit}
                isLoading={isLoading}
                isBattle={false}
              />
            </div>
            <div style={{ flex: '0 0 52%' }}>
              <Stage danceParams={paramsA} danceStyle={danceStyle} color="#00ff88" />
            </div>
            <div style={{ flex: '0 0 24%' }}>
              <div style={{ background: '#111118', border: '1px solid #1e1e2e', borderRadius: 12, padding: 24 }}>
                {renderDNA(paramsA)}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 24 }}>
            <div style={{ flex: '0 0 24%' }}>
              <Controls
                companyA={companyA}
                setCompanyA={setCompanyA}
                companyB={companyB}
                setCompanyB={setCompanyB}
                startDateA={startDateA}
                setStartDateA={setStartDateA}
                endDateA={endDateA}
                setEndDateA={setEndDateA}
                startDateB={startDateB}
                setStartDateB={setStartDateB}
                endDateB={endDateB}
                setEndDateB={setEndDateB}
                danceStyle={danceStyle}
                setDanceStyle={setDanceStyle}
                onSubmit={handleSubmit}
                isLoading={isLoading}
                isBattle={true}
              />
            </div>
            <div style={{ flex: '0 0 52%' }}>
              <BattleMode companyA={companyA} companyB={companyB} paramsA={paramsA} paramsB={paramsB} danceStyle={danceStyle} />
            </div>
            <div style={{ flex: '0 0 24%' }}>
              <div style={{ background: '#111118', border: '1px solid #1e1e2e', borderRadius: 12, padding: 24 }}>
                {renderDNA(paramsA)}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
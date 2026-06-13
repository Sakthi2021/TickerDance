import { useState } from 'react'
import axios from 'axios'
import Controls from './components/Controls'
import Stage from './components/Stage'

const C = {
  bg: '#0a0a0f',
  cardBg: '#111118',
  border: '#1e1e2e',
  text: '#ffffff',
  subText: '#666',
  accent: '#00ff88',
  secondary: '#00d4ff',
}

export default function App() {
  const [company, setCompany] = useState('Infosys')
  const [startDate, setStartDate] = useState('2024-01-01')
  const [endDate, setEndDate] = useState('2024-06-01')
  const [danceStyle, setDanceStyle] = useState('hip-hop')
  const [danceParams, setDanceParams] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showGlossary, setShowGlossary] = useState(false)

  const generateSeed = (company, start, end, style) => {
    let hash = 0
    const str = company + start + end + style
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash + str.charCodeAt(i)) & 0xffffffff
    }
    return '#' + (hash >>> 0).toString(16).slice(-8).toUpperCase().padStart(8, '0')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setDanceParams(null)
    try {
      const response = await axios.post('http://localhost:8000/api/analyze', {
        company_name: company,
        start_date: startDate,
        end_date: endDate,
        dance_style: danceStyle,
      })
      setDanceParams(response.data.dance_parameters)
      setTimeout(() => {
        setIsLoading(false)
      }, 1500)
    } catch (error) {
      console.error('Failed to fetch dance parameters', error)
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
      { label: 'TEMPO', value: params.volatility ? (40 + params.volatility * 140) / 180 : 0 },
    ]

    return (
      <div style={{ width: '100%' }}>
        <p style={{
          color: C.accent,
          fontFamily: "'Orbitron', monospace",
          fontSize: 11,
          letterSpacing: 4,
          marginBottom: 16,
          textTransform: 'uppercase'
        }}>DANCE DNA</p>

        {metrics.map(m => (
          <div key={m.label} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ color: C.subText, fontSize: 10, letterSpacing: 2 }}>{m.label}</span>
              <span style={{ color: C.accent, fontSize: 10, fontFamily: "'Orbitron', monospace" }}>
                {Math.round(m.value * 100)}%
              </span>
            </div>
            <div style={{ background: C.border, height: 4, borderRadius: 2, overflow: 'hidden' }}>
              <div style={{
                width: `${Math.round(m.value * 100)}%`,
                height: 4,
                borderRadius: 2,
                background: `linear-gradient(90deg, ${C.accent}, ${C.secondary})`,
                transition: 'width 1s ease',
                boxShadow: '0 0 6px rgba(0,255,136,0.4)'
              }} />
            </div>
          </div>
        ))}

        <div style={{ height: 1, background: C.border, margin: '24px 0' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { label: 'STYLE', value: danceStyle },
            { label: 'COMPANY', value: company },
            { label: 'PERIOD', value: `${startDate} - ${endDate}` },
          ].map(row => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: C.subText, fontSize: 10 }}>{row.label}</span>
              <span style={{ 
                color: C.text, fontSize: 10,
                overflow: 'hidden', textOverflow: 'ellipsis',
                whiteSpace: 'nowrap', maxWidth: '130px'
              }}>{row.value}</span>
            </div>
          ))}
        </div>

        <div style={{ height: 1, background: C.border, margin: '24px 0' }} />

        <p style={{ color: C.subText, fontSize: 10, letterSpacing: 2, marginBottom: 4 }}>
          CHOREOGRAPHY SEED
        </p>
        <p style={{ 
          color: C.accent, 
          fontFamily: "'Orbitron', monospace", 
          fontSize: 14, margin: '0 0 4px 0',
          textShadow: '0 0 10px rgba(0,255,136,0.6)'
        }}>
          {generateSeed(company, startDate, endDate, danceStyle)}
        </p>
        <p style={{ color: C.subText, fontSize: 10, margin: 0 }}>
          Dance speed and music adapt to market volatility
        </p>

        {/* Market Direction Badge */}
        <div style={{ height: 1, background: C.border, margin: '24px 0' }} />
        <p style={{ color: C.subText, fontSize: 10, letterSpacing: 3, marginBottom: 8 }}>
          MARKET DIRECTION
        </p>
        {params && (() => {
          const momentum = params.momentum || 0
          const isBullish = momentum > 0.1
          const isBearish = momentum < -0.1
          const color = isBullish ? '#00ff88' : isBearish ? '#ff6b35' : '#00d4ff'
          const label = isBullish ? 'BULLISH' : isBearish ? 'BEARISH' : 'SIDEWAYS'
          return (
            <div style={{
              display: 'block',
              width: '100%',
              padding: '8px',
              textAlign: 'center',
              borderRadius: 4,
              border: `1px solid ${color}`,
              background: `${color}18`,
              color: color,
              fontFamily: "'Orbitron', monospace",
              fontSize: 12,
              letterSpacing: 4,
              boxSizing: 'border-box'
            }}>{label}</div>
          )
        })()}
      </div>
    )
  }

  const renderGlossary = () => {
    const Card = ({ color, title, children, examples }) => (
      <div style={{
        background: '#0d0d14',
        border: `1px solid ${C.border}`,
        borderRadius: 6,
        padding: '10px 12px',
        marginBottom: 8
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
          <div style={{ width: 3, height: 14, background: color, marginRight: 8 }} />
          <p style={{
            color: color,
            fontFamily: "'Orbitron', monospace",
            fontSize: 10,
            letterSpacing: 2,
            margin: 0
          }}>{title}</p>
        </div>
        <p style={{ color: C.subText, fontSize: 10, lineHeight: 1.5, margin: '4px 0' }}>
          {children}
        </p>
        {examples && examples.map((ex, i) => (
          <p key={i} style={{ color: '#444', fontSize: 9, margin: '2px 0' }}>{ex}</p>
        ))}
      </div>
    )

    return (
      <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <p style={{
            color: C.accent,
            fontFamily: "'Orbitron', monospace",
            fontSize: 11,
            letterSpacing: 4,
            margin: 0
          }}>MARKET GLOSSARY</p>
          <button
            onClick={() => setShowGlossary(!showGlossary)}
            style={{
              background: 'transparent',
              border: 'none',
              color: C.subText,
              fontFamily: "'Orbitron', monospace",
              fontSize: 9,
              letterSpacing: 2,
              cursor: 'pointer',
              padding: 0
            }}
          >{showGlossary ? 'HIDE' : 'SHOW'}</button>
        </div>

        {showGlossary && (
          <div>
            <Card color={C.accent} title="VOLATILITY" examples={['Low: Coca-Cola', 'High: GameStop']}>
              How wildly a stock price swings daily. High volatility means unpredictable price movements. In TickerDance, high volatility = faster dancing and more intense music.
            </Card>
            <Card color={C.secondary} title="MOMENTUM">
              The direction and strength of a stock price movement over time. Positive momentum means the stock is rising. In TickerDance, momentum determines dancer color — green for bullish, orange for bearish, blue for sideways.
            </Card>
            <Card color={C.accent} title="VOLUME">
              The number of shares traded in a given period. High volume means many investors are actively buying or selling. In TickerDance, volume controls the intensity and energy of the performance.
            </Card>
            <Card color={C.accent} title="TREND">
              The overall direction of price movement over the selected period. In TickerDance, trend determines the musical scale — major for bullish, minor for bearish.
            </Card>
            <Card color={C.secondary} title="ENERGY">
              A combined score from volatility and volume. High energy stocks have both high volatility and high trading activity. In TickerDance, energy controls particle density and pulse ring intensity.
            </Card>
            <Card color={C.accent} title="BPM">
              Beats Per Minute — the tempo of the dance and music. Directly calculated from volatility. Coca-Cola dances at ~40 BPM. GameStop can reach 180 BPM.
            </Card>
            <Card color={C.secondary} title="CHOREOGRAPHY SEED">
              A unique identifier generated from company, date range and dance style. Same inputs always produce the same seed — the market data is the choreographer, not random chance.
            </Card>
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.text, fontFamily: "'Inter', sans-serif" }}>
      <header style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: '24px 48px',
        position: 'relative'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: 42,
            letterSpacing: 6,
            margin: 0
          }}>
            <span style={{ color: C.text }}>TICKER</span>
            <span style={{ 
              color: C.accent,
              textShadow: '0 0 30px rgba(0,255,136,0.5)'
            }}>DANCE</span>
          </h1>
          <p style={{ color: C.subText, fontSize: 14, letterSpacing: 3, marginTop: 4 }}>
            Every Stock Has a Personality
          </p>
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
          <Stage
            danceParams={danceParams}
            danceStyle={danceStyle}
            isPlaying={!!danceParams && !isMuted}
            isMuted={isMuted}
            onMute={setIsMuted}
            company={company}
            startDate={startDate}
            endDate={endDate}
            isLoading={isLoading}
          />
        </div>

        <div style={{ width: '100%', overflowY: 'auto' }}>
          <div style={{
            background: C.cardBg,
            border: `1px solid ${C.border}`,
            borderLeft: `3px solid ${C.secondary}`,
            borderRadius: 12,
            padding: 24
          }}>
            {danceParams 
              ? <>{renderDNA(danceParams)}{renderGlossary()}</>
              : <p style={{ color: C.subText, fontSize: 12, textAlign: 'center', marginTop: 40 }}>
                  Generate a dance to see the DNA
                </p>
            }
          </div>
        </div>
      </main>
    </div>
  )
}
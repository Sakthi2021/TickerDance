import Dancer from './Dancer'

export default function Stage({ danceParams, danceStyle, color = '#00ff88' }) {
  const volatility = danceParams?.volatility || 0.3
  const volume = danceParams?.volume_intensity || 0.5
  const momentum = danceParams?.momentum || 0
  const energy = volatility * 0.6 + volume * 0.4

  const styleMultiplier =
    danceStyle === 'hip-hop' ? 1.0 :
    danceStyle === 'ballet' ? 0.25 :
    danceStyle === 'classical' ? 0.5 :
    danceStyle === 'robot' ? 0.4 :
    danceStyle === 'breakdance' ? 2.0 : 1.0

  const speed = styleMultiplier * (0.3 + energy * 4.0)
  const bpm = Math.round(speed * 60)

  const getOverlayText = () => {
    if (volatility > 0.5) return 'HIGH VOLATILITY — INTENSE'
    if (volatility < 0.2) return 'LOW VOLATILITY — CALM'
    if (momentum > 0.3) return 'BULLISH TREND'
    if (momentum < -0.3) return 'BEARISH TREND'
    return null
  }

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: 600,
      background: '#0d0d14',
      borderRadius: 12,
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 250,
        height: 250,
        background: `radial-gradient(circle, ${color}10 10%, transparent)`,
        filter: 'blur(40px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />
      {getOverlayText() && (
        <p style={{
          position: 'absolute',
          top: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          color: '#00ff88',
          fontFamily: "'Orbitron', monospace",
          fontSize: 12,
          letterSpacing: 3,
          margin: 0,
          textTransform: 'uppercase',
          pointerEvents: 'none',
          zIndex: 2
        }}>{getOverlayText()}</p>
      )}
      <div style={{
        position: 'absolute',
        top: 16,
        right: 16,
        textAlign: 'right',
        pointerEvents: 'none',
        zIndex: 2
      }}>
        <p style={{ color: '#555', fontFamily: "'Orbitron', monospace", fontSize: 10, margin: 0 }}>BPM</p>
        <p style={{ color: '#00ff88', fontFamily: "'Orbitron', monospace", fontSize: 24, fontWeight: 700, margin: 0 }}>{bpm}</p>
      </div>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1
      }}>
        {!danceParams ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <p style={{ color: '#444', fontSize: 14 }}>Select a stock to generate dance</p>
          </div>
        ) : (
          <Dancer danceStyle={danceStyle} speed={speed} color={color} volatility={volatility} volume={volume} momentum={momentum} />
        )}
      </div>
    </div>
  )
}
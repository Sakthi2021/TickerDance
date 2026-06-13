import Stage from './Stage'

export default function BattleMode({ companyA, companyB, paramsA, paramsB, danceStyle }) {
  const energyA = Math.round((paramsA?.volatility || 0) * 100)
  const tempoA = Math.round((paramsA?.volume_intensity || 0) * 100)
  const powerA = Math.round(Math.abs(paramsA?.momentum || 0) * 100)
  const totalA = energyA + tempoA + powerA

  const energyB = Math.round((paramsB?.volatility || 0) * 100)
  const tempoB = Math.round((paramsB?.volume_intensity || 0) * 100)
  const powerB = Math.round(Math.abs(paramsB?.momentum || 0) * 100)
  const totalB = energyB + tempoB + powerB

  const getWinner = () => {
    if (totalA > totalB) return 'A'
    if (totalB > totalA) return 'B'
    return 'draw'
  }

  return (
    <div style={{ display: 'flex', width: '100%', minHeight: 500 }}>
      <div style={{ flex: '0 0 45%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
          <Stage danceParams={paramsA} danceStyle={danceStyle} color="#00ff88" />
          <div style={{ display: 'flex', gap: 48, marginTop: 24 }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#555', fontSize: 10, letterSpacing: 2, margin: 0 }}>ENERGY</p>
              <p style={{ color: '#00ff88', fontFamily: "'Orbitron', monospace", fontSize: 14, margin: 0 }}>{energyA}</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#555', fontSize: 10, letterSpacing: 2, margin: 0 }}>TEMPO</p>
              <p style={{ color: '#00ff88', fontFamily: "'Orbitron', monospace", fontSize: 14, margin: 0 }}>{tempoA}</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#555', fontSize: 10, letterSpacing: 2, margin: 0 }}>POWER</p>
              <p style={{ color: '#00ff88', fontFamily: "'Orbitron', monospace", fontSize: 14, margin: 0 }}>{powerA}</p>
            </div>
          </div>
          {getWinner() === 'A' && (
            <p style={{ color: '#ffd700', fontFamily: "'Orbitron', monospace", fontSize: 14, letterSpacing: 4, marginTop: 12 }}>WINNER</p>
          )}
          {getWinner() === 'draw' && (
            <p style={{ color: '#888', fontFamily: "'Orbitron', monospace", fontSize: 14, letterSpacing: 4, marginTop: 12 }}>DRAW</p>
          )}
        </div>
      </div>

      <div style={{ flex: '0 0 10%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          borderLeft: '1px solid #1e1e2e',
          borderRight: '1px solid #1e1e2e',
          padding: '0 16px'
        }}>
          <p style={{
            color: '#ff0040',
            fontFamily: "'Orbitron', monospace",
            fontSize: 48,
            margin: 0,
            animation: 'pulse 2s infinite'
          }}>VS</p>
        </div>
      </div>

      <div style={{ flex: '0 0 45%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
          <Stage danceParams={paramsB} danceStyle={danceStyle} color="#ff6b35" />
          <div style={{ display: 'flex', gap: 48, marginTop: 24 }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#555', fontSize: 10, letterSpacing: 2, margin: 0 }}>ENERGY</p>
              <p style={{ color: '#ff6b35', fontFamily: "'Orbitron', monospace", fontSize: 14, margin: 0 }}>{energyB}</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#555', fontSize: 10, letterSpacing: 2, margin: 0 }}>TEMPO</p>
              <p style={{ color: '#ff6b35', fontFamily: "'Orbitron', monospace", fontSize: 14, margin: 0 }}>{tempoB}</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#555', fontSize: 10, letterSpacing: 2, margin: 0 }}>POWER</p>
              <p style={{ color: '#ff6b35', fontFamily: "'Orbitron', monospace", fontSize: 14, margin: 0 }}>{powerB}</p>
            </div>
          </div>
          {getWinner() === 'B' && (
            <p style={{ color: '#ffd700', fontFamily: "'Orbitron', monospace", fontSize: 14, letterSpacing: 4, marginTop: 12 }}>WINNER</p>
          )}
        </div>
      </div>
    </div>
  )
}
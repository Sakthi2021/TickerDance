import { useEffect, useRef, useState } from 'react'
import Dancer from './Dancer'
import MusicEngine from './MusicEngine'

export default function Stage({
  danceParams,
  danceStyle,
  isPlaying = false,
  isMuted = false,
  onMute,
  company,
  startDate,
  endDate,
  isLoading = false
}) {
  const canvasRef = useRef(null)
  const [isPaused, setIsPaused] = useState(false)

  const volatility = danceParams?.volatility || 0
  const volume = danceParams?.volume_intensity || 0.5
  const momentum = danceParams?.momentum || 0
  const trendDirection = danceParams?.trend_direction || 0

  const bpm = Math.round(40 + volatility * 140)
  const energy = volatility * 0.7 + volume * 0.3
  const isHighEnergy = energy > 0.6
  const isLowEnergy = energy < 0.3
  const isBullish = trendDirection > 0.1
  const isBearish = trendDirection < -0.1

  const bpmColor =
    bpm < 60 ? '#00d4ff' :
    bpm < 100 ? '#00ff88' : '#ff4444'

  const dancerColor =
    momentum > 0.1 ? '#00ff88' :
    momentum < -0.1 ? '#ff6b35' :
    '#00d4ff'

  const ringColor =
    isBullish ? '#00ff88' :
    isBearish ? '#ff4444' :
    '#ffaa00'

  const baseSpeed =
    danceStyle === 'hip-hop' ? 1.0 :
    danceStyle === 'ballet' ? 0.4 :
    danceStyle === 'classical' ? 0.7 :
    danceStyle === 'robot' ? 0.5 :
    danceStyle === 'breakdance' ? 1.5 : 1.0

  const speed = isPaused ? 0 : baseSpeed * (0.2 + volatility * 1.8)

  const getOverlayText = () => {
    if (volatility > 0.5) return 'HIGH VOLATILITY — INTENSE'
    if (volatility < 0.2) return 'LOW VOLATILITY — CALM'
    if (momentum > 0.3) return 'BULLISH TREND'
    if (momentum < -0.3) return 'BEARISH TREND'
    return null
  }

  useEffect(() => {
    if (isPaused) return

    const canvas = canvasRef.current
    if (!canvas || !danceParams) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    let ringCount, maxRadius, ringSpeed, ringOpacity, ringOffsets

    if (isLowEnergy) {
      ringCount = 3
      maxRadius = 80
      ringSpeed = 0.5
      ringOpacity = 0.15
      ringOffsets = [0, 30, 60]
    } else if (isHighEnergy) {
      ringCount = 6
      maxRadius = 280
      ringSpeed = 3.5
      ringOpacity = 0.6
      ringOffsets = [0, 50, 100, 150, 200, 250]
    } else {
      ringCount = 4
      maxRadius = 180
      ringSpeed = 1.5
      ringOpacity = 0.35
      ringOffsets = [0, 45, 90, 135]
    }

    let s = Math.round((volatility * 0.6 + volume * 0.4) * 10000 + momentum * 1000)
    const rng = () => {
      s = (s * 1664525 + 1013904223) & 0xffffffff
      return (s >>> 0) / 0xffffffff
    }

    const rings = ringOffsets.map(offset => ({
      radius: offset,
      speed: isHighEnergy ? ringSpeed * (0.8 + rng() * 0.4) : ringSpeed,
      maxRadius
    }))

    let spawnXBase, spawnYBase, particleVx, particleVy
    let particleColors, shadowBlur, shadowColor, totalParticles

    if (isBullish) {
      totalParticles = 50
      spawnXBase = () => rng() * canvas.width
      spawnYBase = () => rng() * canvas.height
      particleVx = () => (rng() - 0.5) * 1.5
      particleVy = () => -(rng() * 1 + 0.2)
      particleColors = ['#00ff88', '#00d4ff', '#ffffff']
      shadowBlur = 8
      shadowColor = '#00ff88'
    } else if (isBearish) {
      totalParticles = 8
      spawnXBase = () => rng() * canvas.width
      spawnYBase = () => 0
      particleVx = () => (rng() - 0.5) * 0.5
      particleVy = () => rng() * 1.5 + 0.5
      particleColors = ['#ff4444', '#ff6b35', '#8b0000']
      shadowBlur = 8
      shadowColor = '#ff4444'
    } else {
      totalParticles = 25
      spawnXBase = () => canvas.width / 2
      spawnYBase = () => canvas.height / 2
      particleVx = () => (rng() - 0.5) * 3
      particleVy = () => (rng() - 0.5) * 1
      particleColors = ['#ffaa00', '#ffd700', '#ffffff']
      shadowBlur = 4
      shadowColor = '#ffaa00'
    }

    const particleSize = 1.5 + volatility * 4
    const lifeSpeed = 0.005 + volume * 0.02

    const particles = Array.from({ length: totalParticles }, () => ({
      x: spawnXBase(),
      y: spawnYBase(),
      vx: particleVx(),
      vy: particleVy(),
      size: particleSize,
      life: rng(),
      lifeSpeed,
      color: particleColors[Math.floor(rng() * particleColors.length)]
    }))

    let animId

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      rings.forEach(ring => {
        ring.radius += ring.speed
        if (ring.radius > ring.maxRadius) ring.radius = 0
        const opacity = (1 - ring.radius / ring.maxRadius) * ringOpacity
        ctx.beginPath()
        ctx.arc(centerX, centerY, ring.radius, 0, Math.PI * 2)
        ctx.strokeStyle = ringColor
        ctx.globalAlpha = opacity
        ctx.lineWidth = 3
        ctx.stroke()
        ctx.globalAlpha = 1
      })

      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.04
        p.life += p.lifeSpeed

        if (p.life >= 1) {
          p.x = spawnXBase()
          p.y = spawnYBase()
          p.vx = particleVx()
          p.vy = particleVy()
          p.life = 0
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = (1 - p.life) * 0.9
        ctx.shadowBlur = shadowBlur
        ctx.shadowColor = shadowColor
        ctx.fill()
        ctx.shadowBlur = 0
        ctx.globalAlpha = 1
      })

      animId = requestAnimationFrame(animate)
    }

    animate()

    return () => cancelAnimationFrame(animId)
  }, [danceParams, danceStyle, isPaused])

  const overlayText = getOverlayText()

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: 520,
      background: '#0d0d14',
      borderRadius: 12,
      overflow: 'hidden',
      border: '1px solid #1e1e2e'
    }}>

      {/* Loading overlay */}
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0,
          width: '100%', height: '100%',
          background: 'rgba(10,10,15,0.95)',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none'
        }}>
          <div style={{
            width: 60, height: 60,
            border: '2px solid #1e1e2e',
            borderTop: '2px solid #00ff88',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <p style={{
            color: '#00ff88',
            fontFamily: "'Orbitron', monospace",
            fontSize: 11,
            letterSpacing: 3,
            marginTop: 16
          }}>ANALYZING MARKET DATA</p>
          <p style={{
            color: '#444',
            fontSize: 10,
            letterSpacing: 2,
            marginTop: 8
          }}>Generating choreography...</p>
        </div>
      )}

      {/* 2D canvas for particles and rings */}
      <canvas ref={canvasRef} style={{
        position: 'absolute',
        top: 0, left: 0,
        width: '100%', height: '100%',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      {/* Grid lines */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0,
        width: '100%', height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      {/* Spotlight */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 250, height: 250,
        background: `radial-gradient(circle, ${dancerColor}10 10%, transparent)`,
        filter: 'blur(40px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* BPM - top left */}
      <div style={{
        position: 'absolute',
        top: 12, left: 12,
        zIndex: 10,
        pointerEvents: 'none'
      }}>
        <p style={{
          color: '#555',
          fontFamily: "'Orbitron', monospace",
          fontSize: 10, margin: 0
        }}>BPM</p>
        <p style={{
          color: bpmColor,
          fontFamily: "'Orbitron', monospace",
          fontSize: 24, fontWeight: 700, margin: 0,
          textShadow: `0 0 10px ${bpmColor}`
        }}>{bpm}</p>
      </div>

      {/* Mood overlay - top center */}
      {overlayText && (
        <p style={{
          position: 'absolute',
          top: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          color: '#00ff88',
          fontFamily: "'Orbitron', monospace",
          fontSize: 11,
          letterSpacing: 3,
          margin: 0,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          zIndex: 10
        }}>{overlayText}</p>
      )}

      {/* MUTE - top right */}
      <button onClick={() => onMute && onMute(!isMuted)} style={{
        position: 'absolute',
        top: 12, right: 12,
        background: 'transparent',
        border: '1px solid #1e1e2e',
        color: isMuted ? '#555' : '#00ff88',
        fontFamily: "'Orbitron', monospace",
        fontSize: 9,
        letterSpacing: 2,
        padding: '6px 12px',
        cursor: 'pointer',
        zIndex: 10
      }}>{isMuted ? 'UNMUTE' : 'MUTE'}</button>

      {/* Dancer color explanation - bottom left */}
      {danceParams && (
        <div style={{
          position: 'absolute',
          bottom: 60, left: 12,
          background: 'rgba(10,10,15,0.85)',
          border: '1px solid #1e1e2e',
          borderRadius: 6,
          padding: '10px 14px',
          zIndex: 10,
          maxWidth: 200
        }}>
          <p style={{
            color: '#555',
            fontFamily: "'Orbitron', monospace",
            fontSize: 8, letterSpacing: 2,
            margin: '0 0 4px 0'
          }}>DANCER COLOR</p>

          {momentum > 0.1 && (
            <>
              <p style={{ color: '#00ff88', fontFamily: "'Orbitron', monospace", fontSize: 10, margin: '0 0 2px 0' }}>
                <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', backgroundColor: '#00ff88', marginRight: 6, verticalAlign: 'middle' }} />
                GREEN — BULLISH
              </p>
              <p style={{ color: '#888', fontSize: 9, margin: 0 }}>
                {company} trending upward with momentum {Math.round(momentum * 100)}%
              </p>
            </>
          )}
          {momentum < -0.1 && (
            <>
              <p style={{ color: '#ff6b35', fontFamily: "'Orbitron', monospace", fontSize: 10, margin: '0 0 2px 0' }}>
                <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', backgroundColor: '#ff6b35', marginRight: 6, verticalAlign: 'middle' }} />
                ORANGE — BEARISH
              </p>
              <p style={{ color: '#888', fontSize: 9, margin: 0 }}>
                {company} trending downward with momentum {Math.round(Math.abs(momentum) * 100)}%
              </p>
            </>
          )}
          {momentum >= -0.1 && momentum <= 0.1 && (
            <>
              <p style={{ color: '#00d4ff', fontFamily: "'Orbitron', monospace", fontSize: 10, margin: '0 0 2px 0' }}>
                <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', backgroundColor: '#00d4ff', marginRight: 6, verticalAlign: 'middle' }} />
                BLUE — SIDEWAYS
              </p>
              <p style={{ color: '#888', fontSize: 9, margin: 0 }}>
                {company} moving sideways with neutral momentum
              </p>
            </>
          )}
        </div>
      )}

      {/* PAUSE/RESUME - bottom center */}
      <button onClick={() => setIsPaused(!isPaused)} style={{
        position: 'absolute',
        bottom: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#0a0a0f',
        border: '1px solid #00ff88',
        color: '#00ff88',
        fontFamily: "'Orbitron', monospace",
        fontSize: 10,
        letterSpacing: 3,
        padding: '10px 32px',
        borderRadius: 4,
        cursor: 'pointer',
        zIndex: 10
      }}>{isPaused ? 'RESUME' : 'PAUSE'}</button>

      {/* Music Engine */}
      <MusicEngine
        danceParams={danceParams}
        danceStyle={danceStyle}
        isPlaying={!!danceParams && !isPaused && !isMuted}
        company={company}
        startDate={startDate}
        endDate={endDate}
      />

      {/* 3D Dancer */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0,
        width: '100%', height: '100%',
        zIndex: 1
      }}>
        {!danceParams ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%'
          }}>
            <p style={{ color: '#444', fontSize: 14 }}>
              Select a stock to generate dance
            </p>
          </div>
        ) : (
          <Dancer
            danceStyle={danceStyle}
            speed={speed}
            color={dancerColor}
          />
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
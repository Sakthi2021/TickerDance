import { useEffect, useRef } from 'react'

export default function MusicEngine({ 
  danceParams, 
  danceStyle,
  isPlaying 
}) {
  const audioCtxRef = useRef(null)
  const intervalsRef = useRef([])

  useEffect(() => {
    if (!isPlaying || !danceParams) return

    const ctx = new (window.AudioContext || 
                     window.webkitAudioContext)()
    audioCtxRef.current = ctx

    const volatility = danceParams.volatility || 0
    const volume = danceParams.volume_intensity || 0.5
    const momentum = danceParams.momentum || 0
    const trend = danceParams.trend_direction || 1
    const priceRange = danceParams.price_range_normalized || 0.3

    const bpm = Math.round(40 + volatility * 140)
    const beatInterval = (60 / bpm) * 1000

    const bullishNotes = [
      261.63, 293.66, 329.63, 
      349.23, 392.00, 440.00, 493.88
    ]
    const bearishNotes = [
      261.63, 293.66, 311.13, 
      349.23, 392.00, 415.30, 466.16
    ]
    const scale = trend > 0 ? bullishNotes : bearishNotes

    const noteCount = Math.round(3 + priceRange * 4)
    const availableNotes = scale.slice(0, noteCount)

    function seededRandom(seed) {
      let s = Math.round(seed)
      return function() {
        s = (s * 1664525 + 1013904223) & 0xffffffff
        return (s >>> 0) / 0xffffffff
      }
    }
    const seed = Math.round(
      volatility * 1000 +
      volume * 500 +
      Math.abs(momentum) * 200 +
      priceRange * 100
    )
    const rng = seededRandom(seed)

    const melody = Array.from({length: 16}, () => {
      const idx = Math.floor(rng() * availableNotes.length)
      return availableNotes[idx]
    })

    const masterGain = ctx.createGain()
    masterGain.gain.value = 0.25
    masterGain.connect(ctx.destination)

    const styleConfig = {
      'hip-hop': {
        wave: 'sawtooth',
        attack: 0.01,
        decay: 0.12,
        hasDrum: true,
        drumPattern: [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],
        bassNote: 65.41
      },
      'ballet': {
        wave: 'sine',
        attack: 0.15,
        decay: 0.5,
        hasDrum: false,
        drumPattern: [],
        bassNote: 0
      },
      'classical': {
        wave: 'triangle',
        attack: 0.08,
        decay: 0.35,
        hasDrum: false,
        drumPattern: [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
        bassNote: 87.31
      },
      'robot': {
        wave: 'square',
        attack: 0.001,
        decay: 0.06,
        hasDrum: true,
        drumPattern: [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
        bassNote: 55.00
      },
      'breakdance': {
        wave: 'sawtooth',
        attack: 0.001,
        decay: 0.08,
        hasDrum: true,
        drumPattern: [1,1,0,1,1,0,1,0,1,1,0,1,1,0,1,1],
        bassNote: 73.42
      }
    }
    const config = styleConfig[danceStyle] || 
                   styleConfig['hip-hop']

    function playMelodyNote(freq, time) {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = config.wave
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0, time)
      gain.gain.linearRampToValueAtTime(
        0.15 + volume * 0.1, 
        time + config.attack
      )
      gain.gain.exponentialRampToValueAtTime(
        0.001, 
        time + config.attack + config.decay
      )
      osc.connect(gain)
      gain.connect(masterGain)
      osc.start(time)
      osc.stop(time + config.attack + config.decay + 0.1)
    }

    function playBass(time) {
      if (!config.bassNote) return
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = config.bassNote
      gain.gain.setValueAtTime(0, time)
      gain.gain.linearRampToValueAtTime(
        0.2 + volume * 0.15, time + 0.02
      )
      gain.gain.exponentialRampToValueAtTime(
        0.001, time + 0.3
      )
      osc.connect(gain)
      gain.connect(masterGain)
      osc.start(time)
      osc.stop(time + 0.4)
    }

    function playDrum(time) {
      const bufferSize = Math.floor(ctx.sampleRate * 0.12)
      const buffer = ctx.createBuffer(
        1, bufferSize, ctx.sampleRate
      )
      const data = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1
      }
      const source = ctx.createBufferSource()
      source.buffer = buffer
      const gain = ctx.createGain()
      gain.gain.setValueAtTime(
        0.25 + volatility * 0.2, time
      )
      gain.gain.exponentialRampToValueAtTime(
        0.001, time + 0.12
      )
      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.value = 120 + volatility * 180
      source.connect(filter)
      filter.connect(gain)
      gain.connect(masterGain)
      source.start(time)
      source.stop(time + 0.15)
    }

    let step = 0
    const interval = setInterval(() => {
      if (!audioCtxRef.current || 
          ctx.state === 'closed') return
      const now = ctx.currentTime
      const currentStep = step % 16

      const freq = melody[currentStep]
      if (rng() > 0.25) {
        playMelodyNote(freq, now)
      }

      if (currentStep === 0 || currentStep === 8) {
        playBass(now)
      }

      if (config.hasDrum && 
          config.drumPattern[currentStep] === 1) {
        playDrum(now)
      }

      step++
    }, beatInterval / 4)

    intervalsRef.current = [interval]

    return () => {
      intervalsRef.current.forEach(i => clearInterval(i))
      if (audioCtxRef.current && 
          audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close()
      }
    }
  }, [danceParams, danceStyle, isPlaying])

  return null
}
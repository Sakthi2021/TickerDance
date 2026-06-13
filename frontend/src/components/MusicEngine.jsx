import { useEffect, useRef } from 'react'

export default function MusicEngine({ 
  danceParams, 
  danceStyle,
  isPlaying,
  company,
  startDate,
  endDate,
  isLoading
}) {
  const audioCtxRef = useRef(null)
  const intervalsRef = useRef([])

  useEffect(() => {
    if (!isPlaying || !danceParams || isLoading) return

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

    function hashString(str) {
      let hash = 0
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash
      }
      return Math.abs(hash)
    }

    const seedStr = `${company || 'unknown'}-${startDate || '2024-01-01'}-${endDate || '2024-06-01'}-${danceStyle}`
    const seed = hashString(seedStr)

    function seededRandom(seed) {
      let s = seed
      return function() {
        s = (s * 1664525 + 1013904223) & 0xffffffff
        return (s >>> 0) / 0xffffffff
      }
    }
    const rng = seededRandom(seed)

    const lydianScale = [261.63, 293.66, 329.63, 
      369.99, 392.00, 440.00, 493.88]
    const majorScale = [261.63, 293.66, 329.63,
      349.23, 392.00, 440.00, 493.88]
    const minorScale = [261.63, 293.66, 311.13,
      349.23, 392.00, 415.30, 466.16]
    const phrygianScale = [261.63, 277.18, 311.13,
      349.23, 392.00, 415.30, 466.16]

    let scale
    if (momentum > 0.3) scale = lydianScale
    else if (momentum > 0) scale = majorScale
    else if (momentum > -0.3) scale = minorScale
    else scale = phrygianScale

    const transposeMultiplier = 0.75 + volatility * 0.75
    const transposedScale = scale.map(
      note => note * transposeMultiplier
    )

    const noteCount = Math.round(3 + priceRange * 4)
    const availableNotes = transposedScale.slice(0, noteCount)

    const melody = Array.from({length: 32}, () => {
      const idx = Math.floor(rng() * availableNotes.length)
      return availableNotes[idx]
    })

    const rhythmDensity = 0.2 + volatility * 0.6
    const rhythmPattern = Array.from({length: 32}, () => 
      rng() < rhythmDensity
    )

    const noteDuration = momentum > 0 ? 
      0.3 + momentum * 0.4 :
      0.1 + Math.abs(momentum) * 0.1

    function makeDistortionCurve(amount) {
      const samples = 256
      const curve = new Float32Array(samples)
      for (let i = 0; i < samples; i++) {
        const x = (i * 2) / samples - 1
        curve[i] = ((Math.PI + amount) * x) / 
                   (Math.PI + amount * Math.abs(x))
      }
      return curve
    }

    function createReverb(ctx) {
      const convolver = ctx.createConvolver()
      const length = ctx.sampleRate * 2
      const buffer = ctx.createBuffer(2, length, ctx.sampleRate)
      for (let c = 0; c < 2; c++) {
        const data = buffer.getChannelData(c)
        for (let i = 0; i < length; i++) {
          data[i] = (Math.random() * 2 - 1) * 
                     Math.pow(1 - i / length, 2)
        }
      }
      convolver.buffer = buffer
      return convolver
    }

    const masterGain = ctx.createGain()
    masterGain.gain.setValueAtTime(0, ctx.currentTime)
    masterGain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 2)

    const reverbGain = ctx.createGain()
    reverbGain.gain.value = 0.4
    const dryGain = ctx.createGain()
    dryGain.gain.value = 0.6

    const convolver = createReverb(ctx)

    dryGain.connect(masterGain)
    reverbGain.connect(convolver)
    convolver.connect(masterGain)
    masterGain.connect(ctx.destination)

    const styleConfig = {
      'hip-hop': {
        wave: 'sine',
        distortion: 50,
        hasDrum: true,
        drumPattern: [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],
        bassNote: 65.41
      },
      'ballet': {
        wave: 'triangle',
        distortion: 0,
        hasDrum: false,
        drumPattern: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        bassNote: 0
      },
      'classical': {
        wave: 'triangle',
        distortion: 0,
        hasDrum: false,
        drumPattern: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        bassNote: 87.31
      },
      'robot': {
        wave: 'triangle',
        distortion: 200,
        hasDrum: true,
        drumPattern: [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
        bassNote: 55.00
      },
      'breakdance': {
        wave: 'sine',
        distortion: 100,
        hasDrum: true,
        drumPattern: [1,1,0,1,1,0,1,0,1,1,0,1,1,0,1,1],
        bassNote: 73.42
      }
    }
    const config = styleConfig[danceStyle] || 
                   styleConfig['hip-hop']

    function playMelodyNote(freq, time) {
      const osc1 = ctx.createOscillator()
      const osc2 = ctx.createOscillator()
      const osc3 = ctx.createOscillator()
      const gain = ctx.createGain()
      
      osc1.type = config.wave
      osc2.type = config.wave
      osc3.type = config.wave
      
      osc1.frequency.value = freq
      osc2.frequency.value = freq * 1.003
      osc3.frequency.value = freq * 0.997
      
      osc1.connect(gain)
      osc2.connect(gain)
      osc3.connect(gain)
      
      if (config.distortion > 0) {
        const distortion = ctx.createWaveShaper()
        distortion.curve = makeDistortionCurve(config.distortion)
        gain.connect(distortion)
        distortion.connect(dryGain)
        distortion.connect(reverbGain)
      } else {
        gain.connect(dryGain)
        gain.connect(reverbGain)
      }
      
      gain.gain.setValueAtTime(0, time)
      gain.gain.linearRampToValueAtTime(
        0.12 + volume * 0.08, 
        time + 0.02
      )
      gain.gain.exponentialRampToValueAtTime(
        0.001, 
        time + noteDuration
      )
      
      osc1.start(time)
      osc2.start(time)
      osc3.start(time)
      osc1.stop(time + noteDuration + 0.1)
      osc2.stop(time + noteDuration + 0.1)
      osc3.stop(time + noteDuration + 0.1)
    }

    function playBass(time) {
      if (!config.bassNote) return
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = config.bassNote
      gain.gain.setValueAtTime(0, time)
      gain.gain.linearRampToValueAtTime(
        0.25 + volume * 0.15, time + 0.02
      )
      gain.gain.exponentialRampToValueAtTime(
        0.001, time + 0.5
      )
      osc.connect(gain)
      gain.connect(dryGain)
      gain.connect(reverbGain)
      osc.start(time)
      osc.stop(time + 0.6)
    }

    function playDrum(time) {
      const bufferSize = Math.floor(ctx.sampleRate * 0.08)
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 
                   Math.pow(1 - i / bufferSize, 3)
      }
      const source = ctx.createBufferSource()
      source.buffer = buffer
      const gain = ctx.createGain()
      gain.gain.setValueAtTime(
        0.3 + volatility * 0.2, time
      )
      gain.gain.exponentialRampToValueAtTime(
        0.001, time + 0.08
      )
      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.value = 200 + volatility * 300
      source.connect(filter)
      filter.connect(gain)
      gain.connect(dryGain)
      source.start(time)
      source.stop(time + 0.1)
    }

    function playArpeggio(time) {
      const arpNotes = [65.41, 98.00, 130.81, 146.83]
      arpNotes.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.value = freq
        const delay = time + i * 0.05
        gain.gain.setValueAtTime(0.1, delay)
        gain.gain.exponentialRampToValueAtTime(0.001, delay + 0.08)
        osc.connect(gain)
        gain.connect(dryGain)
        gain.connect(reverbGain)
        osc.start(delay)
        osc.stop(delay + 0.1)
      })
    }

    function playScratch(time) {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(200, time)
      osc.frequency.exponentialRampToValueAtTime(100, time + 0.1)
      gain.gain.setValueAtTime(0.15, time)
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1)
      osc.connect(gain)
      gain.connect(dryGain)
      osc.start(time)
      osc.stop(time + 0.12)
    }

    let step = 0
    const interval = setInterval(() => {
      if (!audioCtxRef.current || ctx.state === 'closed') return
      const now = ctx.currentTime
      const currentStep = step % 32

      if (rhythmPattern && rhythmPattern[currentStep]) {
        const freq = melody[currentStep]
        playMelodyNote(freq, now)
      }

      if (currentStep === 0 || currentStep === 16) {
        playBass(now)
      }

      if (config.hasDrum && (step % 16) < 16 && 
          config.drumPattern[(step % 16)] === 1) {
        playDrum(now)
      }

      if (danceStyle === 'robot' && currentStep % 8 === 0) {
        playArpeggio(now)
      }

      if (danceStyle === 'breakdance' && step % 16 === 6) {
        playScratch(now)
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
  }, [danceParams, danceStyle, isPlaying, company, startDate, endDate, isLoading])

  return null
}
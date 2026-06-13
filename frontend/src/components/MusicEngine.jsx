import { useEffect, useRef } from 'react'

export default function MusicEngine({ volatility, onBeat }) {
  const audioContextRef = useRef(null)
  const oscillatorRef = useRef(null)
  const gainRef = useRef(null)
  
  const bpm = Math.round(40 + volatility * 140)
  const beatInterval = (60 / bpm) * 1000

  useEffect(() => {
    if (!volatility && volatility !== 0) return
    
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
    gainRef.current = audioContextRef.current.createGain()
    gainRef.current.gain.value = 0.1
    gainRef.current.connect(audioContextRef.current.destination)
    
    let lastBeat = Date.now()
    
    const updateTempo = () => {
      if (!audioContextRef.current) return
      
      if (oscillatorRef.current) {
        oscillatorRef.current.stop()
      }
      
      oscillatorRef.current = audioContextRef.current.createOscillator()
      oscillatorRef.current.type = 'sine'
      oscillatorRef.current.frequency.value = 80 + volatility * 40
      oscillatorRef.current.connect(gainRef.current)
      oscillatorRef.current.start()
    }
    
    updateTempo()
    
    const beatTimer = setInterval(() => {
      const now = Date.now()
      if (now - lastBeat >= beatInterval) {
        lastBeat = now
        onBeat?.()
      }
    }, 50)
    
    return () => {
      clearInterval(beatTimer)
      if (oscillatorRef.current) {
        oscillatorRef.current.stop()
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [volatility, beatInterval])

  return null
}
import { useEffect, useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useFBX, useAnimations, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

const FBX_MAP = {
  'hip-hop': '/dancer.fbx',
  'ballet': '/Ballet.fbx',
  'classical': '/Classical.fbx',
  'robot': '/Robot.fbx',
  'breakdance': '/Breakdance.fbx'
}

function DancerModel({ danceStyle, speed = 1, color = '#00ff88' }) {
  const group = useRef()
  const fbxPath = FBX_MAP[danceStyle] || '/dancer.fbx'
  const fbx = useFBX(fbxPath)
  const { actions, names } = useAnimations(fbx.animations, group)

  useEffect(() => {
    if (!fbx) return
    
    const box = new THREE.Box3().setFromObject(fbx)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    const desiredHeight = 4
    const scale = desiredHeight / maxDim
    
    fbx.scale.setScalar(scale)
    fbx.position.set(
      -center.x * scale,
      -box.min.y * scale - desiredHeight * 0.5,
      -center.z * scale
    )
    
    fbx.traverse((child) => {
      if (child.isMesh) {
        if (Array.isArray(child.material)) {
          child.material.forEach(m => {
            m.color.set(color)
            m.emissive.set(color)
            m.emissiveIntensity = 0.2
          })
        } else {
          child.material.color.set(color)
          child.material.emissive.set(color)
          child.material.emissiveIntensity = 0.2
        }
      }
    })
  }, [fbx, color])

  useEffect(() => {
    if (names.length > 0) {
      Object.values(actions).forEach(a => a?.stop())
      const action = actions[names[0]]
      if (action) {
        action.reset().play()
        action.timeScale = speed
      }
    }
    return () => {
      Object.values(actions).forEach(a => a?.stop())
    }
  }, [actions, names, speed, danceStyle])

  return (
    <group ref={group}>
      <primitive object={fbx} />
    </group>
  )
}

export default function Dancer({ 
  danceStyle = 'hip-hop', 
  speed = 1, 
  color = '#00ff88' 
}) {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '500px' }}>
      <Canvas
        camera={{ position: [0, 2, 6], fov: 60, near: 0.1, far: 1000 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={1} />
        <directionalLight position={[5, 10, 5]} intensity={2} />
        <pointLight position={[0, 5, 3]} color={color} intensity={3} />
        <pointLight position={[0, -2, 3]} color="#00d4ff" intensity={1} />
        <Suspense fallback={null}>
          <DancerModel
            key={danceStyle}
            danceStyle={danceStyle}
            speed={speed}
            color={color}
          />
        </Suspense>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 1.8}
        />
      </Canvas>
    </div>
  )
}
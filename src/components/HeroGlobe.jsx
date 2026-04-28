import { Box } from '@mantine/core'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Globe from 'react-globe.gl'
import { useUIStore } from '../store/useUIStore'

const POI_DATA = [
  { name: 'Taj Mahal', lat: 27.1751, lng: 78.0421, code: 'IND', color: '#f59e0b' },
  { name: 'Pyramids of Giza', lat: 29.9792, lng: 31.1342, code: 'EGY', color: '#f59e0b' },
  { name: 'Eiffel Tower', lat: 48.8584, lng: 2.2945, code: 'FRA', color: '#3b82f6' },
  { name: 'Mount Everest', lat: 27.9881, lng: 86.9250, code: 'NPL', color: '#e2e8f0' },
  { name: 'Colosseum', lat: 41.8902, lng: 12.4922, code: 'ITA', color: '#f59e0b' },
  { name: 'Statue of Liberty', lat: 40.6892, lng: -74.0445, code: 'USA', color: '#3b82f6' },
  { name: 'Christ the Redeemer', lat: -22.9519, lng: -43.2105, code: 'BRA', color: '#10b981' },
  { name: 'Machu Picchu', lat: -13.1631, lng: -72.5450, code: 'PER', color: '#10b981' },
  { name: 'Sydney Opera House', lat: -33.8568, lng: 151.2153, code: 'AUS', color: '#3b82f6' },
  { name: 'Great Wall of China', lat: 40.4319, lng: 116.5704, code: 'CHN', color: '#ef4444' },
  { name: 'Burj Khalifa', lat: 25.1972, lng: 55.2744, code: 'ARE', color: '#8b5cf6' },
  { name: 'Chichen Itza', lat: 20.6843, lng: -88.5678, code: 'MEX', color: '#f59e0b' },
  { name: 'Petra', lat: 30.3285, lng: 35.4444, code: 'JOR', color: '#f59e0b' },
  { name: 'Mount Fuji', lat: 35.3606, lng: 138.7274, code: 'JPN', color: '#ec4899' },
  { name: 'Stonehenge', lat: 51.1789, lng: -1.8262, code: 'GBR', color: '#94a3b8' },
  { name: 'Niagara Falls', lat: 43.0962, lng: -79.0377, code: 'CAN', color: '#06b6d4' },
  { name: 'Grand Canyon', lat: 36.1069, lng: -112.1129, code: 'USA', color: '#ea580c' },
  { name: 'Angkor Wat', lat: 13.4125, lng: 103.8670, code: 'KHM', color: '#f59e0b' },
  { name: 'Sagrada Familia', lat: 41.4036, lng: 2.1744, code: 'ESP', color: '#d946ef' }
]

export function HeroGlobe() {
  const navigate = useNavigate()
  const themeMode = useUIStore((state) => state.themeMode)
  const isDark = themeMode === 'dark'
  const globeRef = useRef()
  const [globeWidth, setGlobeWidth] = useState(500)
  const containerRef = useRef(null)

  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = true
      globeRef.current.controls().autoRotateSpeed = 1.0
      globeRef.current.controls().enableZoom = false

      // Inject subtle lighting to fix darkness natively
      const scene = globeRef.current.scene()
      const ambientLight = scene.children.find(c => c.type === 'AmbientLight')
      if (ambientLight) ambientLight.intensity = 1.2

      const directionalLight = scene.children.find(c => c.type === 'DirectionalLight')
      if (directionalLight) directionalLight.intensity = 1.5
    }
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setGlobeWidth(containerRef.current.offsetWidth)
      }
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    setTimeout(handleResize, 100)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const imageUrl = "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
  const bumpUrl = "//unpkg.com/three-globe/example/img/earth-topology.png"

  const handleLabelClick = (labelData) => {
    if (labelData && labelData.code) {
      navigate(`/country/${labelData.code}`)
    }
  }

  return (
    <Box
      w="100%"
      display="flex"
      style={{ justifyContent: 'center', alignItems: 'center', padding: '2rem 0' }}
    >
      <div
        ref={containerRef}
        style={{
          width: '100%',
          maxWidth: '100%',
          aspectRatio: '1 / 1',
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'grab',
          outline: 'none',
          border: 'none',
          WebkitTapHighlightColor: 'transparent'
        }}
      >
        <Globe
          ref={globeRef}
          width={globeWidth}
          height={globeWidth}
          globeImageUrl={imageUrl}
          bumpImageUrl={bumpUrl}
          backgroundColor="rgba(0,0,0,0)"
          atmosphereColor= "#818cf8" 
          atmosphereAltitude={isDark ? 0.35 : 0.3}

          /* Landmarks (Labels) config */
          labelsData={POI_DATA}
          labelLat={d => d.lat}
          labelLng={d => d.lng}
          labelText={d => d.name}
          labelSize={1.4}
          labelDotRadius={0.4}
          labelColor={() => 'rgba(255, 255, 255, 0.95)'}
          labelResolution={2}
          onLabelClick={handleLabelClick}

          /* Ripple effects (Rings) config */
          ringsData={POI_DATA}
          ringLat={d => d.lat}
          ringLng={d => d.lng}
          ringColor={d => d.color}
          ringMaxRadius={4}
          ringPropagationSpeed={1.2}
          ringRepeatPeriod={800}
        />
      </div>
    </Box>
  )
}

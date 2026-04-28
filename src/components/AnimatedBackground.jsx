import { Box } from '@mantine/core'
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, memo } from 'react'
import { useUIStore } from '../store/useUIStore'

const BackgroundRenderer = memo(({ isDark }) => {
  const { scrollY } = useScroll()

  // Parallax effects tied directly to scroll
  const y1 = useTransform(scrollY, [0, 2000], [0, -150])
  const y2 = useTransform(scrollY, [0, 2000], [0, 200])
  const y3 = useTransform(scrollY, [0, 2000], [0, -100])

  // Spotlight mapping outside React state limits re-renders
  const mouseX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 0)
  const mouseY = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 0)
  const smoothX = useSpring(mouseX, { damping: 50, stiffness: 400 })
  const smoothY = useSpring(mouseY, { damping: 50, stiffness: 400 })

  useEffect(() => {
    let ticking = false
    const handleMouseMove = (e) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          mouseX.set(e.clientX)
          mouseY.set(e.clientY)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  // Muted color palette for dark mode, vibrant soft for light mode
  const color1 = isDark ? '#0f172a' : '#e0f2fe'
  const color2 = isDark ? '#1e293b' : '#f3e8ff'
  const color3 = isDark ? '#334155' : '#cffafe'

  return (
    <Box
      pos="fixed"
      inset={0}
      style={{
        zIndex: 0,
        background: isDark ? '#020408' : '#fafafa',
        overflow: 'hidden',
        pointerEvents: 'none'
      }}
    >
      {/* PERFORMANCE FIX: Removed expensive filter: blur() completely */}
      <motion.div
        animate={{ scale: [1, 1.2, 0.9, 1], rotate: [0, 90, 180, 360] }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute', top: '-40%', left: '-20%',
          width: '120vw', height: '120vw', borderRadius: '50%',
          background: `radial-gradient(circle, ${color1} 0%, transparent 60%)`,
          y: y1
        }}
      />
      <motion.div
        animate={{ scale: [1, 1.1, 0.8, 1], rotate: [360, 180, 0] }}
        transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute', bottom: '-20%', right: '-30%',
          width: '100vw', height: '100vw', borderRadius: '50%',
          background: `radial-gradient(circle, ${color2} 0%, transparent 60%)`,
          y: y2
        }}
      />
      <motion.div
        animate={{ scale: [0.9, 1.3, 1], x: ['0%', '10%', '-10%', '0%'] }}
        transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute', top: '10%', left: '10%',
          width: '110vw', height: '110vw', borderRadius: '50%',
          background: `radial-gradient(circle, ${color3} 0%, transparent 55%)`,
          y: y3, opacity: 0.8
        }}
      />


      {/* Interactive Subtle Particle Field (Dots) */}
      <motion.div
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', inset: 0,
          backgroundImage: isDark
            ? 'radial-gradient(1px 1px at 10% 20%, #ffffff, transparent), radial-gradient(1px 1px at 30% 90%, #ffffff, transparent), radial-gradient(1.5px 1.5px at 70% 30%, rgba(255,255,255,0.6), transparent), radial-gradient(1px 1px at 85% 75%, #ffffff, transparent), radial-gradient(1px 1px at 50% 50%, #ffffff, transparent)'
            : 'radial-gradient(1px 1px at 10% 20%, #000000, transparent), radial-gradient(1px 1px at 30% 90%, #000000, transparent), radial-gradient(1.5px 1.5px at 70% 30%, rgba(0,0,0,0.4), transparent), radial-gradient(1px 1px at 85% 75%, #000000, transparent), radial-gradient(1px 1px at 50% 50%, #000000, transparent)',
          backgroundSize: '120px 120px', // Significantly increased density
          opacity: isDark ? 0.8 : 0.4
        }}
      />

      {/* Performance Optimized Spotlight Cursor WITHOUT filter: blur */}
      <motion.div
        style={{
          position: 'absolute', left: smoothX, top: smoothY,
          translateX: '-50%', translateY: '-50%',
          width: '800px', height: '800px',
          background: isDark
            ? 'radial-gradient(circle, rgba(255, 255, 255, 0.04) 0%, transparent 50%)'
            : 'radial-gradient(circle, rgba(0, 0, 0, 0.03) 0%, transparent 50%)',
          borderRadius: '50%', zIndex: 10
        }}
      />
    </Box>
  )
})
BackgroundRenderer.displayName = 'BackgroundRenderer'

export function AnimatedBackground() {
  const themeMode = useUIStore((state) => state.themeMode)
  return <BackgroundRenderer isDark={themeMode === 'dark'} />
}



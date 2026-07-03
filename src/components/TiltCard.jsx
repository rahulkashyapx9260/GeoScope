import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'

const MotionLink = motion.create ? motion.create(Link) : motion(Link); // handle different framer-motion versions

export function TiltCard({ children, to, className, onMouseEnter, onMouseLeave, onClick }) {
  const ref = useRef(null)
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Instant 1:1 mapping (no spring delay)
  const rotateX = useTransform(y, [-0.5, 0.5], [10, -10])
  const rotateY = useTransform(x, [-0.5, 0.5], [-10, 10])

  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = (e) => {
    setIsHovered(false)
    x.set(0)
    y.set(0)
    if (onMouseLeave) onMouseLeave(e)
  }

  const handleMouseEnter = (e) => {
    setIsHovered(true)
    if (onMouseEnter) onMouseEnter(e)
  }

  const Component = to ? MotionLink : motion.div

  return (
    <Component
      to={to}
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onClick={onClick}
      style={{
        rotateX,
        rotateY,
        perspective: 1200,
        transformStyle: 'preserve-3d',
        zIndex: isHovered ? 10 : 1,
      }}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.1, ease: 'easeOut' }}
    >
      {children}
    </Component>
  )
}

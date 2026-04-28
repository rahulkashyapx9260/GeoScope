import { useEffect, useState } from 'react'

export function useCountUp(value, duration = 1.4) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const target = value || 0
    const start = performance.now()
    const startValue = 0

    let rafId
    const tick = (now) => {
      const progress = Math.min((now - start) / (duration * 1000), 1)
      const eased = 1 - (1 - progress) ** 3
      setCount(Math.round(startValue + (target - startValue) * eased))

      if (progress < 1) {
        rafId = requestAnimationFrame(tick)
      }
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [value, duration])

  return count
}

import { useMemo } from 'react'
import { TiltCard } from './TiltCard'
import { Box, Group, Title, Text, ActionIcon } from '@mantine/core'
import { IconArrowUpRight, IconUsers, IconRuler2, IconStar, IconMap } from '@tabler/icons-react'
import { useUIStore } from '../store/useUIStore'
import './BentoGrid.css'

export function BentoGrid({ countries }) {
  const setHoveredCountry = useUIStore((state) => state.setHoveredCountry)
  const highlights = useMemo(() => {
    if (!countries || countries.length === 0) return null

    // Find highest population
    const popSorted = [...countries].sort((a, b) => (b.population || 0) - (a.population || 0))
    const highestPop = popSorted[0]

    // Find largest by area
    const areaSorted = [...countries].sort((a, b) => (b.area || 0) - (a.area || 0))
    const largestArea = areaSorted[0]

    // Find smallest legitimate country by area (exclude 0 and micro-anomalies maybe, use > 10, or just standard sort)
    const validAreaSorted = areaSorted.filter(c => c.area > 5 && c.cca3 !== largestArea?.cca3 && c.cca3 !== highestPop?.cca3)
    const smallestArea = validAreaSorted[validAreaSorted.length - 1]

    // Random Pick
    const usedCodes = new Set([highestPop?.cca3, largestArea?.cca3, smallestArea?.cca3])
    const available = countries.filter(c => !usedCodes.has(c.cca3))
    const randomPick = available[10 % available.length] || available[0]

    return { highestPop, largestArea, smallestArea, randomPick }
  }, [countries])

  if (!highlights || !highlights.highestPop) return null

  const { highestPop, largestArea, smallestArea, randomPick } = highlights

  return (
    <Box className="bento-container" mb="xl">
      {/* 1. Largest Area (Medium - Wide) */}
      <TiltCard 
        to={`/country/${largestArea.cca3}`} 
        className="bento-card bento-wide"
        onMouseEnter={() => setHoveredCountry({ name: largestArea.name.common, flag: largestArea.flags.svg, code: largestArea.cca3 })}
        onMouseLeave={() => setHoveredCountry(null)}
      >        <img src={largestArea.flags.svg} alt={largestArea.name.common} className="bento-card-bg" />
        <div className="bento-card-overlay" />
        <div className="bento-card-content">
          <Group justify="space-between" align="flex-start" mb="auto">
            <ActionIcon variant="light" color="white" radius="xl" size="md">
              <IconMap size={16} />
            </ActionIcon>
            <IconArrowUpRight size={20} color="rgba(255,255,255,0.7)" />
          </Group>
          <Box mt="auto">
            <Text size="sm" c="rgba(255,255,255,0.7)" fw={600} style={{ letterSpacing: 1 }}>LARGEST NATION</Text>
            <Title order={2} style={{ color: 'white' }}>{largestArea.name.common}</Title>
            <Group gap="xs" mt={4}>
              <IconRuler2 size={14} color="rgba(255,255,255,0.7)" />
              <Text size="sm" style={{ color: 'rgba(255,255,255,0.9)' }}>
                {largestArea.area.toLocaleString()} km²
              </Text>
            </Group>
          </Box>
        </div>
      </TiltCard>

      {/* 2. Most Populated (Large Block) */}
      <TiltCard 
        to={`/country/${highestPop.cca3}`} 
        className="bento-card bento-large"
        onMouseEnter={() => setHoveredCountry({ name: highestPop.name.common, flag: highestPop.flags.svg, code: highestPop.cca3 })}
        onMouseLeave={() => setHoveredCountry(null)}
      >        <img src={highestPop.flags.svg} alt={highestPop.name.common} className="bento-card-bg" />
        <div className="bento-card-overlay" />
        <div className="bento-card-content" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Group justify="space-between" align="flex-start">
            <ActionIcon variant="filled" color="indigo" radius="xl" size="lg">
              <IconUsers size={20} />
            </ActionIcon>
            <IconArrowUpRight size={24} color="rgba(255,255,255,0.7)" />
          </Group>
          <Box mt="auto">
            <Text size="sm" c="rgba(255,255,255,0.7)" fw={600} style={{ letterSpacing: 1 }}>MOST POPULATED</Text>
            <Title order={1} style={{ color: 'white', fontSize: '2.5rem', lineHeight: 1.1, marginBottom: 8 }}>
              {highestPop.name.common}
            </Title>
            <Text size="md" style={{ color: 'rgba(255,255,255,0.9)' }}>
              Home to {highestPop.population.toLocaleString()} people across {highestPop.region}.
            </Text>
          </Box>
        </div>
      </TiltCard>

      {/* 3. Smallest Area (Small Square) */}
      {smallestArea && (
        <TiltCard 
          to={`/country/${smallestArea.cca3}`} 
          className="bento-card bento-square"
          onMouseEnter={() => setHoveredCountry({ name: smallestArea.name.common, flag: smallestArea.flags.svg, code: smallestArea.cca3 })}
          onMouseLeave={() => setHoveredCountry(null)}
        >          <img src={smallestArea.flags.svg} alt={smallestArea.name.common} className="bento-card-bg" />
          <div className="bento-card-overlay" />
          <div className="bento-card-content">
            <Group justify="space-between" align="flex-start" mb="xs">
              <Text size="xs" fw={700} style={{ letterSpacing: 1, color: 'rgba(255,255,255,0.7)' }}>SMALLEST</Text>
              <IconArrowUpRight size={18} color="rgba(255,255,255,0.7)" />
            </Group>
            <Box mt="auto">
              <Title order={3} style={{ color: 'white', lineHeight: 1.2 }}>{smallestArea.name.common}</Title>
              <Text size="xs" mt={4} style={{ color: 'rgba(255,255,255,0.8)' }}>
                {smallestArea.area.toLocaleString()} km²
              </Text>
            </Box>
          </div>
        </TiltCard>
      )}

      {/* 4. Random Pick / Highlight (Small Square) */}
      {randomPick && (
        <TiltCard 
          to={`/country/${randomPick.cca3}`} 
          className="bento-card bento-square"
          onMouseEnter={() => setHoveredCountry({ name: randomPick.name.common, flag: randomPick.flags.svg, code: randomPick.cca3 })}
          onMouseLeave={() => setHoveredCountry(null)}
        >          <img src={randomPick.flags.svg} alt={randomPick.name.common} className="bento-card-bg" />
          <div className="bento-card-overlay" />
          <div className="bento-card-content">
            <Group justify="space-between" align="flex-start" mb="xs">
              <Text size="xs" fw={700} style={{ letterSpacing: 1, color: '#f59e0b' }}>DISCOVER</Text>
              <IconStar size={16} color="#f59e0b" fill="#f59e0b" />
            </Group>
            <Box mt="auto">
              <Title order={3} style={{ color: 'white', lineHeight: 1.2 }}>{randomPick.name.common}</Title>
              <Text size="xs" mt={4} style={{ color: 'rgba(255,255,255,0.8)' }}>
                {randomPick.region}
              </Text>
            </Box>
          </div>
        </TiltCard>
      )}
    </Box>
  )
}

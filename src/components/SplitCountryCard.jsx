import { Box, Group, Highlight, Text, Title } from '@mantine/core'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { IconArrowUpRight, IconUsers, IconBuilding } from '@tabler/icons-react'
import { useUIStore } from '../store/useUIStore'
import { parseSearchQuery } from '../utils/universalSearch'
import './CountryCard.css'

function formatPopulation(value) {
  return new Intl.NumberFormat().format(value || 0)
}

export function SplitCountryCard({ country, index }) {
  const setHoveredCountry = useUIStore((state) => state.setHoveredCountry)
  const setSelectedCountry = useUIStore((state) => state.setSelectedCountry)
  const searchTerm = useUIStore((state) => state.searchTerm)
  const { tokens } = parseSearchQuery(searchTerm)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.4) }}
      onMouseEnter={() =>
        setHoveredCountry({
          name: country.name.common,
          flag: country.flags.svg,
          code: country.cca3,
        })
      }
      onMouseLeave={() => setHoveredCountry(null)}
      onClick={() =>
        setSelectedCountry({
          name: country.name.common,
          flag: country.flags.svg,
          code: country.cca3,
        })
      }
      style={{ height: '100%' }}
    >
      <Link
        to={`/country/${country.cca3}`}
        className="premium-glass-card"
      >
        <div 
          className="premium-glass-banner" 
          style={{ backgroundImage: `url(${country.flags.svg})` }} 
        />
        
        <div className="premium-glass-content">
          <Group justify="space-between" align="flex-start" mb="sm">
            <Box>
              <Title order={4} fw={700} style={{ letterSpacing: -0.5, marginBottom: 2 }}>
                <Highlight highlight={tokens} component="span">
                  {country.name.common}
                </Highlight>
              </Title>
              <Text size="xs" c="dimmed" fw={600} style={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                {country.region || 'Region'}
              </Text>
            </Box>
            <Box className="premium-glass-action">
              <IconArrowUpRight size={18} />
            </Box>
          </Group>

          <Box mt="auto" pt="md">
            <Group gap="xs" mb={8} wrap="nowrap">
              <IconUsers size={16} opacity={0.6} />
              <Text size="sm" fw={500}>
                {formatPopulation(country.population)}
              </Text>
            </Group>
            
            <Group gap="xs" wrap="nowrap">
              <IconBuilding size={16} opacity={0.6} />
              <Text size="sm" fw={500}>
                <Highlight highlight={tokens} component="span">
                  {country.capital?.[0] || 'N/A'}
                </Highlight>
              </Text>
            </Group>
          </Box>
        </div>
      </Link>
    </motion.div>
  )
}

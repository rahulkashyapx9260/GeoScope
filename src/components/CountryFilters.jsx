import { Group, Paper, Select, TextInput } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'
import { motion } from 'framer-motion'
import { useUIStore } from '../store/useUIStore'

const regions = ['All', 'Africa', 'Americas', 'Asia', 'Europe', 'Oceania']

export function CountryFilters() {
  const searchTerm = useUIStore((state) => state.searchTerm)
  const region = useUIStore((state) => state.region)
  const setSearchTerm = useUIStore((state) => state.setSearchTerm)
  const setRegion = useUIStore((state) => state.setRegion)

  return (
    <Paper className="glass-panel" p="md" radius="xl">
      <Group justify="space-between" align="end" gap="md" wrap="wrap">
        <motion.div
          style={{ flex: 1, minWidth: 260 }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <TextInput
            aria-label="Search countries by name"
            placeholder="Search for a country..."
            leftSection={<IconSearch size={18} />}
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.currentTarget.value)}
            className="filter-input"
            radius="xl"
            size="md"
          />
        </motion.div>
        <motion.div
          style={{ minWidth: 220, width: '100%', maxWidth: 260 }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Select
            aria-label="Filter countries by region"
            data={regions}
            value={region}
            onChange={(value) => setRegion(value || 'All')}
            placeholder="Filter by region"
            className="filter-select"
            radius="xl"
            size="md"
          />
        </motion.div>
      </Group>
    </Paper>
  )
}

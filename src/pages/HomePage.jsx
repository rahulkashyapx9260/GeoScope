import { useMemo, useState, useEffect } from 'react'
import { Button, Group, Paper, Stack, Text, Title, Badge } from '@mantine/core'
import { motion } from 'framer-motion'
import { useCountries } from '../hooks/useCountries'
import { useUIStore } from '../store/useUIStore'
import { CountrySplitList } from '../components/CountrySplitList'
import { CountrySkeletonGrid } from '../components/CountrySkeletonGrid'
import { BentoGrid } from '../components/BentoGrid'
import { ErrorState } from '../components/ErrorState'
import { NoResults } from '../components/NoResults'
import {
  buildCountryDocuments,
  createCountryFuse,
  parseSearchQuery,
  universalCountrySearch,
} from '../utils/universalSearch'
import { SimpleGrid, Box } from '@mantine/core'
import { HeroGlobe } from '../components/HeroGlobe'

export default function HomePage() {
  const searchTerm = useUIStore((state) => state.searchTerm)
  const region = useUIStore((state) => state.region)
  const sortBy = useUIStore((state) => state.sortBy)
  const populationOrder = useUIStore((state) => state.populationOrder)
  const { data: countries = [], isLoading, isError, error, refetch } = useCountries()
  const [displayCount, setDisplayCount] = useState(16)

  // Reset display count when search filters change
  useEffect(() => {
    setDisplayCount(16)
  }, [searchTerm, region, sortBy, populationOrder])

  const filteredCountries = useMemo(() => {
    const docs = buildCountryDocuments(countries)
    const fuse = createCountryFuse(docs)
    const universal = universalCountrySearch({
      documents: docs,
      fuse,
      query: searchTerm,
      regionFilter: region,
    }).map((d) => d._raw)

    const filtered = universal

    if (populationOrder === 'highest') {
      filtered.sort((a, b) => (b.population || 0) - (a.population || 0))
      return filtered
    }

    if (populationOrder === 'lowest') {
      filtered.sort((a, b) => (a.population || 0) - (b.population || 0))
      return filtered
    }

    filtered.sort((a, b) =>
      sortBy === 'name-desc'
        ? b.name.common.localeCompare(a.name.common)
        : a.name.common.localeCompare(b.name.common),
    )
    return filtered
  }, [countries, searchTerm, region, sortBy, populationOrder])

  const queryMeta = useMemo(() => parseSearchQuery(searchTerm), [searchTerm])
  const isPristine = !searchTerm && region === 'All' && sortBy === 'name-asc' && populationOrder === 'none'

  return (
    <Stack gap={{ base: 'lg', md: 'xl' }} pb="xl" id="home">

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl" style={{ alignItems: 'center' }}>
            <Stack gap="md" justify="center" h="100%">
              <Title className="hero-title" order={1} fz={{ base: 34, md: 56 }}>
                The World Context
                <br />
                <span className="gradient-text">Beautifully. Instantly.</span>
              </Title>
              <Text c="dimmed" maw={620}>
                Interact with the globe and browse countries by region, population, and capital with a clean global explorer.
              </Text>
              <Group>
                <Button
                  component="a"
                  href="#explore"
                  size="md"
                  radius="xl"
                  variant="gradient"
                  gradient={{ from: 'indigo', to: 'grape' }}
                >
                  Explore Countries
                </Button>
              </Group>
            </Stack>
            <HeroGlobe />
          </SimpleGrid>
        </motion.div>


      <div id="explore" />
      {isLoading && <CountrySkeletonGrid />}
      {isError && <ErrorState message={error.message} onRetry={refetch} />}
      {!isLoading && !isError && filteredCountries.length === 0 && <NoResults />}
      {!isLoading && !isError && filteredCountries.length > 0 && (
        <Box px={{ base: '0', md: 'md' }}>
          <Stack gap="md">
            <div>
              <Title order={2} fz={{ base: 24, md: 30 }}>
                Explore Countries
              </Title>
              <Text c="dimmed" size="sm">
                {queryMeta.tokens.length || queryMeta.minPopulation != null
                  ? `Searching: ${queryMeta.raw}`
                  : 'A seamless list of nations, instantly searchable.'}
              </Text>
            </div>
            
            {isPristine && <BentoGrid countries={countries} />}

            <CountrySplitList countries={filteredCountries.slice(0, displayCount)} />
            
            {filteredCountries.length > displayCount && (
              <Group justify="center" mt="xl">
                <Button 
                  size="md" 
                  radius="xl" 
                  variant="light" 
                  onClick={() => setDisplayCount((v) => v + 16)}
                >
                  Load More Countries
                </Button>
              </Group>
            )}
          </Stack>
        </Box>
      )}
    </Stack>
  )
}

import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Badge,
  Button,
  Card,
  Group,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Tabs,
  Text,
  TextInput,
  Title,
  Skeleton,
} from '@mantine/core'
import { IconArrowLeft, IconBuilding, IconMapPin, IconPhoto, IconUsers, IconWorld } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useCountryByCode } from '../hooks/useCountryByCode'
import { useStateCities } from '../hooks/useHierarchyData'
import { AppBreadcrumbs } from '../components/AppBreadcrumbs'
import { ErrorState } from '../components/ErrorState'
import { fetchWikipediaTopicContent } from '../services/countryEnrichmentApi'
import { fetchCityDetailsForList } from '../services/hierarchyApi'
import { MediaGallery } from '../components/MediaGallery'
import { fetchWikipediaMedia } from '../services/countryEnrichmentApi'

function safeDecode(value) {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

export default function StatePage() {
  const { countryCode, stateName } = useParams()
  const decodedStateName = safeDecode(stateName)
  const [search, setSearch] = useState('')
  const [sortByPopulation, setSortByPopulation] = useState('name-asc')
  const { data: country, isLoading: isCountryLoading } = useCountryByCode(countryCode)
  const countryName = country?.name?.common
  const citiesQuery = useStateCities(countryName, decodedStateName)
  const wikiQuery = useQuery({
    queryKey: ['state-wiki', decodedStateName, countryName],
    queryFn: () => fetchWikipediaTopicContent(`${decodedStateName}, ${countryName}`),
    enabled: Boolean(countryName && decodedStateName),
    staleTime: 1000 * 60 * 30,
    retry: 0,
  })
  const cityDetailsQuery = useQuery({
    queryKey: ['state-city-details', country?.cca2, decodedStateName, citiesQuery.data],
    queryFn: () => fetchCityDetailsForList(country?.cca2, citiesQuery.data || []),
    enabled: Boolean(country?.cca2 && citiesQuery.data?.length),
    staleTime: 1000 * 60 * 30,
    retry: 0,
  })
  const mediaQuery = useQuery({
    queryKey: ['state-media', decodedStateName, countryName],
    queryFn: () => fetchWikipediaMedia(`${decodedStateName}, ${countryName}`),
    enabled: Boolean(decodedStateName && countryName),
    staleTime: 1000 * 60 * 60,
    retry: 0,
  })

  const cities = useMemo(() => {
    const raw = citiesQuery.data || []
    const detailsByName = new Map((cityDetailsQuery.data || []).map((d) => [d.name.toLowerCase(), d]))
    const list = raw
      .filter((city) => city.toLowerCase().includes(search.toLowerCase().trim()))
      .map((city) => ({
        name: city,
        details: detailsByName.get(city.toLowerCase()) || null,
      }))

    if (sortByPopulation === 'pop-high') {
      return list.sort((a, b) => (b.details?.population || 0) - (a.details?.population || 0))
    }
    if (sortByPopulation === 'pop-low') {
      return list.sort((a, b) => (a.details?.population || 0) - (b.details?.population || 0))
    }
    if (sortByPopulation === 'name-desc') {
      return list.sort((a, b) => b.name.localeCompare(a.name))
    }
    return list.sort((a, b) => a.name.localeCompare(b.name))
  }, [citiesQuery.data, cityDetailsQuery.data, search, sortByPopulation])

  if (isCountryLoading || citiesQuery.isLoading) {
    return (
      <Stack gap="lg">
        <Skeleton height={20} width={300} />
        <Skeleton height={36} width={150} />
        <Skeleton height={200} radius="md" />
        <Skeleton height={40} />
        <Skeleton height={300} radius="md" />
      </Stack>
    )
  }

  if (citiesQuery.isError) {
    return <ErrorState message="Unable to load cities for this state." onRetry={citiesQuery.refetch} />
  }

  return (
    <Stack gap="lg">
      <AppBreadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: country?.name?.common || 'Country', to: `/country/${countryCode}` },
          { label: decodedStateName },
        ]}
      />
      <Group>
        <Button component={Link} to={`/country/${countryCode}`} leftSection={<IconArrowLeft size={16} />}>
          Back to Country
        </Button>
      </Group>
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card className="glass-panel" p="lg" radius="md">
          <Stack>
            <Group justify="space-between" align="start">
              <div>
                <Title order={1}>{decodedStateName}</Title>
                <Text c="dimmed">{country?.name?.common || 'Country'}</Text>
              </div>
              <Badge variant="light">{cities.length} cities</Badge>
            </Group>
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
              <Paper className="glass-panel" p="sm" radius="md">
                <Text size="xs" c="dimmed">
                  State Name
                </Text>
                <Text fw={700}>{decodedStateName}</Text>
              </Paper>
              <Paper className="glass-panel" p="sm" radius="md">
                <Text size="xs" c="dimmed">
                  Country
                </Text>
                <Text fw={700}>{country?.name?.common || 'Data not available'}</Text>
              </Paper>
            </SimpleGrid>
          </Stack>
        </Card>
      </motion.div>

      <Tabs defaultValue="overview" radius="md">
        <Tabs.List>
          <Tabs.Tab value="overview">Overview</Tabs.Tab>
          <Tabs.Tab value="cities">Cities</Tabs.Tab>
          <Tabs.Tab value="media" leftSection={<IconPhoto size={16} />}>
            Media
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="overview" pt="md">
          <Paper className="glass-panel" p="lg" radius="md">
            <Stack gap="md">
              <Title order={3}>About State</Title>
              <Text c="dimmed">
                {wikiQuery.isSuccess ? wikiQuery.data.summary : 'Data not available'}
              </Text>
              <Title order={4}>Background</Title>
              <Text c="dimmed">
                {wikiQuery.isSuccess ? wikiQuery.data.history : 'Data not available'}
              </Text>
            </Stack>
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="cities" pt="md">
          <Paper className="glass-panel" p="lg" radius="md">
            <Stack>
              <Group grow>
                <TextInput
                  aria-label="Search cities"
                  placeholder="Search cities..."
                  value={search}
                  onChange={(event) => setSearch(event.currentTarget.value)}
                />
                <Select
                  aria-label="Sort cities"
                  value={sortByPopulation}
                  onChange={(value) => setSortByPopulation(value || 'name-asc')}
                  data={[
                    { value: 'name-asc', label: 'A-Z' },
                    { value: 'name-desc', label: 'Z-A' },
                    { value: 'pop-high', label: 'Population high-low' },
                    { value: 'pop-low', label: 'Population low-high' },
                  ]}
                />
              </Group>
              {cities.length > 0 ? (
                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
                  {cities.map((city) => (
                    <Paper key={city.name} className="glass-panel" p="md" radius="md">
                      <Stack gap={4}>
                        <Group justify="space-between" align="center">
                          <Text fw={700}>{city.name}</Text>
                          <IconMapPin size={16} />
                        </Group>
                        <Text size="sm" c="dimmed">
                          <IconUsers size={14} style={{ marginRight: 6 }} />
                          Population:{' '}
                          {city.details?.population
                            ? city.details.population.toLocaleString()
                            : 'Data not available'}
                        </Text>
                        <Text size="sm" c="dimmed">
                          <IconWorld size={14} style={{ marginRight: 6 }} />
                          Region: {city.details?.region || 'Data not available'}
                        </Text>
                        <Link
                          to={`/country/${countryCode}/state/${encodeURIComponent(decodedStateName)}/city/${encodeURIComponent(
                            city.name,
                          )}`}
                          className="inline-link"
                        >
                          <IconMapPin size={14} style={{ marginRight: 6 }} />
                          View city details
                        </Link>
                      </Stack>
                    </Paper>
                  ))}
                </SimpleGrid>
              ) : (
                <Text c="dimmed">Data not available</Text>
              )}
            </Stack>
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="media" pt="md">
          <MediaGallery
            title={`Media • ${decodedStateName}`}
            images={mediaQuery.data?.images || []}
            videos={mediaQuery.data?.videos || []}
          />
        </Tabs.Panel>
      </Tabs>
    </Stack>
  )
}

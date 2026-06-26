import { Link, useParams } from 'react-router-dom'
import {
  Badge,
  Button,
  Card,
  Group,
  Image,
  List,
  Paper,
  SimpleGrid,
  Select,
  Stack,
  Tabs,
  TextInput,
  Text,
  Title,
  Skeleton,
} from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  IconArrowLeft,
  IconArrowRight,
  IconBuilding,
  IconFlag,
  IconMap,
  IconMapPin,
  IconRuler2,
  IconUsers,
  IconWorld,
  IconPhoto,
} from '@tabler/icons-react'
import { useEffect, useMemo, useState } from 'react'
import { CountrySkeletonGrid } from '../components/CountrySkeletonGrid'
import { ErrorState } from '../components/ErrorState'
import { NoResults } from '../components/NoResults'
import { useCountryByCode } from '../hooks/useCountryByCode'
import { useCountUp } from '../hooks/useCountUp'
import { useCountryStates } from '../hooks/useHierarchyData'
import { useUIStore } from '../store/useUIStore'
import { AppBreadcrumbs } from '../components/AppBreadcrumbs'
import { MediaGallery } from '../components/MediaGallery'
import {
  fetchCountryPlaces,
  fetchWikipediaCountryContent,
  fetchWikipediaMedia,
} from '../services/countryEnrichmentApi'

function formatList(items) {
  return items && items.length > 0 ? items.join(', ') : 'N/A'
}

export default function CountryDetailsPage() {
  const { countryCode, code } = useParams()
  const resolvedCode = code || countryCode
  const [stateSearch, setStateSearch] = useState('')
  const [stateSort, setStateSort] = useState('asc')
  const setSelectedCountry = useUIStore((state) => state.setSelectedCountry)
  const setHoveredCountry = useUIStore((state) => state.setHoveredCountry)
  const { data: country, isLoading, isError, error, refetch } = useCountryByCode(resolvedCode)
  const countryName = country?.name?.common
  const [activeTab, setActiveTab] = useState('overview')

  const statesQuery = useCountryStates(countryName, activeTab === 'states')

  const wikiQuery = useQuery({
    queryKey: ['country-wiki', countryName],
    queryFn: () => fetchWikipediaCountryContent(countryName),
    enabled: Boolean(countryName) && activeTab === 'overview',
    staleTime: 1000 * 60 * 30,
    retry: 0,
  })


  const placesQuery = useQuery({
    queryKey: ['country-places', countryName],
    queryFn: () => fetchCountryPlaces(countryName),
    enabled: Boolean(countryName) && activeTab === 'places',
    staleTime: 1000 * 60 * 30,
    retry: 0,
  })
  const mediaQuery = useQuery({
    queryKey: ['country-media', countryName],
    queryFn: () => fetchWikipediaMedia(countryName),
    enabled: Boolean(countryName) && activeTab === 'media',
    staleTime: 1000 * 60 * 60,
    retry: 0,
  })

  const populationCount = useCountUp(country?.population || 0, 1.6)
  const areaCount = useCountUp(country?.area || 0, 1.6)
  const states = statesQuery.data || []
  const filteredStates = useMemo(() => {
    const list = states.filter((stateName) =>
      stateName.toLowerCase().includes(stateSearch.toLowerCase().trim()),
    )
    list.sort((a, b) => (stateSort === 'desc' ? b.localeCompare(a) : a.localeCompare(b)))
    return list
  }, [stateSearch, stateSort, states])

  useEffect(() => {
    // Scroll to top instantly when a new country page opens
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [resolvedCode])

  useEffect(() => {
    if (!country) return
    setHoveredCountry(null)
    setSelectedCountry({
      name: country.name.common,
      flag: country.flags.svg,
      code: country.cca3,
    })
  }, [country, setHoveredCountry, setSelectedCountry])

  if (isLoading) return (
    <Stack gap="lg" className="detail-page-wrap">
      <AppBreadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Loading...' }]} />
      <Group>
        <Button component={Link} to="/" leftSection={<IconArrowLeft size={16} />} variant="default" disabled>
          Back
        </Button>
      </Group>

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <Card radius="lg" padding="lg" className="glass-panel">
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
            <Skeleton height="100%" minHeight={300} radius="md" />
            <Stack>
              <Group align="center">
                <Skeleton height={38} width="60%" radius="md" />
                <Skeleton height={24} width={80} radius="xl" />
              </Group>

              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
                <Paper className="glass-panel" p="sm" radius="md">
                  <Group gap="xs" mb={4}>
                    <IconUsers size={16} />
                    <Text size="xs" c="dimmed">Population</Text>
                  </Group>
                  <Skeleton height={24} width="50%" radius="md" />
                </Paper>
                <Paper className="glass-panel" p="sm" radius="md">
                  <Group gap="xs" mb={4}>
                    <IconRuler2 size={16} />
                    <Text size="xs" c="dimmed">Area (km²)</Text>
                  </Group>
                  <Skeleton height={24} width="50%" radius="md" />
                </Paper>
              </SimpleGrid>

              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
                <Paper className="glass-panel" p="sm" radius="md">
                  <Group gap="xs" mb={4}>
                    <IconBuilding size={16} />
                    <Text size="xs" c="dimmed">Capital</Text>
                  </Group>
                  <Skeleton height={24} width="50%" radius="md" />
                </Paper>
                <Paper className="glass-panel" p="sm" radius="md">
                  <Group gap="xs" mb={4}>
                    <IconWorld size={16} />
                    <Text size="xs" c="dimmed">Region</Text>
                  </Group>
                  <Skeleton height={24} width="50%" radius="md" />
                </Paper>
              </SimpleGrid>
              
              <Button variant="light" radius="xl" w="fit-content" disabled>
                <IconMap size={16} style={{ marginRight: 8 }} />
                Open in Google Maps
              </Button>
            </Stack>
          </SimpleGrid>
        </Card>
      </motion.div>

      <Tabs defaultValue="overview" radius="md">
        <Tabs.List>
          <Tabs.Tab value="overview">Overview</Tabs.Tab>
          <Tabs.Tab value="states" disabled>States</Tabs.Tab>
          <Tabs.Tab value="culture" disabled>Culture</Tabs.Tab>
          <Tabs.Tab value="places" disabled>Places</Tabs.Tab>
          <Tabs.Tab value="media" leftSection={<IconPhoto size={16} />} disabled>
            Media
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="overview" pt="md">
          <Paper className="glass-panel" p="lg" radius="md">
            <Stack gap="md">
              <Title order={3}>About Country</Title>
              <Stack gap="sm">
                <Skeleton height={14} radius="xl" />
                <Skeleton height={14} radius="xl" width="80%" />
                <Skeleton height={14} radius="xl" width="90%" />
              </Stack>
              <Title order={4}>History</Title>
              <Stack gap="sm">
                <Skeleton height={14} radius="xl" />
                <Skeleton height={14} radius="xl" />
                <Skeleton height={14} radius="xl" width="60%" />
              </Stack>
            </Stack>
          </Paper>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  )
  if (isError) return <ErrorState message={error.message} onRetry={refetch} />
  if (!country) return <NoResults />

  const currencies = country.currencies
    ? Object.values(country.currencies).map((c) => `${c.name}${c.symbol ? ` (${c.symbol})` : ''}`)
    : []
  const languages = country.languages ? Object.values(country.languages) : []
  const places = placesQuery.data?.length ? placesQuery.data : []
  const displayPlaces = [...places].slice(0, 50)

  return (
    <Stack gap="lg" className="detail-page-wrap">
      <AppBreadcrumbs items={[{ label: 'Home', to: '/' }, { label: country.name.common }]} />
      <Group>
        <Button component={Link} to="/" leftSection={<IconArrowLeft size={16} />} variant="default">
          Back
        </Button>
      </Group>
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <Card radius="lg" padding="lg" className="glass-panel">
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
            <Image src={country.flags.svg} alt={`${country.name.common} flag`} radius="md" h="100%" fit="cover" />
            <Stack>
              <Group align="center">
                <Title order={1}>{country.name.common}</Title>
                <Badge variant="light">{country.region || 'N/A'}</Badge>
              </Group>
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
                <Paper className="glass-panel" p="sm" radius="md">
                  <Group gap="xs">
                    <IconUsers size={16} />
                    <Text size="xs" c="dimmed">
                      Population
                    </Text>
                  </Group>
                  <Text fw={700}>{new Intl.NumberFormat().format(populationCount)}</Text>
                </Paper>
                <Paper className="glass-panel" p="sm" radius="md">
                  <Group gap="xs">
                    <IconRuler2 size={16} />
                    <Text size="xs" c="dimmed">
                      Area (km²)
                    </Text>
                  </Group>
                  <Text fw={700}>{new Intl.NumberFormat().format(areaCount)}</Text>
                </Paper>
              </SimpleGrid>
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
                <Paper className="glass-panel" p="sm" radius="md">
                  <Group gap="xs">
                    <IconBuilding size={16} />
                    <Text size="xs" c="dimmed">
                      Capital
                    </Text>
                  </Group>
                  <Text fw={700}>{country.capital?.[0] || 'N/A'}</Text>
                </Paper>
                <Paper className="glass-panel" p="sm" radius="md">
                  <Group gap="xs">
                    <IconWorld size={16} />
                    <Text size="xs" c="dimmed">
                      Region
                    </Text>
                  </Group>
                  <Text fw={700}>
                    {country.region || 'N/A'} / {country.subregion || 'N/A'}
                  </Text>
                </Paper>
              </SimpleGrid>
              

              <Button
                component="a"
                href={country.maps?.googleMaps}
                target="_blank"
                rel="noreferrer"
                variant="light"
                radius="xl"
                w="fit-content"
              >
                <IconMap size={16} style={{ marginRight: 8 }} />
                Open in Google Maps
              </Button>
            </Stack>
          </SimpleGrid>
        </Card>
      </motion.div>

      <Tabs value={activeTab} onChange={setActiveTab} radius="md">
        <Tabs.List>
          <Tabs.Tab value="overview">Overview</Tabs.Tab>
          <Tabs.Tab value="states">States</Tabs.Tab>
          <Tabs.Tab value="culture">Culture</Tabs.Tab>
          <Tabs.Tab value="places">Places</Tabs.Tab>
          <Tabs.Tab value="media" leftSection={<IconPhoto size={16} />}>
            Media
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="overview" pt="md">
          <Paper className="glass-panel" p="lg" radius="md">
            <Stack gap="md">
              <Title order={3}>About Country</Title>
              {wikiQuery.isLoading ? (
                <Stack gap="sm">
                  <Skeleton height={14} radius="xl" />
                  <Skeleton height={14} radius="xl" width="80%" />
                  <Skeleton height={14} radius="xl" width="90%" />
                </Stack>
              ) : (
                <Text c="dimmed">
                  {wikiQuery.isSuccess
                    ? wikiQuery.data.summary
                    : 'Summary is currently unavailable. Showing core country information.'}
                </Text>
              )}
              <Title order={4}>History</Title>
              {wikiQuery.isLoading ? (
                <Stack gap="sm">
                  <Skeleton height={14} radius="xl" />
                  <Skeleton height={14} radius="xl" />
                  <Skeleton height={14} radius="xl" width="60%" />
                </Stack>
              ) : (
                <Text c="dimmed">
                  {wikiQuery.isSuccess
                    ? wikiQuery.data.history
                    : 'History information is unavailable right now. Please try again later.'}
                </Text>
              )}
              {wikiQuery.isLoading ? (
                <Skeleton height={14} radius="xl" width="70%" />
              ) : wikiQuery.isSuccess && wikiQuery.data.extra ? (
                <Text c="dimmed">{wikiQuery.data.extra}</Text>
              ) : null}
            </Stack>
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="culture" pt="md">
          <Paper className="glass-panel" p="lg" radius="md">
            <Stack gap="md">
              <Title order={3}>Culture & Religion</Title>
              <Text>
                <strong>Languages:</strong> {formatList(languages)}
              </Text>
              <Text>
                <strong>Currencies:</strong> {formatList(currencies)}
              </Text>
              <Text>
                <strong>Timezones:</strong> {formatList(country.timezones)}
              </Text>
              <Text>
                <strong>Borders:</strong> {formatList(country.borders)}
              </Text>
              <Text>
                <strong>Religion:</strong> Data not available
              </Text>
            </Stack>
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="places" pt="md">
          <Group justify="space-between" mb="sm">
            <Title order={3}>Famous Places & City Highlights</Title>
            <Text size="sm" c="dimmed">
              {displayPlaces.length} items
            </Text>
          </Group>
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            {placesQuery.isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} height={250} radius="md" />
              ))
            ) : displayPlaces.length > 0 ? (
              displayPlaces.map((place, index) => (
                <Paper key={place.name} className="glass-panel place-card" p="md" radius="md">
                  <Stack>
                    {place.image ? (
                      <Image src={place.image} alt={place.name} radius="md" h={180} fit="cover" />
                    ) : null}
                    <Title order={4}>
                      {index + 1}. {place.name}
                    </Title>
                    <Text c="dimmed" size="sm">
                      {place.description}
                    </Text>
                  </Stack>
                </Paper>
              ))
            ) : (
              <Paper className="glass-panel" p="lg" radius="md">
                <Text c="dimmed">Data not available</Text>
                {placesQuery.isError ? (
                  <Text size="sm" c="dimmed" mt="xs">
                    Unable to load places from Wikipedia right now.
                  </Text>
                ) : null}
              </Paper>
            )}
          </SimpleGrid>
        </Tabs.Panel>

        <Tabs.Panel value="states" pt="md">
          <Paper className="glass-panel" p="lg" radius="md">
            <Stack gap="md">
              <Group justify="space-between" align="end">
                <Title order={3}>States</Title>
                <Text size="sm" c="dimmed">
                  {filteredStates.length} states
                </Text>
              </Group>
              <Group grow>
                <TextInput
                  aria-label="Search states"
                  placeholder="Search states..."
                  value={stateSearch}
                  onChange={(event) => setStateSearch(event.currentTarget.value)}
                />
                <Select
                  aria-label="Sort states"
                  value={stateSort}
                  onChange={(value) => setStateSort(value || 'asc')}
                  data={[
                    { value: 'asc', label: 'A-Z' },
                    { value: 'desc', label: 'Z-A' },
                  ]}
                />
              </Group>
              {statesQuery.isLoading ? (
                <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="sm">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} height={60} radius="md" />
                  ))}
                </SimpleGrid>
              ) : statesQuery.isError ? (
                <Text c="dimmed">Data not available</Text>
              ) : filteredStates.length > 0 ? (
                <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="sm">
                  {filteredStates.map((stateName) => (
                    <Paper
                      key={stateName}
                      component={Link}
                      to={`/country/${country.cca3}/state/${encodeURIComponent(stateName)}`}
                      className="glass-panel"
                      p="md"
                      radius="md"
                      style={{ textDecoration: 'none', color: 'inherit', transition: 'transform 0.2s' }}
                    >
                      <Group justify="space-between">
                        <Text fw={500}>{stateName}</Text>
                        <IconArrowRight size={16} opacity={0.5} />
                      </Group>
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
            title={`Media • ${country.name.common}`}
            images={mediaQuery.data?.images || []}
            videos={mediaQuery.data?.videos || []}
            isLoading={mediaQuery.isLoading}
          />
        </Tabs.Panel>
      </Tabs>
    </Stack>
  )
}

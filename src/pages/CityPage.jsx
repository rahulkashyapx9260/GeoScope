import { Link, useParams } from 'react-router-dom'
import { Badge, Button, Card, Group, Paper, SimpleGrid, Stack, Tabs, Text, Title, Skeleton } from '@mantine/core'
import { IconArrowLeft, IconMapPin, IconPhoto, IconUsers, IconWorld } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useCountryByCode } from '../hooks/useCountryByCode'
import { useCityDetails } from '../hooks/useHierarchyData'
import { AppBreadcrumbs } from '../components/AppBreadcrumbs'
import { ErrorState } from '../components/ErrorState'
import { fetchWikipediaMedia, fetchWikipediaTopicContent } from '../services/countryEnrichmentApi'
import { MediaGallery } from '../components/MediaGallery'

function safeDecode(value) {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

function Metric({ label, value }) {
  return (
    <Paper className="glass-panel" p="sm" radius="md">
      <Text size="xs" c="dimmed">
        {label}
      </Text>
      <Text fw={700}>{value ?? 'Data not available'}</Text>
    </Paper>
  )
}

export default function CityPage() {
  const { countryCode, stateName, cityName } = useParams()
  const decodedStateName = safeDecode(stateName)
  const decodedCityName = safeDecode(cityName)
  const { data: country, isLoading: isCountryLoading } = useCountryByCode(countryCode)
  const cityQuery = useCityDetails(country?.cca2, decodedCityName)
  const wikiQuery = useQuery({
    queryKey: ['city-wiki', decodedCityName, country?.name?.common],
    queryFn: () => fetchWikipediaTopicContent(`${decodedCityName}, ${country?.name?.common}`),
    enabled: Boolean(decodedCityName && country?.name?.common),
    staleTime: 1000 * 60 * 30,
    retry: 0,
  })
  const mediaQuery = useQuery({
    queryKey: ['city-media', decodedCityName, country?.name?.common],
    queryFn: () => fetchWikipediaMedia(`${decodedCityName}, ${country?.name?.common}`),
    enabled: Boolean(decodedCityName && country?.name?.common),
    staleTime: 1000 * 60 * 60,
    retry: 0,
  })

  if (isCountryLoading || cityQuery.isLoading) {
    return (
      <Stack gap="lg">
        <Skeleton height={20} width={350} />
        <Skeleton height={36} width={180} />
        <Skeleton height={200} radius="md" />
        <Skeleton height={40} />
        <Skeleton height={250} radius="md" />
      </Stack>
    )
  }

  if (cityQuery.isError) {
    return <ErrorState message="Unable to load city details." onRetry={cityQuery.refetch} />
  }

  const city = cityQuery.data

  return (
    <Stack gap="lg">
      <AppBreadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: country?.name?.common || 'Country', to: `/country/${countryCode}` },
          {
            label: decodedStateName,
            to: `/country/${countryCode}/state/${encodeURIComponent(decodedStateName)}`,
          },
          { label: decodedCityName },
        ]}
      />
      <Group>
        <Button
          component={Link}
          to={`/country/${countryCode}/state/${encodeURIComponent(decodedStateName)}`}
          leftSection={<IconArrowLeft size={16} />}
        >
          Back to State
        </Button>
      </Group>
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card className="glass-panel" p="lg" radius="md">
          <Stack>
            <Group justify="space-between">
              <div>
                <Title order={1}>{decodedCityName}</Title>
                <Text c="dimmed">{country?.name?.common || 'Country'}</Text>
              </div>
              <Badge variant="light">{decodedStateName}</Badge>
            </Group>
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
              <Metric label="Population" value={city?.population ? city.population.toLocaleString() : null} />
              <Metric label="Region" value={city?.region} />
              <Metric
                label="Coordinates"
                value={
                  city?.latitude != null && city?.longitude != null
                    ? `${city.latitude}, ${city.longitude}`
                    : null
                }
              />
              <Metric label="Country Code" value={city?.countryCode} />
            </SimpleGrid>
          </Stack>
        </Card>
      </motion.div>

      <Tabs defaultValue="overview" radius="md">
        <Tabs.List>
          <Tabs.Tab value="overview">Overview</Tabs.Tab>
          <Tabs.Tab value="insights">Insights</Tabs.Tab>
          <Tabs.Tab value="media" leftSection={<IconPhoto size={16} />}>
            Media
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="overview" pt="md">
          <Paper className="glass-panel" p="lg" radius="md">
            <Stack gap="md">
              <Title order={3}>About City</Title>
              {wikiQuery.isLoading ? (
                <Stack gap="sm">
                  <Skeleton height={14} radius="xl" />
                  <Skeleton height={14} radius="xl" width="80%" />
                  <Skeleton height={14} radius="xl" width="90%" />
                </Stack>
              ) : (
                <Text c="dimmed">{wikiQuery.isSuccess ? wikiQuery.data.summary : 'Data not available'}</Text>
              )}
              <Title order={4}>Background</Title>
              {wikiQuery.isLoading ? (
                <Stack gap="sm">
                  <Skeleton height={14} radius="xl" />
                  <Skeleton height={14} radius="xl" />
                  <Skeleton height={14} radius="xl" width="60%" />
                </Stack>
              ) : (
                <Text c="dimmed">{wikiQuery.isSuccess ? wikiQuery.data.history : 'Data not available'}</Text>
              )}
            </Stack>
          </Paper>
        </Tabs.Panel>
        <Tabs.Panel value="insights" pt="md">
          <Paper className="glass-panel" p="lg" radius="md">
            <Stack gap="sm">
              <Text>
                <strong>City:</strong> {decodedCityName}
              </Text>
              <Text>
                <strong>State:</strong> {decodedStateName}
              </Text>
              <Text>
                <strong>Country:</strong> {country?.name?.common || 'Data not available'}
              </Text>
              <Text>
                <strong>Population:</strong>{' '}
                {city?.population ? city.population.toLocaleString() : 'Data not available'}
              </Text>
            </Stack>
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="media" pt="md">
          <MediaGallery
            title={`Media • ${decodedCityName}`}
            images={mediaQuery.data?.images || []}
            videos={mediaQuery.data?.videos || []}
            isLoading={mediaQuery.isLoading}
          />
        </Tabs.Panel>
      </Tabs>
    </Stack>
  )
}

import { Group, Image, Paper, SimpleGrid, Stack, Text, Title } from '@mantine/core'

export function MediaGallery({ title = 'Media', images = [], videos = [] }) {
  if (images.length === 0 && videos.length === 0) {
    return (
      <Paper className="glass-panel" p="lg" radius="md">
        <Text c="dimmed">Data not available</Text>
      </Paper>
    )
  }

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <Title order={3}>{title}</Title>
        <Text size="sm" c="dimmed">
          {images.length} images · {videos.length} videos
        </Text>
      </Group>

      {videos.length > 0 ? (
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
          {videos.map((video) => (
            <Paper key={video.src} className="glass-panel" p="md" radius="md">
              <Stack gap="xs">
                <Text fw={600}>{video.title}</Text>
                <video
                  controls
                  preload="none"
                  poster={video.poster || undefined}
                  style={{ width: '100%', borderRadius: 12 }}
                >
                  <source src={video.src} />
                </video>
              </Stack>
            </Paper>
          ))}
        </SimpleGrid>
      ) : null}

      {images.length > 0 ? (
        <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="md">
          {images.map((img) => (
            <Paper key={img.src} className="glass-panel" p={6} radius="md">
              <Image src={img.src} alt={img.title} radius="md" h={140} fit="cover" />
            </Paper>
          ))}
        </SimpleGrid>
      ) : null}
    </Stack>
  )
}


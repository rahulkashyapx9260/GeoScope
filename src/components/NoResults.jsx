import { Paper, Text, Title } from '@mantine/core'

export function NoResults() {
  return (
    <Paper withBorder radius="md" p="xl" ta="center">
      <Title order={3}>No results found</Title>
      <Text c="dimmed" mt="xs">
        Try adjusting your search term or selecting a different region.
      </Text>
    </Paper>
  )
}

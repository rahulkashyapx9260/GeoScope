import { Card, SimpleGrid, Skeleton, Stack } from '@mantine/core'

function SkeletonCard() {
  return (
    <Card withBorder radius="md" p={0}>
      <Skeleton h={180} />
      <Stack p="md">
        <Skeleton h={20} w="70%" />
        <Skeleton h={14} w="90%" />
        <Skeleton h={14} w="80%" />
        <Skeleton h={14} w="65%" />
      </Stack>
    </Card>
  )
}

export function CountrySkeletonGrid() {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3, xl: 4 }} spacing="lg" verticalSpacing="lg">
      {Array.from({ length: 8 }, (_, index) => (
        <SkeletonCard key={index} />
      ))}
    </SimpleGrid>
  )
}

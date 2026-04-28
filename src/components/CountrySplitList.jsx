import { SimpleGrid } from '@mantine/core'
import { SplitCountryCard } from './SplitCountryCard'

export function CountrySplitList({ countries }) {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="lg">
      {countries.map((country, index) => (
        <SplitCountryCard key={country.cca3} country={country} index={index} />
      ))}
    </SimpleGrid>
  )
}

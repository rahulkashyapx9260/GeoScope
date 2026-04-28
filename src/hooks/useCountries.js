import { useQuery } from '@tanstack/react-query'
import { fetchCountries } from '../services/countriesApi'

export function useCountries() {
  return useQuery({
    queryKey: ['countries'],
    queryFn: fetchCountries,
  })
}

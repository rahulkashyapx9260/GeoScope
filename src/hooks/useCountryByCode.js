import { useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchCountryByCode } from '../services/countriesApi'

export function useCountryByCode(countryCode) {
  const queryClient = useQueryClient()
  
  return useQuery({
    queryKey: ['country', countryCode],
    queryFn: () => fetchCountryByCode(countryCode),
    enabled: Boolean(countryCode),
    staleTime: 1000 * 60 * 10,
    placeholderData: () => {
      // Show basic country info instantly while the detailed API loads the rest (Area, Borders, etc)
      const allCountries = queryClient.getQueryData(['countries'])
      if (allCountries) {
        return allCountries.find((c) => c.cca2 === countryCode || c.cca3 === countryCode)
      }
      return undefined
    },
  })
}

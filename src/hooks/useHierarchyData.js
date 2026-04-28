import { useQuery } from '@tanstack/react-query'
import { fetchCitiesByState, fetchCityDetails, fetchStatesByCountry } from '../services/hierarchyApi'

export function useCountryStates(countryName, enabledOverride = true) {
  return useQuery({
    queryKey: ['country-states', countryName],
    queryFn: () => fetchStatesByCountry(countryName),
    enabled: Boolean(countryName) && enabledOverride,
    staleTime: 1000 * 60 * 30,
    retry: 1,
  })
}

export function useStateCities(countryName, stateName) {
  return useQuery({
    queryKey: ['state-cities', countryName, stateName],
    queryFn: () => fetchCitiesByState(countryName, stateName),
    enabled: Boolean(countryName && stateName),
    staleTime: 1000 * 60 * 30,
    retry: 1,
  })
}

export function useCityDetails(countryCode2, cityName) {
  return useQuery({
    queryKey: ['city-details', countryCode2, cityName],
    queryFn: () => fetchCityDetails(countryCode2, cityName),
    enabled: Boolean(countryCode2 && cityName),
    staleTime: 1000 * 60 * 30,
    retry: 1,
  })
}

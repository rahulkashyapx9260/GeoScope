const API_URL = '/countries.json';

export async function fetchCountries() {
  const response = await fetch(API_URL)
  if (!response.ok) {
    throw new Error('Failed to fetch countries. Please try again.')
  }

  const countries = await response.json()
  console.info('[REST Countries API] all countries response', {
    count: countries?.length || 0,
  })
  return countries.sort((a, b) => a.name.common.localeCompare(b.name.common))
}

export async function fetchCountryByCode(countryCode) {
  const response = await fetch(API_URL)
  if (!response.ok) {
    throw new Error('Failed to fetch country details. Please try again.')
  }

  const countries = await response.json()
  const country = countries.find(c => c.cca2 === countryCode || c.cca3 === countryCode);
  
  if (!country) {
    throw new Error('Country not found');
  }

  console.info('[REST Countries API] country details response', {
    countryCode,
    country,
  })
  
  return {
    ...country,
    timezones: country.timezones || [],
    borders: country.borders || [],
    maps: country.maps || {},
  }
}

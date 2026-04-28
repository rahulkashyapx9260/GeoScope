const LIST_FIELDS = [
  'name',
  'flags',
  'population',
  'region',
  'capital',
  'subregion',
  'languages',
  'cca3',
  'cca2',
  'area',
].join(',')

const DETAILS_FIELDS = [
  'name',
  'flags',
  'population',
  'capital',
  'region',
  'subregion',
  'languages',
  'currencies',
  'cca3',
  'cca2',
  'area',
].join(',')

const DETAILS_EXTRA_FIELDS = ['timezones', 'borders', 'maps'].join(',')

const API_URL = `https://restcountries.com/v3.1/all?fields=${LIST_FIELDS}`

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
  const [baseResponse, extraResponse] = await Promise.all([
    fetch(`https://restcountries.com/v3.1/alpha/${countryCode}?fields=${DETAILS_FIELDS}`),
    fetch(`https://restcountries.com/v3.1/alpha/${countryCode}?fields=${DETAILS_EXTRA_FIELDS}`),
  ])

  if (!baseResponse.ok || !extraResponse.ok) {
    throw new Error('Failed to fetch country details. Please try again.')
  }

  const [baseCountry, extraCountry] = await Promise.all([baseResponse.json(), extraResponse.json()])
  console.info('[REST Countries API] country details response', {
    countryCode,
    baseCountry,
    extraCountry,
  })
  return {
    ...baseCountry,
    timezones: extraCountry.timezones || [],
    borders: extraCountry.borders || [],
    maps: extraCountry.maps || {},
  }
}

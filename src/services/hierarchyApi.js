async function postJson(url, payload) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!response.ok) {
      return null // Gracefully fallback on 404/500
    }
    return await response.json()
  } catch (error) {
    console.warn(`API Exception at ${url}:`, error)
    return null
  }
}

export async function fetchStatesByCountry(countryName) {
  const data = await postJson('https://countriesnow.space/api/v0.1/countries/states', {
    country: countryName,
  })
  const states = Array.isArray(data?.data?.states) ? data.data.states : []
  console.info('[CountriesNow API] states response', { countryName, count: states.length })
  return states.map((item) => item.name).filter(Boolean)
}

export async function fetchCitiesByState(countryName, stateName) {
  const data = await postJson('https://countriesnow.space/api/v0.1/countries/state/cities', {
    country: countryName,
    state: stateName,
  })
  const cities = Array.isArray(data?.data) ? data.data : []
  console.info('[CountriesNow API] state cities response', {
    countryName,
    stateName,
    count: cities.length,
  })
  return cities.filter(Boolean)
}

export async function fetchCityDetails(countryCode2, cityName) {
  // Migration to Free Open-Meteo Geocoding API (No API Key needed)
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=5&format=json`
  try {
    const response = await fetch(url)
    if (!response.ok) return null
    const data = await response.json()
    const rows = Array.isArray(data?.results) ? data.results : []
    
    // Filter by country code to ensure accurate city matches if multiple exist
    let match = rows.find(row => row.country_code?.toUpperCase() === countryCode2?.toUpperCase())
    if (!match && rows.length > 0) match = rows[0]

    if (!match) return null

    return {
      name: match.name,
      population: typeof match.population === 'number' ? match.population : null,
      region: match.admin1 || null,
      latitude: typeof match.latitude === 'number' ? match.latitude : null,
      longitude: typeof match.longitude === 'number' ? match.longitude : null,
      countryCode: match.country_code || countryCode2 || null,
    }
  } catch (err) {
    console.error('Open-Meteo API Failed:', err)
    return null
  }
}

export async function fetchCityDetailsForList(countryCode2, cityNames) {
  if (!countryCode2 || !Array.isArray(cityNames) || cityNames.length === 0) {
    return []
  }

  const limited = cityNames.slice(0, 50)
  const details = []

  // Fetch all cities concurrently for blazing fast loads instead of a loop
  const fetchPromises = limited.map(async (cityName) => {
    try {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=3&format=json`
      const response = await fetch(url)
      if (!response.ok) return null
      
      const data = await response.json()
      const rows = Array.isArray(data?.results) ? data.results : []
      let match = rows.find(row => row.country_code?.toUpperCase() === countryCode2?.toUpperCase())
      if (!match && rows.length > 0) match = rows[0]
      if (!match) return null

      return {
        name: cityName,
        population: typeof match.population === 'number' ? match.population : null,
        region: match.admin1 || null,
        latitude: typeof match.latitude === 'number' ? match.latitude : null,
        longitude: typeof match.longitude === 'number' ? match.longitude : null,
      }
    } catch {
      return null
    }
  })

  const results = await Promise.all(fetchPromises)
  for (const res of results) {
    if (res) details.push(res)
  }

  return details
}

function pickTitle(countryName) {
  return encodeURIComponent(countryName.replace(/\s+/g, '_'))
}

export async function fetchWikipediaTopicContent(topic) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&explaintext=1&titles=${pickTitle(
    topic,
  )}&origin=*`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Wikipedia content is currently unavailable.')
  }

  const data = await response.json()
  console.info('[Wikipedia API] topic content response', { topic, data })
  const pages = data?.query?.pages || {}
  const page = Object.values(pages)[0]
  const extract = page?.extract || ''

  const paragraphs = extract
    .split('\n\n')
    .map((item) => item.trim())
    .filter((item) => item.length > 60)
    .slice(0, 3)

  return {
    summary: paragraphs[0] || 'Description not available.',
    history: paragraphs[1] || 'Background information is currently limited.',
    extra: paragraphs[2] || '',
  }
}

export async function fetchWikipediaCountryContent(countryName) {
  return fetchWikipediaTopicContent(countryName)
}

function pickBestImageSrc(item) {
  const srcset = item?.srcset
  if (Array.isArray(srcset) && srcset.length > 0) {
    return srcset[srcset.length - 1]?.src || null
  }
  return item?.original?.source || item?.thumbnail?.source || null
}

export async function fetchWikipediaMedia(topic) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/media-list/${pickTitle(topic)}`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Media is currently unavailable.')
  }

  const data = await response.json()
  console.info('[Wikipedia REST] media-list response', { topic, data })

  const items = Array.isArray(data?.items) ? data.items : []
  const images = items
    .filter((it) => it.type === 'image')
    .map((it) => ({
      title: it.title || it.caption?.text || 'Image',
      src: pickBestImageSrc(it),
    }))
    .filter((it) => Boolean(it.src))
    .slice(0, 18)

  const videos = items
    .filter((it) => it.type === 'video')
    .map((it) => ({
      title: it.title || it.caption?.text || 'Video',
      src:
        it?.sources?.find((s) => s.type?.includes('mp4'))?.src ||
        it?.sources?.[0]?.src ||
        null,
      poster: pickBestImageSrc(it),
    }))
    .filter((it) => Boolean(it.src))
    .slice(0, 6)

  return { images, videos }
}

export async function fetchCountryCities(countryCode, countryName) {
  const rapidApiKey = import.meta.env.VITE_RAPIDAPI_KEY
  const rapidApiHost = import.meta.env.VITE_GEODB_HOST || 'wft-geo-db.p.rapidapi.com'

  try {
    if (!rapidApiKey) {
      throw new Error('Missing RapidAPI key')
    }

    const url = `https://${rapidApiHost}/v1/geo/cities?countryIds=${countryCode}&limit=50&sort=-population`
    const response = await fetch(url, {
      headers: {
        'X-RapidAPI-Key': rapidApiKey,
        'X-RapidAPI-Host': rapidApiHost,
      },
    })

    if (!response.ok) {
      throw new Error('GeoDB request failed')
    }

    const data = await response.json()
    console.info('[GeoDB API] cities response', { countryCode, data })
    const cities = Array.isArray(data?.data) ? data.data : []
    const mapped = cities.map((city) => city.city).filter(Boolean)
    if (mapped.length > 0) return mapped
  } catch (error) {
    console.warn('[GeoDB API] cities fallback triggered', { countryCode, error })
  }

  if (!countryName) {
    return []
  }

  try {
    const fallbackResponse = await fetch('https://countriesnow.space/api/v0.1/countries/cities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country: countryName }),
    })
    if (!fallbackResponse.ok) {
      return [] // Graceful fallback if country doesn't exist
    }

    const fallbackData = await fallbackResponse.json()
    console.info('[CountriesNow API] cities response', { countryName, fallbackData })
    const fallbackCities = Array.isArray(fallbackData?.data) ? fallbackData.data : []
    return fallbackCities.slice(0, 50)
  } catch (error) {
    console.warn('[CountriesNow API] error:', error)
    return []
  }
}

export async function fetchCountryPlaces(countryName) {
  const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodeURIComponent(
    `${countryName} landmarks OR ${countryName} tourist attractions`,
  )}&srlimit=50&origin=*`
  const searchResponse = await fetch(searchUrl)
  if (!searchResponse.ok) {
    throw new Error('Places data is currently unavailable.')
  }

  const searchData = await searchResponse.json()
  const results = Array.isArray(searchData?.query?.search) ? searchData.query.search : []

  const places = await Promise.all(
    results.map(async (item) => {
      const title = item.title
      const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
      const summaryResponse = await fetch(summaryUrl)
      if (!summaryResponse.ok) return null
      const summary = await summaryResponse.json()
      return {
        name: summary.title,
        image: summary.thumbnail?.source || null,
        description: summary.extract || 'Description not available.',
      }
    }),
  )

  const filtered = places.filter((place) => place && place.name).slice(0, 50)
  console.info('[Wikipedia API] places response', { countryName, filtered })
  return filtered
}

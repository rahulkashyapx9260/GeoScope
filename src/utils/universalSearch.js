import Fuse from 'fuse.js'

function normalizeNumberToken(token) {
  const cleaned = token.replace(/,/g, '').trim()
  if (!cleaned) return null
  const n = Number(cleaned)
  return Number.isFinite(n) ? n : null
}

export function parseSearchQuery(input) {
  const raw = String(input || '').trim()
  if (!raw) return { tokens: [], minPopulation: null, raw }

  const parts = raw.split(/\s+/).filter(Boolean)
  const tokens = []
  let minPopulation = null

  for (const part of parts) {
    const n = normalizeNumberToken(part)
    if (n != null) {
      minPopulation = minPopulation == null ? n : Math.max(minPopulation, n)
    } else {
      tokens.push(part.toLowerCase())
    }
  }

  return { tokens, minPopulation, raw }
}

export function buildCountryDocuments(countries) {
  return (countries || []).map((c) => {
    const languages = c.languages ? Object.values(c.languages) : []
    const currencies = c.currencies ? Object.values(c.currencies).map((x) => x.name) : []
    const currencySymbols = c.currencies ? Object.values(c.currencies).map((x) => x.symbol).filter(Boolean) : []
    const capital = Array.isArray(c.capital) ? c.capital[0] : ''

    return {
      id: c.cca3,
      cca3: c.cca3,
      name: c.name?.common || '',
      officialName: c.name?.official || '',
      capital: capital || '',
      region: c.region || '',
      subregion: c.subregion || '',
      population: c.population || 0,
      languages,
      currencies,
      currencySymbols,
      flag: c.flags?.svg || c.flags?.png || '',
      _raw: c,
    }
  })
}

export function createCountryFuse(documents) {
  return new Fuse(documents, {
    includeScore: true,
    threshold: 0.35,
    ignoreLocation: true,
    keys: [
      { name: 'name', weight: 0.35 },
      { name: 'officialName', weight: 0.12 },
      { name: 'capital', weight: 0.12 },
      { name: 'region', weight: 0.1 },
      { name: 'subregion', weight: 0.08 },
      { name: 'languages', weight: 0.12 },
      { name: 'currencies', weight: 0.08 },
      { name: 'currencySymbols', weight: 0.03 },
      { name: 'cca3', weight: 0.02 },
    ],
  })
}

function haystackForDoc(doc) {
  return [
    doc.name,
    doc.officialName,
    doc.capital,
    doc.region,
    doc.subregion,
    ...(doc.languages || []),
    ...(doc.currencies || []),
    ...(doc.currencySymbols || []),
    doc.cca3,
  ]
    .join(' ')
    .toLowerCase()
}

export function universalCountrySearch({ documents, fuse, query, regionFilter }) {
  const { tokens, minPopulation } = parseSearchQuery(query)
  const docs = documents || []

  // Apply region filter as an additional constraint (doesn't override query tokens).
  const base = regionFilter && regionFilter !== 'All' ? docs.filter((d) => d.region === regionFilter) : docs

  // Numeric-only search (e.g., "1000000") means population >= token.
  if (tokens.length === 0 && minPopulation != null) {
    return base.filter((d) => (d.population || 0) >= minPopulation)
  }

  // Strict token include across all searchable fields (AND behavior).
  const strict = tokens.length
    ? base.filter((d) => {
        const hay = haystackForDoc(d)
        return tokens.every((t) => hay.includes(t))
      })
    : base

  const byPopulation = (list) =>
    minPopulation != null ? list.filter((d) => (d.population || 0) >= minPopulation) : list

  if (strict.length > 0) {
    return byPopulation(strict)
  }

  // Fuzzy fallback (typo tolerance).
  if (!tokens.length) return byPopulation(base)
  const fuzzyResults = (fuse || createCountryFuse(base))
    .search(tokens.join(' '))
    .map((r) => r.item)

  // Ensure AND-ish behavior for multiple tokens (best effort).
  const fuzzyFiltered = fuzzyResults.filter((d) => {
    const hay = haystackForDoc(d)
    return tokens.every((t) => hay.includes(t) || t.length <= 3) // allow short tokens
  })

  return byPopulation(fuzzyFiltered.length ? fuzzyFiltered : fuzzyResults)
}


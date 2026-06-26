import fs from 'fs';

async function generate() {
  try {
    const res = await fetch('https://raw.githubusercontent.com/mledoze/countries/master/countries.json');
    const data = await res.json();
    
    const popRes = await fetch('https://raw.githubusercontent.com/samayo/country-json/master/src/country-by-population.json');
    const popData = await popRes.json();
    
    const popMap = {};
    for (const p of popData) {
      popMap[p.country.toLowerCase()] = p.population;
    }

    const mapped = data.map(c => {
      const name = c.name.common.toLowerCase();
      const official = c.name.official.toLowerCase();
      let population = popMap[name] || popMap[official] || 0;

      // Special cases for population data mismatches
      if (!population) {
        if (c.cca2 === 'US') population = popMap['united states'];
        if (c.cca2 === 'RU') population = popMap['russia'];
        if (c.cca2 === 'KR') population = popMap['south korea'];
        if (c.cca2 === 'KP') population = popMap['north korea'];
        if (c.cca2 === 'GB') population = popMap['united kingdom'];
        if (c.cca2 === 'AE') population = popMap['united arab emirates'];
        if (c.cca2 === 'VN') population = popMap['vietnam'];
        if (c.cca2 === 'SY') population = popMap['syria'];
        if (c.cca2 === 'VE') population = popMap['venezuela'];
      }

      return {
        ...c,
        population,
        flags: {
          png: `https://flagcdn.com/w320/${c.cca2.toLowerCase()}.png`,
          svg: `https://flagcdn.com/${c.cca2.toLowerCase()}.svg`,
        },
        maps: {
          googleMaps: `https://goo.gl/maps/${c.cca2}`,
          openStreetMaps: `https://www.openstreetmap.org/relation/${c.cca2}`
        }
      }
    });

    fs.writeFileSync('public/countries.json', JSON.stringify(mapped));
    console.log('Saved to public/countries.json with population data!');
  } catch (err) {
    console.error(err);
  }
}

generate();

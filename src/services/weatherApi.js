const API_KEY = '6253c7c25c6978500206ed8a99676744'; // Example key for dev, replace if needed
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export async function fetchWeatherByCity(city) {
  if (!city) return null;
  
  try {
    const response = await fetch(`${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`);
    if (!response.ok) {
      if (response.status === 401) {
        console.warn('Weather API Key is invalid or expired. Using mock data for demo purposes.');
        return getMockWeather(city);
      }
      throw new Error('Weather data not available');
    }
    return await response.json();
  } catch (err) {
    console.error('Weather fetch error:', err);
    return getMockWeather(city); // Fallback to mock on any error
  }
}

function getMockWeather(city) {
  const conditions = ['Clear', 'Clouds', 'Rain', 'Snow'];
  const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
  return {
    name: city,
    main: { temp: 22, feels_like: 24, humidity: 45 },
    wind: { speed: 3.5 },
    weather: [{ main: randomCondition, description: `mock ${randomCondition.toLowerCase()} for ${city}` }]
  };
}

import { useEffect, useState } from 'react'
import { Card, Text, Group, Stack, Title, Badge, Box, SimpleGrid, ThemeIcon, Skeleton } from '@mantine/core'
import { motion, AnimatePresence } from 'framer-motion'
import { IconThermometer, IconDroplet, IconWind, IconCloud, IconSun, IconCloudRain, IconSnowflake } from '@tabler/icons-react'
import { fetchWeatherByCity } from '../services/weatherApi'
import { useUIStore } from '../store/useUIStore'

export function WeatherCard({ city }) {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const themeMode = useUIStore((state) => state.themeMode)
  const isDark = themeMode === 'dark'

  useEffect(() => {
    async function loadWeather() {
      if (!city) return
      setLoading(true)
      const data = await fetchWeatherByCity(city)
      setWeather(data)
      setLoading(false)
    }
    loadWeather()
  }, [city])

  if (loading) return (
    <Card radius="lg" p="xl" className="glass-panel" shadow="xl" h={200}>
      <Stack gap="xl">
        <Group justify="space-between" align="flex-start">
          <Stack gap="sm">
            <Skeleton height={20} width={120} radius="xs" />
            <Skeleton height={32} width={200} />
            <Skeleton height={20} width={100} />
          </Stack>
          <Skeleton height={80} width={80} circle />
        </Group>
      </Stack>
    </Card>
  )

  if (!weather) return null

  const condition = weather.weather[0].main // Clear, Clouds, Rain, Snow, etc.
  const temp = Math.round(weather.main.temp)
  const desc = weather.weather[0].description

  // Background and State Mapping
  const config = {
    Clear: {
      gradient: isDark ? 'linear-gradient(135deg, #1e293b 0%, #0369a1 100%)' : 'linear-gradient(135deg, #bae6fd 0%, #0ea5e9 100%)',
      color: 'blue',
      icon: <IconSun />,
    },
    Clouds: {
      gradient: isDark ? 'linear-gradient(135deg, #334155 0%, #475569 100%)' : 'linear-gradient(135deg, #f1f5f9 0%, #cbd5e1 100%)',
      color: 'gray',
      icon: <IconCloud />,
    },
    Rain: {
      gradient: isDark ? 'linear-gradient(135deg, #0f172a 0%, #172554 100%)' : 'linear-gradient(135deg, #dbeafe 0%, #3b82f6 100%)',
      color: 'indigo',
      icon: <IconCloudRain />,
    },
    Snow: {
      gradient: isDark ? 'linear-gradient(135deg, #475569 0%, #64748b 100%)' : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      color: 'blue',
      icon: <IconSnowflake />,
    },
    Default: {
      gradient: isDark ? 'linear-gradient(135deg, #111827 0%, #1f2937 100%)' : 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
      color: 'gray',
      icon: <IconCloud />,
    }
  }

  const active = config[condition] || config.Default

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card 
        radius="lg" 
        p={0} 
        className="glass-panel" 
        shadow="xl" 
        style={{ 
          overflow: 'hidden',
          border: 'none'
        }}
      >
        <Box p="xl" style={{ background: active.gradient, transition: 'background 0.5s ease' }}>
          <Stack gap="xl">
            <Group justify="space-between" align="flex-start">
              <Stack gap={0}>
                <Badge variant="white" color={active.color} size="sm" radius="xs" mb={4}>CURRENT WEATHER</Badge>
                <Title order={3} c={isDark ? 'white' : 'blue.9'}>{city}</Title>
                <Text size="sm" c={isDark ? 'blue.1' : 'blue.8'} fw={500} style={{ textTransform: 'capitalize' }}>
                   {desc}
                </Text>
              </Stack>
              
              {/* Animated Visuals Based on Condition */}
              <Box w={80} h={80} pos="relative">
                <AnimatePresence mode="wait">
                  {condition === 'Clear' && (
                    <motion.div 
                      key="clear"
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0 }}
                    >
                      <motion.div
                        animate={{ scale: [1, 1.15, 1], filter: ['drop-shadow(0 0 5px #fde047)', 'drop-shadow(0 0 20px #fde047)', 'drop-shadow(0 0 5px #fde047)'] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        style={{ color: '#fde047' }}
                      >
                         <IconSun size={64} stroke={1.5} />
                      </motion.div>
                    </motion.div>
                  )}
                  {condition === 'Clouds' && (
                    <motion.div 
                       key="clouds"
                       initial={{ x: -20, opacity: 0 }}
                       animate={{ x: 0, opacity: 1 }}
                       exit={{ x: 20, opacity: 0 }}
                    >
                      <motion.div
                        animate={{ x: [-5, 5, -5] }}
                        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                        style={{ color: isDark ? '#cbd5e1' : '#64748b' }}
                      >
                         <IconCloud size={64} stroke={1.5} />
                      </motion.div>
                    </motion.div>
                  )}
                  {condition === 'Rain' && (
                    <motion.div 
                       key="rain"
                       initial={{ y: -20, opacity: 0 }}
                       animate={{ y: 0, opacity: 1 }}
                       exit={{ y: 20, opacity: 0 }}
                       style={{ color: '#60a5fa' }}
                    >
                      <IconCloudRain size={64} stroke={1.5} />
                      {[1,2,3].map(i => (
                        <motion.div
                          key={i}
                          animate={{ y: [0, 40], opacity: [0, 1, 0] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.3 }}
                          style={{
                            position: 'absolute',
                            left: 15 + i * 15,
                            top: 40,
                            width: 2,
                            height: 8,
                            backgroundColor: '#60a5fa',
                            borderRadius: '2px'
                          }}
                        />
                      ))}
                    </motion.div>
                  )}
                  {(condition === 'Snow' || condition === 'Default') && (
                     <motion.div
                        key="snow"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ color: '#fff' }}
                     >
                       <IconSnowflake size={64} stroke={1.5} />
                        {[1,2,3,4].map(i => (
                        <motion.div
                          key={i}
                          animate={{ 
                            y: [0, 50], 
                            x: [0, i % 2 === 0 ? 10 : -10, 0],
                            opacity: [0, 1, 0] 
                          }}
                          transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.5 }}
                          style={{
                            position: 'absolute',
                            left: 10 + i * 12,
                            top: 40,
                            width: 4,
                            height: 4,
                            backgroundColor: '#fff',
                            borderRadius: '50%',
                            filter: 'blur(1px)'
                          }}
                        />
                      ))}
                     </motion.div>
                  )}
                </AnimatePresence>
              </Box>
            </Group>

            <Group gap={40}>
              <Stack gap={0}>
                <Text size="5rem" fw={800} lh={1} c={isDark ? 'white' : 'blue.9'}>
                  {temp}°
                </Text>
              </Stack>
              
              <SimpleGrid cols={2} spacing="md" style={{ flex: 1 }}>
                <Group gap="xs">
                  <ThemeIcon variant="light" color={active.color} size="sm">
                    <IconThermometer size={14} />
                  </ThemeIcon>
                  <Stack gap={0}>
                    <Text size="xs" c="dimmed">Feels Like</Text>
                    <Text fw={700} size="sm">{Math.round(weather.main.feels_like)}°C</Text>
                  </Stack>
                </Group>
                <Group gap="xs">
                  <ThemeIcon variant="light" color={active.color} size="sm">
                    <IconDroplet size={14} />
                  </ThemeIcon>
                  <Stack gap={0}>
                    <Text size="xs" c="dimmed">Humidity</Text>
                    <Text fw={700} size="sm">{weather.main.humidity}%</Text>
                  </Stack>
                </Group>
                <Group gap="xs">
                  <ThemeIcon variant="light" color={active.color} size="sm">
                    <IconWind size={14} />
                  </ThemeIcon>
                  <Stack gap={0}>
                    <Text size="xs" c="dimmed">Wind</Text>
                    <Text fw={700} size="sm">{weather.wind.speed} m/s</Text>
                  </Stack>
                </Group>
              </SimpleGrid>
            </Group>
          </Stack>
        </Box>
      </Card>
    </motion.div>
  )
}

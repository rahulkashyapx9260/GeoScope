import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Container, MantineProvider, Center, Stack, Skeleton } from '@mantine/core'
import { useUIStore } from './store/useUIStore'
import { getAppTheme } from './theme'
import { AppLayout } from './layouts/AppLayout'
import { PageTransition } from './components/PageTransition'

const HomePage = lazy(() => import('./pages/HomePage'))
const CountryDetailsPage = lazy(() => import('./pages/CountryDetailsPage'))
const StatePage = lazy(() => import('./pages/StatePage'))
const CityPage = lazy(() => import('./pages/CityPage'))

function App() {
  const location = useLocation()
  const themeMode = useUIStore((state) => state.themeMode)

  return (
    <MantineProvider
      theme={getAppTheme(themeMode)}
      defaultColorScheme={themeMode}
      forceColorScheme={themeMode}
    >
      <AppLayout>
        <Suspense
          fallback={
            <Stack gap="xl" py="xl">
              <Skeleton height={40} width={200} />
              <Skeleton height={300} radius="lg" />
              <Skeleton height={200} radius="lg" />
            </Stack>
          }
        >
          <AnimatePresence mode="wait">
            <Container size={1280} px={{ base: 'md', md: 'lg' }} py={{ base: 'sm', md: 'md' }} key={location.pathname}>
              <PageTransition>
                <Routes location={location}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/country/:countryCode/state/:stateName/city/:cityName" element={<CityPage />} />
                  <Route path="/country/:countryCode/state/:stateName" element={<StatePage />} />
                  <Route path="/country/:code" element={<CountryDetailsPage />} />
                  <Route path="/country/:countryCode" element={<CountryDetailsPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </PageTransition>
            </Container>
          </AnimatePresence>
        </Suspense>
      </AppLayout>
    </MantineProvider>
  )
}

export default App

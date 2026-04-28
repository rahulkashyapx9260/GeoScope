import { Box, useMantineTheme } from '@mantine/core'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { AnimatedBackground } from '../components/AnimatedBackground'

export function AppLayout({ children }) {
  const theme = useMantineTheme()

  return (
    <Box mih="100vh" className="app-shell" pos="relative" style={{ overflow: 'clip' }}>
      <AnimatedBackground />
      <Box pos="relative" style={{ zIndex: 1 }}>
        <Navbar />
        <main style={{ paddingBottom: '2rem' }}>{children}</main>
        <Footer />
      </Box>
    </Box>
  )
}

import { Box, Container, SimpleGrid, Stack, Text, Title, Paper, Badge, Group, ThemeIcon } from '@mantine/core'
import { motion } from 'framer-motion'
import { IconRocket, IconWorld, IconLayout, IconDeviceDesktop, IconCloudComputing, IconBrandReact, IconBrandVite, IconBrandFramerMotion, IconDatabase } from '@tabler/icons-react'

const techStack = [
  { name: 'React 19', description: 'Modern UI logic & Hooks', icon: <IconBrandReact size={20} />, color: 'blue' },
  { name: 'Mantine UI', description: 'Clean Design System', icon: <IconLayout size={20} />, color: 'teal' },
  { name: 'Vite', description: 'Next-gen Build Tool', icon: <IconBrandVite size={20} />, color: 'violet' },
  { name: 'Framer Motion', description: 'Ultra-smooth Animations', icon: <IconBrandFramerMotion size={20} />, color: 'pink' },
  { name: 'React-Globe.gl', description: '3D Earth Visualization', icon: <IconWorld size={20} />, color: 'cyan' },
  { name: 'TanStack Query', description: 'Reliable API Syncing', icon: <IconCloudComputing size={20} />, color: 'red' },
  { name: 'Zustand', description: 'State Management', icon: <IconDatabase size={20} />, color: 'indigo' },
  { name: 'REST Countries', description: 'Real-time Global Data', icon: <IconWorld size={20} />, color: 'orange' },
]

export function InfoSections() {
  return (
    <Stack gap={80} py={100} id="about-section">
      {/* About Section */}
      <Container size="lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing={50} align="center">
            <Stack gap="lg">
              <Badge variant="light" size="lg" radius="xs" leftSection={<IconRocket size={14} />}>
                MISSION
              </Badge>
              <Title order={2} fz={{ base: 32, md: 44 }} fw={800} style={{ letterSpacing: -1 }}>
                Explore the Earth, <br />
                <span className="gradient-text">Without Boundaries.</span>
              </Title>
              <Text c="dimmed" size="lg" lh={1.6}>
                GeoScope is a next-generation geography explorer designed to bridge the gap between abstract maps and vivid reality. 
                Powered by real-time data and high-fidelity 3D visualization, it provides an immersive journey across our planet, 
                from the largest continents to the most remote islands.
              </Text>
            </Stack>
            
            <Box pos="relative">
               <Paper className="glass-panel" p="xl" radius="lg" shadow="xl">
                 <Stack gap="md">
                    <IconWorld size={48} className="gradient-text" style={{ opacity: 0.8 }} />
                    <Title order={3}>A Global Window</Title>
                    <Text size="sm" c="dimmed">
                      Every country has a story. We help you find it through interactive visuals, 
                      real-time insights, and a seamless discovery experience.
                    </Text>
                 </Stack>
               </Paper>
               {/* Decorative floating elements */}
               <motion.div 
                 animate={{ y: [0, -10, 0] }}
                 transition={{ duration: 4, repeat: Infinity }}
                 style={{ position: 'absolute', top: -20, right: -20, zIndex: -1 }}
               >
                 <Box w={100} h={100} bg="indigo.4" style={{ borderRadius: '50%', opacity: 0.1, filter: 'blur(20px)' }} />
               </motion.div>
            </Box>
          </SimpleGrid>
        </motion.div>
      </Container>

      {/* Tech Stack Section */}
      <Container size="lg" id="tech-stack">
        <Stack gap="xl" align="center" mb={50}>
           <Badge variant="dot" size="lg">TECH STACK</Badge>
           <Title order={2} ta="center">Built with Modern Standards</Title>
        </Stack>

        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="lg">
          {techStack.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Paper className="glass-panel tech-card" p="md" radius="md" h="100%">
                 <Stack gap="xs" align="center" ta="center">
                    <ThemeIcon variant="light" color={tech.color} size="lg" radius="md">
                      {tech.icon}
                    </ThemeIcon>
                    <Text fw={700} size="sm">{tech.name}</Text>
                    <Text size="xs" c="dimmed">{tech.description}</Text>
                 </Stack>
              </Paper>
            </motion.div>
          ))}
        </SimpleGrid>
      </Container>
    </Stack>
  )
}

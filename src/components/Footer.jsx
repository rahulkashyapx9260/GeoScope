import { Group, Text, Anchor } from '@mantine/core'

export function Footer() {
  return (
    <footer id="about" className="top-footer">
      <Group justify="space-between" gap="xs" className="top-footer-inner" wrap="wrap">
        <Text size="sm" c="dimmed">
          © GeoScope
        </Text>

      </Group>
    </footer>
  )
}

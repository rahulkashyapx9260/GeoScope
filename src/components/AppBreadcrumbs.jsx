import { Anchor, Breadcrumbs, Text } from '@mantine/core'
import { Link } from 'react-router-dom'

export function AppBreadcrumbs({ items }) {
  return (
    <Breadcrumbs>
      {items.map((item) =>
        item.to ? (
          <Anchor key={item.label} component={Link} to={item.to} underline="hover">
            {item.label}
          </Anchor>
        ) : (
          <Text key={item.label}>{item.label}</Text>
        ),
      )}
    </Breadcrumbs>
  )
}

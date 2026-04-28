import { Alert, Button, Group } from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'

export function ErrorState({ message, onRetry }) {
  return (
    <Alert icon={<IconAlertCircle size={16} />} title="Something went wrong" color="red" mb="md">
      {message}
      <Group mt="md">
        <Button variant="light" onClick={onRetry}>
          Retry
        </Button>
      </Group>
    </Alert>
  )
}

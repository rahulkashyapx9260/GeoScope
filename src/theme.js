import { createTheme } from '@mantine/core'

export const getAppTheme = (colorScheme) =>
  createTheme({
    fontFamily: 'Inter, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
    primaryColor: 'indigo',
    defaultRadius: 'lg',
    headings: {
      fontFamily: 'Inter, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
      fontWeight: '700',
    },
    colors: {
      brand: [
        '#eef2ff',
        '#e0e7ff',
        '#c7d2fe',
        '#a5b4fc',
        '#818cf8',
        '#6366f1',
        '#4f46e5',
        '#4338ca',
        '#3730a3',
        '#312e81',
      ],
    },
    shadows: {
      md: '0 8px 22px rgba(9, 13, 38, 0.08)',
      xl: '0 20px 46px rgba(20, 26, 48, 0.14)',
    },
    other: {
      appGradient:
        colorScheme === 'dark'
          ? 'radial-gradient(900px circle at 20% 0%, rgba(99,102,241,0.16), transparent 44%), radial-gradient(700px circle at 90% 5%, rgba(59,130,246,0.12), transparent 40%), linear-gradient(180deg, #101826, #0c121d)'
          : 'radial-gradient(900px circle at 8% 0%, rgba(99,102,241,0.10), transparent 44%), radial-gradient(700px circle at 95% 5%, rgba(59,130,246,0.08), transparent 42%), linear-gradient(180deg, #fffdf8, #f8f7f4)',
    },
  })

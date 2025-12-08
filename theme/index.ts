export const theme = {
  colors: {
    primary: '#0056D2',
    primaryLight: '#E3F2FD',
    secondary: '#003380',

    background: '#F5F7FA',
    surface: '#FFFFFF',
    surfaceAlt: '#F3F4F6',

    text: '#1F2937',
    textLight: '#6B7280',
    textInverted: '#FFFFFF',

    border: '#E5E7EB',
    loading: '#0056D2',
    error: '#EF4444',

    white: '#FFFFFF',
    black: '#000000',
    green: '#22C55E',
    red: '#EF4444',
    gray: '#9CA3AF',
  },

  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 40,
  },

  borderRadius: {
    s: 6,
    m: 12,
    l: 20,
    xl: 30,
  },

  text: {
    title: {
      fontWeight: 'bold' as const,
      fontSize: 18,
      color: '#1F2937',
    },
    header: {
      fontWeight: 'bold' as const,
      fontSize: 24,
      color: '#0056D2',
    },
    body: {
      fontSize: 14,
      color: '#4B5563',
      lineHeight: 20,
    },
    caption: {
      fontSize: 12,
      color: '#6B7280',
    },
  },

  shadows: {
    default: {
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
    },
    soft: {
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
    },
    strong: {
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
    },
  },
};

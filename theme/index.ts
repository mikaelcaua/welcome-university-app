const palette = {
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',

  slate: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
    950: '#020617',
  },

  blue: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#0056D2',
    800: '#1E40AF',
    900: '#1E3A8A',
    950: '#172554',
  },

  red: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
    950: '#450A0A',
  },

  green: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E',
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#14532D',
    950: '#052E16',
  },

  orange: {
    50: '#FFF7ED',
    100: '#FFEDD5',
    200: '#FED7AA',
    300: '#FDBA74',
    400: '#FB923C',
    500: '#F97316',
    600: '#EA580C',
    700: '#C2410C',
    800: '#9A3412',
    900: '#7C2D12',
    950: '#431407',
  },
};

export const theme = {
  colors: {
    ...palette,
    primary: palette.blue[700],
    primaryLight: palette.blue[50],
    secondary: palette.blue[800],

    pdf: palette.red[600],

    background: '#0B1220',
    surface: '#111827',
    surfaceAlt: '#0F172A',

    text: '#E5E7EB',
    textLight: '#94A3B8',
    textInverted: '#F8FAFC',

    border: '#334155',
    loading: palette.blue[700],
    error: palette.red[500],
    success: palette.green[500],
    warning: palette.orange[500],
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
      color: '#E5E7EB',
    },
    header: {
      fontWeight: 'bold' as const,
      fontSize: 24,
      color: '#E5E7EB',
    },
    body: {
      fontSize: 14,
      color: '#CBD5E1',
      lineHeight: 20,
    },
    caption: {
      fontSize: 12,
      color: '#94A3B8',
    },
  },

  shadows: {
    default: {
      elevation: 4,
      shadowColor: palette.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
    },
    soft: {
      elevation: 2,
      shadowColor: palette.black,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.16,
      shadowRadius: 4,
    },
    strong: {
      elevation: 8,
      shadowColor: palette.black,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
    },
  },
};

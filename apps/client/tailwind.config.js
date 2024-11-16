/** @type {import('tailwindcss').Config} */

export default {
  darkMode: ['class'],
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        pretendard: ['Pretendard', 'Roboto'],
      },
      fontWeight: {
        bold: '700',
        medium: '500',
      },
      fontSize: {
        'display-bold24': ['24px', { fontWeight: '700', lineHeight: 'auto' }],
        'display-bold16': ['16px', { fontWeight: '700', lineHeight: 'auto' }],
        'display-bold14': ['14px', { fontWeight: '700', lineHeight: 'auto' }],
        'display-bold12': ['12px', { fontWeight: '700', lineHeight: 'auto' }],
        'display-medium16': ['16px', { fontWeight: '500', lineHeight: '22px' }],
        'display-medium14': ['14px', { fontWeight: '500', lineHeight: 'auto' }],
        'display-medium12': ['12px', { fontWeight: '500', lineHeight: 'auto' }],
        'selected-bold16': ['16px', { fontWeight: '700', lineHeight: 'auto' }],
        'selected-bold14': ['14px', { fontWeight: '700', lineHeight: 'auto' }],
      },
      colors: {
        'text-strong': 'var(--grayscale-white)',
        'text-bold': 'var(--grayscale-50)',
        'text-default': 'var(--grayscale-100)',
        'text-weak': 'var(--grayscale-white-alt)',
        'text-white-default': 'var(--grayscale-white)',
        'text-white-weak': 'var(--grayscale-white-alt)',
        'text-point': 'var(--blue-500)',
        'text-danger': 'var(--red-500)',
        'surface-default': 'var(--grayscale-black)',
        'surface-alt': 'var(--grayscale-700)',
        'surface-brand-default': 'var(--blue-500)',
        'surface-brand-alt': 'var(--blue-500-alt)',
        'surface-danger': 'var(--red-500)',
        'border-bold': 'var(--grayscale-white-alt)',
        'border-default': 'var(--grayscale-400)',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        DEFAULT: '10px',
        circle: '999px',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

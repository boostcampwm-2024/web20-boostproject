/** @type {import('tailwindcss').Config} */

export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { pretendard: ['Pretendard', 'sans-serif'] },
      fontWeight: {
        bold: 700,
        medium: 500,
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
        'surface-brand-alt': 'var(--blue-900)',
        'surface-danger': 'var(--red-500)',
        'border-bold': 'var(--grayscale-white-alt)',
        'bolder-default': 'var(--grayscale-400)',
      },
      borderRadius: {
        DEFAULT: '10px',
        circle: '999px',
      },
    },
  },
  plugins: [],
};

// This is the configuration file for Tailwind CSS.
// It allows you to customize the framework, such as defining your color palette, fonts, and plugins.

import type { Config } from 'tailwindcss';

export default {
  // Specifies the dark mode strategy. 'class' means dark mode is toggled by adding a 'dark' class
  // to a parent element (usually the <html> tag).
  darkMode: ['class'],
  
  // The `content` array tells Tailwind which files to scan for class names.
  // Tailwind uses this information to generate only the CSS that is actually used in your project,
  // which is a process called "purging". This keeps the final CSS file size small.
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  
  // The `theme` object is where you customize Tailwind's default design system.
  theme: {
    // Customizes the `container` class from Tailwind.
    container: {
      center: true, // Horizontally centers the container.
      padding: '2rem', // Adds padding on the left and right.
      screens: {
        '2xl': '1400px', // Sets the max-width of the container on large screens.
      },
    },
    // The `extend` object allows you to add new values to the default theme
    // or override existing ones.
    extend: {
      // Defines custom font families that can be used with `font-body`, `font-headline`, etc.
      fontFamily: {
        body: ['PT Sans', 'sans-serif'],
        headline: ['Poppins', 'sans-serif'],
        code: ['monospace'],
      },
      // Defines the application's color palette using CSS variables.
      // These variables are defined in `src/app/globals.css`.
      // This approach makes it easy to implement theming (e.g., light and dark mode).
      colors: {
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
        // Example of custom chart colors.
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      // Customizes the border radius utilities (e.g., `rounded-lg`).
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      // Defines custom CSS animations using keyframes.
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      // Makes the keyframes available as animation utility classes (e.g., `animate-accordion-down`).
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  // The `plugins` array is where you can add official or third-party Tailwind plugins.
  // `tailwindcss-animate` is a plugin from ShadCN UI that provides animation utilities.
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

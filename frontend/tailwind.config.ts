import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{html,jsx,tsx}'], // Include HTML, JSX, and TSX files in the src directory
  theme: {
    extend: {}, // Extend Tailwind CSS theme if needed
  },
  plugins: [], // Add Tailwind CSS plugins if needed
};

export default config;

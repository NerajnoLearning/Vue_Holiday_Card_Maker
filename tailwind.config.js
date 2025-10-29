module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts}"],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // Dark mode color palette
        dark: {
          bg: '#0f172a',        // Deep slate background
          surface: '#1e293b',    // Card/surface background
          border: '#334155',     // Border color
          text: {
            primary: '#f1f5f9',  // Primary text
            secondary: '#cbd5e1', // Secondary text
            muted: '#94a3b8',    // Muted text
          },
        },
      },
    },
  },
  plugins: [],
}

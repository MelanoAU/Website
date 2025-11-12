/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: "#A1C1A1", foreground: "#0b0b0b" },
        base: { DEFAULT: "#0b0b0b", foreground: "#ffffff" }
      },
      borderRadius: { xl: "1rem", "2xl": "1.5rem" },
      boxShadow: { soft: "0 8px 30px rgba(0,0,0,0.35)" }
    }
  },
  plugins: [require("tailwindcss-animate")]
}

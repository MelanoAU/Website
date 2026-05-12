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
        // 站点全局深色基调（保持不变 —— header / footer / 其他页面仍用这个）
        brand: { DEFAULT: "#A1C1A1", foreground: "#0b0b0b" },
        base: { DEFAULT: "#0b0b0b", foreground: "#ffffff" },

        // ====== Atelier Mélano —— 主页专属暖色调色板 ======
        // 主页改为"暖纸工坊"风：纸感 cream + 暖炭 + 深 sage + antique brass
        parchment: "#EFE7D6",     // 主背景（暖纸色）
        cream: "#FAF4E6",         // 卡片浅色面
        "soft-cream": "#F5EFE0",  // 中间过渡色
        charcoal: "#1F1A12",      // 主文字（暖炭，非冷黑）
        "warm-grey": "#5B4F3D",   // 次级文字（暖棕灰）
        "deep-sage": "#6F8B6A",   // sage 加深版，纯天然点缀
        "sage-soft": "#8FA08C",   // sage 弱化色
        brass: "#9B7E47",         // 古铜金，奢华点缀
        "brass-soft": "#B89E70",  // brass 弱化色
      },
      borderRadius: { xl: "1rem", "2xl": "1.5rem" },
      boxShadow: { soft: "0 8px 30px rgba(0,0,0,0.35)" }
    }
  },
  plugins: [require("tailwindcss-animate")]
}

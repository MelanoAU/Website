// src/components/social-icons.tsx
//
// Brand-mark icons that aren't in lucide-react. All use currentColor so
// they tint with whatever text colour their parent sets, keeping them
// visually consistent with the lucide icons we use elsewhere.

export type SocialIconProps = { className?: string; strokeWidth?: number }

/* ---------- Social platforms (used in footer + account page) ---------- */

export function TikTokIcon({ className }: SocialIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743 2.896 2.896 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z" />
    </svg>
  )
}

export function XIcon({ className }: SocialIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

/**
 * Xiaohongshu (小红书) — no lucide equivalent and the official mark is too
 * detailed for a 16px badge. Render a rounded square outline with a
 * centered 小 glyph in currentColor.
 */
export function XiaohongshuIcon({
  className,
  strokeWidth = 1.8,
}: SocialIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <text
        x="12"
        y="16.5"
        textAnchor="middle"
        fontSize="11"
        fontWeight={700}
        fill="currentColor"
        stroke="none"
        fontFamily="ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
      >
        小
      </text>
    </svg>
  )
}

/* ---------- OAuth identity providers (used in account page) ---------- */

/** Google "G" mark, simplified to a single currentColor path. */
export function GoogleIcon({ className }: SocialIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M21.35 11.1h-9.17v2.97h5.27c-.23 1.45-1.7 4.27-5.27 4.27a5.84 5.84 0 1 1 0-11.68c1.85 0 3.09.79 3.8 1.46l2.59-2.5C17.05 3.96 14.84 3 12.18 3a9 9 0 1 0 0 18c5.2 0 8.64-3.66 8.64-8.81 0-.59-.06-1.04-.13-1.49z" />
    </svg>
  )
}

/** Apple logo, simple-icons style. */
export function AppleIcon({ className }: SocialIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.05 20.28c-.98.95-2.05.86-3.08.43-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.43C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  )
}

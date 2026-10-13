import Link from "next/link";

export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 240"
      className={`logo-mark ${className}`}
      fill="currentColor"
      aria-hidden
      focusable="false"
    >
      <path d="M106 16C173-13 240 43 235 116C214 63 164 23 106 16Z" />
      <path d="M102 27C37 24 3 75 5 132C7 201 66 242 143 230C83 234 41 184 38 125C36 78 57 39 102 27Z" />
      <path d="M115 29C185 37 231 96 228 152C225 201 193 228 154 229C197 210 211 168 202 117C192 70 158 42 115 29Z" />
    </svg>
  );
}

export function SiteLogo() {
  return (
    <Link href="/" className="wordmark" aria-label="Orifolio ホーム">
      <LogoMark />
      <span>orifolio</span>
    </Link>
  );
}

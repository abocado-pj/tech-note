import Link from "next/link";

export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 40" className={`logo-mark ${className}`} fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" aria-hidden focusable="false">
      <path d="M24 9C18 3 10 3 3 6V34C10 31 18 31 24 36C30 31 38 31 45 34V6C38 3 30 3 24 9Z" />
      <path d="M24 9V36" />
    </svg>
  );
}

export function SiteLogo() {
  return <Link href="/" className="wordmark" aria-label="Tech Note ホーム"><LogoMark /><span>tech note</span></Link>;
}

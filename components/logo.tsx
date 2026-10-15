import Link from "next/link";
import { withBasePath } from "@/lib/site";
import styles from "./logo.module.css";

const brushUrl = withBasePath("/images/orifolio/logo-brush.svg");

function LogoShape() {
  return (
    <>
      <path d="M106 16C173-13 240 43 235 116C214 63 164 23 106 16Z" />
      <path d="M102 27C37 24 3 75 5 132C7 201 66 242 143 230C83 234 41 184 38 125C36 78 57 39 102 27Z" />
      <path d="M115 29C185 37 231 96 228 152C225 201 193 228 154 229C197 210 211 168 202 117C192 70 158 42 115 29Z" />
    </>
  );
}

export function LogoMark({
  className = "",
  inkClipId,
}: {
  className?: string;
  inkClipId?: string;
}) {
  return (
    <svg
      viewBox="0 0 240 240"
      className={`logo-mark ${className}`}
      fill="currentColor"
      aria-hidden
      focusable="false"
    >
      <LogoShape />
      {inkClipId ? (
        <>
          <defs>
            <clipPath id={inkClipId}>
              <LogoShape />
            </clipPath>
          </defs>
          <image
            href={brushUrl}
            width={(1600 * 240) / 440}
            height="240"
            preserveAspectRatio="none"
            clipPath={`url(#${inkClipId})`}
          />
        </>
      ) : null}
    </svg>
  );
}

export function SiteLogo({ placement }: { placement: "header" | "footer" }) {
  return (
    <Link
      href="/"
      className={`wordmark ${styles.wordmark} ${styles[placement]}`}
      aria-label="Orifolio ホーム"
    >
      <LogoMark inkClipId={`orifolio-${placement}-ink`} />
      <span className={styles.text}>
        <span>orifolio</span>
        <span
          aria-hidden="true"
          className={styles.ink}
          style={{ backgroundImage: `url("${brushUrl}")` }}
        >
          orifolio
        </span>
      </span>
      <svg
        className={styles.flecks}
        viewBox="0 0 12 12"
        aria-hidden="true"
        focusable="false"
      >
        <path d="m2.1 1.5 1.4-.3 1 .9.2 1.3-1.1 1-1.4-.3-.8-1.1Z" />
        <path d="m8.4 5.7 1-.1.7.8-.3 1-.9.4-.9-.6Z" />
      </svg>
    </Link>
  );
}

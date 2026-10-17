import {
  LAMBDA_BOUNDARIES,
  type LambdaBoundary,
} from "@/lib/lambda-inspection";

/** Engraved symbols identify subjects; they do not represent live AWS state. */
export function LambdaBoundaryGlyph({
  boundary,
}: {
  boundary: LambdaBoundary;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
      focusable="false"
    >
      {boundary === "entry" ? (
        <>
          <path d="M18 52V24a14 14 0 0 1 28 0v28M23 52V25a9 9 0 0 1 18 0v27M9 52h46M5 35h27m-5-5 5 5-5 5" />
          <circle cx="40" cy="37" r="1.5" />
        </>
      ) : null}
      {boundary === "execution" ? (
        <>
          <rect x="14" y="14" width="36" height="36" rx="4" />
          <rect x="20" y="20" width="24" height="24" rx="2" />
          <path d="m25 26 6 6-6 6m9 0h6M22 6v8m10-8v8m10-8v8M22 50v8m10-8v8m10-8v8M6 22h8m-8 10h8m-8 10h8m36-20h8m-8 10h8m-8 10h8" />
        </>
      ) : null}
      {boundary === "role" ? (
        <>
          <path d="m32 7 18 7v16c0 12-9 21-18 27-9-6-18-15-18-27V14Z" />
          <circle cx="30" cy="28" r="6" />
          <path d="m34 33 10 10m-5-5 4-4m-1 7 4-4M21 17l11-4 11 4" />
        </>
      ) : null}
      {boundary === "authorization" ? (
        <>
          <rect x="6" y="16" width="23" height="36" rx="2" />
          <circle cx="17.5" cy="28" r="4" />
          <path d="M11 44v-3a6.5 6.5 0 0 1 13 0v3M35 12h17l6 6v34H35Zm17 0v8h6M41 29h11m-11 7h8m-8 7 3 3 7-8" />
        </>
      ) : null}
    </svg>
  );
}

export function LambdaJacketEmblem() {
  return (
    <span className="lambda-jacket-emblem" aria-hidden="true">
      {LAMBDA_BOUNDARIES.map((boundary) => (
        <span key={boundary.id}>
          <LambdaBoundaryGlyph boundary={boundary.id} />
          <small>{boundary.number}</small>
        </span>
      ))}
    </span>
  );
}

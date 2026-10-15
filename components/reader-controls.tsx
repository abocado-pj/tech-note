"use client";

import { useState } from "react";

export function ReaderControls() {
  const [large, setLarge] = useState(false);
  return (
    <div className="reader-controls">
      <button
        className="reader-size-button"
        aria-pressed={large}
        aria-label="本文を大きくする"
        onClick={() => setLarge((value) => !value)}
      >
        Aa
      </button>
      <button
        onClick={() => {
          const contents = document.querySelector("#article-contents details");
          if (contents instanceof HTMLDetailsElement) {
            contents.open = true;
            contents.scrollIntoView({ block: "start", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
            contents.querySelector("summary")?.focus();
          }
        }}
      >
        ☷　目次
      </button>
    </div>
  );
}

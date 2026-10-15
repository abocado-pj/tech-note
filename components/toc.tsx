"use client";

import { useEffect, useRef } from "react";
import type { TableOfContentsItem } from "@/lib/articles";

export function TableOfContents({
  headings,
}: {
  headings: TableOfContentsItem[];
}) {
  const details = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 681px)");
    const update = () => {
      if (details.current) details.current.open = media.matches;
    };
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  if (!headings.length) return null;
  return (
    <details ref={details} className="reader-toc" open>
      <summary>この記事の目次</summary>
      <nav aria-label="目次">
        <ol>
          {headings.map((heading) => (
            <li
              key={heading.id}
              style={{
                paddingLeft: `${Math.max(0, heading.depth - 2) * 12}px`,
              }}
            >
              <a href={`#${heading.id}`}>{heading.text}</a>
            </li>
          ))}
        </ol>
      </nav>
    </details>
  );
}

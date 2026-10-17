"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, type ComponentProps, type ReactNode, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { BookJacket } from "./book-cover";
import type { BookPresentation } from "@/lib/book-artwork";

type OpeningBook = BookPresentation;
type OpeningRequest = { book: OpeningBook; href: string; source: HTMLAnchorElement; bounds: DOMRect };
type OpeningContext = { begin: (book: OpeningBook, href: string, source: HTMLAnchorElement) => boolean };
const BookOpeningContext = createContext<OpeningContext | null>(null);

export function BookOpeningProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [request, setRequest] = useState<OpeningRequest | null>(null);
  const [navigating, setNavigating] = useState(false);
  const active = useRef<OpeningRequest | null>(null);
  const navigationStarted = useRef(false);
  const volume = useRef<HTMLDivElement>(null);
  const front = useRef<HTMLDivElement>(null);
  const animations = useRef<Animation[]>([]);
  const navigationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancel = useCallback((restoreFocus = false) => {
    animations.current.forEach(animation => animation.cancel());
    animations.current = [];
    if (navigationTimer.current) clearTimeout(navigationTimer.current);
    navigationTimer.current = null;
    if (restoreFocus) active.current?.source.focus({ preventScroll: true });
    active.current = null;
    navigationStarted.current = false;
    setRequest(null);
    setNavigating(false);
  }, []);

  const begin = useCallback((book: OpeningBook, href: string, source: HTMLAnchorElement) => {
    if (active.current) return true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || typeof Element.prototype.animate !== "function") return false;
    const nearby = source.closest(".book-entry, .night-book-item, .shelf-book");
    const candidates = nearby?.querySelectorAll<HTMLElement>("[data-book-cover-slug]") ?? document.querySelectorAll<HTMLElement>("[data-book-cover-slug]");
    const jacket = Array.from(candidates).find(element => {
      const bounds = element.getBoundingClientRect();
      return element.dataset.bookCoverSlug === book.slug && bounds.bottom > 0 && bounds.top < window.innerHeight;
    });
    const image = jacket?.querySelector<HTMLImageElement>("img");
    if (!jacket || !image?.complete || !image.naturalWidth) return false;
    const next = { book, href, source, bounds: jacket.getBoundingClientRect() };
    active.current = next;
    navigationStarted.current = false;
    setNavigating(false);
    setRequest(next);
    return true;
  }, []);

  useEffect(() => {
    const onBack = () => cancel();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && active.current && !navigationStarted.current) { event.preventDefault(); cancel(true); }
    };
    window.addEventListener("popstate", onBack);
    window.addEventListener("pagehide", onBack);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("popstate", onBack);
      window.removeEventListener("pagehide", onBack);
      window.removeEventListener("keydown", onKey);
      animations.current.forEach(animation => animation.cancel());
      if (navigationTimer.current) clearTimeout(navigationTimer.current);
    };
  }, [cancel]);

  useEffect(() => {
    // Remove the board after the destination's first paint, not before it renders.
    const frame = requestAnimationFrame(() => cancel());
    return () => cancelAnimationFrame(frame);
  }, [pathname, cancel]);

  useLayoutEffect(() => {
    if (!request || !volume.current || !front.current) return;
    const current = request;
    const width = Math.min(285, window.innerWidth * .44, window.innerHeight * .4);
    const height = width * 1.5;
    const dx = current.bounds.x + current.bounds.width / 2 - window.innerWidth / 2;
    const dy = current.bounds.y + current.bounds.height / 2 - window.innerHeight / 2;
    const scaleX = current.bounds.width / width;
    const scaleY = current.bounds.height / height;
    const model = volume.current;
    model.style.width = `${width}px`;
    model.style.height = `${height}px`;
    model.style.marginLeft = `${-width / 2}px`;
    model.style.marginTop = `${-height / 2}px`;
    let stopped = false;
    const play = (element: Element, frames: Keyframe[], options: KeyframeAnimationOptions) => {
      const animation = element.animate(frames, { fill: "forwards", ...options });
      animations.current.push(animation);
      return animation.finished;
    };
    const navigate = () => {
      if (stopped || active.current !== current) return;
      navigationStarted.current = true;
      setNavigating(true);
      router.push(current.href);
      // A slow route must never leave the interface behind a permanent overlay.
      navigationTimer.current = setTimeout(() => cancel(), 1800);
    };
    const run = async () => {
      try {
        await play(model, [
          { transform: `translate(${dx}px, ${dy}px) scale(${scaleX}, ${scaleY})` },
          { transform: "translate(0, 0) scale(1)" },
        ], { duration: 260, easing: "cubic-bezier(.2,.7,.2,1)" });
        if (stopped) return;
        const turns = [play(model, [{ transform: "translateX(0)" }, { transform: `translateX(${width * .43}px)` }], { duration: 540, easing: "cubic-bezier(.3,0,.2,1)" })];
        turns.push(play(front.current!, [
          { transform: "rotateY(0deg)", boxShadow: "7px 4px 14px #0005" },
          { transform: "rotateY(-82deg)", boxShadow: "25px 12px 30px #0007", offset: .52 },
          { transform: "rotateY(-153deg)", boxShadow: "3px 3px 7px #0003" },
        ], { duration: 540, easing: "cubic-bezier(.3,0,.2,1)" }));
        model.querySelectorAll<HTMLElement>("[data-opening-leaf]").forEach((leaf, index) => {
          turns.push(play(leaf, [
            { transform: "rotateY(0deg)", filter: "brightness(1)" },
            { transform: `rotateY(${-132 + index * 9}deg)`, filter: "brightness(.92)" },
          ], { duration: 410, delay: 70 + index * 45, easing: "cubic-bezier(.3,0,.2,1)" }));
        });
        await Promise.all(turns);
        navigate();
      } catch {
        // Cancellation is expected; other animation failures use normal navigation.
        if (!stopped && active.current === current) { cancel(); router.push(current.href); }
      }
    };
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduce = () => { if (reducedMotion.matches) { stopped = true; cancel(); router.push(current.href); } };
    reducedMotion.addEventListener("change", reduce);
    const prepare = async () => {
      // A cached source image can still need decoding in this new element.
      // Keep the catalogue visible until the moving jacket can paint its art.
      const fallback = () => {
        if (stopped || active.current !== current) return;
        stopped = true;
        cancel();
        router.push(current.href);
      };
      navigationTimer.current = setTimeout(fallback, 1200);
      try {
        const image = model.querySelector("img");
        if (image) await image.decode();
        if (stopped || active.current !== current) return;
        if (navigationTimer.current) clearTimeout(navigationTimer.current);
        navigationTimer.current = null;
        model.parentElement?.setAttribute("data-opening-ready", "");
        await run();
      } catch { fallback(); }
    };
    void prepare();
    return () => { stopped = true; reducedMotion.removeEventListener("change", reduce); };
  }, [request, router, cancel]);

  return <BookOpeningContext.Provider value={{ begin }}>
    {children}
    {request && createPortal(<div className="book-opening" data-book-opening={request.book.slug}>
      <div className="book-opening__scrim" />
      <div className="book-opening__volume" ref={volume} aria-hidden="true">
        <div className="book-opening__paper-block"><small>ORIFOLIO / BOOKS</small><strong>{request.book.title}</strong><span>{request.book.subtitle}</span></div>
        {[0, 1, 2].map(leaf => <div key={leaf} className="book-opening__leaf" data-opening-leaf><span>{request.book.title}</span></div>)}
        <div className="book-opening__front" ref={front}>
          <div className="book-opening__outer"><BookJacket book={request.book} eager /></div>
          <div className="book-opening__endpaper"><small>ORIFOLIO</small><span>{request.book.title}</span></div>
        </div>
      </div>
      <p className="book-opening__status" role="status">「{request.book.title}」{navigating ? "の本文を表示しています" : "を開いています"}{!navigating && <span>Escでキャンセル</span>}</p>
    </div>, document.body)}
  </BookOpeningContext.Provider>;
}

type BookOpenLinkProps = Omit<ComponentProps<typeof Link>, "href" | "onNavigate"> & { book: OpeningBook; href?: string };

export function BookOpenLink({ book, href = book.url, children, ...props }: BookOpenLinkProps) {
  const context = useContext(BookOpeningContext);
  const anchor = useRef<HTMLAnchorElement>(null);
  return <Link {...props} href={href} ref={anchor} data-open-book={book.slug} onNavigate={event => {
    if (anchor.current && context?.begin(book, href, anchor.current)) event.preventDefault();
  }}>{children}</Link>;
}

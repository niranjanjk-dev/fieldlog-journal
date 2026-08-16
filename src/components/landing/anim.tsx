import { useEffect, useRef, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  stagger?: boolean;
  as?: "div" | "section" | "li" | "header" | "footer";
};

/** Soft upward reveal on scroll, powered by GSAP + ScrollTrigger. */
export function Reveal({
  children,
  className = "",
  delay = 0,
  y = 20,
  stagger = false,
  as: Tag = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let ctx: { revert: () => void } | undefined;
    let cancelled = false;

    (async () => {
      try {
        const [{ gsap }, { ScrollTrigger }] = await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          gsap.set(el, { opacity: 1, autoAlpha: 1 });
          return;
        }
        ctx = gsap.context(() => {
          const targets = stagger ? Array.from(el.children) : [el];
          if (stagger) gsap.set(el, { autoAlpha: 1 });
          gsap.fromTo(
            targets,
            { autoAlpha: 0, y },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.65,
              delay,
              ease: "power2.out",
              stagger: stagger ? 0.08 : 0,
              scrollTrigger: { trigger: el, start: "top 92%", once: true },
            },
          );
        }, el);
      } catch {
        if (el) el.style.opacity = "1";
      }
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [delay, y, stagger]);

  return (
    // @ts-expect-error polymorphic ref
    <Tag ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </Tag>
  );
}

/** Scroll-triggered number count-up. */
export function CountUp({
  to,
  suffix = "",
  decimals = 0,
}: {
  to: number;
  suffix?: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let ctx: { revert: () => void } | undefined;
    let cancelled = false;
    (async () => {
      try {
        const [{ gsap }, { ScrollTrigger }] = await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);
        const obj = { v: 0 };
        ctx = gsap.context(() => {
          gsap.to(obj, {
            v: to,
            duration: 1.4,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
            onUpdate: () => {
              el.textContent = obj.v.toFixed(decimals) + suffix;
            },
          });
        }, el);
      } catch {
        if (el) el.textContent = to.toFixed(decimals) + suffix;
      }
    })();
    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [to, suffix, decimals]);
  return <span ref={ref}>0{suffix}</span>;
}

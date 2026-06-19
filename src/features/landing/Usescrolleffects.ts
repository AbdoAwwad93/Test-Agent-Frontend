"use client";

import { useEffect, useRef } from "react";


export function useHeroParallax() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const offset = window.scrollY * 0.08; 
        el.style.transform = `translateY(${Math.min(offset, 40)}px)`;
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return ref;
}


export function useActiveSectionNav(
 navRef: React.RefObject<HTMLElement | null>,
  sectionIds: string[]
) {
  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const link = navRef.current?.querySelector(
            `a[href="#${entry.target.id}"]`
          );
          if (!link) return;

          if (entry.isIntersecting) {
            navRef.current
              ?.querySelectorAll("a")
              .forEach((a) => a.classList.remove("active"));
            link.classList.add("active");
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [navRef, sectionIds]);
}
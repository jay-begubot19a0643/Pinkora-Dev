'use client';

import { useEffect, useRef } from 'react';

export function LandingExperience({ children }: { children: React.ReactNode }) {
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = mainRef.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const reveals = Array.from(root.querySelectorAll<HTMLElement>('.next-reveal'));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => entry.target.classList.toggle('is-visible', entry.isIntersecting));
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    );

    reveals.forEach((element) => observer.observe(element));

    let animationFrame = 0;
    const updateScrollEffects = () => {
      animationFrame = 0;
      const progress = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1);
      root.style.setProperty('--landing-scroll-progress', progress.toFixed(3));
    };
    const onScroll = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(updateScrollEffects);
    };

    updateScrollEffects();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return <main ref={mainRef} className="next-landing-experience">{children}</main>;
}

"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export default function ScrollReveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [enhanced, setEnhanced] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }

    setEnhanced(true);
    let inView = false;
    let frame = 0;

    const updateParallax = () => {
      frame = 0;
      if (!inView) return;
      const bounds = element.getBoundingClientRect();
      const distance = window.innerHeight / 2 - (bounds.top + bounds.height / 2);
      const offset = Math.max(-18, Math.min(18, distance * 0.035));
      element.style.setProperty("--parallax-y", `${offset}px`);
    };

    const scheduleParallax = () => {
      if (!frame) frame = window.requestAnimationFrame(updateParallax);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) {
          setVisible(true);
          scheduleParallax();
        } else {
          element.style.setProperty("--parallax-y", "0px");
        }
      },
      { threshold: 0, rootMargin: "0px 0px 12% 0px" },
    );

    observer.observe(element);
    window.addEventListener("scroll", scheduleParallax, { passive: true });
    window.addEventListener("resize", scheduleParallax);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", scheduleParallax);
      window.removeEventListener("resize", scheduleParallax);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`scroll-reveal${enhanced ? " scroll-reveal--enhanced" : ""}${visible ? " scroll-reveal--visible" : ""}${className ? ` ${className}` : ""}`}
    >
      <div className="scroll-reveal__contenido">{children}</div>
    </div>
  );
}

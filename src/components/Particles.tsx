"use client";

import { useEffect, useRef } from "react";

export function Particles() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    for (let i = 0; i < 30; i++) {
      const p = document.createElement("div");
      p.className = "particle";
      p.style.left = Math.random() * 100 + "%";
      p.style.animationDelay = Math.random() * 6 + "s";
      p.style.animationDuration = 4 + Math.random() * 4 + "s";
      const size = 2 + Math.random() * 4;
      p.style.width = size + "px";
      p.style.height = size + "px";
      container.appendChild(p);
    }
    return () => {
      container.innerHTML = "";
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
    />
  );
}

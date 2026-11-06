"use client";

import { useEffect, useRef } from "react";

export function GoldBurst() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    const pieces = Array.from({ length: 90 }, () => ({
      x: canvas.width * 0.5 + (Math.random() - 0.5) * 80,
      y: canvas.height * 0.42,
      vx: (Math.random() - 0.5) * 9,
      vy: Math.random() * -8 - 2,
      size: Math.random() * 4 + 1.5,
      life: 1,
      gold: Math.random() > 0.35,
    }));

    let frame = 0;
    const tick = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach((piece) => {
        piece.x += piece.vx;
        piece.y += piece.vy;
        piece.vy += 0.12;
        piece.life -= 0.012;
        context.globalAlpha = Math.max(piece.life, 0);
        context.fillStyle = piece.gold ? "#E4C56A" : "#F3E6C4";
        context.fillRect(piece.x, piece.y, piece.size, piece.size * 1.6);
      });
      context.globalAlpha = 1;
      if (pieces.some((piece) => piece.life > 0)) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return <canvas ref={ref} className="pointer-events-none fixed inset-0 z-[96]" aria-hidden />;
}

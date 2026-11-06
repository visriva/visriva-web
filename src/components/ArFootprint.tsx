"use client";

import { useEffect, useRef, useState } from "react";

export function ArFootprint() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [live, setLive] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      const stream = videoRef.current?.srcObject;
      if (stream instanceof MediaStream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  async function start() {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setLive(true);
    } catch {
      setError("The camera needs permission, and this page needs a secure connection.");
    }
  }

  function stop() {
    const stream = videoRef.current?.srcObject;
    if (stream instanceof MediaStream) stream.getTracks().forEach((track) => track.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
    setLive(false);
  }

  return (
    <div className="border border-gold/30 bg-deep">
      <div className="relative aspect-[4/3] overflow-hidden bg-ink">
        <video ref={videoRef} className="h-full w-full object-cover" playsInline muted />
        <div className="pointer-events-none absolute inset-[12%] border border-gold">
          <span className="absolute -top-px left-0 h-6 w-6 border-l border-t border-gold" />
          <span className="absolute -top-px right-0 h-6 w-6 border-r border-t border-gold" />
          <span className="absolute -bottom-px left-0 h-6 w-6 border-b border-l border-gold" />
          <span className="absolute -bottom-px right-0 h-6 w-6 border-b border-r border-gold" />
          <span className="absolute left-1/2 top-3 -translate-x-1/2 bg-deep/80 px-3 py-1 font-royal text-[0.62rem] uppercase tracking-[0.22em] text-gold">
            8 × 8 ft guide
          </span>
        </div>
        {live ? null : (
          <div className="absolute inset-0 grid place-items-center px-8 text-center">
            <p className="max-w-sm font-display text-3xl italic text-champagne">
              Hold the phone where the station would stand.
            </p>
          </div>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
        <p className="max-w-md text-sm text-mist/75">
          A frame, not a measured scan. Use it to feel the footprint. Confirm the real floor with the venue.
        </p>
        {live ? (
          <button type="button" onClick={stop} className="border border-gold/50 px-4 py-2 text-[0.68rem] uppercase tracking-[0.18em] text-gold">
            Close camera
          </button>
        ) : (
          <button type="button" onClick={start} className="bg-gold px-4 py-2 text-[0.68rem] uppercase tracking-[0.18em] text-deep">
            Open camera
          </button>
        )}
      </div>
      {error ? <p className="px-5 pb-4 text-sm text-gold-2">{error}</p> : null}
    </div>
  );
}

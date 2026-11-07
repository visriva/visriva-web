"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const moments = [
  {
    title: "The print",
    copy: "They step in and leave holding the proof.",
    image: "/images/party.jpg",
    film: "/films/booth.mp4",
  },
  {
    title: "The portrait",
    copy: "A prompt written for the brand, then a picture they keep.",
    image: "/images/workshop.jpg",
    film: "/films/merchandise.mp4",
  },
  {
    title: "The object",
    copy: "A tote, a magnet, a shirt still warm from the press.",
    image: "/images/toast.jpg",
    film: "/films/merchandise.mp4",
  },
  {
    title: "The headset",
    copy: "A minute out of the room. Then they are back, grinning.",
    image: "/images/stage.jpg",
    film: "/films/floor.mp4",
  },
];

export function GuestMoments({ films = false }: { films?: boolean }) {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-10" aria-labelledby="guests-title">
      <div className="mx-auto max-w-[1500px]">
        <p className="font-royal text-[0.68rem] uppercase tracking-[0.32em] text-gold">
          What guests experience
        </p>
        <h2 id="guests-title" className="mood-logotype mood-logotype-suster-selly mt-3 max-w-2xl text-5xl leading-none sm:text-6xl">
          Short loops. The part they remember.
        </h2>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {moments.map((moment, index) => (
            <Moment key={moment.title} {...moment} film={films ? moment.film : undefined} wide={index === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Moment({
  title,
  copy,
  image,
  film,
  wide,
}: {
  title: string;
  copy: string;
  image: string;
  film?: string;
  wide: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const on = Boolean(entry?.isIntersecting);
        setLive(on);
        const video = videoRef.current;
        if (!video) return;
        if (on) void video.play().catch(() => undefined);
        else video.pause();
      },
      { threshold: 0.45 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <article ref={ref} className={`relative min-h-80 overflow-hidden border border-gold/25 ${wide ? "md:min-h-[32rem]" : ""}`}>
      {film ? (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover grayscale"
          muted
          loop
          playsInline
          poster={image}
        >
          <source src={film} type="video/mp4" />
        </video>
      ) : (
        <Image
          src={image}
          alt=""
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className={`object-cover grayscale contrast-125 brightness-75 ${live ? "ken-burns" : ""}`}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6">
        <h3 className="mood-logotype mood-logotype-suster-selly text-4xl">{title}</h3>
        <p className="mt-2 max-w-sm text-sm text-champagne/90">{copy}</p>
      </div>
    </article>
  );
}

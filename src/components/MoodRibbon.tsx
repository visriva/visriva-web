"use client";

import { moodOrder, moods } from "@/lib/moods";

export function MoodRibbon() {
  return (
    <section
      className="mood-canvas mood-chimela border-y border-white/10 py-16"
      aria-label="House type study — eight reference moods on Visriva"
    >
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-10">
        <p className="type-eyebrow text-gold-2">Type study · All eight moods live on site</p>
        <p className="mt-4 max-w-2xl text-sm font-light leading-relaxed text-mist">
          Each reference palette and logotype informs a band, card, or page on Visriva — one brand,
          many rooms.
        </p>
      </div>
      <div className="mt-10 flex gap-4 overflow-x-auto px-4 pb-4 scrollbar-none sm:gap-5 sm:px-6 lg:px-10">
        {moodOrder.map((id) => {
          const mood = moods[id];
          return (
            <article
              key={id}
              data-mood={id}
              className={`mood-panel mood-${id} flex h-52 w-[min(82vw,18rem)] shrink-0 flex-col justify-between p-6 sm:h-56`}
            >
              <div>
                <p className={`mood-logotype mood-logotype-${id}`}>{mood.sample}</p>
                {mood.subtitle ? (
                  <p className={`mood-logotype-sub mood-logotype-${id} mt-2 opacity-70`}>
                    {mood.subtitle}
                  </p>
                ) : null}
              </div>
              <p className="text-xs font-light leading-relaxed opacity-85">{mood.blurb}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

"use client";

import { SwipeableCMSSlider } from "@/components/framer-ui";
import { galleryItems } from "@/lib/site";

export function GalleryMotionStrip() {
  const items = galleryItems.slice(0, 8).map((item, i) => ({
    id: `g-${i}`,
    title: item.caption,
    copy: item.tag,
    image: item.src,
  }));
  return (
    <div className="mt-10">
      <p className="section-kicker">Swipe the floor</p>
      <div className="mt-4">
        <SwipeableCMSSlider items={items} />
      </div>
    </div>
  );
}
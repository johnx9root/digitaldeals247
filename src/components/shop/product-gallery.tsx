"use client";

import Image from "next/image";
import { useState } from "react";
import { X } from "lucide-react";

export function ProductGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const list = images.length
    ? images
    : [
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
      ];
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  return (
    <>
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => setLightbox(true)}
          className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-muted"
        >
          <Image
            src={list[active]}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            unoptimized={list[active].startsWith("data:")}
          />
          <span className="absolute bottom-3 right-3 rounded-md bg-black/60 px-2 py-1 text-xs text-white">
            Tap to enlarge
          </span>
        </button>
        {list.length > 1 && (
          <div className="flex gap-2 overflow-x-auto">
            {list.map((src, i) => (
              <button
                key={src + i}
                type="button"
                onClick={() => setActive(i)}
                className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-md border-2 ${
                  i === active ? "border-brand-blue" : "border-transparent"
                }`}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="80px"
                  unoptimized={src.startsWith("data:")}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setLightbox(false)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white"
            aria-label="Close"
            onClick={() => setLightbox(false)}
          >
            <X />
          </button>
          <div
            className="relative h-[80vh] w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={list[active]}
              alt={title}
              fill
              className="object-contain"
              sizes="100vw"
              unoptimized={list[active].startsWith("data:")}
            />
          </div>
        </div>
      )}
    </>
  );
}

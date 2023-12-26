"use client";
import React from "react";
import {
  GlowingStarsBackgroundCard,
  GlowingStarsDescription,
  GlowingStarsTitle,
} from "./GlowingStarsUI";

export function GlowingStarsCard() {
  return (
    <div className="flex items-center justify-center py-20 antialiased [&_h2]:m-0">
      <GlowingStarsBackgroundCard>
        <GlowingStarsTitle>Comestic</GlowingStarsTitle>
        <div className="flex items-end justify-between">
          <GlowingStarsDescription>
            Discover the best comestic products ever in Canada
          </GlowingStarsDescription>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[hsla(0,0%,100%,.1)]">
            <Icon />
          </div>
        </div>
      </GlowingStarsBackgroundCard>
    </div>
  );
}

const Icon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      className="h-4 w-4 stroke-2 text-white"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
      />
    </svg>
  );
};

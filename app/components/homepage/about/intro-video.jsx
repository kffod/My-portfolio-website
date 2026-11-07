"use client";
// About section visual: your intro video once utils/data/intro-video.js has one, otherwise your photo.
// The video only loads when the visitor presses play (nothing autoplays, nothing slows the page).
import { introVideo } from "@/utils/data/intro-video";
import { personalData } from "@/utils/data/personal-data";
import Image from "next/image";
import { useState } from "react";
import { FaPlay } from "react-icons/fa";

// full class names so Tailwind keeps them
const FRAMES = {
  "16:9": "aspect-video w-full max-w-[560px]",
  "9:16": "aspect-[9/16] w-full max-w-[300px]",
  "1:1": "aspect-square w-full max-w-[420px]",
  "4:5": "aspect-[4/5] w-full max-w-[380px]",
};

function youtubeIdOf(value) {
  const v = String(value || "").trim();
  if (!v) return "";
  const m = v.match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/|\/live\/)([\w-]{11})/);
  if (m) return m[1];
  return /^[\w-]{11}$/.test(v) ? v : "";
}

function IntroVideo() {
  const [playing, setPlaying] = useState(false);
  const ytId = youtubeIdOf(introVideo.youtubeId);
  const src = String(introVideo.src || "").trim();

  // no video yet: the photo, as before
  if (!ytId && !src) {
    return (
      <Image
        src={personalData.profile}
        width={280}
        height={280}
        alt={personalData.name}
        className="rounded-lg transition-all duration-1000 grayscale hover:grayscale-0 cursor-pointer"
      />
    );
  }

  const frame = FRAMES[introVideo.aspect] || FRAMES["16:9"];
  const title = introVideo.title || `${personalData.name}: introduction`;
  // cover: your own poster, else the thumbnail set on YouTube, else your profile photo
  const poster = introVideo.poster || (ytId ? `https://i.ytimg.com/vi/${ytId}/maxresdefault.jpg` : personalData.profile);

  return (
    <div className={`m-zoom relative overflow-hidden rounded-lg border border-line bg-black ${frame}`}>
      {playing && ytId && (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}

      {playing && !ytId && (
        <video
          className="absolute inset-0 h-full w-full bg-black object-contain"
          src={src}
          poster={introVideo.poster || undefined}
          controls
          autoPlay
          playsInline
          preload="metadata"
        >
          {introVideo.captions && <track kind="captions" src={introVideo.captions} srcLang="en" label="English" default />}
        </video>
      )}

      {!playing && (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play video: ${title}`}
          className="group absolute inset-0 h-full w-full"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={poster}
            alt=""
            className="h-full w-full object-cover"
            onLoad={(e) => {
              // YouTube answers a missing HD thumbnail with a 120px grey placeholder: use the standard one
              if (e.currentTarget.src.includes("maxresdefault") && e.currentTarget.naturalWidth <= 120) {
                e.currentTarget.src = `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`;
              }
            }}
            onError={(e) => {
              if (!e.currentTarget.src.includes("hqdefault") && ytId) e.currentTarget.src = `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`;
            }}
          />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="m-btn flex h-16 w-16 items-center justify-center rounded-full bg-accent text-page shadow-xl shadow-black/40">
              <FaPlay size={20} className="ml-1" />
            </span>
          </span>
          {introVideo.duration && (
            <span className="absolute bottom-3 right-3 rounded bg-page/85 px-2 py-0.5 font-mono text-xs text-white">
              {introVideo.duration}
            </span>
          )}
        </button>
      )}
    </div>
  );
}

export default IntroVideo;

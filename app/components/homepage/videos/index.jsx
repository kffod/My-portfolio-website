"use client";
// @flow strict
// Videos section: your newest non-gaming uploads plus pinned videos. Click a card to play it here.
import { youtube } from "@/utils/data/youtube";
import { useEffect, useState } from "react";
import { BsYoutube } from "react-icons/bs";
import { FaArrowRight, FaPlay } from "react-icons/fa";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const fmt = (iso) => {
  const d = new Date(iso);
  return isNaN(d) ? "" : `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
};

// shown straight away (and kept if the feed can't be reached); titles fill in from /api/youtube
const FALLBACK = youtube.pinned.map((id) => ({ id, title: "", published: "", pinned: true }));

function VideoCard({ video }) {
  const [playing, setPlaying] = useState(false);
  const title = video.title || "Watch on YouTube";

  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-edge/60 bg-gradient-to-br from-page to-deep transition-all duration-300 hover:-translate-y-1 hover:border-violet-500 hover:shadow-[0_0_30px_0_rgb(var(--c-violet-600)/0.25)]">
      <div className="relative aspect-video w-full bg-black">
        {playing ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button onClick={() => setPlaying(true)} className="absolute inset-0 h-full w-full" aria-label={`Play ${title}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
              alt={title}
              loading="lazy"
              className="h-full w-full object-cover opacity-90 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100"
            />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600/90 text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                <FaPlay size={18} className="ml-1" />
              </span>
            </span>
            {video.latest && (
              <span className="absolute left-3 top-3 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-white">
                New
              </span>
            )}
          </button>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <a
          href={`https://www.youtube.com/watch?v=${video.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="line-clamp-2 text-base font-medium text-white transition-colors duration-200 hover:text-accent"
        >
          {title}
        </a>
        {video.published && <p className="mt-2 text-xs text-gray-400">{fmt(video.published)}</p>}
      </div>
    </div>
  );
}

function Videos() {
  const [videos, setVideos] = useState(FALLBACK);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/youtube")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data?.videos?.length) setVideos(data.videos);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div id="videos" className="relative z-50 border-t my-12 lg:my-24 border-line">
      <div className="w-[100px] h-[100px] bg-violet-100 rounded-full absolute top-6 left-[42%] translate-x-1/2 filter blur-3xl opacity-20"></div>

      <div className="flex justify-center -translate-y-[1px]">
        <div className="w-3/4">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-violet-500 to-transparent w-full" />
        </div>
      </div>

      <div className="flex justify-center my-5 lg:py-8">
        <div className="flex items-center">
          <span className="w-24 h-[2px] bg-raised"></span>
          <span className="bg-raised w-fit text-white p-2 px-5 text-xl rounded-md flex items-center gap-2">
            <BsYoutube className="text-red-500" size={20} /> Videos
          </span>
          <span className="w-24 h-[2px] bg-raised"></span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {videos.map((video) => (
          <VideoCard video={video} key={video.id} />
        ))}
      </div>

      <div className="flex justify-center mt-8 lg:mt-12">
        <a
          href={youtube.channelUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:gap-3 rounded-full bg-gradient-to-r from-red-600 to-pink-500 px-6 md:px-8 py-3 md:py-4 text-xs md:text-sm font-medium uppercase tracking-wider text-white transition-all duration-200"
        >
          <BsYoutube size={18} />
          <span>View my channel</span>
          <FaArrowRight size={14} />
        </a>
      </div>
    </div>
  );
}

export default Videos;

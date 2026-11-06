// GET /api/youtube: videos for the Videos section.
// Returns your pinned videos (with titles) plus your newest non-gaming uploads.
// Uses YouTube's public oEmbed and RSS feeds, so no API key is needed. Cached for 6 hours.
import { youtube } from "@/utils/data/youtube";
import { NextResponse } from "next/server";

export const revalidate = 21600; // 6 hours

const CACHE = { next: { revalidate } };
const UA = { "user-agent": "Mozilla/5.0 (portfolio video feed)" };

const decode = (s) =>
  String(s || "")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#x27;/g, "'");

async function resolveChannelId() {
  if (/^UC[\w-]{22}$/.test(youtube.channelId || "")) return youtube.channelId;
  const res = await fetch(youtube.channelUrl, { ...CACHE, headers: UA });
  if (!res.ok) throw new Error(`channel page ${res.status}`);
  const html = await res.text();
  const m =
    html.match(/"channelId":"(UC[\w-]{22})"/) ||
    html.match(/youtube\.com\/channel\/(UC[\w-]{22})/) ||
    html.match(/"externalId":"(UC[\w-]{22})"/);
  if (!m) throw new Error("channel id not found");
  return m[1];
}

async function latestUploads() {
  const id = await resolveChannelId();
  const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${id}`, { ...CACHE, headers: UA });
  if (!res.ok) throw new Error(`feed ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(([, e]) => ({
    id: (e.match(/<yt:videoId>([^<]+)<\/yt:videoId>/) || [])[1],
    title: decode((e.match(/<title>([^<]*)<\/title>/) || [])[1]),
    published: (e.match(/<published>([^<]+)<\/published>/) || [])[1] || "",
  })).filter((v) => v.id);
}

async function titleFor(id) {
  try {
    const url = `https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}&format=json`;
    const res = await fetch(url, CACHE);
    if (!res.ok) return "";
    return decode((await res.json()).title);
  } catch {
    return "";
  }
}

const isExcluded = (title) => {
  const t = String(title || "").toLowerCase();
  return youtube.excludeWords.some((w) => t.includes(w.toLowerCase()));
};

export async function GET() {
  let uploads = [];
  try {
    uploads = await latestUploads();
  } catch (error) {
    console.error("youtube: couldn't read the channel feed:", error?.message);
  }
  const byId = new Map(uploads.map((v) => [v.id, v]));

  const pinned = await Promise.all(
    youtube.pinned.map(async (id) => ({
      id,
      title: byId.get(id)?.title || (await titleFor(id)),
      published: byId.get(id)?.published || "",
      pinned: true,
    }))
  );

  const pinnedIds = new Set(youtube.pinned);
  const latest = youtube.autoLatest
    ? uploads
        .filter((v) => !pinnedIds.has(v.id) && !isExcluded(v.title))
        .slice(0, youtube.maxLatest)
        .map((v) => ({ ...v, latest: true }))
    : [];

  return NextResponse.json({ channelUrl: youtube.channelUrl, videos: [...latest, ...pinned] });
}

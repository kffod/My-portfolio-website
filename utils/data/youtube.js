// YouTube settings for the Videos section, the hero/contact icons and the terminal.
//
// pinned:       videos always shown first, in this order (add or remove IDs any time)
// autoLatest:   also show your newest uploads automatically (read from the channel's public feed)
// excludeWords: newest uploads whose title contains any of these words are skipped,
//               so gaming videos don't show up. Edit to taste. Pinned videos are never filtered.

export const youtube = {
  channelUrl: "https://www.youtube.com/@sophisticatedguyd",
  handle: "@sophisticatedguyd",
  // Optional: your channel ID (starts with "UC"). Leave "" and it's looked up from the handle.
  channelId: "",

  pinned: [
    "15lSETas4Dk",
    "cyKg2IjYONk",
    "ApvHUTxlay0",
    "t86n77SG8fQ",
    "F9ydWBgGUXc",
  ],

  autoLatest: true,
  maxLatest: 3,

  excludeWords: [
    "gaming", "gameplay", "game play", "live stream", "livestream", "stream highlights",
    "bgmi", "pubg", "free fire", "freefire", "valorant", "minecraft", "gta", "fortnite",
    "call of duty", "cod mobile", "codm", "apex", "warzone", "roblox", "clash", "fifa",
    "efootball", "pokemon", "rank push", "headshot", "clutch", "lobby",
  ],
};

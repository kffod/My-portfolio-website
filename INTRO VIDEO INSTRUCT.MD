Upload it to YouTube at 1920×1080, 16:9.
Set visibility to Unlisted if you don't want it in your channel feed, or Public if you do. Both play on your site.
Leave Allow embedding on. It's on by default, under Show more → License.
Set a custom thumbnail (1280×720), ideally a frame where you're looking at the camera. Your site uses it as the cover automatically.
Copy the link: Share → Copy.
Paste it into utils/data/intro-video.js:

youtubeId: "https://youtu.be/AbCdEfGhIjK",
aspect: "16:9",
duration: "1:05",   // the real length, or leave ""
Leave src empty, and leave poster empty too unless you want a different cover from your YouTube thumbnail. 
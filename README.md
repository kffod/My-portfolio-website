# Sachin Jadhav: Portfolio

**Live:** https://www.sachinjadhavofficial.com

Personal portfolio of Sachin Jadhav, AI Full-Stack Engineer at DXC Technology. One repo holds everything:

- **The main site:** Next.js 14, Tailwind CSS
- **Terminal Mode:** an interactive terminal portfolio, embedded on the home page and also at [`/terminal`](https://www.sachinjadhavofficial.com/terminal)
- **Ask my portfolio:** a small RAG assistant over the site's own data with cited answers. Free by default (no AI model needed); can use a free LLM key

## Project layout

```
app/                     Next.js pages and components
  api/ask/route.js       "Ask my portfolio" endpoint (retrieval + Claude, rate-limited)
  components/homepage/   page sections (about, terminal, projects, certifications, ...)
utils/data/              all site content: experience, projects, skills, certifications, posts
utils/ask/               knowledge base + retriever for the assistant
public/terminal/         the terminal portfolio (plain HTML/CSS/JS, no build step)
  index.html, script.js, styles.css, loading.js
  commands/              one file per command (about.html, integral.js, ask.js, ...)
```

To change site content, edit the files in `utils/data/`. The assistant reads the same files, so its answers stay in sync.

## Terminal Mode

Edit the terminal directly in `public/terminal/`. It's served as static files, so changes show up on refresh.

| Command | What it does |
|---|---|
| `help` | list all commands |
| `about`, `experience`, `education`, `skills`, `projects`, `certifications` | portfolio sections |
| `integral [arch\|stack]` | simulated demo of Integral Assistant (approve/reject gate, Ctrl+C to stop) |
| `ask <question>` | ask about my work, with cited sources (uses `/api/ask`) |
| `posts` | my LinkedIn posts |
| `neofetch`, `sudo hire-sachin`, `theme [default\|green\|amber]` | extras |
| `play` | Guardrail: approve an AI agent's safe actions, reject the dangerous ones (30s) |
| `ctf` | capture the flag (tools: `ls`, `cat`, `decode`, `rot13`, `hint`, `submit`) |
| `achievements` | progress, shared with the corner badge on the site |
| `resume`, `links`, `open <name>`, `contact`, `surprise`, `clear` | misc |

The home page sends commands into the embedded terminal with
`postMessage({ type: "terminal:run", command })`; only messages from the same origin are accepted.

## Run locally

```bash
npm install
cp .env.example .env.local   # optional: add a free LLM key
npm run dev                  # http://localhost:3000
```

## Environment variables

All optional. With no model key set, the assistant answers for free with the best-matching sentences from the site, with citations. If a model call fails (for example a free-tier rate limit), it falls back to that mode automatically.

| Variable | Required | Purpose |
|---|---|---|
| `LLM_API_KEY`, `LLM_BASE_URL`, `LLM_MODEL` | no | any OpenAI-compatible model (e.g. a free Groq or Gemini key) |
| `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL` | no | use Claude instead (used first if set) |
| `ASK_RATE_LIMIT`, `ASK_DAILY_LIMIT` | no | assistant limits (default 8 per visitor per 10 min, 300 per day) |
| `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` | for the contact form | free key from web3forms.com; without it the form opens the visitor's email app |

## Deploy

Deployed on Vercel. Add the environment variables under **Settings → Environment Variables**, and the domain under
**Settings → Domains** (`sachinjadhavofficial.com` redirecting to `www.sachinjadhavofficial.com`).

// commands/ask.js
// `ask <question>` sends a question to the portfolio assistant (/api/ask on the main Next.js site:
// retrieval over my portfolio data, answers with citations). Opened on its own, outside the
// main site, there's no API, so it points visitors to the main site instead.

const MAIN_SITE = "https://www.sachinjadhavofficial.com";
const FRAMES = "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏";
let counter = 0;

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

export function render(raw) {
  const question = String(raw || "").replace(/^\s*ask\b/i, "").trim();
  if (question.length < 3) {
    return `usage: <span class="text-red">ask</span> &lt;question&gt;<br>` +
      `<span class="text-gray">e.g. ask what did sachin build at dxc?</span>`;
  }
  counter += 1;
  return `<div class="ask-box" id="ask-${counter}" data-pending="1" data-q="${esc(question.slice(0, 300))}">` +
    `<span class="text-gray">◆ searching my portfolio <span class="ask-spin">${FRAMES[0]}</span></span></div>`;
}

function absolute(url) {
  try { return new URL(url, window.location.origin).href; } catch (e) { return "#"; }
}

function format(data) {
  const answer = esc(data.answer || "").replace(/\[(\d+)\]/g, '<span class="text-green">[$1]</span>');
  const sources = (data.sources || [])
    .map((s) => `<span class="text-green">[${Number(s.n)}]</span> ` +
      (s.url ? `<a href="${esc(absolute(s.url))}" target="_blank" rel="noopener">${esc(s.title)}</a>` : esc(s.title)))
    .join("<br>");
  return `<span class="text-pink">answer ›</span> ${answer}` +
    (sources ? `<br><br><span class="text-gray">sources</span><br>${sources}` : "") +
    `<br><span class="text-gray">${data.mode === "ai" ? "AI-written from my portfolio. It can make mistakes." : "matched from my portfolio content."}</span>`;
}

export async function run() {
  const pending = document.querySelectorAll('.ask-box[data-pending="1"]');
  const box = pending[pending.length - 1];
  if (!box) return;
  box.removeAttribute("data-pending");
  const question = box.getAttribute("data-q") || "";
  // The terminal rewrites its output HTML right after a command runs, which replaces this element,
  // so always look the box up again by id instead of keeping a reference to it.
  const id = box.id;
  const current = () => document.getElementById(id);

  let frame = 0;
  const spinner = setInterval(() => {
    const s = current()?.querySelector(".ask-spin");
    if (s) s.textContent = FRAMES[++frame % FRAMES.length];
  }, 90);

  let html;
  try {
    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    const type = res.headers.get("content-type") || "";
    if (res.status === 404 || !type.includes("application/json")) throw new Error("no-api");
    const data = await res.json();
    html = res.ok ? format(data) : `<span class="text-red">${esc(data.error || "something went wrong")}</span>`;
  } catch (e) {
    html = `<span class="text-yellow">ask runs on my main site.</span> ` +
      `<a href="${MAIN_SITE}/#terminal" target="_blank" rel="noopener">open the terminal there ↗</a>`;
  } finally {
    clearInterval(spinner);
  }

  const target = current();
  if (target) target.innerHTML = html;
  const shell = document.getElementById("shell");
  if (shell) shell.scrollTop = shell.scrollHeight;
}

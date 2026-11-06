// commands/games.js
// Mini-games, a capture-the-flag and achievements for the terminal.
//   play           Guardrail: approve the AI agent's safe actions, reject the dangerous ones (30 seconds)
//   ctf            find the hidden flag, then `submit flag{...}`   (tools: ls, cat, decode, rot13, hint)
//   hack           a harmless movie-style "hack"
//   achievements   progress, shared with the main site (same browser storage)
// script.js routes these commands here through COMMANDS, RAW, render(), after() and onCommand().

const EMBEDDED = window.self !== window.top;
const STORE_KEY = "portfolio-achievements";
const THEMES_KEY = "portfolio-themes-seen";
const BEST_KEY = "portfolio-guardrail-best";
const VERIFY_RE = /credly\.com|skills\.google|cloudskillsboost|forage-uploads/;

// keep in sync with utils/achievements.js on the main site
export const ACHIEVEMENTS = [
  { id: "root", icon: "🔑", title: "Root access", hint: "run sudo hire-sachin" },
  { id: "approver", icon: "✅", title: "Approver", hint: "approve the write in the integral demo" },
  { id: "guardian", icon: "🛡️", title: "Guardian", hint: "score 8 or more in the Guardrail game (play)" },
  { id: "flag", icon: "🚩", title: "Flag captured", hint: "solve the capture-the-flag (ctf)" },
  { id: "chameleon", icon: "🎨", title: "Theme hacker", hint: "try all three themes" },
  { id: "verifier", icon: "🔍", title: "Verifier", hint: "open a certificate's verification page" },
  { id: "curious", icon: "💬", title: "Curious", hint: "ask my portfolio a question (ask ...)" },
  { id: "konami", icon: "🕹️", title: "Old school", hint: "a famous 1986 cheat code. try it anywhere" },
];

export const COMMANDS = ["play", "ctf", "ls", "cat", "decode", "base64", "rot13", "submit", "hint", "hack", "achievements"];
// these get the visitor's input with its original capitalisation (base64 is case-sensitive)
export const RAW = new Set(["decode", "base64", "rot13", "submit"]);

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const ABORT = Symbol("abort");
const red = (s) => `<span class="text-red">${s}</span>`;
const gray = (s) => `<span class="text-gray">${s}</span>`;
const green = (s) => `<span class="text-green">${s}</span>`;

function read(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (e) {
    return fallback;
  }
}
function write(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
}
function scroll() {
  const shell = document.getElementById("shell");
  if (shell) shell.scrollTop = shell.scrollHeight;
}
function append(html) {
  const out = document.getElementById("output");
  if (out && html) {
    out.insertAdjacentHTML("beforeend", html);
    scroll();
  }
}
function argOf(raw) {
  const s = String(raw || "").trim().replace(/^\S+\s*/, "");
  return s === "undefined" ? "" : s;
}

// ---------------------------------------------------------------- achievements
const announced = new Set();

export function unlock(id) {
  const def = ACHIEVEMENTS.find((a) => a.id === id);
  if (!def || announced.has(id) || read(STORE_KEY, []).includes(id)) return "";
  announced.add(id);
  if (EMBEDDED) {
    // the main site saves it and shows a notification
    try { window.parent.postMessage({ type: "portfolio:unlock", id }, window.location.origin); } catch (e) {}
  } else {
    write(STORE_KEY, [...new Set([...read(STORE_KEY, []), id])]);
  }
  return `<div class="text-yellow">🏆 achievement unlocked: ${def.icon} ${esc(def.title)} ${gray("(type 'achievements')")}</div>`;
}

function achievementsList() {
  const have = new Set(read(STORE_KEY, []));
  announced.forEach((id) => have.add(id));
  const width = Math.max(...ACHIEVEMENTS.map((a) => a.title.length)) + 3;
  const rows = ACHIEVEMENTS.map((a) =>
    have.has(a.id)
      ? `${green("✓")} ${a.icon} ${esc(a.title)}`
      : `${gray("·")} 🔒 ${esc(a.title.padEnd(width, " "))}${gray(esc(a.hint))}`
  );
  return `<div class="text-yellow">🏆 ACHIEVEMENTS ${have.size}/${ACHIEVEMENTS.length}</div>` +
    `<pre style="margin:4px 0">${rows.join("\n")}</pre>` +
    gray("progress is saved only in this browser, and shared with the main site.");
}

// ---------------------------------------------------------------- capture the flag
const SECRET = "cm90MTM6IHN5bnR7dWh6bmFfdmFfZ3VyX3liYmN9";
const rot13 = (s) => s.replace(/[a-z]/gi, (c) => {
  const base = c <= "Z" ? 65 : 97;
  return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
});
const FLAG = rot13(atob(SECRET).replace(/^rot13:\s*/, ""));
const FILES = {
  "readme.txt": "Hi! This terminal is a small portfolio. Some things in it are hidden. 👀",
  "notes.md": "- [x] ship Integral Assistant\n- [x] pass all four Claude certifications\n- [ ] delete .secret before deploying (it only shows with ls -a)",
};
const ctf = { notes: false, secret: false, decoded: false, rotated: false };

function ctfIntro() {
  return `<div class="text-yellow">🚩 CAPTURE THE FLAG</div>` +
    `A flag is hidden somewhere in this terminal. Find it, then run ${red("submit")} flag{...}<br>` +
    `${gray("tools:")} ${red("ls")}, ${red("cat")} &lt;file&gt;, ${red("decode")} &lt;base64&gt;, ${red("rot13")} &lt;text&gt;, ${red("hint")}<br>` +
    gray("no brute force needed. good luck.");
}

function ls(arg) {
  const all = /^-\w*a/.test(arg);
  const names = all ? [".", "..", ".secret", "notes.md", "readme.txt", "resume.pdf"] : ["notes.md", "readme.txt", "resume.pdf"];
  return names
    .map((n) => (n.startsWith(".") ? gray(n) : n.endsWith(".pdf") ? `<span class="text-pink">${n}</span>` : n))
    .join("&nbsp;&nbsp;&nbsp;");
}

function cat(arg) {
  const name = arg.trim();
  if (!name) return `usage: ${red("cat")} &lt;file&gt; ${gray("(try ls)")}`;
  if (name === "resume.pdf") return `cat: resume.pdf: binary file. ${gray("try")} ${red("resume")}`;
  if (name === "." || name === "..") return `cat: ${esc(name)}: is a directory`;
  if (name === ".secret") {
    ctf.secret = true;
    return `${esc(SECRET)}<br>${gray("looks like base64... try")} ${red("decode")} ${gray("&lt;text&gt;")}`;
  }
  if (!(name in FILES)) return `cat: ${esc(name)}: no such file ${gray("(try ls)")}`;
  if (name === "notes.md") ctf.notes = true;
  return esc(FILES[name]).replace(/\n/g, "<br>");
}

function decode(arg) {
  const text = arg.trim().replace(/^-d\s+/, "").replace(/\s+/g, "");
  if (!text) return `usage: ${red("decode")} &lt;base64 text&gt;`;
  let out = null;
  if (/^[A-Za-z0-9+/]+={0,2}$/.test(text)) {
    try { out = atob(text); } catch (e) { out = null; }
  }
  if (out === null || /[^\x20-\x7e]/.test(out)) {
    return `decode: that doesn't look like base64 ${gray("(copy the text from .secret exactly)")}`;
  }
  if (text === SECRET) ctf.decoded = true;
  return green(esc(out));
}

function rot13Cmd(arg) {
  const text = arg.trim();
  if (!text) return `usage: ${red("rot13")} &lt;text&gt;`;
  const out = rot13(text);
  if (/flag\{/i.test(out)) ctf.rotated = true;
  return green(esc(out));
}

function submit(arg) {
  const guess = arg.trim().toLowerCase();
  if (!guess) return `usage: ${red("submit")} flag{...}`;
  if (guess !== FLAG) return `${red("✗ that's not the flag.")} ${gray("stuck? type")} ${red("hint")}`;
  return `${green(`🚩 FLAG CAPTURED: ${esc(FLAG)}`)}<br>` +
    `${gray("nice work: curious, methodical and persistent. exactly what I look for in a teammate.")}<br>` +
    `${gray("want to build something together?")} ${red("contact")} ${gray("or")} ${red("sudo hire-sachin")}` +
    unlock("flag");
}

function hint() {
  if (!ctf.notes) return `${gray("hint 1/4:")} look around first. ${red("ls")} lists files and ${red("cat")} reads them.`;
  if (!ctf.secret) return `${gray("hint 2/4:")} notes.md mentions a hidden file. hidden files start with a dot and only show with ${red("ls -a")}.`;
  if (!ctf.decoded) return `${gray("hint 3/4:")} .secret is base64. copy it and run ${red("decode")} &lt;text&gt;.`;
  if (!ctf.rotated) return `${gray("hint 4/4:")} the decoded text names its cipher. ${red("rot13")} &lt;text&gt; undoes it.`;
  return `${gray("last step:")} ${red("submit")} the flag{...} you found.`;
}

// ---------------------------------------------------------------- interactive sessions (play, hack)
const state = { running: false, aborted: false, waiting: null, timer: null };
let boxes = 0;

export function isRunning() {
  return state.running;
}

function answer(value) {
  const resolve = state.waiting;
  state.waiting = null;
  if (resolve) resolve(value);
}

// while a session runs it owns the keyboard: a/r answer, Ctrl+C or Esc quits
document.addEventListener("keydown", (e) => {
  if (!state.running) return;
  e.preventDefault();
  e.stopImmediatePropagation();
  e.stopPropagation();
  const key = (e.key || "").toLowerCase();
  if ((e.ctrlKey && key === "c") || key === "escape") {
    state.aborted = true;
    answer(null);
  } else if (key === "a" || key === "y") answer(true);
  else if (key === "r" || key === "n") answer(false);
}, true);

document.addEventListener("click", (e) => {
  const target = e.target && e.target.closest ? e.target : null;
  if (!target) return;
  const button = target.closest("[data-game-answer]");
  if (button && state.running) {
    e.preventDefault();
    answer(button.getAttribute("data-game-answer") === "approve");
    return;
  }
  const link = target.closest("a[href]");
  if (link && VERIFY_RE.test(link.href)) append(unlock("verifier"));
}, true);

async function session(name, body) {
  const pending = document.querySelectorAll(`[data-game-pending="${name}"]`);
  const host = pending[pending.length - 1];
  if (!host || state.running) return;
  host.removeAttribute("data-game-pending");
  const id = host.id;
  const cmdLine = document.getElementById("command-line");
  state.running = true;
  state.aborted = false;
  if (cmdLine) cmdLine.style.visibility = "hidden";

  // always look elements up by id: script.js rewrites the output HTML after each command
  let n = 0;
  const box = () => {
    const el = document.getElementById(id);
    if (!el || state.aborted) throw ABORT;
    return el;
  };
  const line = (html) => {
    const lid = `${id}-${n++}`;
    box().insertAdjacentHTML("beforeend", `<div id="${lid}">${html}</div>`);
    scroll();
    return lid;
  };
  const set = (lid, html) => {
    const el = document.getElementById(lid);
    if (el) el.innerHTML = html;
  };
  const pause = async (ms) => {
    await sleep(ms);
    if (state.aborted) throw ABORT;
  };

  try {
    await body({ line, set, pause });
  } catch (e) {
    if (e !== ABORT) console.error(e);
    const el = document.getElementById(id);
    if (el) el.insertAdjacentHTML("beforeend", `<div class="text-red">^C stopped</div>`);
  } finally {
    clearInterval(state.timer);
    state.running = false;
    state.aborted = false;
    state.waiting = null;
    if (cmdLine) cmdLine.style.visibility = "visible";
    const input = document.getElementById("command-input");
    if (input) {
      input.value = "";
      input.focus({ preventScroll: true });
    }
    scroll();
  }
}

// ---------------------------------------------------------------- Guardrail
const SAFE = [
  ["read COBOL program P5155 and its copybooks", "reading source changes nothing"],
  ["run a SELECT on the CLIENTS table (first 10 rows)", "a read-only query"],
  ["search the manuals for the reinstatement rules", "retrieval only"],
  ["open the contract enquiry screen (view only)", "looking, not touching"],
  ["summarise what work unit A05432 changed", "a read-only summary"],
  ["generate a .docx report of the analysis", "creates a file for you; the server is untouched"],
  ["list the libraries on the current level", "read-only"],
  ["explain field CHDRNUM in its copybook", "an explanation, nothing more"],
  ["draft a SQL fix and show it for review (not run)", "showing a fix is not running it"],
  ["cite the manual section behind its answer", "citations keep answers honest"],
];
const DANGER = [
  ["run DELETE FROM CLIENTS with no WHERE clause", "that deletes every client"],
  ["compile and promote a program to production", "production changes need a human sign-off"],
  ["update premium rates in table T5687", "a business-rule change on the live system"],
  ["DROP TABLE POLICY_HISTORY", "irreversible"],
  ["email the customer list to an outside address", "that's a data leak"],
  ["write the user's IBM i password to the logs", "passwords are never stored or logged"],
  ["turn off the approval gate to finish faster", "that removes the safety net"],
  ["run CLRLIB on the production library", "clears a production library"],
  ["create a client record on the live system", "a write: it waits for a human"],
  ["answer from memory without citing sources", "ungrounded answers are how hallucinations reach users"],
];
const TIME_LIMIT = 30;

function shuffle(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const button = (value, key, cls) =>
  `<button type="button" data-game-answer="${value}" class="${cls}" style="background:none;border:1px solid currentColor;border-radius:4px;font:inherit;cursor:pointer;padding:0 8px;margin:4px 8px 0 0">[${key}] ${value}</button>`;

async function guardrail({ line, set, pause }) {
  const rounds = shuffle([
    ...shuffle(SAFE).slice(0, 5).map(([t, why]) => ({ t, why, safe: true })),
    ...shuffle(DANGER).slice(0, 5).map(([t, why]) => ({ t, why, safe: false })),
  ]);
  line(`<span class="text-yellow">◆ GUARDRAIL</span> ${gray("· you are the human in the loop")}`);
  line(gray("an AI agent wants to act on a live insurance system. approve the safe actions, reject the dangerous ones."));
  line(`${gray("keys:")} ${green("a")} approve · ${red("r")} reject · ${gray(`Ctrl+C quits · ${TIME_LIMIT}s on the clock`)}`);
  const hud = line("");

  let score = 0;
  let slipped = 0;
  let answered = 0;
  let left = TIME_LIMIT;
  let timedOut = false;
  const drawHud = () =>
    set(hud, `<span class="text-orange">⏱ ${left}s</span>  ${gray("score")} ${green(score)}${gray(`/${rounds.length}`)}`);
  drawHud();
  await pause(900);

  const started = Date.now();
  state.timer = setInterval(() => {
    left = Math.max(0, TIME_LIMIT - Math.floor((Date.now() - started) / 1000));
    drawHud();
    if (left === 0) {
      timedOut = true;
      clearInterval(state.timer);
      answer("timeout");
    }
  }, 250);

  for (let i = 0; i < rounds.length && !timedOut; i++) {
    const r = rounds[i];
    line(`<br>${gray(`[${i + 1}/${rounds.length}]`)} agent wants to: <span class="text-blue">${esc(r.t)}</span>`);
    const prompt = line(`${button("approve", "a", "text-green")}${button("reject", "r", "text-red")}`);
    const choice = await new Promise((resolve) => { state.waiting = resolve; });
    if (state.aborted || choice === null) throw ABORT;
    if (choice === "timeout") {
      set(prompt, `<span class="text-orange">⏱ time's up</span>`);
      break;
    }
    answered++;
    const correct = choice === r.safe;
    if (correct) score++;
    if (choice && !r.safe) slipped++;
    set(prompt, `${correct ? green("✓") : red("✗")} ${choice ? "approved" : "rejected"} ${gray(`· ${r.safe ? "safe" : "dangerous"}: ${esc(r.why)}`)}`);
    drawHud();
    await pause(250);
  }
  clearInterval(state.timer);

  const previous = Number(read(BEST_KEY, 0)) || 0;
  const best = Math.max(previous, score);
  write(BEST_KEY, best);
  const verdict =
    score === rounds.length ? "flawless. you'd make a great approval gate." :
    score >= 8 ? "production-ready guardian." :
    score >= 5 ? "close, but a few things slipped through." :
    "please don't give this agent prod access 😅";

  line(`<br><span class="text-yellow">◆ RESULT</span> ${green(`${score}/${rounds.length}`)} ${timedOut ? gray(`(${answered} answered before time ran out)`) : ""}`);
  line(`${gray(verdict)} ${score > previous ? `<span class="text-pink">new best!</span>` : gray(`best: ${best}`)}`);
  if (slipped) {
    line(`${red(`⚠ ${slipped} dangerous action${slipped > 1 ? "s" : ""} got through.`)} ${gray("that's why Integral Assistant asks a human before any write.")}`);
  } else {
    line(gray("that's the idea behind Integral Assistant: the agent proposes, a human approves every write."));
  }
  if (score >= 8) {
    const won = unlock("guardian");
    if (won) line(won);
  }
  line(`${gray("play again:")} ${red("play")}`);
}

// ---------------------------------------------------------------- hack (easter egg)
const HACK = [
  "initialising ZeroCool v4.20 ...",
  "[*] scanning 10.0.0.0/24 ..................... 3 hosts up",
  "[*] open ports: 22/ssh  23/telnet  992/tn5250",
  "[*] loading exploit: buffer_overflow.cbl",
  "[*] bypassing firewall  ▓▓▓▓▓▓░░░░  62%",
  "[*] bypassing firewall  ▓▓▓▓▓▓▓▓▓▓ 100%",
  "[*] decrypting mainframe: 0x4F 0x72 0x61 0x63 0x6C 0x65 ...",
  "[*] escalating privileges to QSECOFR",
  "[*] downloading the_secret_to_happiness.txt",
];
const hexRow = () =>
  Array.from({ length: 16 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, "0")).join(" ");

async function hack({ line, pause }) {
  for (const step of HACK) {
    line(green(esc(step)));
    await pause(160 + Math.random() * 200);
  }
  for (let i = 0; i < 6; i++) {
    line(gray(hexRow()));
    await pause(60);
  }
  await pause(300);
  line(`<span class="text-green" style="font-size:1.4em;font-weight:bold">█ ACCESS GRANTED █</span>`);
  await pause(900);
  line(gray("...just kidding 😄 nothing was hacked. real systems need a human in the loop."));
  line(`${gray("want a real challenge? try")} ${red("ctf")}`);
}

// ---------------------------------------------------------------- Konami code
const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
let konami = 0;
document.addEventListener("keydown", (e) => {
  const key = e.key && e.key.length === 1 ? e.key.toLowerCase() : e.key;
  konami = key === KONAMI[konami] ? konami + 1 : key === "ArrowUp" ? (konami === 2 ? 2 : 1) : 0;
  if (konami < KONAMI.length) return;
  konami = 0;
  if (EMBEDDED) {
    // the main site switches to retro mode and records the achievement
    try { window.parent.postMessage({ type: "portfolio:konami" }, window.location.origin); } catch (err) {}
    append(`<div class="text-green">🕹️ cheat code accepted: retro mode toggled.</div>`);
  } else {
    document.body.classList.toggle("theme-green");
    append(`<div class="text-green">🕹️ cheat code accepted.</div>` + unlock("konami"));
  }
});

// the Integral demo reports an approved write
window.addEventListener("terminal:achievement", (e) => append(unlock(String(e.detail || ""))));

// ---------------------------------------------------------------- routing from script.js
export function render(name, raw) {
  const arg = argOf(raw);
  switch (name) {
    case "play":
    case "hack":
      return `<div id="game-${++boxes}" data-game-pending="${name}"></div>`;
    case "ctf": return ctfIntro();
    case "ls": return ls(arg);
    case "cat": return cat(arg);
    case "decode":
    case "base64": return decode(arg);
    case "rot13": return rot13Cmd(arg);
    case "submit": return submit(arg);
    case "hint": return hint();
    case "achievements": return achievementsList();
    default: return "";
  }
}

export function after(name) {
  if (name === "play") session("play", guardrail);
  if (name === "hack") session("hack", hack);
}

// achievements earned through existing commands
export function onCommand(command, arg) {
  const a = String(arg || "") === "undefined" ? "" : String(arg || "");
  if (command === "sudo" && a === "hire-sachin") append(unlock("root"));
  if (command === "ask" && a) append(unlock("curious"));
  if (command === "theme") {
    const theme = a === "default" ? "midnight" : a;
    if (["midnight", "green", "amber"].includes(theme)) {
      const seen = read(THEMES_KEY, []);
      if (!seen.includes(theme)) {
        seen.push(theme);
        write(THEMES_KEY, seen);
      }
      if (["midnight", "green", "amber"].every((t) => seen.includes(t))) append(unlock("chameleon"));
    }
  }
}

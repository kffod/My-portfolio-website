// commands/integral.js
// `integral` command — a replay of a session with Integral Assistant,
// my agentic AI assistant for IBM i / SMART/400 (LIFE/Asia), played inside the terminal.
//
//   integral          -> interactive demo (boot, tool calls, 5250 green screen, approval gate)
//   integral arch     -> ASCII architecture diagram
//   integral stack    -> tech stack
//
// The demo is a SIMULATION: no network calls, and the data is made up.

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const ABORT = Symbol("abort");

const state = { running: false, aborted: false, awaiting: null, promptHtml: null };
let runCounter = 0;

export const BANNER = `
██╗███╗   ██╗████████╗███████╗ ██████╗ ██████╗  █████╗ ██╗
██║████╗  ██║╚══██╔══╝██╔════╝██╔════╝ ██╔══██╗██╔══██╗██║
██║██╔██╗ ██║   ██║   █████╗  ██║  ███╗██████╔╝███████║██║
██║██║╚██╗██║   ██║   ██╔══╝  ██║   ██║██╔══██╗██╔══██║██║
██║██║ ╚████║   ██║   ███████╗╚██████╔╝██║  ██║██║  ██║███████╗
╚═╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝
        A S S I S T A N T   ·   a coding agent for the green-screen world`;

const ARCH = `
┌────────────────────────────────────────────────────────────────────────┐
│ Browser · React + TypeScript                                           │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │  HTTP + streaming
┌────────────────────────────────────▼───────────────────────────────────┐
│ Python · FastAPI                                                       │
│ agentic workflow: plan → act → observe → decide                        │
│ human approval gate · grounded, cited answers                          │
└──────────┬─────────────────────────┬─────────────────────────┬─────────┘
           │                         │                         │
┌──────────▼─────────┐  ┌────────────▼───────────┐  ┌──────────▼─────────┐
│ Claude             │  │ RAG                    │  │ MCP server         │
│ via Amazon Bedrock │  │ Bedrock KB · vector DB │  │ IBM i tools · 5250 │
└────────────────────┘  └────────────────────────┘  └──────────┬─────────┘
                                                               │  MCP
                                                        ┌──────▼─────┐
                                                        │ IBM i      │
                                                        │ SMART/400  │
                                                        └────────────┘`;

const STACK = [
  ["platform", "IBM i · SMART/400 R26"],
  ["model", "Claude (via Amazon Bedrock)"],
  ["agents", "agentic workflows: plan → act → observe → decide, human-in-the-loop approval"],
  ["tools", "Model Context Protocol (MCP) server for IBM i and 5250 green screens"],
  ["retrieval", "RAG over a Bedrock Knowledge Base + vector DB, answers with citations"],
  ["backend", "Python · FastAPI"],
  ["frontend", "React + Vite · TypeScript"],
];

// ---------- public API used by script.js ----------
export function isRunning() { return state.running; }
export function isAwaiting() { return typeof state.awaiting === "function"; }
export function answer(value) {
  const resolve = state.awaiting;
  state.awaiting = null;
  if (resolve) resolve(value);
}
export function abort() {
  if (!state.running) return false;
  state.aborted = true;
  if (isAwaiting()) answer("");
  return true;
}

export function render(cmd) {
  let arg = (cmd || "").split(" ")[1] || "";
  if (arg === "undefined") arg = "";
  if (arg === "arch") return archHtml();
  if (arg === "stack") return stackHtml();
  if (arg && arg !== "demo") {
    return `<span class="text-red">integral: unknown option '${esc(arg)}'</span><br>` +
      `usage: <span class="text-red">integral</span> [demo | arch | stack]`;
  }
  runCounter += 1;
  return `<pre class="ascii-art text-green ia-banner">${BANNER}</pre>` +
    `<div class="text-gray">simulated replay · made-up data · press <span class="text-pink">Ctrl+C</span> to interrupt</div><br>` +
    `<div id="ia-run-${runCounter}" class="ia-session" data-pending="1"></div>`;
}

function archHtml() {
  return `<div class="text-yellow">Integral Assistant: runtime architecture</div>` +
    `<pre class="ascii-art text-blue ia-pre">${esc(ARCH)}</pre>` +
    `<div class="text-gray">Claude plans · MCP acts · RAG grounds · a human approves every write</div>`;
}

function stackHtml() {
  const pad = Math.max(...STACK.map(([k]) => k.length)) + 3;
  const rows = STACK.map(([k, v]) =>
    `<span class="text-pink">${k.padEnd(pad, " ")}</span>${esc(v)}`).join("\n");
  return `<div class="text-yellow">Integral Assistant: tech stack</div><pre class="ia-pre">${rows}</pre>`;
}

// ---------- the animated session ----------
export async function run() {
  const pending = document.querySelectorAll('.ia-session[data-pending="1"]');
  const host = pending[pending.length - 1];
  if (!host) return;
  host.removeAttribute("data-pending");
  const id = host.id;

  state.running = true;
  state.aborted = false;
  const cmdLine = document.getElementById("command-line");
  const prompt = document.getElementById("prompt");
  state.promptHtml = prompt.innerHTML;
  cmdLine.style.visibility = "hidden";

  let n = 0;
  const box = () => {
    const b = document.getElementById(id);
    if (!b || state.aborted) throw ABORT;
    return b;
  };
  const scroll = () => {
    const shell = document.getElementById("shell");
    shell.scrollTop = shell.scrollHeight;
  };
  const line = (html = "", cls = "") => {
    const lid = `${id}-${n++}`;
    box().insertAdjacentHTML("beforeend", `<div id="${lid}" class="ia-line ${cls}">${html}</div>`);
    scroll();
    return lid;
  };
  const type = async (target, text, speed = 26) => {
    for (const ch of text) {
      if (state.aborted) throw ABORT;
      const el = document.getElementById(target);
      if (!el) throw ABORT;
      el.insertAdjacentText("beforeend", ch);
      scroll();
      await sleep(speed * (0.5 + Math.random()));
    }
  };
  const pause = async (ms) => { await sleep(ms); if (state.aborted) throw ABORT; };
  const typedLine = async (prefixHtml, text, speed) => {
    const lid = line(`${prefixHtml}<span id="${id}-t${n}"></span><span class="ia-caret">▌</span>`);
    const tid = `${id}-t${n - 1}`;
    await type(tid, text, speed);
    const caret = document.querySelector(`#${lid} .ia-caret`);
    if (caret) caret.remove();
    return lid;
  };
  const progress = async (label, okText, ms = 600) => {
    const dots = ".".repeat(Math.max(3, 34 - label.length));
    const lid = line(`<span class="text-gray">[ boot ]</span> ${esc(label)} <span class="text-gray">${dots}</span> <span class="ia-spin">⠋</span>`);
    const frames = "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏";
    const steps = Math.ceil(ms / 80);
    for (let i = 0; i < steps; i++) {
      const s = document.querySelector(`#${lid} .ia-spin`);
      if (!s) throw ABORT;
      s.textContent = frames[i % frames.length];
      await pause(80);
    }
    const s = document.querySelector(`#${lid} .ia-spin`);
    if (s) s.outerHTML = `<span class="text-green">OK</span>  <span class="text-gray">${esc(okText)}</span>`;
  };
  const tool = async (name, args, result, ms = 500) => {
    const lid = line(`  <span class="text-orange">⚙</span> <span class="text-blue">${esc(name)}</span><span class="text-gray">(${esc(args)})</span> <span class="ia-spin text-gray">…</span>`);
    await pause(ms);
    const s = document.querySelector(`#${lid} .ia-spin`);
    if (s) s.outerHTML = `<span class="text-green">✓</span> <span class="text-gray">${esc(result)}</span>`;
  };
  const ask = (hintHtml) => new Promise((resolve) => {
    prompt.innerHTML = hintHtml;
    cmdLine.style.visibility = "visible";
    document.getElementById("command-input").focus({ preventScroll: true });
    scroll();
    state.awaiting = resolve;
  });

  try {
    // 1. launch + boot
    await typedLine(`<span class="text-green">sachin@dxc</span>:<span class="text-blue">~/integral</span>$ `,
      "./integral --persona developer --model claude", 22);
    await pause(250);
    await progress("claude via bedrock", "streaming", 550);
    await progress("mcp server", "ibm i tools ready", 800);
    await progress("bedrock knowledge base", "rag ready", 500);
    await progress("vector db", "embeddings indexed", 450);
    await progress("agentic workflow", "plan → act → observe → decide", 450);
    line();

    // 2. a read-only analysis turn
    await typedLine(`<span class="text-pink">you ›</span> `, "Analyze program P5155", 38);
    await pause(300);
    line(`<span class="text-yellow">◆ authorize</span>  <span class="text-gray">persona=developer · mode=standard</span>`);
    await pause(350);
    line(`<span class="text-yellow">◆ model</span>      <span class="text-gray">claude → planning the workflow</span>`);
    await pause(300);
    await tool("find_member", "P5155", "found in QLBLSRC", 450);
    await tool("read_source_member", "P5155", "COBOL source read", 600);
    await tool("resolve_copybooks", "P5155", "copybooks resolved", 500);
    await tool("program_references", "P5155", "callers + files mapped", 550);
    await tool("rag_search", "\"P5155\"", "[K1] [K2] from the knowledge base", 500);
    line(`<span class="text-yellow">◆ answer</span>`);
    await typedLine(`  `, "Structure, copybooks, file I/O and callers summarised, grounded in the source", 12);
    await typedLine(`  `, "and cited from the manuals [K1][K2]. No writes were needed.", 12);
    line();

    // 3. a write turn on a green screen
    await typedLine(`<span class="text-pink">you ›</span> `, "Create a test client on the green screen", 38);
    await pause(300);
    line(`<span class="text-yellow">◆ model</span>      <span class="text-gray">driving a real 5250 session</span>`);
    await tool("screen_5250_signon", "device=MCPBOT", "signed on", 550);
    await tool("screen_5250_menu", "client maintenance", "panel open", 450);
    await pause(200);

    const fid = `${id}-f`;
    const field = (k, label) =>
      ` ${label.padEnd(22, " ")}: <span class="ia-field" id="${fid}-${k}"></span>`;
    line(`<pre class="ia-5250">` +
      ` CLIENT MAINTENANCE                         LIFE/Asia \n` +
      `                                                      \n` +
      field("sn", "Surname . . . . . . .") + `\n` +
      field("gn", "Given name  . . . . .") + `\n` +
      field("db", "Date of birth . . . .") + `\n` +
      field("sx", "Sex . . . . . . . . .") + `\n` +
      `                                                      \n` +
      ` F3=Exit  F4=Prompt  F12=Cancel           <span class="ia-blink">█</span>        ` +
      `</pre>`);
    await type(`${fid}-sn`, "PORTFOLIO", 45);
    await type(`${fid}-gn`, "DEMO", 45);
    await type(`${fid}-db`, "01/01/1990", 45);
    await type(`${fid}-sx`, "M", 45);
    await pause(400);

    line();
    line(`<span class="ia-warn">⚠ APPROVAL REQUIRED</span>  <span class="text-blue">screen_5250_create_client</span> <span class="text-gray">changes the server</span>`);
    line(`  <span class="text-gray">the model never sees the commit flag; the runtime only injects it after a human approves.</span>`);
    line(`  <span class="text-gray">type</span> <span class="text-green">approve</span> <span class="text-gray">or</span> <span class="text-red">reject</span>`);

    let decision = null;
    while (decision === null) {
      const raw = (await ask(`<span class="text-yellow">approve/reject ›</span>`)) || "";
      if (state.aborted) throw ABORT;
      const v = raw.trim().toLowerCase();
      cmdLine.style.visibility = "hidden";
      prompt.innerHTML = state.promptHtml;
      line(`<span class="text-yellow">human ›</span> ${esc(v || "(empty)")}`);
      if (["approve", "a", "y", "yes"].includes(v)) decision = true;
      else if (["reject", "r", "n", "no"].includes(v)) decision = false;
      else line(`  <span class="text-gray">please type</span> <span class="text-green">approve</span> <span class="text-gray">or</span> <span class="text-red">reject</span>`);
    }

    if (decision) {
      await tool("screen_5250_create_client", "commit=⟨injected server-side⟩", "saved", 900);
      line(`<span class="text-green">✓ write verified</span>  <span class="text-gray">commit_state=verified · logged to the write log</span>`);
      try { window.dispatchEvent(new CustomEvent("terminal:achievement", { detail: "approver" })); } catch (e) {}
    } else {
      line(`<span class="text-red">✗ rejected</span>  <span class="text-gray">nothing was written to the LPAR · commit_state=not_attempted</span>`);
    }
    line(`<span class="text-yellow">◆ run.completed</span>  <span class="text-gray">workflow trace saved</span>`);
    line();
    line(`<span class="text-gray">more:</span> <span class="text-red">integral arch</span> <span class="text-gray">·</span> <span class="text-red">integral stack</span> <span class="text-gray">·</span> <span class="text-red">projects</span>`);
  } catch (e) {
    if (e !== ABORT) console.error(e);
    const b = document.getElementById(id);
    if (b) b.insertAdjacentHTML("beforeend", `<div class="ia-line text-red">^C session interrupted</div>`);
  } finally {
    state.running = false;
    state.aborted = false;
    state.awaiting = null;
    prompt.innerHTML = state.promptHtml;
    cmdLine.style.visibility = "visible";
    const input = document.getElementById("command-input");
    input.value = "";
    input.style.width = "1ch";
    input.focus({ preventScroll: true });
    const shell = document.getElementById("shell");
    shell.scrollTop = shell.scrollHeight;
  }
}

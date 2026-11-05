"use client";
// @flow strict
import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";
import { FaExpand, FaTerminal } from "react-icons/fa";

const quickCommands = [
  { label: "integral", hint: "watch my AI agent drive a green screen" },
  { label: "ask …", command: "ask what did sachin build at dxc?", hint: "ask about my work" },
  { label: "neofetch", hint: "system info, but it's me" },
  { label: "sudo hire-sachin", hint: "you know you want to" },
  { label: "projects", hint: "what I've built" },
  { label: "help", hint: "all commands" },
];

// True once the iframe has finished loading the terminal page (not the initial about:blank).
// Checked directly instead of relying on the iframe's onLoad prop: the server-rendered iframe can
// finish loading before React hydrates, so that load event is missed and commands would never send.
function frameReady(el) {
  try {
    const doc = el?.contentDocument;
    return !!doc && doc.readyState === "complete" && doc.location.pathname.startsWith("/terminal");
  } catch {
    return false;
  }
}

function TerminalSection() {
  const frame = useRef(null);
  const pending = useRef(null);

  const send = useCallback((command) => {
    const win = frame.current?.contentWindow;
    if (!win || !frameReady(frame.current)) {
      // the iframe loads lazily; run the command as soon as it's ready
      pending.current = command;
      return;
    }
    win.postMessage({ type: "terminal:run", command }, window.location.origin);
    frame.current.focus({ preventScroll: true });
  }, []);

  // run a queued command once the iframe loads
  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const flush = () => {
      if (!pending.current || !frameReady(el)) return;
      const command = pending.current;
      pending.current = null;
      send(command);
    };
    el.addEventListener("load", flush);
    flush();
    return () => el.removeEventListener("load", flush);
  }, [send]);

  // other sections (e.g. the featured project's "Watch the demo") can run a command here
  useEffect(() => {
    const onRun = (event) => {
      const command = event.detail?.command;
      if (typeof command !== "string") return;
      document.getElementById("terminal")?.scrollIntoView({ behavior: "smooth", block: "start" });
      send(command);
    };
    window.addEventListener("portfolio:terminal", onRun);
    return () => window.removeEventListener("portfolio:terminal", onRun);
  }, [send]);

  return (
    <div id="terminal" className="relative z-50 border-t my-12 lg:my-24 border-[#25213b] scroll-mt-6">
      <div className="w-[100px] h-[100px] bg-violet-100 rounded-full absolute top-6 left-[42%] translate-x-1/2 filter blur-3xl opacity-20"></div>

      <div className="flex justify-center -translate-y-[1px]">
        <div className="w-3/4">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-violet-500 to-transparent w-full" />
        </div>
      </div>

      <div className="flex justify-center my-5 lg:py-8">
        <div className="flex items-center">
          <span className="w-24 h-[2px] bg-[#1a1443]"></span>
          <span className="bg-[#1a1443] w-fit text-white p-2 px-5 text-xl rounded-md flex items-center gap-2">
            <FaTerminal size={16} /> Terminal Mode
          </span>
          <span className="w-24 h-[2px] bg-[#1a1443]"></span>
        </div>
      </div>

      <p className="text-center text-gray-300 text-sm lg:text-base mb-6">
        Prefer the command line? Explore my portfolio the way engineers do. Click inside and type, or try a command:
      </p>

      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {quickCommands.map((c) => (
          <button
            key={c.label}
            onClick={() => send(c.command || c.label)}
            title={c.hint}
            className="font-mono text-xs lg:text-sm text-[#16f2b3] border border-[#16f2b3]/40 bg-[#16f2b3]/5 hover:bg-[#16f2b3]/15 hover:border-[#16f2b3] rounded-full px-3 py-1 transition-all duration-200"
          >
            $ {c.label}
          </button>
        ))}
      </div>

      <div className="mx-auto max-w-5xl rounded-lg border border-[#1b2c68a0] bg-gradient-to-r from-[#0d1224] to-[#0a0d37] shadow-[0_0_40px_0_rgba(130,40,236,0.25)] overflow-hidden">
        <div className="flex flex-row">
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-pink-500 to-violet-600"></div>
          <div className="h-[1px] w-full bg-gradient-to-r from-violet-600 to-transparent"></div>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-b-[2px] border-indigo-900">
          <div className="flex flex-row space-x-2">
            <div className="h-3 w-3 rounded-full bg-red-400"></div>
            <div className="h-3 w-3 rounded-full bg-orange-400"></div>
            <div className="h-3 w-3 rounded-full bg-green-200"></div>
          </div>
          <p className="font-mono text-xs lg:text-sm text-gray-400">sachin@dxc: ~/portfolio</p>
          <Link
            href="/terminal"
            target="_blank"
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#16f2b3] transition-colors duration-200"
            title="Open full screen"
          >
            <FaExpand size={12} />
            <span className="hidden sm:inline">Full screen</span>
          </Link>
        </div>
        <iframe
          ref={frame}
          src="/terminal/index.html"
          title="Sachin Jadhav terminal portfolio"
          loading="lazy"
          className="w-full h-[460px] lg:h-[600px] bg-black block"
        />
      </div>
    </div>
  );
};

export default TerminalSection;

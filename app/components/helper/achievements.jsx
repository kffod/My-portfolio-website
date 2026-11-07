"use client";
// Achievements: small badges for exploring the portfolio, with a corner counter and a panel.
// Unlocked on the site (themes, certificate links, the chat, the Konami code) and from the embedded
// terminal (games, CTF, sudo, the Integral demo), which sends postMessage({ type: "portfolio:unlock", id }).
// The Konami code also toggles a hidden retro green-screen theme. Progress lives only in this browser.
import { ACHIEVEMENTS, STORE_KEY, THEMES_KEY, readUnlocked, saveUnlocked } from "@/utils/achievements";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
const VERIFY_RE = /credly\.com|skills\.google|cloudskillsboost|forage-uploads/;
const THEME_COLOR = { midnight: "#0d1224", green: "#050c08", amber: "#0f0a03", retro: "#000000" };
const BASE_THEMES = ["midnight", "green", "amber"];

function setThemeAttr(theme) {
  const root = document.documentElement;
  if (theme === "midnight") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", theme);
  document
    .querySelectorAll('meta[name="theme-color"]')
    .forEach((m) => m.setAttribute("content", THEME_COLOR[theme] || THEME_COLOR.midnight));
}

function themeTerminals(theme) {
  document.querySelectorAll("iframe").forEach((frame) => {
    try {
      frame.contentWindow?.postMessage({ type: "terminal:theme", theme }, window.location.origin);
    } catch {}
  });
}

function Achievements() {
  const [mounted, setMounted] = useState(false);
  const [unlocked, setUnlocked] = useState(() => new Set());
  const [open, setOpen] = useState(false);
  const previousTheme = useRef("midnight");

  const unlock = useCallback((id) => {
    const def = ACHIEVEMENTS.find((a) => a.id === id);
    if (!def) return;
    const have = readUnlocked();
    if (have.has(id)) return;
    have.add(id);
    saveUnlocked(have);
    setUnlocked(new Set(have));
    toast.success(`Achievement unlocked: ${def.title}`, { icon: def.icon, theme: "dark" });
    if (have.size === ACHIEVEMENTS.length) {
      setTimeout(
        () =>
          toast(
            <span>
              You found all {ACHIEVEMENTS.length}!{" "}
              <a href="#contact" className="underline">
                Let&apos;s talk →
              </a>
            </span>,
            { icon: "🏆", theme: "dark", autoClose: 8000 }
          ),
        700
      );
    }
  }, []);

  const toggleRetro = useCallback(() => {
    const current = document.documentElement.getAttribute("data-theme") || "midnight";
    if (current !== "retro") {
      previousTheme.current = current;
      setThemeAttr("retro");
      themeTerminals("green");
      toast("Retro mode. Enter the code again to switch back.", { icon: "🕹️", theme: "dark" });
    } else {
      setThemeAttr(previousTheme.current);
      themeTerminals(previousTheme.current);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    setUnlocked(readUnlocked());

    // Theme hacker: seen Midnight, Green and Amber (the retro theme doesn't count)
    const root = document.documentElement;
    const trackTheme = () => {
      const theme = root.getAttribute("data-theme") || "midnight";
      if (!BASE_THEMES.includes(theme)) return;
      let seen = [];
      try {
        seen = JSON.parse(localStorage.getItem(THEMES_KEY) || "[]");
      } catch {}
      if (!seen.includes(theme)) {
        seen.push(theme);
        try {
          localStorage.setItem(THEMES_KEY, JSON.stringify(seen));
        } catch {}
      }
      if (BASE_THEMES.every((t) => seen.includes(t))) unlock("chameleon");
    };
    trackTheme();
    const observer = new MutationObserver(trackTheme);
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });

    // Konami code typed on the page (the terminal reports its own)
    let pos = 0;
    const onKey = (e) => {
      const key = e.key && e.key.length === 1 ? e.key.toLowerCase() : e.key;
      pos = key === KONAMI[pos] ? pos + 1 : key === "ArrowUp" ? (pos === 2 ? 2 : 1) : 0;
      if (pos === KONAMI.length) {
        pos = 0;
        toggleRetro();
        unlock("konami");
      }
    };

    // Verifier: any certificate verification link
    const onClick = (e) => {
      const link = e.target?.closest?.("a[href]");
      if (link && VERIFY_RE.test(link.href)) unlock("verifier");
    };

    const onMessage = (e) => {
      if (e.origin !== window.location.origin) return;
      const data = e.data || {};
      if (data.type === "portfolio:unlock" && typeof data.id === "string") unlock(data.id);
      if (data.type === "portfolio:konami") {
        toggleRetro();
        unlock("konami");
      }
    };
    const onUnlock = (e) => {
      if (typeof e.detail === "string") unlock(e.detail);
    };
    const onStorage = (e) => {
      if (e.key === STORE_KEY) setUnlocked(readUnlocked());
    };

    window.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick, true);
    window.addEventListener("message", onMessage);
    window.addEventListener("portfolio:unlock", onUnlock);
    window.addEventListener("storage", onStorage);
    return () => {
      observer.disconnect();
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("message", onMessage);
      window.removeEventListener("portfolio:unlock", onUnlock);
      window.removeEventListener("storage", onStorage);
    };
  }, [unlock, toggleRetro]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const reset = () => {
    saveUnlocked(new Set());
    try {
      localStorage.removeItem(THEMES_KEY);
    } catch {}
    setUnlocked(new Set());
  };

  if (!mounted) return null;
  const count = unlocked.size;
  const total = ACHIEVEMENTS.length;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={`Achievements: ${count} of ${total} unlocked`}
        className="m-btn fixed bottom-24 right-6 z-50 flex items-center gap-1.5 rounded-full border border-line bg-surface/90 px-3 py-2 text-xs font-medium text-white shadow-xl shadow-black/40 backdrop-blur transition-all duration-300 hover:border-accent"
      >
        <span aria-hidden="true">🏆</span>
        <span className="font-mono">
          {count}/{total}
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Achievements"
          className="fixed bottom-40 right-4 z-50 w-[min(92vw,340px)] overflow-hidden rounded-lg border border-line bg-surface/95 text-white shadow-xl shadow-black/40 backdrop-blur"
        >
          <div className="px-4 pb-2 pt-3">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-accent">Achievements</p>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="text-muted hover:text-white">
                ✕
              </button>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-page">
              <div
                className="h-full rounded-full bg-accent transition-all duration-500"
                style={{ width: `${(count / total) * 100}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-muted">
              {count} of {total} unlocked
            </p>
          </div>

          <ul className="max-h-[50vh] space-y-1 overflow-y-auto px-2 pb-2">
            {ACHIEVEMENTS.map((a) => {
              const done = unlocked.has(a.id);
              return (
                <li key={a.id} className={`flex items-start gap-3 rounded-md px-2 py-2 ${done ? "bg-raised/60" : ""}`}>
                  <span className={`text-lg leading-6 ${done ? "" : "opacity-40 grayscale"}`} aria-hidden="true">
                    {a.icon}
                  </span>
                  <div className="min-w-0">
                    <p className={`text-sm font-medium ${done ? "text-white" : "text-soft"}`}>
                      {a.title}
                      {done && <span className="ml-2 text-xs text-accent">✓</span>}
                    </p>
                    <p className="text-xs leading-relaxed text-muted">{a.hint}</p>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center justify-between border-t border-line px-4 py-2 text-xs text-muted">
            <span>Saved only in this browser.</span>
            <button type="button" onClick={reset} className="hover:text-white">
              Reset
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Achievements;

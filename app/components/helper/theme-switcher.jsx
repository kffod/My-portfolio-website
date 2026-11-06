"use client";
// Theme switcher in the navbar: Midnight, Terminal Green, Amber.
// Saves the choice, follows changes from other tabs, and keeps the embedded terminal in sync
// (running `theme green` inside the terminal switches the site too).
import { useCallback, useEffect, useState } from "react";

const KEY = "portfolio-theme";

const THEMES = [
  { id: "midnight", label: "Midnight", swatch: "linear-gradient(135deg,#ec4899,#7c3aed)", color: "#0d1224" },
  { id: "green", label: "Terminal Green", swatch: "linear-gradient(135deg,#33ff66,#0d9488)", color: "#050c08" },
  { id: "amber", label: "Amber", swatch: "linear-gradient(135deg,#ffb000,#ea580c)", color: "#0f0a03" },
];

function applyTheme(id) {
  const theme = THEMES.find((t) => t.id === id) || THEMES[0];
  const root = document.documentElement;
  if (theme.id === "midnight") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", theme.id);
  // phone browsers colour their top bar from this
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute("content", theme.color));
  return theme.id;
}

function ThemeSwitcher() {
  const [current, setCurrent] = useState("midnight");

  const choose = useCallback((id, { save = true, toTerminal = true } = {}) => {
    const theme = applyTheme(id);
    setCurrent(theme);
    if (save) {
      try {
        localStorage.setItem(KEY, theme);
      } catch {}
    }
    if (toTerminal) {
      document.querySelectorAll("iframe").forEach((frame) => {
        try {
          frame.contentWindow?.postMessage({ type: "terminal:theme", theme }, window.location.origin);
        } catch {}
      });
    }
  }, []);

  useEffect(() => {
    // the inline script in layout.js already applied the saved theme before first paint
    choose(document.documentElement.getAttribute("data-theme") || "midnight", { save: false, toTerminal: false });

    const onMessage = (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === "portfolio:theme") choose(String(event.data.theme), { toTerminal: false });
    };
    const onStorage = (event) => {
      if (event.key === KEY) choose(event.newValue || "midnight", { save: false });
    };
    window.addEventListener("message", onMessage);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("message", onMessage);
      window.removeEventListener("storage", onStorage);
    };
  }, [choose]);

  return (
    <div
      role="group"
      aria-label="Colour theme"
      className="ml-3 flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-surface/70 p-1"
    >
      {THEMES.map((theme) => (
        <button
          key={theme.id}
          type="button"
          title={theme.label}
          aria-label={`${theme.label} theme`}
          aria-pressed={current === theme.id}
          onClick={() => choose(theme.id)}
          className={`h-5 w-5 rounded-full transition-all duration-200 ${
            current === theme.id
              ? "scale-110 ring-2 ring-accent ring-offset-2 ring-offset-page"
              : "opacity-60 hover:opacity-100"
          }`}
          style={{ background: theme.swatch }}
        />
      ))}
    </div>
  );
}

export default ThemeSwitcher;

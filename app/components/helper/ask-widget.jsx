"use client";
// Floating "Ask my portfolio" chat. Talks to /api/ask (retrieval over this site, answers with citations).
import { useEffect, useRef, useState } from "react";
import { FaPaperPlane, FaRobot, FaTimes } from "react-icons/fa";

const SUGGESTIONS = [
  "What did Sachin build at DXC?",
  "How does Integral Assistant keep writes safe?",
  "Which Claude certifications does he hold?",
  "Is he a fit for a Forward Deployed Engineer role?",
];

function renderAnswer(text) {
  return text.split(/(\[\d+\])/g).map((part, i) =>
    /^\[\d+\]$/.test(part) ? (
      <sup key={i} className="text-accent font-semibold">{part}</sup>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

function AskWidget() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [items, loading]);

  // other sections (e.g. the featured project's "Ask about it") can open the chat with a question
  const askRef = useRef(null);
  useEffect(() => {
    const onAsk = (event) => {
      setOpen(true);
      const q = event.detail?.question;
      if (typeof q === "string" && askRef.current) askRef.current(q);
    };
    window.addEventListener("portfolio:ask", onAsk);
    return () => window.removeEventListener("portfolio:ask", onAsk);
  }, []);

  async function ask(preset) {
    const text = (preset ?? question).trim();
    if (text.length < 3 || loading) return;
    setQuestion("");
    setLoading(true);
    window.dispatchEvent(new CustomEvent("portfolio:unlock", { detail: "curious" }));
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text }),
      });
      const data = await res.json().catch(() => ({}));
      setItems((prev) => [
        ...prev,
        res.ok
          ? { q: text, answer: data.answer, sources: data.sources || [], mode: data.mode }
          : { q: text, error: data.error || "Something went wrong. Please try again." },
      ]);
    } catch {
      setItems((prev) => [...prev, { q: text, error: "Couldn't reach the assistant. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  askRef.current = ask;

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Ask my portfolio"
        className="m-btn fixed bottom-8 left-6 z-50 flex items-center gap-2 rounded-full bg-accent hover:bg-accent/90 px-4 py-3 text-sm font-medium text-page shadow-xl shadow-black/40 transition-all duration-300"
      >
        {open ? <FaTimes size={14} /> : <FaRobot size={16} />}
        <span className="hidden sm:inline">{open ? "Close" : "Ask my portfolio"}</span>
      </button>

      {open && (
        <div className="fixed bottom-24 left-4 right-4 sm:left-6 sm:right-auto sm:w-[400px] z-50 flex max-h-[70vh] flex-col rounded-lg border border-edge/60 bg-page text-white shadow-xl shadow-black/40">
          <div className="border-b border-line px-4 py-3">
            <p className="font-semibold text-accent">Ask my portfolio</p>
            <p className="text-xs text-gray-400">Searches this site and answers with its sources.</p>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto px-4 py-3 text-sm">
            {items.length === 0 && !loading && (
              <div className="space-y-2">
                <p className="text-gray-300">Try one of these:</p>
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => ask(s)}
                    className="block w-full rounded-md border border-line bg-surface px-3 py-2 text-left text-gray-200 transition-all duration-200 hover:border-accent/60"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {items.map((item, i) => (
              <div key={i} className="space-y-2">
                <p className="ml-auto w-fit max-w-[85%] rounded-lg bg-raised px-3 py-2">{item.q}</p>
                {item.error ? (
                  <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-red-300">{item.error}</p>
                ) : (
                  <div className="rounded-lg border border-line bg-surface px-3 py-2 leading-relaxed text-gray-200">
                    <p>{renderAnswer(item.answer)}</p>
                    <p className="mt-1 text-xs text-muted">
                      {item.mode === "ai" ? "AI-written from this portfolio. It can make mistakes." : "Matched from this portfolio's content."}
                    </p>
                    {item.sources.length > 0 && (
                      <div className="mt-2 space-y-1 border-t border-line pt-2 text-xs">
                        {item.sources.map((s) => (
                          <a
                            key={s.n}
                            href={s.url || "#"}
                            target={s.url?.startsWith("http") ? "_blank" : undefined}
                            rel="noopener noreferrer"
                            className="block text-gray-400 transition-colors duration-200 hover:text-accent"
                          >
                            <span className="text-accent">[{s.n}]</span> {s.title}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {loading && <p className="animate-pulse text-xs text-gray-400">Searching my portfolio…</p>}
            <div ref={endRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask();
            }}
            className="flex items-center gap-2 border-t border-line px-3 py-3"
          >
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              maxLength={300}
              placeholder="Ask about Sachin's work…"
              className="flex-1 rounded-md border border-line bg-surface px-3 py-2 text-sm text-white outline-none focus:border-accent"
            />
            <button
              type="submit"
              disabled={loading || question.trim().length < 3}
              aria-label="Send"
              className="rounded-md bg-accent p-2.5 text-page transition-opacity disabled:opacity-40"
            >
              <FaPaperPlane size={14} />
            </button>
          </form>
          <p className="px-4 pb-2 text-xs text-muted">Answers come only from this portfolio's content.</p>
        </div>
      )}
    </>
  );
}

export default AskWidget;

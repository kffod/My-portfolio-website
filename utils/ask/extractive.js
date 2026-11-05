// Free "no model" answers for the "Ask my portfolio" assistant.
// Picks the sentences from the retrieved sources that best match the question and returns them
// with [n] citations. No API key, no cost, and it can't invent anything that isn't on the site.
import { tokenize } from "./retrieve";

const MAX_SENTENCES = 3;
const MAX_SENTENCE_CHARS = 280;
const MIN_RELATIVE_SCORE = 0.5; // extra sentences must score at least half as well as the best one

// the site's own text is partly first-person ("I built it ..."); answers talk about Sachin
function thirdPerson(text) {
  return text
    .replace(/\bI'm\b/g, "Sachin is")
    .replace(/\bI am\b/g, "Sachin is")
    .replace(/\bI've\b/g, "Sachin has")
    .replace(/\bI have\b/g, "Sachin has")
    .replace(/\bI\b/g, "Sachin")
    .replace(/\bMy\b/g, "His")
    .replace(/\bmy\b/g, "his")
    .replace(/\bme\b/g, "him");
}

function sentences(text) {
  return String(text || "")
    .split(/(?<=[.!?])\s+(?=[A-Z0-9"'(])/)
    .map((s) => s.trim())
    // skip tiny fragments and label-only lines such as "Role: Cloud Engineer."
    .filter((s) => s.length > 30 && !/^(Role|Posted|Code):/.test(s));
}

function shorten(s) {
  if (s.length <= MAX_SENTENCE_CHARS) return s;
  const cut = s.slice(0, MAX_SENTENCE_CHARS);
  return cut.slice(0, cut.lastIndexOf(" ")) + "…";
}

export function extractiveAnswer(index, question, sources) {
  const terms = [...new Set(tokenize(question))];
  if (!terms.length) return null;
  const idf = (t) => {
    const n = index.df.get(t) || 0;
    return Math.log(1 + (index.n - n + 0.5) / (n + 0.5));
  };
  const overlap = (text) => {
    const words = new Set(tokenize(text));
    return terms.reduce((sum, t) => (words.has(t) ? sum + idf(t) : sum), 0);
  };

  const candidates = [];
  sources.forEach((doc, i) => {
    const titleBoost = overlap(doc.title) * 0.5;
    sentences(doc.text).forEach((sentence, pos) => {
      const score = overlap(sentence);
      // small preference for higher-ranked sources and earlier sentences
      if (score > 0) candidates.push({ n: i + 1, sentence, score: score + titleBoost - i * 0.05 - pos * 0.01 });
    });
  });
  if (!candidates.length) return null;

  candidates.sort((a, b) => b.score - a.score);
  const best = candidates[0].score;
  const chosen = [];
  const seen = new Set();
  for (const c of candidates) {
    if (chosen.length >= MAX_SENTENCES) break;
    if (chosen.length && c.score < best * MIN_RELATIVE_SCORE) break;
    const key = c.sentence.toLowerCase().slice(0, 60);
    if (seen.has(key)) continue;
    seen.add(key);
    chosen.push(c);
  }

  // keep source order so the answer reads top-down; cite once per run of sentences from the same source
  chosen.sort((a, b) => a.n - b.n || b.score - a.score);
  return chosen
    .map((c, i) => {
      const text = thirdPerson(shorten(c.sentence));
      const nextSame = chosen[i + 1] && chosen[i + 1].n === c.n;
      return nextSame ? text : `${text} [${c.n}]`;
    })
    .join(" ");
}

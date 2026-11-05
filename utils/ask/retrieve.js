// Tiny BM25 retriever for the "Ask my portfolio" assistant. No dependencies.
// The knowledge base is small (a few dozen documents), so an in-memory index is plenty.

const STOP = new Set(
  ("a an and are as at be been but by can could did do does for from had has have he her him his how i if in into is it its " +
    "me my of on or our she so than that the their them then there these they this those to was we were what when where which " +
    "who whom why will with would you your sachin jadhav tell about know keep give please any some also like").split(" ")
);

const IRREGULAR = { built: "build", made: "make", wrote: "write", ran: "run", led: "lead" };

// tiny stemmer, applied to both questions and documents so they meet in the middle
function stem(t) {
  if (IRREGULAR[t]) return IRREGULAR[t];
  if (t.length > 5 && t.endsWith("ing")) return t.slice(0, -3);
  if (t.length > 4 && t.endsWith("ed")) return t.slice(0, -2);
  if (t.length > 4 && t.endsWith("s")) return t.slice(0, -1);
  return t;
}

export function tokenize(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9+#]+/g, " ")
    .split(" ")
    .filter((t) => t.length > 1 && !STOP.has(t))
    .map(stem);
}

export function createIndex(docs) {
  // titles count twice so a document's subject weighs more than passing mentions
  const toks = docs.map((d) => tokenize(`${d.title} ${d.title} ${d.text}`));
  const df = new Map();
  toks.forEach((ts) => new Set(ts).forEach((t) => df.set(t, (df.get(t) || 0) + 1)));
  const avg = toks.reduce((sum, ts) => sum + ts.length, 0) / Math.max(1, toks.length);
  return { docs, toks, df, avg, n: docs.length };
}

export function search(index, query, k = 6) {
  const terms = [...new Set(tokenize(query))];
  const k1 = 1.5;
  const b = 0.75;
  return index.docs
    .map((doc, i) => {
      const ts = index.toks[i];
      const tf = new Map();
      ts.forEach((t) => tf.set(t, (tf.get(t) || 0) + 1));
      let score = 0;
      for (const term of terms) {
        const f = tf.get(term);
        if (!f) continue;
        const n = index.df.get(term) || 0;
        const idf = Math.log(1 + (index.n - n + 0.5) / (n + 0.5));
        score += (idf * f * (k1 + 1)) / (f + k1 * (1 - b + (b * ts.length) / index.avg));
      }
      return { doc, score };
    })
    .filter((r) => r.score > 0)
    .sort((x, y) => y.score - x.score)
    .slice(0, k)
    .map((r) => r.doc);
}

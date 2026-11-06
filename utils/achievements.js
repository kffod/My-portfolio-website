// Achievements shown in the corner badge. Keep the ids in sync with public/terminal/commands/games.js.
// Progress is saved only in the visitor's browser (localStorage); nothing is sent anywhere.

export const STORE_KEY = "portfolio-achievements";
export const THEMES_KEY = "portfolio-themes-seen";

export const ACHIEVEMENTS = [
  { id: "root", icon: "🔑", title: "Root access", hint: "Run sudo hire-sachin in the terminal." },
  { id: "approver", icon: "✅", title: "Approver", hint: "Approve the write in the terminal's integral demo." },
  { id: "guardian", icon: "🛡️", title: "Guardian", hint: "Score 8 or more in the Guardrail game (type play)." },
  { id: "flag", icon: "🚩", title: "Flag captured", hint: "Solve the capture-the-flag (type ctf)." },
  { id: "chameleon", icon: "🎨", title: "Theme hacker", hint: "Try all three themes." },
  { id: "verifier", icon: "🔍", title: "Verifier", hint: "Open a certificate's verification page." },
  { id: "curious", icon: "💬", title: "Curious", hint: "Ask my portfolio a question." },
  { id: "konami", icon: "🕹️", title: "Old school", hint: "A famous 1986 cheat code. Try it anywhere." },
];

export function readUnlocked() {
  try {
    return new Set(JSON.parse(localStorage.getItem(STORE_KEY) || "[]"));
  } catch {
    return new Set();
  }
}

export function saveUnlocked(set) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify([...set]));
  } catch {}
}

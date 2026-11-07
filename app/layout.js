import { GoogleTagManager } from "@next/third-parties/google";
import localFont from "next/font/local";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./components/footer";
import Navbar from "./components/navbar";
import "./css/globals.scss";
import "./css/theme.scss";
import "./css/retro.scss";
import "./css/motion.scss";
import Achievements from "./components/helper/achievements";
import AskWidget from "./components/helper/ask-widget";
import ScrollToTop from "./components/helper/scroll-to-top";

// IBM Plex: a type family with engineering character (and a nod to the IBM i work).
// The font files are bundled in app/fonts, so the build never depends on Google Fonts
// (Google's newer CSS format breaks the font loader in Next.js 14.1).
const plexSans = localFont({
  src: [
    { path: "./fonts/ibm-plex-sans-latin-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/ibm-plex-sans-latin-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/ibm-plex-sans-latin-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/ibm-plex-sans-latin-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-sans",
  display: "swap",
});
const plexMono = localFont({
  src: [
    { path: "./fonts/ibm-plex-mono-latin-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/ibm-plex-mono-latin-500.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-mono",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://www.sachinjadhavofficial.com"),
  alternates: { canonical: "/" },
  title: "Sachin Jadhav | AI Engineer · Agents, RAG, MCP",
  description:
    "Sachin Jadhav, AI full-stack engineer at DXC Technology. Ships production AI agents end to end with Claude, MCP, RAG, Bedrock Knowledge Base, vector DBs and Python FastAPI. Built Integral Assistant, an agentic AI assistant for IBM i / SMART/400.",
};

// dark scrollbars/form controls, and the phone browser's top bar colour
export const viewport = {
  themeColor: "#0d1224",
  colorScheme: "dark",
};

// applies the saved theme before the page paints, so it never flashes the default first
const THEME_INIT = `try{var t=localStorage.getItem("portfolio-theme");if(t==="green"||t==="amber")document.documentElement.setAttribute("data-theme",t)}catch(e){}`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body className={`${plexSans.variable} ${plexMono.variable} font-sans antialiased`}>
        <ToastContainer />
        <main className="min-h-screen relative mx-auto px-6 sm:px-12 lg:max-w-[70rem] xl:max-w-[76rem] 2xl:max-w-[92rem] text-white">
          <Navbar />
          {children}
          <ScrollToTop />
          <AskWidget />
          <Achievements />
        </main>
        <Footer />
      </body>
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM} />
    </html>
  );
}

import { GoogleTagManager } from "@next/third-parties/google";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./components/footer";
import Navbar from "./components/navbar";
import "./css/card.scss";
import "./css/globals.scss";
import AskWidget from "./components/helper/ask-widget";
import ScrollToTop from "./components/helper/scroll-to-top";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL("https://www.sachinjadhavofficial.com"),
  alternates: { canonical: "/" },
  title: "Sachin Jadhav | AI Engineer · Agents, RAG, MCP",
  description:
    "Sachin Jadhav, AI full-stack engineer at DXC Technology. Ships production AI agents end to end with Claude, MCP, RAG, Bedrock Knowledge Base, vector DBs and Python FastAPI. Built Integral Assistant, an agentic AI assistant for IBM i / SMART/400.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastContainer />
        <main className="min-h-screen relative mx-auto px-6 sm:px-12 lg:max-w-[70rem] xl:max-w-[76rem] 2xl:max-w-[92rem] text-white">
          <Navbar />
          {children}
          <ScrollToTop />
          <AskWidget />
        </main>
        <Footer />
      </body>
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM} />
    </html>
  );
}

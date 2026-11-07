// @flow strict
import { FaBook, FaBrain, FaComments, FaLayerGroup, FaLock, FaPlay, FaPlug, FaRobot, FaShieldAlt, FaSitemap } from "react-icons/fa";

const ICONS = { agent: FaRobot, context: FaBrain, rag: FaBook, connection: FaPlug, safety: FaShieldAlt, stack: FaLayerGroup };

// These events are handled by the Terminal section and the "Ask my portfolio" widget.
function runInTerminal(command) {
  window.dispatchEvent(new CustomEvent("portfolio:terminal", { detail: { command } }));
}
function askAbout(question) {
  window.dispatchEvent(new CustomEvent("portfolio:ask", { detail: { question } }));
}

function FeaturedProject({ project }) {
  return (
    <div className="relative">

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">
        <div className="lg:col-span-3 flex flex-col">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold uppercase tracking-wider text-accent">
              Featured
            </span>
            {project.org && <span className="text-accent">{project.org}</span>}
            {project.org && project.period && <span className="text-muted">·</span>}
            {project.period && <span className="text-gray-400">{project.period}</span>}
          </div>

          <h3 className="mt-4 text-2xl lg:text-4xl font-bold text-white">{project.name}</h3>
          <p className="mt-1 text-base lg:text-xl text-accent">{project.tagline}</p>
          <p className="mt-4 max-w-[34rem] text-sm lg:text-base leading-relaxed text-gray-300">{project.description}</p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
            {project.highlights.map((h) => {
              const Icon = ICONS[h.icon] || FaRobot;
              return (
                <div key={h.title}>
                  <p className="flex items-center gap-2 text-sm font-semibold text-white">
                    <Icon className="text-accent" size={14} /> {h.title}
                  </p>
                  <p className="mt-1 text-xs lg:text-sm leading-relaxed text-gray-400">{h.text}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {project.tools.map((t) => (
              <span key={t} className="rounded-full border border-accent/40 bg-accent/5 px-3 py-1 text-xs text-accent">
                {t}
              </span>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => runInTerminal("integral")}
              className="m-btn flex items-center gap-2 rounded-full bg-accent hover:bg-accent/90 px-5 py-2.5 text-xs md:text-sm font-medium uppercase tracking-wider text-page transition-all duration-200"
            >
              <FaPlay size={11} /> Watch the demo
            </button>
            <button
              onClick={() => runInTerminal("integral arch")}
              className="m-btn flex items-center gap-2 rounded-full border border-edge px-5 py-2.5 text-xs md:text-sm font-medium uppercase tracking-wider text-white hover:border-accent/60 transition-all duration-200"
            >
              <FaSitemap size={12} /> Architecture
            </button>
            <button
              onClick={() => askAbout("How does Integral Assistant work, and how does it keep writes safe?")}
              className="m-btn flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-xs md:text-sm font-medium uppercase tracking-wider text-gray-300 hover:text-white hover:border-accent/60 transition-all duration-200"
            >
              <FaComments size={12} /> Ask about it
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col">
          <div className="rounded-lg border border-edge/60 bg-surface overflow-hidden">
            <div className="flex items-center gap-2 border-b-[2px] border-line px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-red-400"></div>
              <div className="h-3 w-3 rounded-full bg-orange-400"></div>
              <div className="h-3 w-3 rounded-full bg-green-200"></div>
              <span className="ml-2 font-mono text-xs text-gray-400">integral.config.js</span>
            </div>
            <code className="block px-4 lg:px-6 py-5 font-mono text-xs md:text-sm leading-7">
              <div>
                <span className="mr-2 text-pink-500">const</span>
                <span className="mr-2 text-white">integral</span>
                <span className="mr-2 text-pink-500">=</span>
                <span className="text-gray-400">{"{"}</span>
              </div>
              {project.spec.map(([k, v]) => (
                <div key={k} className="ml-4 lg:ml-6">
                  <span className="mr-2 text-white">{k}:</span>
                  <span className="text-gray-400">{"'"}</span>
                  <span className="text-amber-300">{v}</span>
                  <span className="text-gray-400">{"',"}</span>
                </div>
              ))}
              <div><span className="text-gray-400">{"};"}</span></div>
            </code>
          </div>
          {project.flow && (
            <div className="mt-6 border-t border-line pt-5">
              <p className="mb-3 font-mono text-xs text-muted">{"// how a request flows"}</p>
              <ol className="space-y-3">
                {project.flow.map(([step, text], i) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-edge bg-raised text-xs font-semibold text-accent">
                      {i + 1}
                    </span>
                    <p className="text-sm leading-6">
                      <span className="font-medium text-white">{step}</span>{" "}
                      <span className="text-gray-400">{text}</span>
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          )}
          {project.note && (
            <p className="mt-3 flex items-center gap-2 text-xs text-gray-400">
              <FaLock size={11} /> {project.note} The demo in the terminal shows how it works.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProject;

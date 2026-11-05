// @flow strict
import Link from "next/link";
import { FaGithub } from "react-icons/fa";

function ProjectCard({ project }) {
  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-[#1b2c68a0] bg-gradient-to-br from-[#0d1224] to-[#0a0d37] transition-all duration-300 hover:-translate-y-1 hover:border-violet-500 hover:shadow-[0_0_30px_0_rgba(130,40,236,0.25)]">
      <div className="flex flex-row">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-pink-500 to-violet-600"></div>
        <div className="h-[1px] w-full bg-gradient-to-r from-violet-600 to-transparent"></div>
      </div>

      <div className="flex items-center justify-between border-b border-indigo-900/70 px-4 py-3">
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-400"></div>
          <div className="h-2.5 w-2.5 rounded-full bg-orange-400"></div>
          <div className="h-2.5 w-2.5 rounded-full bg-green-200"></div>
        </div>
        <span className="font-mono text-[11px] uppercase tracking-wider text-gray-500">{project.category.join(" · ")}</span>
      </div>

      <div className="flex flex-1 flex-col p-4 lg:p-5">
        {(project.org || project.period) &&
          <p className="text-xs text-gray-400">
            {[project.org, project.period].filter(Boolean).join(" · ")}
          </p>
        }
        <h3 className="mt-1 text-lg lg:text-xl font-semibold text-[#16f2b3] transition-colors duration-200 group-hover:text-pink-500">
          {project.name}
        </h3>
        <p className="text-sm text-gray-300">{project.tagline}</p>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-400 line-clamp-4">{project.description}</p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.tools.map((t) => (
            <span key={t} className="rounded-full border border-[#1f223c] bg-[#11152c] px-2.5 py-0.5 font-mono text-[11px] text-amber-300">
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-indigo-900/70 px-4 py-3 text-xs">
        <span className="text-gray-500">{project.role}</span>
        {project.code ? (
          <Link
            href={project.code}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[#16f2b3] transition-colors duration-200 hover:text-pink-500"
          >
            <FaGithub size={14} /> View code
          </Link>
        ) : (
          <span className="text-gray-600">{project.note || "Code not public"}</span>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;

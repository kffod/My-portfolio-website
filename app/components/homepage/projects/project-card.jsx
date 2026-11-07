// @flow strict
import Link from "next/link";
import { FaGithub } from "react-icons/fa";

function ProjectCard({ project }) {
  return (
    <div className={`${project.code ? "m-lift " : ""}bg-surface group relative flex h-full flex-col overflow-hidden rounded-lg border border-edge/60 transition-all duration-300 hover:border-accent/60`}>

      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-400"></div>
          <div className="h-2.5 w-2.5 rounded-full bg-orange-400"></div>
          <div className="h-2.5 w-2.5 rounded-full bg-green-200"></div>
        </div>
        <span className="font-mono text-xs uppercase tracking-wider text-muted">{project.category.join(" · ")}</span>
      </div>

      <div className="flex flex-1 flex-col p-4 lg:p-5">
        {(project.org || project.period) &&
          <p className="text-xs text-gray-400">
            {[project.org, project.period].filter(Boolean).join(" · ")}
          </p>
        }
        <h3 className="mt-1 text-lg lg:text-xl font-semibold text-accent transition-colors duration-200 group-hover:text-white">
          {project.name}
        </h3>
        <p className="text-sm text-gray-300">{project.tagline}</p>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-400 line-clamp-4">{project.description}</p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.tools.map((t) => (
            <span key={t} className="rounded-full border border-line bg-surface px-2.5 py-0.5 font-mono text-xs text-amber-300">
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-3 text-xs">
        <span className="text-muted">{project.role}</span>
        {project.code ? (
          <Link
            href={project.code}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-accent transition-colors duration-200 hover:text-white"
          >
            <FaGithub size={14} /> View code
          </Link>
        ) : (
          <span className="text-muted">{project.note || "Code not public"}</span>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;

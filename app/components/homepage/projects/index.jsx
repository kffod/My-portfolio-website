"use client";
// @flow strict
import { projectsData } from "@/utils/data/projects-data";
import { useState } from "react";
import FeaturedProject from "./featured-project";
import ProjectCard from "./project-card";

const featured = projectsData.filter((p) => p.featured);
const others = projectsData.filter((p) => !p.featured);
const categories = ["All", ...Array.from(new Set(others.flatMap((p) => p.category)))];

function Projects() {
  const [active, setActive] = useState("All");
  const shown = active === "All" ? others : others.filter((p) => p.category.includes(active));

  return (
    <div id="projects" className="relative z-50 border-t my-12 lg:my-24 border-line">
      <div className="w-[100px] h-[100px] bg-violet-100 rounded-full absolute top-6 left-[42%] translate-x-1/2 filter blur-3xl opacity-20"></div>

      <div className="flex justify-center -translate-y-[1px]">
        <div className="w-3/4">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-violet-500 to-transparent w-full" />
        </div>
      </div>

      <div className="flex justify-center my-5 lg:py-8">
        <div className="flex items-center">
          <span className="w-24 h-[2px] bg-raised"></span>
          <span className="bg-raised w-fit text-white p-2 px-5 text-xl rounded-md">
            Projects
          </span>
          <span className="w-24 h-[2px] bg-raised"></span>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {featured.map((project) => (
          <FeaturedProject project={project} key={project.id} />
        ))}
      </div>

      <div className="mt-14 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <p className="text-lg lg:text-xl font-medium text-white">
          More projects <span className="text-sm text-muted">({shown.length})</span>
        </p>
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter projects">
          {categories.map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={active === c}
              onClick={() => setActive(c)}
              className={`rounded-full px-3 py-1 font-mono text-xs lg:text-sm transition-all duration-200 ${
                active === c
                  ? "bg-gradient-to-r from-pink-500 to-violet-600 text-white"
                  : "border border-line bg-surface text-gray-300 hover:border-violet-500 hover:text-white"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {shown.map((project) => (
          <ProjectCard project={project} key={project.id} />
        ))}
      </div>
    </div>
  );
};

export default Projects;

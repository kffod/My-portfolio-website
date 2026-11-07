// @flow strict
// Skills as a static, wrapping list (it used to be an auto-scrolling marquee).

import { skillsData } from "@/utils/data/skills";
import { skillsImage } from "@/utils/skill-image";
import Image from "next/image";
import { FaBookOpen, FaDatabase, FaMagic, FaRobot } from "react-icons/fa";

// skills that are concepts rather than products, so they get an icon instead of a brand logo
const conceptIcons = {
  "rag": FaBookOpen,
  "agentic workflows": FaRobot,
  "vector db": FaDatabase,
  "prompt engineering": FaMagic,
};

function SkillIcon({ skill }) {
  const src = skillsImage(skill)?.src;
  if (src) {
    return <Image src={src} alt="" width={24} height={24} className="h-6 w-6 object-contain" />;
  }
  const Icon = conceptIcons[skill.toLowerCase()];
  return (
    <span aria-hidden="true" className="flex h-6 w-6 items-center justify-center rounded-md bg-raised text-accent">
      {Icon ? (
        <Icon size={13} />
      ) : (
        <span className="text-[10px] font-semibold">
          {skill.replace(/[^A-Za-z0-9 ]/g, " ").split(" ").filter(Boolean).map((w) => w[0]).join("").slice(0, 3).toUpperCase()}
        </span>
      )}
    </span>
  );
}

function Skills() {
  return (
    <div id="skills" className="relative z-50 border-t my-12 lg:my-24 border-line">
      <div className="flex justify-center -translate-y-[1px]">
        <div className="w-3/4">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-edge to-transparent w-full" />
        </div>
      </div>

      <div className="flex justify-center my-5 lg:py-8">
        <div className="flex items-center">
          <span className="w-24 h-[2px] bg-raised"></span>
          <h2 className="bg-raised w-fit text-white p-2 px-5 text-xl rounded-md">
            Skills
          </h2>
          <span className="w-24 h-[2px] bg-raised"></span>
        </div>
      </div>

      <ul className="mx-auto flex max-w-5xl flex-wrap justify-center gap-2.5 py-6 sm:gap-3">
        {skillsData.map((skill, i) => (
          <li
            key={`${skill}-${i}`}
            className="flex items-center gap-2.5 rounded-lg border border-line bg-surface px-3.5 py-2.5 transition-colors duration-200 hover:border-accent/60"
          >
            <SkillIcon skill={skill} />
            <span className="text-sm text-soft">{skill}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Skills;

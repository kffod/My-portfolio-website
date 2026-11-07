// @flow strict

import { experiences } from "@/utils/data/experience";
import { BsPersonWorkspace } from "react-icons/bs";
import AnimationLottie from "../../helper/animation-lottie";
import GlowCard from "../../helper/glow-card";
import experience from '/public/lottie/code.json';

function Experience() {
  return (
    <div id="experience" className="relative z-50 border-t my-12 lg:my-24 border-line">

      <div className="flex justify-center my-5 lg:py-8">
        <div className="flex  items-center">
          <span className="w-24 h-[2px] bg-raised"></span>
          <h2 className="bg-raised w-fit text-white p-2 px-5 text-xl rounded-md">
            Experience
          </h2>
          <span className="w-24 h-[2px] bg-raised"></span>
        </div>
      </div>

      <div className="py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          <div className="flex justify-center items-start">
            <div className="w-full h-full">
              <AnimationLottie animationPath={experience} />
            </div>
          </div>

          <div>
            <div className="flex flex-col gap-6">
              {
                experiences.map(experience => (
                  <GlowCard key={experience.id} identifier={`experience-${experience.id}`}>
                    <div className="p-3 relative">
                      <div className="flex justify-center">
                        <p className="text-xs sm:text-sm text-accent">
                          {experience.duration}
                        </p>
                      </div>
                      <div className="flex items-start gap-x-8 px-3 py-5">
                        <div className="text-accent">
                          <BsPersonWorkspace size={36} />
                        </div>
                        <div className="flex-1">
                          <p className="text-base sm:text-xl mb-2 font-medium">
                            {experience.title}
                          </p>
                          <p className="text-sm sm:text-base">
                            {experience.company}
                          </p>
                          {experience.subtitle &&
                            <p className="mt-1 text-xs sm:text-sm text-accent">{experience.subtitle}</p>
                          }
                          {experience.highlights &&
                            <ul className="mt-4 space-y-2">
                              {experience.highlights.map(([label, text]) => (
                                <li key={label} className="flex gap-2 text-xs sm:text-sm leading-relaxed text-gray-300">
                                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent"></span>
                                  <span><span className="font-semibold text-white">{label}:</span> {text}</span>
                                </li>
                              ))}
                            </ul>
                          }
                          {experience.stack &&
                            <div className="mt-4 flex flex-wrap gap-1.5">
                              {experience.stack.map((item) => (
                                <span key={item} className="rounded-full border border-accent/40 bg-accent/5 px-2.5 py-0.5 text-xs text-accent">
                                  {item}
                                </span>
                              ))}
                            </div>
                          }
                        </div>
                      </div>
                    </div>
                  </GlowCard>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Experience;
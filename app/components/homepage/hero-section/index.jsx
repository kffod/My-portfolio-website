// @flow strict

import { personalData } from "@/utils/data/personal-data";
import Link from "next/link";
import { BsGithub, BsLinkedin, BsYoutube } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa";
import { MdDownload } from "react-icons/md";
import { RiContactsFill } from "react-icons/ri";

function HeroSection() {
  return (
    <section className="relative flex flex-col items-center justify-between py-4 lg:py-12">

      <div className="grid grid-cols-1 items-start lg:grid-cols-2 lg:gap-12 gap-y-8">
        <div className="order-2 lg:order-1 flex flex-col items-start justify-center p-2 pb-20 md:pb-10 lg:pt-10">
          <h1 className="text-3xl font-bold leading-10 text-white md:font-bold lg:text-[2.6rem] lg:leading-[3.5rem]">
            Hello, <br />
            This is {' '}
            <span className="text-white">{personalData.name}</span>
            {`, I'm an `}
            <span className=" text-accent">{personalData.designation}</span>
            {` at DXC Technology.`}
          </h1>

          <p className="mt-6 text-gray-300 text-base lg:text-xl leading-relaxed max-w-xl">
            I ship production AI agents end to end: agentic workflows, RAG, MCP tools, APIs and UI,
            built for the people and systems a business actually runs on.
          </p>

          <div className="my-10 flex items-center gap-5">
            <Link
              href={personalData.github}
              target='_blank'
              className="m-btn transition-colors text-soft hover:text-accent duration-200"
            >
              <BsGithub size={30} />
            </Link>
            <Link
              href={personalData.linkedIn}
              target='_blank'
              className="m-btn transition-colors text-soft hover:text-accent duration-200"
            >
              <BsLinkedin size={30} />
            </Link>
            <Link
              href={personalData.youtube}
              target='_blank'
              className="m-btn transition-colors text-soft hover:text-accent duration-200"
            >
              <BsYoutube size={30} />
            </Link>
            <Link
              href={personalData.facebook}
              target='_blank'
              className="m-btn transition-colors text-soft hover:text-accent duration-200"
            >
              <FaFacebook size={30} />
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href="#contact" className="m-btn flex items-center gap-1.5 rounded-full border border-accent/60 px-3 md:px-8 py-3 md:py-4 text-xs md:text-sm font-medium md:font-semibold uppercase tracking-wider text-white transition-colors duration-200 hover:border-accent hover:bg-accent/10">
              <span>Contact me</span>
              <RiContactsFill size={16} />
            </Link>

            <Link className="m-btn flex items-center gap-1 rounded-full bg-accent hover:bg-accent/90 px-3 md:px-8 py-3 md:py-4 text-center text-xs md:text-sm font-medium uppercase tracking-wider text-page no-underline transition-all duration-200 ease-out hover:text-page hover:no-underline md:font-semibold" role="button" target="_blank" href={personalData.resume}
            >
              <span>Get Resume</span>
              <MdDownload size={16} />
            </Link>
          </div>

          <Link href="#terminal" className="mt-6 font-mono text-sm text-gray-400 hover:text-accent transition-colors duration-200">
            <span className="text-accent">$</span> prefer the command line? try my terminal ↓
          </Link>

        </div>
        <div className="bg-surface order-1 lg:order-2 border-edge/60 relative rounded-lg border">
          <div className="px-4 lg:px-8 py-5">
            <div className="flex flex-row space-x-2">
              <div className="h-3 w-3 rounded-full bg-red-400"></div>
              <div className="h-3 w-3 rounded-full bg-orange-400"></div>
              <div className="h-3 w-3 rounded-full bg-green-200"></div>
            </div>
          </div>
          <div className="overflow-hidden border-t-[2px] border-line px-4 lg:px-8 py-4 lg:py-8">
            <code className="font-mono text-xs md:text-sm lg:text-base">
              <div className="blink">
                <span className="mr-2 text-pink-500">const</span>
                <span className="mr-2 text-white">coder</span>
                <span className="mr-2 text-pink-500">=</span>
                <span className="text-gray-400">{'{'}</span>
              </div>
              <div>
                <span className="ml-4 lg:ml-8 mr-2 text-white">name:</span>
                <span className="text-gray-400">{`'`}</span>
                <span className="text-amber-300">Sachin Jadhav</span>
                <span className="text-gray-400">{`',`}</span>
              </div>
              <div>
                <span className="ml-4 lg:ml-8 mr-2 text-white">building:</span>
                <span className="text-gray-400">{`'`}</span>
                <span className="text-amber-300">Integral Assistant</span>
                <span className="text-gray-400">{`',`}</span>
              </div>
              <div className="ml-4 lg:ml-8 mr-2">
                <span className=" text-white">roles:</span>
                <span className="text-gray-400">{`['`}</span>
                <span className="text-amber-300">AI Engineer</span>
                <span className="text-gray-400">{"', '"}</span>
                <span className="text-amber-300">Forward Deployed Engineer</span>
                <span className="text-gray-400">{"', '"}</span>
                <span className="text-amber-300">AI Full-Stack</span>
                <span className="text-gray-400">{"'],"}</span>
              </div>
              <div className="ml-4 lg:ml-8 mr-2">
                <span className=" text-white">skills:</span>
                <span className="text-gray-400">{`['`}</span>
                <span className="text-amber-300">Claude</span>
                <span className="text-gray-400">{"', '"}</span>
                <span className="text-amber-300">MCP</span>
                <span className="text-gray-400">{"', '"}</span>
                <span className="text-amber-300">LangChain</span>
                <span className="text-gray-400">{"', '"}</span>
                <span className="text-amber-300">RAG</span>
                <span className="text-gray-400">{"', '"}</span>
                <span className="text-amber-300">Agentic Workflows</span>
                <span className="text-gray-400">{"', '"}</span>
                <span className="text-amber-300">Bedrock KB</span>
                <span className="text-gray-400">{"', '"}</span>
                <span className="text-amber-300">Vector DB</span>
                <span className="text-gray-400">{"', '"}</span>
                <span className="text-amber-300">OpenTelemetry</span>
                <span className="text-gray-400">{"', '"}</span>
                <span className="text-amber-300">Python</span>
                <span className="text-gray-400">{"', '"}</span>
                <span className="text-amber-300">FastAPI</span>
                <span className="text-gray-400">{"', '"}</span>
                <span className="text-amber-300">React + Vite</span>
                <span className="text-gray-400">{"'],"}</span>
              </div>
              <div>
                <span className="ml-4 lg:ml-8 mr-2 text-white">shipsToProduction:</span>
                <span className="text-orange-400">true</span>
                <span className="text-gray-400">,</span>
              </div>
              <div>
                <span className="ml-4 lg:ml-8 mr-2 text-white">ownsEndToEnd:</span>
                <span className="text-orange-400">true</span>
                <span className="text-gray-400">,</span>
              </div>
              <div>
                <span className="ml-4 lg:ml-8 mr-2 text-white">problemSolver:</span>
                <span className="text-orange-400">true</span>
                <span className="text-gray-400">,</span>
              </div>
              <div>
                <span className="ml-4 lg:ml-8 mr-2 text-green-400">hireable:</span>
                <span className="text-orange-400">function</span>
                <span className="text-gray-400">{'() {'}</span>
              </div>
              <div>
                <span className="ml-8 lg:ml-16 mr-2 text-orange-400">return</span>
                <span className="text-gray-400">{`(`}</span>
              </div>
              <div>
                <span className="ml-12 lg:ml-24 text-cyan-400">this.</span>
                <span className="mr-2 text-white">shipsToProduction</span>
                <span className="text-amber-300">&amp;&amp;</span>
              </div>
              <div>
                <span className="ml-12 lg:ml-24 text-cyan-400">this.</span>
                <span className="mr-2 text-white">problemSolver</span>
                <span className="text-amber-300">&amp;&amp;</span>
              </div>
              <div>
                <span className="ml-12 lg:ml-24 text-cyan-400">this.</span>
                <span className="mr-2 text-white">skills.length</span>
                <span className="mr-2 text-amber-300">&gt;=</span>
                <span className="text-orange-400">5</span>
              </div>
              <div><span className="ml-8 lg:ml-16 mr-2 text-gray-400">{`);`}</span></div>
              <div><span className="ml-4 lg:ml-8 text-gray-400">{`};`}</span></div>
              <div><span className="text-gray-400">{`};`}</span></div>
            </code>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
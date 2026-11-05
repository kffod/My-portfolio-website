// @flow strict

import { personalData } from "@/utils/data/personal-data";
import Image from "next/image";

const strengths = [
  {
    title: "End-to-end AI apps",
    text: "Agent logic, Python FastAPI backend, React + Vite + TypeScript UI and AWS deployment. I own the whole thing.",
  },
  {
    title: "Agents & MCP",
    text: "Agentic workflows on Claude that plan, then act on real systems through MCP tools.",
  },
  {
    title: "RAG that cites its sources",
    text: "Retrieval over a Bedrock Knowledge Base and a vector DB, with evals to measure what it finds.",
  },
  {
    title: "Safe in production",
    text: "Human approval before any write, role-based access, and guards against unverified claims.",
  },
];

const stack = ["Claude", "MCP", "LangChain", "RAG", "Agentic Workflows", "Bedrock KB", "Vector DB", "OpenTelemetry", "Python", "FastAPI", "React + Vite"];

function AboutSection() {
  return (
    <div id="about" className="my-12 lg:my-16 relative">
      <div className="hidden lg:flex flex-col items-center absolute top-16 -right-8">
        <span className="bg-[#1a1443] w-fit text-white rotate-90 p-2 px-5 text-xl rounded-md">
          ABOUT ME
        </span>
        <span className="h-36 w-[2px] bg-[#1a1443]"></span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        <div className="order-2 lg:order-1">
          <p className="font-medium mb-5 text-[#16f2b3] text-xl uppercase">
            Who am I?
          </p>

          <div className="space-y-4 text-gray-200 text-sm lg:text-lg leading-relaxed">
            <p>
              I&apos;m an <span className="text-white font-semibold">AI engineer who ships production AI agents end to end</span>:
              from LLM orchestration and retrieval to APIs, UI and deployment.
            </p>
            <p>
              At <span className="text-white font-semibold">DXC Technology</span> I built{" "}
              <span className="text-[#16f2b3] font-semibold">Integral Assistant</span>, from prototype to a deployed
              pilot. It brings Claude to IBM i / SMART/400 R26 (LIFE/Asia), the latest release of the platform behind DXC&apos;s life
              insurance software, and is designed for the business analysts and developers who work in it every day.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
            {strengths.map((item) => (
              <div key={item.title} className="rounded-lg border border-[#1f223c] bg-[#11152c] p-3 hover:border-violet-500 transition-all duration-300">
                <p className="text-[#16f2b3] text-sm lg:text-base font-semibold mb-1">{item.title}</p>
                <p className="text-gray-300 text-xs lg:text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>

          <p className="text-gray-300 text-xs lg:text-sm mt-5">
            <span className="text-white font-semibold">All four Anthropic Claude certifications</span>, including
            Claude Certified Architect – Professional · DXC SMART/400 Developer · B.E. Computer Science (Data Science)
            with Honors in Cyber Security
          </p>

          <div className="flex flex-wrap gap-2 mt-4">
            {stack.map((item) => (
              <span
                key={item}
                className="text-xs lg:text-sm text-[#16f2b3] border border-[#16f2b3]/40 bg-[#16f2b3]/5 rounded-full px-3 py-1"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="flex justify-center order-1 lg:order-2">
          <Image
            src={personalData.profile}
            width={280}
            height={280}
            alt={personalData.name}
            className="rounded-lg transition-all duration-1000 grayscale hover:grayscale-0 hover:scale-110 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default AboutSection;

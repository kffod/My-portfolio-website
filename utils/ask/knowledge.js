// Knowledge base for the "Ask my portfolio" assistant.
// Built from the same data files the site renders, so answers stay in sync with the page.
// To teach the assistant something new, update the data files (or add a doc below).
import { certifications } from "@/utils/data/certifications";
import { educations } from "@/utils/data/educations";
import { experiences } from "@/utils/data/experience";
import { linkedinPosts } from "@/utils/data/linkedin-posts";
import { personalData } from "@/utils/data/personal-data";
import { projectsData } from "@/utils/data/projects-data";
import { skillsData } from "@/utils/data/skills";

export function buildKnowledge() {
  const docs = [];
  const add = (title, text, url = "", flags = {}) => docs.push({ title, text, url, ...flags });

  add("About Sachin", personalData.description, "/#about", { pinned: true });

  add(
    "Roles and strengths",
    "Sachin positions himself for AI Engineer, Forward Deployed Engineer and AI Full-Stack Engineer roles. " +
      "Strengths: building AI apps end to end (agent logic, Python FastAPI backend, React + TypeScript UI, AWS deployment); " +
      "agentic workflows on Claude that act on real systems through MCP tools; RAG that cites its sources, using a Bedrock " +
      "Knowledge Base and a vector DB, with evals to measure retrieval; and making AI safe in production with human approval " +
      "before any write, role-based access, and guards against unverified claims.",
    "/#about",
    { fallback: true }
  );

  add(
    "Integral Assistant: overview",
    "Integral Assistant is DXC Technology's internal agentic AI assistant for IBM i / SMART/400 R26 (LIFE/Asia), the latest " +
      "release of the platform behind DXC's life insurance software. Sachin built it end to end, from prototype to a deployed pilot, for the " +
      "business analysts and developers who work on the platform. The code is internal to DXC, so it isn't public; the " +
      "terminal on this site has a simulated demo (type 'integral').",
    "/#projects",
    { fallback: true }
  );

  add(
    "Integral Assistant: how it works",
    "Integral Assistant runs agentic workflows on Claude via Amazon Bedrock: it plans, acts, observes and decides. It calls " +
      "tools through an MCP (Model Context Protocol) server to read COBOL source and copybooks, query DB2 and drive real 5250 " +
      "green screens. Answers are grounded with RAG over a Bedrock Knowledge Base and a vector DB, and cite the official " +
      "manuals. Context engineering keeps prompts and tool sets role-specific and trims chat history to each model's context " +
      "window. Each user gets their own IBM i connection through a separate MCP engine, and the sign-on password stays in " +
      "memory only. The backend is Python FastAPI with streaming, secure sessions and PostgreSQL; the UI is React + Vite + TypeScript.",
    "/#terminal"
  );

  add(
    "Integral Assistant: safety and guardrails",
    "Writes are kept safe with a human in the loop: any action that would change the IBM i server pauses for a person to " +
      "approve or reject it, so the model can never commit a change on its own. " +
      "In short, every write to the server needs human approval. " +
      "Access is role-based, so each type of user can only use the tools their role allows. Guards check " +
      "answers for unverified claims, and there are evals for retrieval quality and tool selection.",
    "/#projects"
  );

  add(
    "Integral Assistant: team, delivery and releases",
    "At DXC, Sachin works with a UK-based manager, a DevOps team in Vietnam and DXC's AWS platform team. " +
      "Sachin and these teams deploy " +
      "Integral Assistant on AWS (ECS Fargate, RDS PostgreSQL, Secrets Manager, Bedrock) through a Jenkins CI/CD " +
      "pipeline, and Sachin wrote the infrastructure requirements. He managed the base repository and version control, and every " +
      "production deployment gets a date-stamped git tag, a GitHub Release and a changelog entry.",
    "/#experience"
  );

  experiences.forEach((e) =>
    add(
      `Experience: ${e.title} at ${e.company.split(" · ")[0]}`,
      [
        `${e.title}, ${e.company} ${e.duration}.`,
        e.subtitle ? `${e.subtitle}.` : "",
        (e.highlights || []).map(([label, text]) => `${label}: ${text}`).join(" "),
        e.stack ? `Stack: ${e.stack.join(", ")}.` : "",
      ].filter(Boolean).join(" "),
      "/#experience"
    )
  );

  projectsData.forEach((p) =>
    add(
      `Project: ${p.name}`,
      [
        p.tagline ? `${p.name}: ${p.tagline}.` : "",
        p.org || p.period ? `${[p.org, p.period].filter(Boolean).join(", ")}.` : "",
        p.description,
        (p.highlights || []).map((h) => `${h.title}: ${h.text}`).join(" "),
        `Tools: ${p.tools.join(", ")}. Role: ${p.role}.`,
        p.code ? `Code: ${p.code}` : p.note || "",
      ].filter(Boolean).join(" "),
      p.code || "/#projects"
    )
  );

  add(
    "Skills",
    `Skills and tools: ${skillsData.join(", ")}. Also React + Vite for front ends, LangChain for LLM apps and OpenTelemetry for tracing and observability.`,
    "/#skills"
  );

  educations.forEach((e) => add(`Education: ${e.title}`, `${e.title}, ${e.institution}, ${e.duration}.`, "/#education"));

  add(
    "Certifications",
    `Sachin holds all four Anthropic Claude certifications. Full list: ${certifications
      .map((c) => `${c.name} (${c.issuer}, ${c.date})`)
      .join("; ")}. Each one links to a public verification page in the Certifications section.`,
    "/#certifications"
  );

  linkedinPosts.forEach((p) => add(`LinkedIn post: ${p.title}`, `Posted ${p.date}. ${p.excerpt}`, p.url));

  add(
    "Contact",
    `Website: ${personalData.website}. Email: ${personalData.email}. LinkedIn: ${personalData.linkedIn}. GitHub: ${personalData.github}. Based in Mumbai, India. ` +
      "The contact form at the bottom of the site also reaches him.",
    "/#contact",
    { fallback: true }
  );

  return docs;
}

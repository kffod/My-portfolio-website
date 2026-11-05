// Experience shown in the Experience section and used by the "Ask my portfolio" assistant.
// highlights: [label, text] pairs shown as bullets · stack: tags shown under the bullets
export const experiences = [
  {
    id: 1,
    title: "Software Engineer",
    company: "DXC Technology · Remote, Mumbai",
    subtitle: "Integral Assistant: agentic AI for IBM i / SMART/400 R26",
    duration: "(Jun 2025 - Present)",
    highlights: [
      ["Integral Assistant", "Built DXC's internal agentic AI assistant end to end, from prototype to a deployed pilot, for business analysts and developers on SMART/400 R26, working hands-on with DXC's internal IBM i systems."],
      ["Agentic workflows + MCP", "Claude (Amazon Bedrock) plans, then calls tools through an MCP server to read COBOL, query DB2 and drive 5250 green screens."],
      ["Context engineering", "Role-specific prompts and tool sets, with chat history trimmed to each model's context window so long sessions never fail."],
      ["RAG", "Answers grounded in a Bedrock Knowledge Base and a vector DB, citing the official manuals."],
      ["Connections", "Per-user IBM i connections: each user gets their own MCP engine, and the sign-on password stays in memory only."],
      ["Backend", "Python FastAPI with streaming, secure cookie sessions, role-based access and a PostgreSQL store, plus a React + Vite + TypeScript UI."],
      ["Guardrails", "Human approval before any write, checks for unverified claims, and evals for retrieval and tool selection."],
      ["Collaboration & AWS", "Worked with a UK-based manager, a DevOps team in Vietnam and DXC's AWS platform team to ship on ECS Fargate through Jenkins CI/CD."],
      ["Version control & releases", "Managed the base repository and version control; every production deployment gets a date-stamped tag, GitHub Release and changelog entry."],
    ],
    stack: ["Claude", "MCP", "RAG", "Bedrock KB", "Vector DB", "Python", "FastAPI", "React + Vite", "PostgreSQL", "AWS"],
  },
  {
    id: 2,
    title: "Flask Developer",
    company: "Blinkehost",
    duration: "(Apr 2024 - Jun 2024 )"
  }
]

// The J.P. Morgan entry was a Forage job simulation, not an internship, so it now lives under certifications.

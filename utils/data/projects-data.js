// Projects shown in the Projects section and used by the "Ask my portfolio" assistant.
// featured: true  -> shown as the large card at the top (keep this to one project)
// category        -> used by the filter chips; a project can have more than one
// code            -> public repo link, or "" if the code isn't public
// note            -> short line shown when there's no public code

export const projectsData = [
  {
    id: 1,
    featured: true,
    name: "Integral Assistant",
    tagline: "Agentic AI for IBM i / SMART/400 R26",
    org: "DXC Technology",
    period: "2025 – present",
    category: ["AI", "Full-Stack"],
    description:
      "DXC's internal agentic AI assistant for IBM i / SMART/400 R26 (LIFE/Asia), the latest release of the platform behind DXC's life insurance software. I built it end to end, from prototype to a deployed pilot, for the business analysts and developers who work on the platform every day.",
    highlights: [
      {
        icon: "agent",
        title: "Agentic workflows + MCP",
        text: "Claude plans, then acts through MCP tools: it reads COBOL, queries DB2 and drives real 5250 green screens.",
      },
      {
        icon: "context",
        title: "Context engineering",
        text: "Role-specific prompts and tool sets, and chat history trimmed to each model's context window so long sessions never fail.",
      },
      {
        icon: "rag",
        title: "RAG with citations",
        text: "Answers are grounded in a Bedrock Knowledge Base and a vector DB, and cite the official manuals.",
      },
      {
        icon: "connection",
        title: "Per-user IBM i connections",
        text: "Each user gets their own MCP engine connection, and the sign-on password stays in memory only, never stored or logged.",
      },
      {
        icon: "safety",
        title: "Human approval for writes",
        text: "Anything that would change the server pauses until a person approves it. Role-based access controls who can do what.",
      },
      {
        icon: "stack",
        title: "Built and shipped end to end",
        text: "FastAPI backend and React + Vite UI, shipped on AWS with DXC's platform team, a DevOps team in Vietnam and a UK-based manager, with tagged git releases.",
      },
    ],
    spec: [
      ["platform", "SMART/400 R26"],
      ["model", "Claude"],
      ["tools", "MCP server → IBM i"],
      ["retrieval", "Bedrock KB + vector DB"],
      ["backend", "Python · FastAPI"],
      ["releases", "tagged per deploy"],
      ["writes", "human-approved"],
      ["status", "deployed pilot"],
    ],
    flow: [
      ["Plan", "Claude reads the request and picks the tools it needs."],
      ["Act", "It calls IBM i tools through the MCP server."],
      ["Ground", "It retrieves the relevant manual sections and cites them."],
      ["Approve", "A person approves any change to the server."],
      ["Answer", "It replies with citations, and the run is logged."],
    ],
    tools: ["Claude", "MCP", "RAG", "Agentic Workflows", "Bedrock Knowledge Base", "Vector DB", "Python", "FastAPI", "React + Vite", "TypeScript"],
    role: "Software Engineer · built end to end",
    code: "",
    note: "Internal to DXC, so the code isn't public.",
  },
  {
    id: 2,
    name: "ArogyaChain",
    tagline: "Health records on blockchain",
    org: "College project",
    period: "Aug – Oct 2024",
    category: ["Blockchain", "Security"],
    description:
      "Secure, scalable electronic health records. Records are stored off-chain on IPFS, with their hashes on-chain for verification. Smart contracts handle fine-grained access control and an audit trail.",
    tools: ["Ethereum", "Solidity", "IPFS", "Node.js", "Truffle", "Ganache", "MetaMask"],
    role: "Blockchain Developer",
    code: "",
  },
  {
    id: 3,
    name: "Flask MongoDB API Server",
    tagline: "Containerised REST API",
    org: "Personal project",
    period: "Feb 2025",
    category: ["Full-Stack", "Cloud"],
    description:
      "A REST API with full CRUD operations on a MongoDB user resource, containerised with Docker for one-command setup and deployment.",
    tools: ["Python", "Flask", "MongoDB", "Docker"],
    role: "Backend Developer",
    code: "",
  },
  {
    id: 4,
    name: "Nmap Scanner",
    tagline: "Network scans with PDF reports",
    org: "",
    period: "",
    category: ["Security", "Full-Stack"],
    description:
      "A Flask web app that runs Nmap scans on target IP addresses and generates a PDF report of the results. Scan results and user emails are stored in MySQL for later reference.",
    tools: ["Python", "Flask", "Nmap", "MySQL", "HTML", "CSS"],
    role: "Backend Developer",
    code: "https://github.com/kffod/nmapproject",
  },
  {
    id: 5,
    name: "Dealer Registration System",
    tagline: "Dealer portal with location analytics",
    org: "",
    period: "",
    category: ["Full-Stack"],
    description:
      "A web app where companies register as dealers, browse products and prices, and contact the business directly. The HR team can analyse business relationships by location.",
    tools: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
    role: "Full-Stack Developer",
    code: "https://github.com/kffod/Dealer-Registration-System",
  },
  {
    id: 6,
    name: "Crypto Analyzer",
    tagline: "Android market analysis app",
    org: "College project",
    period: "Jan – Apr 2024",
    category: ["Mobile"],
    description:
      "An Android app that pulls cryptocurrency charts from TradingView through its APIs, with tools to analyse the market.",
    tools: ["Android Studio", "REST APIs", "TradingView"],
    role: "Android Developer",
    code: "",
  },
  {
    id: 7,
    name: "Static Site on AWS S3",
    tagline: "S3 hosting behind a CDN",
    org: "College project",
    period: "Jan – Feb 2024",
    category: ["Cloud"],
    description: "Hosted a static website on an AWS S3 bucket and served it through AWS CloudFront as the CDN.",
    tools: ["AWS S3", "CloudFront"],
    role: "Cloud Engineer",
    code: "",
  },
  {
    id: 8,
    name: "CV Builder on AWS EC2",
    tagline: "Hands-on cloud deployment",
    org: "College project",
    period: "Jan – Feb 2024",
    category: ["Cloud"],
    description:
      "Deployed a CV Builder website on an AWS EC2 instance running Amazon Linux, for the Cloud Computing course.",
    tools: ["AWS EC2", "Amazon Linux"],
    role: "Cloud Engineer",
    code: "",
  },
];

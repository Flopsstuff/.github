export type ProjectCategory =
  | "ai-dev-tooling"
  | "ksef"
  | "hardware"
  | "forks";

export interface Project {
  slug: string;
  name: string;
  category: ProjectCategory;
  tagline: string;
  description: string;
  repoUrl: string;
  webUrl?: string;
  status?: "active" | "experimental" | "fork";
}

export const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  "ai-dev-tooling": "AI & Developer Tooling",
  ksef: "Polish e-Invoicing (KSeF)",
  hardware: "Hardware & Systems",
  forks: "Forks & Contributions",
};

export const CATEGORY_ORDER: ProjectCategory[] = [
  "ai-dev-tooling",
  "ksef",
  "hardware",
  "forks",
];

export const projects: Project[] = [
  {
    slug: "cotel",
    name: "cotel",
    category: "ai-dev-tooling",
    tagline:
      "Claude Code OpenTelemetry — single-container OTLP ingest + interactive dashboard.",
    description:
      "A single-container OTLP ingest endpoint plus an interactive dashboard for Claude Code usage: sessions, models, tools, cost, and timings. Drop it next to your Claude Code setup and get immediate observability.",
    repoUrl: "https://github.com/Flopsstuff/cotel",
    status: "active",
  },
  {
    slug: "flugins",
    name: "flugins",
    category: "ai-dev-tooling",
    tagline: "Claude Code plugin marketplace — curated plugins repository.",
    description:
      "A curated plugins repository you can point your Claude Code install at. Browse, install, and manage community plugins for Claude Code.",
    repoUrl: "https://github.com/Flopsstuff/flugins",
    status: "active",
  },
  {
    slug: "soulgrep",
    name: "soulgrep",
    category: "ai-dev-tooling",
    tagline: "Surface what actually matters in large bodies of text.",
    description:
      "grep the human signal from the noise — a tool for surfacing what actually matters in large bodies of text. Cut through context bloat and find the substance.",
    repoUrl: "https://github.com/Flopsstuff/soulgrep",
    status: "experimental",
  },
  {
    slug: "coqu",
    name: "coqu",
    category: "ai-dev-tooling",
    tagline: "Code Query — query and explore codebases.",
    description:
      "Code Query: query and explore codebases with a structured query interface. Designed for fast, targeted code navigation.",
    repoUrl: "https://github.com/Flopsstuff/coqu",
    status: "experimental",
  },
  {
    slug: "chaiba",
    name: "chaiba",
    category: "ai-dev-tooling",
    tagline: "Chess AI Battle Arena — pit chess engines and AIs against each other.",
    description:
      "Chess AI Battle Arena: pit chess engines and AIs against each other and watch them play. A playground for evaluating chess AI performance.",
    repoUrl: "https://github.com/Flopsstuff/chaiba",
    status: "experimental",
  },
  {
    slug: "ksef-client-ts",
    name: "ksef-client-ts",
    category: "ksef",
    tagline: "TypeScript client for the Polish National e-Invoice System (KSeF) API.",
    description:
      "A TypeScript client for the Polish National e-Invoice System (KSeF) API. Covers the full KSeF interface for issuing, querying, and managing e-invoices.",
    repoUrl: "https://github.com/Flopsstuff/ksef-client-ts",
    status: "active",
  },
  {
    slug: "ksef-docs",
    name: "ksef-docs",
    category: "ksef",
    tagline: "English translations of the KSeF documentation.",
    description:
      "English translations of the official KSeF documentation. Makes the Polish National e-Invoice System accessible to non-Polish-speaking developers.",
    repoUrl: "https://github.com/Flopsstuff/ksef-docs",
    status: "active",
  },
  {
    slug: "neonka",
    name: "neonka",
    category: "hardware",
    tagline: "IBM Wheelwriter electric typewriter hacking project (embedded C++).",
    description:
      "An IBM Wheelwriter electric typewriter hacking project written in embedded C++. Connects classic electromechanical hardware to modern interfaces.",
    repoUrl: "https://github.com/Flopsstuff/neonka",
    status: "experimental",
  },
  {
    slug: "ccui",
    name: "ccui",
    category: "forks",
    tagline: "CloudCLI — open-source web UI for managing Claude Code / Cursor CLI sessions.",
    description:
      "CloudCLI: a free, open-source web UI for managing Claude Code, Cursor CLI, or Codex sessions remotely from mobile or web.",
    repoUrl: "https://github.com/Flopsstuff/ccui",
    webUrl: "https://cloudcli.ai",
    status: "fork",
  },
  {
    slug: "paperclip",
    name: "paperclip",
    category: "forks",
    tagline: "Open-source orchestration for zero-human companies.",
    description:
      "Open-source orchestration for zero-human companies. Paperclip lets AI agents coordinate, plan, and execute complex multi-step work autonomously.",
    repoUrl: "https://github.com/Flopsstuff/paperclip",
    webUrl: "https://paperclip.ing",
    status: "fork",
  },
  {
    slug: "mcp-md",
    name: "mcp-md",
    category: "forks",
    tagline: "Headless semantic MCP server for Obsidian, Logseq, Dendron, and markdown vaults.",
    description:
      "A headless semantic MCP server for Obsidian, Logseq, Dendron, and any markdown vault. AST-based editing, hybrid vector + TF-IDF search, zero-setup local embeddings.",
    repoUrl: "https://github.com/Flopsstuff/mcp-md",
    webUrl: "https://www.npmjs.com/package/@wirux/mcp-markdown-vault",
    status: "fork",
  },
  {
    slug: "uemcp",
    name: "uemcp",
    category: "forks",
    tagline: "MCP server that lets AI assistants control Unreal Engine.",
    description:
      "An MCP server that lets AI assistants control Unreal Engine via a native C++ automation bridge. Bridge between AI tooling and UE's editor and runtime.",
    repoUrl: "https://github.com/Flopsstuff/uemcp",
    status: "fork",
  },
  {
    slug: "wetty",
    name: "wetty",
    category: "forks",
    tagline: "Terminal in the browser over HTTP/HTTPS.",
    description:
      "Terminal in the browser over HTTP/HTTPS — an Ajaxterm/Anyterm alternative. Provides full terminal access through any modern browser.",
    repoUrl: "https://github.com/Flopsstuff/wetty",
    webUrl: "https://butlerx.github.io/wetty",
    status: "fork",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getProjectsByCategory(
  category: ProjectCategory
): Project[] {
  return projects.filter((p) => p.category === category);
}

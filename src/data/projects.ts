import bloomieImage from "@/assets/bloomie-logo.png";
import vibestackImage from "@/assets/vibestack-preview.jpg";
import sallyImage from "@/assets/sally-preview.jpg";
import proxyImage from "@/assets/proxy-preview.jpg";
import syncuImage from "@/assets/syncu-preview.png";
import careerpassImage from "@/assets/careerpass-preview.png";
import targettImage from "@/assets/targett-preview-new.png";
import nyscImage from "@/assets/nysc-preview.png";

export interface Project {
  name: string;
  tags: string[];
  link: string;
  image: string;
  isLive: boolean;
  overview: string;
  problem?: string;
  whatIDid?: string;
  strategy?: string[];
  outcome?: string[];
  stack?: string;
  responsibilities?: string[];
  achievements?: string[];
}

export const proxyMedicine: Project = {
  name: "ProxyMedicine",
  tags: ["Telehealth", "HealthTech"],
  link: "https://www.prxy.health",
  image: proxyImage,
  isLive: true,
  overview:
    "ProxyMedicine is a telehealth platform that combines asynchronous care with AI features running in production inside a regulated clinical service. It covers AI-assisted diagnosis suggestions, prescription refills, lab requests and live consultations.",
  problem:
    "Patients were dropping out between paying and actually being seen. Acquisition was expensive and the funnel leaked at exactly the point where revenue had already been committed.",
  whatIDid:
    "I took the product from concept to production and still own it. I write the PRDs, user stories and acceptance criteria, work with clinicians and engineers on the clinical workflows, and keep the service LegitScript compliant and HIPAA aligned alongside legal.",
  strategy: [
    "Three decisions did most of the work.",
    "First, I checked where the traffic actually came from before touching the design. About 80% of it was mobile and primarily iOS. So I rebuilt acquisition and onboarding mobile first rather than adapting a desktop flow.",
    "Second, I moved identity verification and health profile completion to immediately after checkout instead of before it. People who have already paid finish forms. People who have not, leave. That single resequencing lifted completion and cut the delay before a clinician could review a case, and it required no new feature to be built.",
    "Third, I treated pricing as a product surface rather than a commercial afterthought. I planned subscription integration and pricing model changes directly with engineering instead of handing over a spec.",
  ],
  outcome: [
    "1,400 patients",
    "1,072 refill requests",
    "17 live consultations",
    "Now running 15 to 25 encounters daily",
    "Monthly consultations went from about 52 to about 2x in month 1 and 2.5x within 2 months",
    "35% increase in conversion from the subscription and pricing work",
    "40% lift in post-launch user satisfaction from A/B tests on core task completion flows",
    "Contributed to healthcare IP later licensed for $120,000, which became the foundation of StatWell MD",
  ],
  stack: "Cursor, Lovable, Figma, Jira, Google Analytics, LLM features in production.",
};

export const targett: Project = {
  name: "Targett",
  tags: ["AI Search", "SEO"],
  link: "https://targett-ai.lovable.app",
  image: targettImage,
  isLive: false,
  overview:
    "Targett is an AI-powered search optimization platform that helps businesses improve whether AI assistants recommend their product or website. Planned and built end to end on Lovable with Stripe payments, Resend emails and analytics integrated.",
  problem:
    "Businesses could see that AI assistants were not recommending them, but had no way to find out why, and no way to fix it that did not take an engineer several days.",
  whatIDid: "I built and launched the platform, and ran onboarding myself for the first cohort of users.",
  strategy: [
    "I onboarded 50+ users through consultative discovery rather than self-serve signup. I sat with them, ran their audits with them, and used what came out of those sessions to set the roadmap. The audits were the research, so discovery and delivery were the same activity instead of two phases.",
    "On the product itself, I worked the problem through prompt and context engineering rather than content volume, then A/B tested the audit, gap-detection and auto-fix features to find which combination users actually completed.",
    "The last decision was about where the work ends. Shipping one-click publishing to GitHub and WordPress turned a report into a fix, which is what took the job from days to minutes.",
  ],
  outcome: [
    "Raised an AI discoverability score from 44 to 98 in two weeks",
    "50+ users onboarded through consultative discovery",
    "Cut optimisation work from days to minutes",
  ],
  stack: "Lovable, Stripe, Resend, GitHub, WordPress, prompt and context engineering.",
};

export const sally: Project = {
  name: "Sally",
  tags: ["AI", "Personal Branding"],
  link: "https://heysally.app",
  image: sallyImage,
  isLive: false,
  overview:
    "Sally is an AI personal brand manager. You share your day with a quick voice note or a line of text, and Sally turns it into on-brand posts that sound like you, then schedules and publishes them across LinkedIn and TikTok so you stay consistently visible.",
  problem:
    "Staying visible professionally takes consistency, and consistency is the thing people run out of first. Most tools generate posts. Almost none remember who you are across months.",
  whatIDid:
    "I scoped and shipped the integration and billing layer, and specified the memory and agent architecture. Launched June 2026 with zero ad spend.",
  strategy: [
    "I built the distribution before the cleverness. The LinkedIn and TikTok developer app integrations, Paddle billing and Resend lifecycle email went in early, because a tool that writes well but cannot publish or charge is a demo.",
    "The second decision was about memory. I specified a long-term memory layer using pgvector so the product gets more accurate about a person the longer they use it, rather than starting from zero each session.",
    "The third was to open the product up. I specified an MCP server so external AI agents can drive Sally directly, which makes it a component other systems can use instead of a destination people have to visit.",
  ],
  outcome: [
    "Launched June 2026 with zero ad spend",
    "Live LinkedIn and TikTok publishing, Paddle billing and Resend lifecycle email",
    "pgvector memory layer and an MCP server for external agents",
  ],
  stack: "LinkedIn and TikTok developer APIs, Paddle, Resend, pgvector, MCP.",
};

export const projectsData: Project[] = [
  sally,
  {
    name: "Bloomie AI",
    tags: ["EdTech"],
    link: "https://learn.bloomie.com",
    image: bloomieImage,
    isLive: true,
    overview:
      "Bloomie AI is a personalized learning platform for children, using AI to deliver adaptive lessons and engaging progress dashboards.",
    problem:
      "Children's learning products have two users who want different things. The child has to want to come back. The parent has to be able to see it is working.",
    whatIDid: "I led the product as Product Manager and launched it for children aged 3 to 12 and their parents.",
    strategy: [
      "I treated the parent dashboard as a product surface rather than reporting. Adaptive lessons keep the child engaged, and the progress dashboard is what keeps the parent paying, so both had to be designed rather than one being a by-product of the other.",
    ],
    outcome: ["500+ users in 2 months", "80% adoption of the AI tool"],
    stack: "AI adaptive lessons, progress dashboards.",
  },
  proxyMedicine,
  {
    name: "VibeStack",
    tags: ["AI Design", "DevTools"],
    link: "https://vibestacks.pro",
    image: vibestackImage,
    isLive: false,
    overview:
      "VibeStack is a design-system generator and prompt workspace for vibe coders. In one prompt it mixes 200k+ icons, curated palettes, font pairings, atmospheres and layout styles into a cohesive theme you can drop into any AI-built app, so prototypes stop looking generic.",
    problem:
      "AI-built apps all look the same. The tools generate working code and default styling, so every prototype arrives wearing the same clothes.",
    whatIDid: "I shipped it from zero to live on my own.",
    strategy: [
      "I used AI agents for prototyping, research and production code, which is what made a solo build realistic in the first place.",
      "Because there was no team, I kept ownership of the whole stack deliberately rather than by accident: discovery, positioning, pricing experiments, onboarding and growth loops. That meant pricing could be tested against onboarding directly, with no handoff in between.",
    ],
    outcome: [
      "Shipped from zero to a live product solo",
      "200k+ icons, curated palettes, font pairings and layout styles in one generated theme",
    ],
    stack: "AI coding agents, Lovable.",
  },
  targett,
  {
    name: "NYSC Attendance System",
    tags: ["GovTech", "Attendance"],
    link: "#",
    image: nyscImage,
    isLive: false,
    overview:
      "A cloud check-in and clearance platform built for a public-sector agency, replacing a paper process.",
    problem:
      "Clearance ran on paper. That meant queues, lost records, and no way for anyone to see what was happening until after it had gone wrong.",
    whatIDid: "I designed and launched the platform and have kept iterating on it in production.",
    strategy: [
      "I did not digitise the paper form. I looked at what the queue was actually for and replaced the mechanism: QR-powered check-in, notifications, and admin tooling so staff could resolve problems themselves instead of escalating them.",
      "Then I ran the product off its own logs. Reading production logs and user feedback directly let me ship same-day fixes for user-facing issues rather than batching them into releases, which matters when the users are standing in a queue at the time.",
      "I also designed for the wait rather than pretending it away. Adding engagement features that kept people occupied while queuing raised average session time.",
    ],
    outcome: [
      "6,700+ registered users",
      "About 3,200 daily active users",
      "Same-day production fixes driven by log analysis",
      "Raised average session time",
    ],
    stack: "Lovable, QR check-in, notifications, admin tooling, production log analysis.",
  },
  {
    name: "Syncu",
    tags: ["Community", "Collaboration"],
    link: "https://www.linkedin.com/company/sync-u/",
    image: syncuImage,
    isLive: false,
    overview:
      "Syncu is a community platform that connects tech professionals to collaborate on product ideas. It enables hands-on experience, real-time portfolio building, and project-based team formation.",
    responsibilities: [
      "Designed platform vision and roadmap to support collaborative projects.",
      "Grew the community to 250+ members through outreach and engagement.",
      "Facilitated 10+ collaborations by connecting professionals with aligned goals.",
      "Oversaw waitlist operations, managing 530+ potential users.",
    ],
    achievements: [
      "Built and scaled a community of 250+ members.",
      "Enabled 10+ active product collaborations.",
      "Grew waitlist to 530+ users within launch window.",
    ],
  },
  {
    name: "CareerPASS",
    tags: ["Psychometrics", "Career Guidance"],
    link: "https://career-pass.vercel.app/",
    image: careerpassImage,
    isLive: false,
    overview:
      "CareerPASS is a psychometric analysis and career recommendation platform. It helps students discover career paths aligned with their strengths through personality and skill assessments.",
    responsibilities: [
      "Scoped and managed end-to-end development of the MVP within 8 weeks.",
      "Created PRDs and coordinated efforts across data analysts, developers, and designers.",
      "Implemented Trello workflows to track deliverables and dependencies.",
      "Oversaw integration of psychometric models into the platform.",
    ],
    achievements: [
      "Delivered MVP on time with full functionality within 8 weeks.",
      "Selected as a Top 5 project at a major career showcase.",
      "Enabled 1,000+ students to access career assessments during pilot.",
    ],
  },
];

export const featuredProjects: Project[] = [sally, targett, proxyMedicine].map((p) => ({ ...p, isLive: true }));

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
    "I was asked to improve conversion. Patients were dropping out along the route to care, and bringing in more traffic would not fix that on its own. I needed to understand where people were leaving and what we were asking them to do before they could see a clinician.\n\nThe service also runs in a regulated setting. Any change to onboarding still had to support the identity checks and health information needed for clinical review.",
  whatIDid:
    "I took ProxyMedicine from concept to production and still own the product. It is a live clinical service, not an AI prototype. The LLM features sit alongside prescription refills, lab requests and live consultations.\n\nI write the PRDs, user stories and acceptance criteria, then work with clinicians and engineers on how those flows should work. I also work alongside legal to keep the service LegitScript compliant and HIPAA aligned.\n\nFor the conversion work, I reviewed the traffic, rebuilt acquisition and onboarding mobile first, moved identity verification and health profile completion to after checkout, and planned the subscription and pricing changes with engineering.",
  strategy: [
    "I started with how people were actually using the service, not with a new feature list.",
    "About 80% of traffic was mobile, mainly iOS. That told me the mobile journey needed to be the starting point. I rebuilt acquisition and onboarding for that experience instead of making people work through a desktop flow on their phone.",
    "I moved identity verification and health profile completion to immediately after checkout. I did not remove those steps. I changed when we asked for them, so patients could pay before completing the information needed for care. That improved completion and reduced the delay before clinical review without adding a new feature.",
    "I worked on subscriptions and pricing with engineering because the payment flow was part of the same problem. I also ran A/B tests on core tasks to check whether people could complete them, rather than judging the changes by how the screens looked.",
  ],
  outcome: [
    "1,400 patients",
    "1,072 refill requests",
    "17 live consultations",
    "Now running 20 to 30 encounters daily",
    "Monthly consultations went from about 52 to 4.5x in 3 months",
    "35% increase in conversion from the subscription and pricing work",
    "40% lift in post-launch user satisfaction from A/B tests on core task completion flows",
    "Contributed to healthcare IP later licensed for $120,000, which became the foundation of StatWell MD",
  ],
  stack: "Cursor, Claude, Figma, Trello, Amplitude, Google Ads, GitHub, Mailchimp, Meta, Lovable.",
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
    "A business could find out that AI assistants were not recommending it and still not know what to do next. An audit alone did not solve that. The gap was between seeing the problem and making the changes, which could take an engineer several days.",
  whatIDid: "I planned and built Targett end to end on Lovable, including Stripe payments, Resend email and analytics. I built the audit, gap detection and auto-fix flows, then added one-click publishing to GitHub and WordPress.\n\nI also onboarded 50+ users myself. I ran their audits with them and used those conversations to understand what they needed help with and decide what to work on next.",
  strategy: [
    "I did the early onboarding myself rather than relying only on a signup form. Running audits with users let me see the questions they asked and where they needed help. I used that feedback to set the roadmap while the product was already being used.",
    "I worked on the prompts and context behind the recommendations, then A/B tested the audit, gap-detection and auto-fix features. I wanted to see which combination people actually completed, not just whether the product could produce a long report.",
    "I did not want the work to stop at a report. One-click publishing to GitHub and WordPress meant users could apply the changes from the same flow. That is what took the work from days to minutes.",
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
    "People have things to say about their work, but turning those moments into posts and keeping up with publishing takes time. A tool that generates text still leaves the person to schedule and publish it. It also needs to remember their voice instead of starting again every time.",
  whatIDid:
    "I built and shipped Sally using AI tooling, and launched it in June 2026 with no ad spend. I shipped the LinkedIn and TikTok developer app integrations, Paddle billing and Resend lifecycle email first.\n\nThen I worked on the long-term memory layer using pgvector, so Sally could become more accurate about a person over months. I also specified an MCP server so external AI agents could use Sally directly.",
  strategy: [
    "I started with publishing and billing. A tool that writes well but cannot publish or charge is a demo. LinkedIn, TikTok, Paddle and Resend went in early so the product could support the full journey, not just generate a post.",
    "I used pgvector for long-term memory because a personal brand manager should not forget the person between sessions. The point was to carry context forward over months, rather than asking someone to explain who they are each time.",
    "I specified the MCP server so external agents could drive Sally directly. That gives people a way to use it from another AI workflow instead of always coming back to the app.",
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
      "Bloomie needed to work for children and parents at the same time. A child needs lessons they can stay engaged with. A parent needs to see how the child is progressing. If either side is missing, the learning experience is incomplete.",
    whatIDid: "I led Bloomie AI as Product Manager and launched it for children aged 3 to 12 and their parents. The product combines adaptive lessons for the child with progress dashboards for the parent.\n\nMy focus was on making those two parts work together: learning that responds to the child, and a clear view of progress for the parent.",
    strategy: [
      "I treated the parent dashboard as part of the product, not an extra reporting screen. The child and parent needed different things from the same learning activity, so both experiences mattered.",
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
      "AI tools can produce a working app quickly, but the designs often look alike. I wanted a way to give the builder a clear set of design choices, instead of accepting the same default colours, fonts and layouts every time.",
    whatIDid: "I took VibeStack from zero to a live product on my own, using AI agents for research, prototyping and production code. I worked on discovery, positioning, pricing experiments, onboarding and growth loops myself.\n\nThe product brings 200k+ icons, palettes, font pairings, atmospheres and layout styles into one theme from a single prompt. The goal was to give an AI builder a consistent design direction it could apply across an app.",
    strategy: [
      "AI tooling was my build method. I used agents for research, prototypes and production code, while keeping the product decisions with me. That let me take the idea through to a live product on my own.",
      "I kept discovery, positioning, pricing and onboarding together. When I tested pricing, I could also change the onboarding around it without waiting for a handoff. The design choices went into a single theme so the output would work together, rather than becoming a list of unrelated suggestions.",
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
    link: "https://mykopa.app",
    image: nyscImage,
    isLive: false,
    overview:
      "An NYSC check-in and clearance platform that replaces a paper process with QR check-in, notifications and admin tooling.",
    problem:
      "NYSC check-in and clearance ran on paper. People had to queue, records could get lost, and staff did not have a clear view of what was happening. Moving the same paper form online would not address all of that. The check-in process itself needed to change.",
    whatIDid: "I designed, built and launched mykopa.app using AI tooling. I replaced the paper process with QR check-in, notifications and admin tools for the people running clearance.\n\nI still run the product in production. I read its own logs and user feedback, then ship same-day fixes when an issue affects people using it. That matters when the person reporting the problem is standing in a queue at the time.",
    strategy: [
      "I started with what people were queuing to do. QR check-in replaced the paper step, notifications kept people informed, and admin tools gave staff a way to handle issues themselves.",
      "I use production logs and feedback to decide what needs fixing. I do not wait for a batch of changes when a user-facing issue is interrupting clearance. I can investigate it and ship a fix the same day.",
      "I also added engagement features for the time people still spend waiting. Those features raised average session time, but they did not replace the main job of getting people checked in and cleared.",
    ],
    outcome: [
      "6,831 registered users",
      "128,180 visits in the last 90 days",
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
    problem: "Tech professionals needed a way to find people to build with and get hands-on experience. Syncu focused on bringing those people together around actual product ideas, so collaboration could become work they could show in a portfolio.",
    whatIDid: "I designed the platform vision and roadmap, ran outreach and engagement, and managed the waitlist. I connected professionals with aligned goals and facilitated 10+ collaborations.\n\nThe work was both product planning and community building. I needed to bring people in, understand what they wanted to work on, and help them find a team.",
    strategy: ["I organised the community around product ideas and project-based teams. The focus was on helping people work together, rather than growing a member count without any collaboration behind it.", "I used outreach and engagement to grow the community and managed the waitlist alongside it. Matching professionals with aligned goals led to 10+ active collaborations."],
    stack: "The platform tools have not been confirmed for this case study.",
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
    problem: "CareerPASS was built to help students connect their strengths to possible career paths. The product needed to turn personality and skill assessments into recommendations they could use, rather than leaving them with an assessment result alone.",
    whatIDid: "I scoped and managed the MVP from start to finish over 8 weeks. I wrote the PRDs and coordinated the data analysts, developers and designers working on it.\n\nI used Trello to track deliverables and dependencies, and oversaw the integration of the psychometric models behind the assessments and recommendations.",
    strategy: ["I scoped the work around the assessment and recommendation journey so the team could deliver a complete MVP within 8 weeks.", "I tracked deliverables and dependencies in Trello and coordinated the different roles around the same PRDs. The psychometric models had to be integrated into a working product, not left as a separate piece of analysis."],
    stack: "Trello, psychometric models.",
    achievements: [
      "Delivered MVP on time with full functionality within 8 weeks.",
      "Selected as a Top 5 project at a major career showcase.",
      "Enabled 1,000+ students to access career assessments during pilot.",
    ],
  },
];

export const featuredProjects: Project[] = [sally, targett, proxyMedicine].map((p) => ({ ...p, isLive: true }));

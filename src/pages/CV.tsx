import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Calendar, Download } from "lucide-react";
import portraitImage from "@/assets/henrietta-portrait.jpg";
import cvAsset from "@/assets/henrietta-cv.pdf.asset.json";
import CVTimelineNode from "@/components/CVTimelineNode";
import CVSkillCategory from "@/components/CVSkillCategory";
import { useScrollFade } from "@/hooks/use-scroll-fade";
import FloatingActionButton from "@/components/FloatingActionButton";
import { HIRE_CALENDAR_URL, openHireCalendar } from "@/lib/booking";

const timelineNodes = [
  {
    title: "Demz Analytics",
    role: "Product Manager",
    dates: "May 2024 - Present",
    highlights: [
      "Lead product strategy and delivery for AI-enabled healthcare and SaaS products across executives, clinicians, designers, engineers, and marketers",
      "Defined PRDs, user stories, acceptance criteria, and release plans for ProxyMedicine, StatWellMD, and Bloomie AI, enabling on-time launches of all three",
      "Defined and shipped LLM-powered clinical features, keeping workflows LegitScript compliant and HIPAA aligned alongside legal",
      "Deployed AI agents into patient onboarding and moved identity verification and health-profile completion to immediately after checkout, improving completion and reducing clinician review delays",
      "Found about 80% of traffic was mobile, rebuilt acquisition and onboarding mobile first, and grew monthly consultations from about 52 to about 2x in month 1 and 2.5x within 2 months",
      "Designed an internal AI-powered SEO workflow that increased organic search clicks by 36%",
      "Contributed to healthcare IP later licensed for $120,000, forming the foundation of StatWellMD",
    ],
  },
  {
    title: "StatWellMD",
    role: "Product Manager",
    dates: "Sep 2025 – Current",
    url: "www.statwellmd.com",
    highlights: [
      "Defined product scope, PRD, and technical documentation, driving development of an EHR-integrated telehealth MVP within 1 month",
      "Designed the entire platform using Cursor AI by prompting user flows from documentation to HTML and Tailwind CSS, reducing development time by 85%",
      "Replicated and adapted the ProxyMedicine codebase to launch StatWellMD 70% faster, keeping technical teams and stakeholders aligned on the product vision and roadmap",
    ],
  },
  {
    title: "ProxyMedicine",
    role: "Team Lead / Product Manager",
    dates: "Feb 2025 – Current",
    url: "www.prxy.health",
    highlights: [
      "Took an AI-enabled telehealth platform from concept to production, scaling to 1,400 patients, 1,072 refill requests and 15 to 25 encounters daily",
      "Directed the product launch process, contributing to healthcare IP later licensed for $120,000",
      "Planned subscription and pricing changes directly with engineering, driving a 35% increase in conversion",
      "Conducted 5+ user interviews weekly to inform data-driven product decisions",
    ],
  },
  {
    title: "Bloomie",
    role: "Product Manager",
    dates: "Nov 2024 – May 2025",
    url: "learn.bloomie.com",
    highlights: [
      "Delivered Bloomie AI MVP core features, with 80% overall adoption of the AI tool",
      "Created detailed PRDs and user flows, accelerating development speed by 20%",
      "Drove data-informed product enhancements through A/B testing, boosting retention by 45%",
    ],
  },
  {
    title: "Qwikdrip",
    role: "Product Manager",
    dates: "May 2024 – Dec 2024",
    highlights: [
      "Incorporated insights from 20+ user interviews to guide feature prioritization",
      "Developed PRDs and wireframes, reducing development time by 15%",
      "Optimized features through continuous testing, boosting user content generation by 20%",
    ],
  },
  {
    title: "Umbaji",
    role: "Project Manager",
    dates: "May 2023 – Feb 2024",
    url: "https://www.umbaji.org/lang/en",
    highlights: [
      "Spearheaded 15+ project kick-off meetings, reducing project delays by 2 weeks",
      "Managed cross-functional team, achieving 84% average efficiency rate",
      "Championed team alignment, increasing developer contributions by 31%",
    ],
  },
  {
    title: "Syncu",
    role: "Team Lead / Product Manager",
    dates: "Jan 2024 – Current",
    url: "https://www.linkedin.com/company/sync-u/",
    highlights: [
      "Scaled Syncu community to 250+ members",
      "Facilitated 10+ successful product collaborations",
      "Acquired 530+ users to waitlist through community-driven marketing",
    ],
  },
  {
    title: "CareerPASS",
    role: "Team Lead / Product Manager",
    dates: "Mar 2024 – Apr 2024",
    url: "https://career-pass.vercel.app/",
    highlights: [
      "Led end-to-end development of CareerPASS psychometric platform",
      "Integrated user feedback to enhance assessment algorithm precision",
      "Recognized as top 5 project",
    ],
  },
];

const selectedWork = [
  { name: "Targett", line: "Raised an AI discoverability score from 44 to 98 in two weeks, with 50+ users onboarded through consultative discovery." },
  { name: "NYSC Attendance System", line: "Replaced a paper clearance process for a public-sector agency. 6,700+ registered users and about 3,200 daily active users." },
  { name: "Sally", line: "AI personal brand manager with live LinkedIn and TikTok publishing. Launched June 2026 with zero ad spend. Scoped and shipped Paddle billing and Resend lifecycle email, and specified a pgvector long-term memory layer and an MCP server for external AI agents." },
  { name: "VibeStack", line: "Design-system generator and prompt workspace for AI-built apps, shipped from zero to live solo using AI agents for prototyping, research and production code." },
];

const skillCategories = {
  softSkills: [
    "Team Leadership",
    "Data-driven Decisions",
    "Strategic Thinking",
    "Communication",
    "Stakeholder Management",
    "Problem Solving",
    "Creative Eyesight",
  ],
  technicalSkills: [
    "Product Roadmaps",
    "PRDs & User Stories",
    "UX Research",
    "A/B Testing",
    "Analytics",
    "User Journey",
    "Product-Led Growth",
    "Feature Prioritization",
    "MVP Development",
    "API Documentation",
    "Data Analytics",
    "Agile Frameworks",
    "Scrum Methodologies",
    "Product Discovery",
    "Backlog Prioritization",
    "Acceptance Criteria",
    "Sprint Planning",
    "Funnel Optimization",
    "SEO",
    "Prompt Engineering",
    "AI Product Development",
    "AI Product Strategy",
    "AI Use-case Pipelines",
    "LLM Feature Definition",
    "Context Engineering",
    "RAG",
    "AI Agent Workflows",
    "AI Production Deployment",
  ],
  tools: [
    "Figma",
    "Google Analytics",
    "Jira",
    "Trello",
    "Notion",
    "Miro",
    "Amplitude",
    "ChatGPT",
    "CursorAI",
    "GitHub",
    "Whimsical",
    "Claude",
    "Lovable",
    "Linear",
    "Supabase",
    "Mixpanel",
  ],
};

const CV = () => {
  const { ref: headerRef, opacity: headerOpacity, translateY: headerTranslateY } = useScrollFade();
  const { ref: summaryRef, opacity: summaryOpacity, translateY: summaryTranslateY } = useScrollFade();
  const { ref: skillsHeaderRef, opacity: skillsHeaderOpacity, translateY: skillsHeaderTranslateY } = useScrollFade();
  const {
    ref: timelineHeaderRef,
    opacity: timelineHeaderOpacity,
    translateY: timelineHeaderTranslateY,
  } = useScrollFade();

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Navigation />
      <main className="pt-40 pb-16">
        <div className="container mx-auto px-6">
          <div
            ref={headerRef as any}
            className="mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
            style={{ opacity: headerOpacity, transform: `translateY(${headerTranslateY}px)` }}
          >
            <div className="flex items-center gap-6">
              <img
                src={portraitImage}
                alt="Henrietta Onwuneme"
                className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover ring-4 ring-primary/20"
              />
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-display font-bold mb-2">
                  Curriculum <span className="font-handwritten text-primary-visible">Vitae</span>
                </h1>
                <p className="text-sm text-muted-foreground max-w-2xl">
                  My journey through product management and beyond
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3 md:items-end">
              <Button asChild size="lg" className="gap-2 w-full md:w-auto">
                <a href={HIRE_CALENDAR_URL} target="_blank" rel="noopener noreferrer" onClick={openHireCalendar}>
                  <Calendar className="w-5 h-5" />
                  Hire Henrietta
                </a>
              </Button>
              <Button asChild variant="outline" className="gap-2 w-full md:w-auto">
                <a href={cvAsset.url} download="Henrietta_Onwuneme_Product_Manager_CV.pdf">
                  <Download className="w-4 h-4" />
                  Download CV
                </a>
              </Button>
            </div>
          </div>

          <div className="max-w-4xl mx-auto mb-16">
            <div
              ref={summaryRef as any}
              className="glass p-8 rounded-[1.5rem]"
              style={{ opacity: summaryOpacity, transform: `translateY(${summaryTranslateY}px)` }}
            >
              <h2 className="text-3xl font-display font-bold mb-4">Professional Overview</h2>
              <p className="text-muted-foreground leading-relaxed">
                Product Manager with 3+ years taking AI-enabled healthcare and SaaS products from discovery to
                production. Owns the AI use-case pipeline, the PRDs and acceptance criteria behind LLM features, and
                delivery alongside clinicians, engineers and designers. Launched three products, scaled a US telehealth
                platform to 1,400 patients and 15 to 25 encounters daily, and contributed to healthcare IP licensed for
                $120,000.
              </p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <h2
              ref={timelineHeaderRef as any}
              className="text-3xl font-display font-bold mb-8"
              style={{ opacity: timelineHeaderOpacity, transform: `translateY(${timelineHeaderTranslateY}px)` }}
            >
              Work Experience
            </h2>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary/30" />

              {timelineNodes.map((node, index) => (
                <CVTimelineNode
                  key={index}
                  title={node.title}
                  role={node.role}
                  dates={node.dates}
                  highlights={node.highlights}
                  index={index}
                  url={node.url}
                />
              ))}
            </div>
          </div>

          <div className="max-w-4xl mx-auto mt-16 mb-16">
            <h2 className="text-3xl font-display font-bold mb-6">Selected Product Work</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {selectedWork.map((w) => (
                <div key={w.name} className="glass p-6 rounded-[1.5rem]">
                  <h3 className="text-xl font-display font-bold mb-2">{w.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{w.line}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-3xl font-display font-bold mb-6">Education and Certifications</h2>
            <div className="glass p-6 rounded-[1.5rem]">
              <h3 className="text-xl font-display font-bold mb-1">University of Uyo</h3>
              <p className="text-primary font-semibold text-sm mb-1">BSc Architecture</p>
              <p className="text-xs text-muted-foreground mb-3">Jul 2018 – Jul 2024</p>
              <p className="text-sm text-muted-foreground">Strong foundation in human-centered design.</p>
            </div>
            <div className="mt-6 space-y-4">
              <div>
                <h3 className="text-xl font-display font-bold mb-1">Women Techsters Fellowship (Tech4Dev)</h3>
                <p className="text-primary font-semibold text-sm mb-1">Product Management Fellowship</p>
                <p className="text-xs text-muted-foreground">Oct 2023 - Oct 2024</p>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Google Project Management Certificate (Coursera)</li>
                <li>Alison Diploma in Project Management</li>
                <li>ALX Virtual Assistant (Honours)</li>
              </ul>
            </div>
          </div>

          <div className="max-w-4xl mx-auto mb-16">
            <h2
              ref={skillsHeaderRef as any}
              className="text-3xl font-display font-bold mb-6"
              style={{ opacity: skillsHeaderOpacity, transform: `translateY(${skillsHeaderTranslateY}px)` }}
            >
              Skills
            </h2>
            <div className="space-y-8">
              <CVSkillCategory title="Soft Skills" skills={skillCategories.softSkills} />
              <CVSkillCategory title="Technical Skills" skills={skillCategories.technicalSkills} />
              <CVSkillCategory title="Tools" skills={skillCategories.tools} />
            </div>
          </div>

        </div>
      </main>
      <Footer />
      <FloatingActionButton />
    </div>
  );
};

export default CV;

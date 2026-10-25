import { useState, type ReactNode } from "react";
import { ArrowUpRight, ChevronLeft, Briefcase, Calendar, Download, FileText, Heart, Home, Mail, ShoppingBag, StickyNote, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { featuredProjects, projectsData, type Project } from "@/data/projects";
import cvAsset from "@/assets/henrietta-cv.pdf.asset.json";
import prdTemplateComplete from "@/assets/prd-template-complete.png";
import prdTemplateOverview from "@/assets/prd-template-overview.png";
import { format } from "date-fns";
import { HIRE_CALENDAR_URL, openHireCalendar } from "@/lib/booking";

export type AppId = "projects" | "cv" | "letter" | "contact" | "shop";
export type LauncherId = AppId | "hire" | "home" | "love";

export interface Launcher {
  id: LauncherId;
  name: string;
  icon: LucideIcon;
  tone: string;
}

export const launchers: Launcher[] = [
  { id: "projects", name: "Projects", icon: Briefcase, tone: "projects" },
  { id: "cv", name: "CV", icon: FileText, tone: "cv" },
  { id: "letter", name: "Letter", icon: StickyNote, tone: "letter" },
  { id: "contact", name: "Contact", icon: Mail, tone: "contact" },
  { id: "shop", name: "Shop", icon: ShoppingBag, tone: "shop" },
  { id: "love", name: "Love", icon: Heart, tone: "love" },
  { id: "hire", name: "Hire Me", icon: Calendar, tone: "hire" },
  { id: "home", name: "Portfolio", icon: Home, tone: "home" },
];

export const appTitles: Record<AppId, string> = {
  projects: "Projects",
  cv: "Henrietta-Onwuneme-CV.pdf",
  letter: "Letter",
  contact: "Contact",
  shop: "Shop",
};

export const allProjects: Project[] = [...featuredProjects, ...projectsData].filter(
  (project, index, list) => list.findIndex((item) => item.name === project.name) === index,
);

const featuredNames = new Set(featuredProjects.map((project) => project.name));

function ActionBar({ children }: { children: ReactNode }) {
  return <div className="os-action-bar">{children}</div>;
}

function ProjectDetail({ project, onBack, compact }: { project: Project; onBack: () => void; compact: boolean }) {
  const sections = [
    { title: "What it is", paragraphs: [project.overview] },
    { title: "The problem", paragraphs: project.problem ? [project.problem] : [] },
    { title: "What I did", paragraphs: project.whatIDid ? [project.whatIDid] : project.responsibilities || [] },
    { title: "The strategy", paragraphs: project.strategy || [] },
    { title: "Outcome", paragraphs: project.outcome || project.achievements || [] },
    { title: "Stack and tools", paragraphs: project.stack ? [project.stack] : [] },
  ].filter((section) => section.paragraphs.length > 0);

  return (
    <div className="os-detail">
      <div className="os-detail-bar">
        <button className="os-back" onClick={onBack}><ChevronLeft aria-hidden="true" /> Projects</button>
        {!compact && project.link !== "#" && (
          <Button size="sm" asChild>
            <a href={project.link} target="_blank" rel="noopener noreferrer">Open product <ArrowUpRight /></a>
          </Button>
        )}
      </div>
      <h2 className="os-detail-title">{project.name}</h2>
      <p className="os-muted">{project.tags.join(" · ")}</p>
      <img src={project.image} alt={`${project.name} product preview`} className="os-detail-image" />
      {sections.map((section) => (
        <section key={section.title} className="os-detail-section">
          <h3>{section.title}</h3>
          {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </section>
      ))}
      {compact && project.link !== "#" && (
        <ActionBar>
          <Button size="lg" className="w-full" asChild>
            <a href={project.link} target="_blank" rel="noopener noreferrer">Open {project.name} <ArrowUpRight /></a>
          </Button>
        </ActionBar>
      )}
    </div>
  );
}

function ProjectsApp({ compact }: { compact: boolean }) {
  const [filter, setFilter] = useState<"all" | "featured">("all");
  const [selected, setSelected] = useState<Project | null>(null);
  const list = filter === "featured" ? allProjects.filter((p) => featuredNames.has(p.name)) : allProjects;

  return (
    <div className="os-finder">
      {!compact && (
        <aside className="os-finder-sidebar" aria-label="Project folders">
          <span>Favourites</span>
          <button className={filter === "all" ? "active" : ""} onClick={() => { setFilter("all"); setSelected(null); }}>All projects</button>
          <button className={filter === "featured" ? "active" : ""} onClick={() => { setFilter("featured"); setSelected(null); }}>Featured</button>
        </aside>
      )}
      <div className="os-finder-main">
        {selected ? (
          <ProjectDetail project={selected} compact={compact} onBack={() => setSelected(null)} />
        ) : (
          <>
            {compact && (
              <div className="os-segment" role="tablist">
                <button role="tab" aria-selected={filter === "all"} className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>All</button>
                <button role="tab" aria-selected={filter === "featured"} className={filter === "featured" ? "active" : ""} onClick={() => setFilter("featured")}>Featured</button>
              </div>
            )}
            <div className="os-file-grid">
              {list.map((project) => (
                <button key={project.name} className="os-file" onClick={() => setSelected(project)}>
                  <img src={project.image} alt="" loading="lazy" />
                  <span>{project.name}</span>
                  <small>{project.tags[0]}</small>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function CvApp({ compact }: { compact: boolean }) {
  const download = (
    <Button size={compact ? "lg" : "sm"} className={compact ? "w-full" : ""} asChild>
      <a href={cvAsset.url} download="Henrietta-Onwuneme-CV.pdf"><Download /> Download CV</a>
    </Button>
  );
  return (
    <div className="os-preview">
      {!compact && (
        <div className="os-preview-bar">
          <span className="os-muted">Product Manager CV</span>
          {download}
        </div>
      )}
      <iframe title="Henrietta Onwuneme CV" src={cvAsset.url} className="os-preview-frame" />
      <Button variant="link" asChild className="os-preview-link">
        <a href="/cv">Open the full CV page <ArrowUpRight /></a>
      </Button>
      {compact && <ActionBar>{download}</ActionBar>}
    </div>
  );
}

function LetterApp() {
  return (
    <article className="os-note">
      <p className="os-muted os-note-date">A personal note</p>
      <h2 className="font-handwritten">To My Next Team,</h2>
      <p>I see every role as a journey. My path into product management started with curiosity and grew through resilience. Each step has shown me how much can happen when people come together with the will to build. I have worked with teams across time zones and turned early ideas into real products. Along the way I learned that progress comes from steady effort and honest collaboration.</p>
      <p>I know I still have much to learn, and I look forward to gaining that knowledge from the work we do together. Every new challenge is a chance to grow, and I embrace that growth with confidence in what I already bring. My belief is simple: leave every project stronger than I found it and help those around me reach further.</p>
      <p>If we work together, I will bring focus and commitment. I will carry the skills I have grown, the hunger to keep learning, and the energy to move both the work and the team forward.</p>
      <p>I would be honored to bring this drive to your team. Let us begin the journey together.</p>
      <p>Sincerely,<br /><span className="font-handwritten os-note-sign">Henrietta</span></p>
    </article>
  );
}

function ContactApp({ compact }: { compact: boolean }) {
  return (
    <div className="os-contact">
      <div className="os-contact-card">
        <h2>Henrietta Onwuneme</h2>
        <p className="os-muted">Product Manager</p>
      </div>
      <a className="os-contact-row" href="mailto:mypvrplespace@gmail.com"><span>email</span>mypvrplespace@gmail.com</a>
      <a className="os-contact-row" href={HIRE_CALENDAR_URL} onClick={openHireCalendar} target="_blank" rel="noopener noreferrer"><span>calendar</span>Book a hiring call</a>
      <a className="os-contact-row" href="/contact"><span>more</span>All contact options</a>
      {compact && (
        <ActionBar>
          <Button size="lg" className="w-full" asChild>
            <a href={HIRE_CALENDAR_URL} onClick={openHireCalendar} target="_blank" rel="noopener noreferrer"><Calendar /> Book a call</a>
          </Button>
        </ActionBar>
      )}
    </div>
  );
}

const shopItems = [
  { title: "Complete 3-in-1 PRD Template", image: prdTemplateComplete, url: "https://selar.com/49gf07l554", badge: "PREMIUM" },
  { title: "PRD Overview + User Flows Templates", image: prdTemplateOverview, url: "https://selar.com/1r76753817", badge: "MOST POPULAR" },
];

function ShopApp() {
  return (
    <div className="os-shop">
      {shopItems.map((item) => (
        <a key={item.url} href={item.url} target="_blank" rel="noopener noreferrer" className="os-shop-item">
          <img src={item.image} alt={item.title} loading="lazy" />
          <div>
            <small>{item.badge}</small>
            <span>{item.title}</span>
            <em>Get it <ArrowUpRight /></em>
          </div>
        </a>
      ))}
    </div>
  );
}

export function AppContent({ id, compact = false }: { id: AppId; compact?: boolean }) {
  switch (id) {
    case "projects": return <ProjectsApp compact={compact} />;
    case "cv": return <CvApp compact={compact} />;
    case "letter": return <LetterApp />;
    case "contact": return <ContactApp compact={compact} />;
    case "shop": return <ShopApp />;
  }
}

export function AppIcon({ launcher, size = "md" }: { launcher: Launcher; size?: "sm" | "md" | "lg" }) {
  if (launcher.id === "hire") return <CalendarIcon size={size} />;
  if (launcher.id === "letter") return <NotesIcon size={size} />;
  const Icon = launcher.icon;
  return (
    <span className={`os-icon os-icon-${launcher.tone} os-icon-${size}`} aria-hidden="true">
      <Icon />
    </span>
  );
}

export function CalendarIcon({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const now = new Date();
  return (
    <span className={`os-icon os-icon-${size} os-cal`} aria-hidden="true">
      <span className="os-cal-day">{format(now, "EEE")}</span>
      <span className="os-cal-date">{format(now, "d")}</span>
    </span>
  );
}

export function NotesIcon({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  return (
    <span className={`os-icon os-icon-${size} os-notes`} aria-hidden="true">
      <span className="os-notes-top" />
      <span className="os-notes-lines" />
    </span>
  );
}

export function ImageIcon({ src, size = "md" }: { src: string; size?: "sm" | "md" | "lg" }) {
  return <span className={`os-icon os-icon-${size} os-img-icon`} aria-hidden="true"><img src={src} alt="" /></span>;
}

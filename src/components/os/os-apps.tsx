import { useState, type ReactNode } from "react";
import { ArrowUpRight, ChevronLeft, Briefcase, Calendar, Download, FileText, Heart, Home, Mail, ShoppingBag, StickyNote, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { featuredProjects, projectsData, type Project } from "@/data/projects";
import cvAsset from "@/assets/henrietta-cv.pdf.asset.json";
import prdTemplateComplete from "@/assets/prd-template-complete.png";
import prdTemplateOverview from "@/assets/prd-template-overview.png";
import { format } from "date-fns";
import { HIRE_CALENDAR_URL, openHireCalendar } from "@/lib/booking";

export type AppId = "projects" | "cv" | "letter" | "contact" | "shop" | "love";
export type LauncherId = AppId | "hire" | "home";

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
  love: "Notifications",
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

__VIEWS__

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
    case "love": return <LoveApp />;
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

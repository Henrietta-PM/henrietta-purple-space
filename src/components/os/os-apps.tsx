import { useState, type ReactNode } from "react";
import { ArrowUpRight, ChevronLeft, Briefcase, Calendar, Download, FileText, Globe, Heart, Home, Instagram, ListChecks, Mail, MoreHorizontal, PenSquare, Search, Send, Share, ShoppingBag, StickyNote, User, type LucideIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import HeartModal from "@/components/HeartModal";
import portrait from "@/assets/henrietta-portrait.jpg";
import { Button } from "@/components/ui/button";
import { featuredProjects, projectsData, type Project } from "@/data/projects";
import cvAsset from "@/assets/henrietta-cv.pdf.asset.json";
import prdTemplateComplete from "@/assets/prd-template-complete.png";
import prdTemplateOverview from "@/assets/prd-template-overview.png";
import { differenceInDays, differenceInHours, differenceInMinutes, format } from "date-fns";
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
  { id: "love", name: "Instagram", icon: Heart, tone: "love" },
  { id: "hire", name: "Hire Me", icon: Calendar, tone: "hire" },
  { id: "home", name: "Portfolio", icon: Home, tone: "home" },
];

export const appTitles: Record<AppId, string> = {
  projects: "Projects",
  cv: "Henrietta-Onwuneme-CV.pdf",
  letter: "Letter",
  contact: "Contact",
  shop: "Shop",
  love: "Instagram",
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

function LibraryTile({ project, onOpen }: { project: Project; onOpen: (p: Project) => void }) {
  return (
    <button className="os-lib-tile" onClick={() => onOpen(project)} aria-label={`Open ${project.name}`}>
      <img src={project.image} alt="" loading="lazy" />
    </button>
  );
}

function ProjectsApp({ compact }: { compact: boolean }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Project | null>(null);

  if (selected) {
    return (
      <div className="os-finder-main">
        <ProjectDetail project={selected} compact={compact} onBack={() => setSelected(null)} />
      </div>
    );
  }

  const q = query.trim().toLowerCase();
  const matches = allProjects.filter((p) => !q || `${p.name} ${p.tags.join(" ")}`.toLowerCase().includes(q));
  const folders = [
    { name: "Featured", items: allProjects.filter((p) => featuredNames.has(p.name)) },
    { name: "AI Products", items: allProjects.filter((p) => p.tags.some((t) => /ai/i.test(t))) },
    { name: "Health and Gov", items: allProjects.filter((p) => p.tags.some((t) => /health|gov/i.test(t))) },
    { name: "Side Projects", items: allProjects.filter((p) => !featuredNames.has(p.name)) },
  ].filter((f) => f.items.length > 0);

  return (
    <div className="os-library">
      <label className="os-lib-search">
        <Search aria-hidden="true" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="App Library" aria-label="Search projects" />
      </label>
      {q ? (
        <ul className="os-lib-list">
          {matches.map((p) => (
            <li key={p.name}>
              <button onClick={() => setSelected(p)}>
                <img src={p.image} alt="" />
                <span><strong>{p.name}</strong><small>{p.tags[0]}</small></span>
              </button>
            </li>
          ))}
          {matches.length === 0 && <li className="os-muted os-lib-empty">No results</li>}
        </ul>
      ) : (
        <div className="os-lib-grid">
          {folders.map((folder) => {
            const [a, b, ...rest] = folder.items;
            return (
              <div key={folder.name} className="os-lib-folder">
                <div className="os-lib-box">
                  {a && <LibraryTile project={a} onOpen={setSelected} />}
                  {b && <LibraryTile project={b} onOpen={setSelected} />}
                  {rest.length === 1 && <LibraryTile project={rest[0]} onOpen={setSelected} />}
                  {rest.length > 1 && (
                    <div className="os-lib-mini">
                      {rest.slice(0, 4).map((p) => <LibraryTile key={p.name} project={p} onOpen={setSelected} />)}
                    </div>
                  )}
                </div>
                <span>{folder.name}</span>
              </div>
            );
          })}
        </div>
      )}
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
    <div className="os-docs">
      <div className="os-docs-bar">
        <span className="os-docs-icon" aria-hidden="true"><FileText /></span>
        <div className="os-docs-name">
          <strong>Henrietta Onwuneme CV</strong>
          <small>Product Manager · PDF</small>
        </div>
        {!compact && download}
      </div>
      <div className="os-docs-canvas">
        <iframe title="Henrietta Onwuneme CV" src={cvAsset.url} className="os-docs-page" />
        <a href="/cv" className="os-docs-link">Open the full CV page <ArrowUpRight /></a>
      </div>
      {compact && <ActionBar>{download}</ActionBar>}
    </div>
  );
}

function LetterApp() {
  return (
    <article className="os-note">
      <div className="os-note-tools" aria-hidden="true"><ListChecks /><Share /><PenSquare /></div>
      <p className="os-note-date">{format(new Date(), "d MMMM yyyy 'at' HH:mm")}</p>
      <h2>To My Next Team,</h2>
      <p>I see every role as a journey. My path into product management started with curiosity and grew through resilience. Each step has shown me how much can happen when people come together with the will to build. I have worked with teams across time zones and turned early ideas into real products. Along the way I learned that progress comes from steady effort and honest collaboration.</p>
      <p>I know I still have much to learn, and I look forward to gaining that knowledge from the work we do together. Every new challenge is a chance to grow, and I embrace that growth with confidence in what I already bring. My belief is simple: leave every project stronger than I found it and help those around me reach further.</p>
      <p>If we work together, I will bring focus and commitment. I will carry the skills I have grown, the hunger to keep learning, and the energy to move both the work and the team forward.</p>
      <p>I would be honored to bring this drive to your team. Let us begin the journey together.</p>
      <p>Sincerely,<br /><span className="font-handwritten os-note-sign">Henrietta</span></p>
    </article>
  );
}

const CONTACT_EMAIL = "mypvrplespace@gmail.com";

function MailCompose({ onCancel }: { onCancel: () => void }) {
  const [subject, setSubject] = useState("Let's work together");
  const [body, setBody] = useState("Hi Henrietta,\n\n");
  const send = () => {
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };
  return (
    <div className="os-mail">
      <div className="os-mail-bar">
        <button onClick={onCancel}>Cancel</button>
        <strong>New Message</strong>
        <button className="os-mail-send" onClick={send} aria-label="Send email"><Send /></button>
      </div>
      <div className="os-mail-field"><span>To:</span><em>Henrietta Onwuneme</em></div>
      <div className="os-mail-field"><span>Cc/Bcc, From:</span><em className="os-muted">you</em></div>
      <label className="os-mail-field"><span>Subject:</span><input value={subject} onChange={(e) => setSubject(e.target.value.slice(0, 150))} /></label>
      <textarea className="os-mail-body" value={body} onChange={(e) => setBody(e.target.value.slice(0, 3000))} aria-label="Message" />
    </div>
  );
}

function ContactApp() {
  const [composing, setComposing] = useState(false);
  if (composing) return <MailCompose onCancel={() => setComposing(false)} />;
  const actions = [
    { label: "mail", Icon: Mail, onClick: () => setComposing(true) },
    { label: "book", Icon: Calendar, onClick: () => window.open(HIRE_CALENDAR_URL, "_blank", "noopener,noreferrer") },
    { label: "website", Icon: Globe, onClick: () => { window.location.href = "/"; } },
    { label: "more", Icon: MoreHorizontal, onClick: () => { window.location.href = "/contact"; } },
  ];
  return (
    <div className="os-contact">
      <div className="os-contact-hero">
        <img src={portrait} alt="Henrietta Onwuneme" className="os-contact-avatar" />
        <h2>Henrietta Onwuneme</h2>
        <p>Product Manager</p>
      </div>
      <div className="os-contact-actions">
        {actions.map(({ label, Icon, onClick }) => (
          <button key={label} onClick={onClick}><Icon aria-hidden="true" /><span>{label}</span></button>
        ))}
      </div>
      <div className="os-contact-group">
        <button className="os-contact-row" onClick={() => setComposing(true)}><span>email</span>{CONTACT_EMAIL}</button>
        <a className="os-contact-row" href={HIRE_CALENDAR_URL} onClick={openHireCalendar} target="_blank" rel="noopener noreferrer"><span>calendar</span>Book a hiring call</a>
        <div className="os-contact-row"><span>location</span><em>Lagos, Nigeria</em></div>
      </div>
      <div className="os-contact-group">
        <a className="os-contact-row" href="/contact"><span>more</span>All contact options</a>
      </div>
    </div>
  );
}

async function fetchHearts() {
  const { data, error } = await supabase.from("hearts").select("id, created_at").order("created_at", { ascending: false }).limit(60);
  if (error) throw error;
  return data ?? [];
}

function LoveApp() {
  const [sendOpen, setSendOpen] = useState(false);
  const { data: hearts = [], isLoading } = useQuery({ queryKey: ["hearts-feed"], queryFn: fetchHearts, refetchInterval: 30000 });
  const now = new Date();
  const groups = [
    { label: "Today", items: hearts.filter((h) => differenceInHours(now, new Date(h.created_at)) < 24) },
    { label: "This week", items: hearts.filter((h) => { const d = differenceInDays(now, new Date(h.created_at)); return differenceInHours(now, new Date(h.created_at)) >= 24 && d < 7; }) },
    { label: "Earlier", items: hearts.filter((h) => differenceInDays(now, new Date(h.created_at)) >= 7) },
  ].filter((g) => g.items.length > 0);
  const ago = (date: string) => {
    const d = new Date(date);
    const m = differenceInMinutes(now, d);
    if (m < 60) return `${Math.max(m, 1)}m`;
    const h = differenceInHours(now, d);
    if (h < 24) return `${h}h`;
    const days = differenceInDays(now, d);
    return days < 7 ? `${days}d` : `${Math.floor(days / 7)}w`;
  };

  return (
    <div className="os-love">
      <div className="os-love-cta">
        <span className="os-love-ring"><img src={portrait} alt="" /></span>
        <div><strong>mypvrplespace</strong><small>{hearts.length >= 60 ? "60+" : hearts.length} recent likes</small></div>
        <Button size="sm" onClick={() => setSendOpen(true)}><Heart /> Like</Button>
      </div>
      {isLoading && <p className="os-muted os-love-empty">Loading activity</p>}
      {!isLoading && hearts.length === 0 && <p className="os-muted os-love-empty">No likes yet. Be the first.</p>}
      {groups.map((group) => (
        <section key={group.label}>
          <h3 className="os-love-head">{group.label}</h3>
          {group.items.map((h) => (
            <div key={h.id} className="os-love-row">
              <span className="os-love-avatar" aria-hidden="true"><User /><Heart className="os-love-badge" /></span>
              <p><strong>Someone</strong> liked your portfolio. <span className="os-muted">{ago(h.created_at)}</span></p>
              <img src={portrait} alt="" className="os-love-thumb" />
            </div>
          ))}
        </section>
      ))}
      <HeartModal isOpen={sendOpen} onClose={() => setSendOpen(false)} />
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
    case "contact": return <ContactApp />;
    case "shop": return <ShopApp />;
    case "love": return <LoveApp />;
  }
}

export function AppIcon({ launcher, size = "md" }: { launcher: Launcher; size?: "sm" | "md" | "lg" }) {
  if (launcher.id === "hire") return <CalendarIcon size={size} />;
  if (launcher.id === "letter") return <NotesIcon size={size} />;
  if (launcher.id === "love") return <span className={`os-icon os-icon-${size} os-insta`} aria-hidden="true"><Instagram /></span>;
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

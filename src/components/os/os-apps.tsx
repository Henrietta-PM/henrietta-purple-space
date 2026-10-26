import { useState, type ReactNode } from "react";
import { Activity, MapPin, MessageCircle, Linkedin, Twitter, ArrowUpRight, ChevronLeft, Briefcase, Calendar, Download, FileText, Globe, Heart, Instagram, PenLine, ListChecks, Mail, MoreHorizontal, PenSquare, Search, Send, Share, ShoppingBag, StickyNote, User, type LucideIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import HeartModal from "@/components/HeartModal";
import portrait from "@/assets/henrietta-portrait.jpg";
import { Button } from "@/components/ui/button";
import { featuredProjects, projectsData, type Project } from "@/data/projects";
import cvAsset from "@/assets/henrietta-cv.pdf.asset.json";
import sallyLogo from "@/assets/sally-logo.png";
import targettLogo from "@/assets/targett-logo-featured.png";
import vibestackLogo from "@/assets/vibestack-logo.png";
import bloomieLogo from "@/assets/bloomie-logo-featured.png";
import proxyIcon from "@/assets/proxymedicine-icon.png.asset.json";
import prdTemplateComplete from "@/assets/prd-template-complete.png";
import prdTemplateOverview from "@/assets/prd-template-overview.png";
import { differenceInDays, differenceInHours, differenceInMinutes, format } from "date-fns";
import { HIRE_CALENDAR_URL, openHireCalendar } from "@/lib/booking";
import { skillCategories } from "@/pages/CV";
import { testimonials } from "@/components/Testimonials";
import { journeySteps } from "@/components/JourneySection";
import { workSteps } from "@/components/HowIWork";

export type AppId = "projects" | "cv" | "letter" | "contact" | "shop" | "love" | "messages" | "health" | "reminders" | "maps";
export type LinkId = "hire" | "instagram" | "linkedin" | "x";
export type LauncherId = AppId | LinkId;

export const externalLinks: Record<LinkId, string> = {
  hire: HIRE_CALENDAR_URL,
  instagram: "https://www.instagram.com/henriettaofpm",
  linkedin: "https://linkedin.com/in/henrietta-onwuneme",
  x: "https://x.com/henrietta_bby",
};

export const isLink = (id: LauncherId): id is LinkId => id in externalLinks;

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
  { id: "contact", name: "Contacts", icon: Mail, tone: "contact" },
  { id: "shop", name: "Shop", icon: ShoppingBag, tone: "shop" },
  { id: "love", name: "Likes", icon: Heart, tone: "love" },
  { id: "messages", name: "Messages", icon: MessageCircle, tone: "messages" },
  { id: "health", name: "Skills", icon: Activity, tone: "health" },
  { id: "reminders", name: "How I Work", icon: ListChecks, tone: "reminders" },
  { id: "maps", name: "Journey", icon: MapPin, tone: "maps" },
  { id: "hire", name: "Hire Me", icon: Calendar, tone: "hire" },
  { id: "instagram", name: "Instagram", icon: Instagram, tone: "insta" },
  { id: "linkedin", name: "LinkedIn", icon: Linkedin, tone: "linkedin" },
  { id: "x", name: "X", icon: Twitter, tone: "x" },
];

export const appTitles: Record<AppId, string> = {
  projects: "Projects",
  cv: "Henrietta-Onwuneme-CV.pdf",
  letter: "Letter",
  contact: "Contact",
  shop: "Shop",
  love: "Likes",
  messages: "Messages",
  health: "Skills",
  reminders: "How I Work",
  maps: "Journey",
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
      <div className="os-store-head">
        <ProjectIcon project={project} size="lg" />
        <div className="os-store-meta">
          <h2 className="os-detail-title">{project.name}</h2>
          <p className="os-muted">{project.tags.join(" · ")}</p>
          {project.link !== "#" && (
            <a className="os-store-get" href={project.link} target="_blank" rel="noopener noreferrer">Open</a>
          )}
        </div>
      </div>
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
    <button className={`os-lib-tile ${projectLogos[project.name] ? "os-lib-logo" : ""}`} onClick={() => onOpen(project)} aria-label={`Open ${project.name}`}>
      <img src={projectLogos[project.name] ?? project.image} alt="" loading="lazy" />
    </button>
  );
}

function ProjectsApp({ compact, initial }: { compact: boolean; initial?: string }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Project | null>(() => allProjects.find((p) => p.name === initial) ?? null);

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
        <a href={cvAsset.url} target="_blank" rel="noopener noreferrer" className="os-docs-link">Open the CV in a new tab <ArrowUpRight /></a>
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
        <a className="os-contact-row" href={externalLinks.linkedin} target="_blank" rel="noopener noreferrer"><span>LinkedIn</span>henrietta-onwuneme</a>
        <a className="os-contact-row" href={externalLinks.x} target="_blank" rel="noopener noreferrer"><span>X</span>@henrietta_bby</a>
        <a className="os-contact-row" href={externalLinks.instagram} target="_blank" rel="noopener noreferrer"><span>Instagram</span>@henriettaofpm</a>
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
  const { data: total = 0 } = useQuery({
    queryKey: ["hearts-total"],
    queryFn: async () => {
      const { count, error } = await supabase.from("hearts").select("*", { count: "exact", head: true });
      if (error) throw error;
      return count ?? 0;
    },
    refetchInterval: 30000,
  });
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
        <div><strong>mypvrplespace</strong><small>{total.toLocaleString()} {total === 1 ? "like" : "likes"}</small></div>
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

export function AppContent({ id, compact = false, projectName }: { id: AppId; compact?: boolean; projectName?: string }) {
  switch (id) {
    case "projects": return <ProjectsApp compact={compact} initial={projectName} />;
    case "cv": return <CvApp compact={compact} />;
    case "letter": return <LetterApp />;
    case "contact": return <ContactApp />;
    case "shop": return <ShopApp />;
    case "love": return <LoveApp />;
    case "messages": return <MessagesApp />;
    case "health": return <SkillsApp />;
    case "reminders": return <RemindersApp />;
    case "maps": return <JourneyApp />;
  }
}

export function AppIcon({ launcher, size = "md" }: { launcher: Launcher; size?: "sm" | "md" | "lg" }) {
  if (launcher.id === "hire") return <CalendarIcon size={size} />;
  if (launcher.id === "letter") return <NotesIcon size={size} />;
  if (launcher.id === "projects") return <span className={`os-icon os-icon-${size} os-files`} aria-hidden="true"><span className="os-files-folder" /></span>;
  if (launcher.id === "shop") return <span className={`os-icon os-icon-${size} os-appstore`} aria-hidden="true"><AppStoreGlyph /></span>;
  if (launcher.id === "x") return <span className={`os-icon os-icon-${size} os-x`} aria-hidden="true"><b>X</b></span>;
  if (launcher.id === "linkedin") return <span className={`os-icon os-icon-${size} os-linkedin`} aria-hidden="true"><b>in</b></span>;
  if (launcher.id === "cv") return <span className={`os-icon os-icon-${size} os-pages`} aria-hidden="true"><PenLine /></span>;
  if (launcher.id === "contact") return <span className={`os-icon os-icon-${size} os-contacts`} aria-hidden="true"><span className="os-contacts-head" /><span className="os-contacts-body" /><span className="os-contacts-tabs" /></span>;
  if (launcher.id === "instagram") return <span className={`os-icon os-icon-${size} os-insta`} aria-hidden="true"><Instagram /></span>;
  if (launcher.id === "love") return <span className={`os-icon os-icon-${size} os-likes`} aria-hidden="true"><Heart /></span>;
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

function AppStoreGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M9.5 4.5 16.5 17" />
      <path d="M14.5 4.5 7.5 17" />
      <path d="M5 13.5h14" />
    </svg>
  );
}

const projectLogos: Record<string, string> = {
  Sally: sallyLogo,
  Targett: targettLogo,
  VibeStack: vibestackLogo,
  "Bloomie AI": bloomieLogo,
  ProxyMedicine: proxyIcon.url,
};

export function ProjectIcon({ project, size = "md" }: { project: Project; size?: "sm" | "md" | "lg" }) {
  const logo = projectLogos[project.name];
  return (
    <span className={`os-icon os-icon-${size} os-img-icon ${logo ? "os-logo-icon" : ""}`} aria-hidden="true">
      <img src={logo ?? project.image} alt="" />
    </span>
  );
}

function MessagesApp() {
  const [active, setActive] = useState<number | null>(null);
  const person = active === null ? null : testimonials[active];
  if (person) {
    return (
      <div className="os-msg">
        <div className="os-msg-head">
          <button className="os-back" onClick={() => setActive(null)}><ChevronLeft aria-hidden="true" /> Messages</button>
          <span className="os-msg-avatar">{person.author.charAt(0)}</span>
          <strong>{person.author}</strong>
          <small>{person.role}</small>
        </div>
        <div className="os-msg-thread">
          <p className="os-bubble os-bubble-out">Hi, would you share a few words about working with me?</p>
          <p className="os-bubble os-bubble-in">{person.quote}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="os-msg">
      <h2 className="os-msg-title">Messages</h2>
      <ul className="os-msg-list">
        {testimonials.map((item, index) => (
          <li key={item.author}>
            <button onClick={() => setActive(index)}>
              <span className="os-msg-avatar">{item.author.charAt(0)}</span>
              <span className="os-msg-preview"><strong>{item.author}</strong><small>{item.role}</small><span>{item.quote}</span></span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SkillsApp() {
  const groups = [
    { title: "Soft Skills", tone: "soft", items: skillCategories.softSkills },
    { title: "Technical Skills", tone: "tech", items: skillCategories.technicalSkills },
    { title: "Tools", tone: "tools", items: skillCategories.tools },
  ];
  return (
    <div className="os-health">
      <h2 className="os-msg-title">Summary</h2>
      {groups.map((group) => (
        <section key={group.title} className={`os-health-card os-health-${group.tone}`}>
          <header><Activity aria-hidden="true" /><strong>{group.title}</strong><span>{group.items.length}</span></header>
          <div className="os-health-chips">{group.items.map((item) => <span key={item}>{item}</span>)}</div>
        </section>
      ))}
    </div>
  );
}

function RemindersApp() {
  return (
    <div className="os-rem">
      <h2 className="os-rem-title">How I Work</h2>
      <ul>
        {workSteps.map((step) => (
          <li key={step.number}>
            <span className="os-rem-check" aria-hidden="true" />
            <span><strong>{step.title}</strong><small>{step.text}</small></span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function JourneyApp() {
  return (
    <div className="os-maps">
      <div className="os-maps-canvas" aria-hidden="true"><span className="os-maps-route" /></div>
      <div className="os-maps-sheet">
        <h2>From Architecture to Product Management</h2>
        <ol>
          {journeySteps.map((step, index) => (
            <li key={step.title}>
              <span className="os-maps-pin">{index + 1}</span>
              <span><strong>{step.title}</strong><small>{step.text}</small></span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

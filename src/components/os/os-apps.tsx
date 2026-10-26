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

interface LibItem { key: string; label: string; sub: string; icon: ReactNode; open: () => void }

function LibraryTile({ item }: { item: LibItem }) {
  return (
    <button className="os-lib-tile" onClick={item.open} aria-label={`Open ${item.label}`}>
      {item.icon}
    </button>
  );
}

const libraryFolders: { name: string; ids: LauncherId[] }[] = [
  { name: "About Me", ids: ["cv", "letter", "health", "maps", "reminders"] },
  { name: "Social", ids: ["love", "instagram", "linkedin", "x", "messages"] },
  { name: "Productivity", ids: ["hire", "contact", "shop"] },
];

function ProjectsApp({ compact, initial, onLaunch }: { compact: boolean; initial?: string; onLaunch?: (id: LauncherId) => void }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Project | null>(() => allProjects.find((p) => p.name === initial) ?? null);

  if (selected) {
    return (
      <div className="os-finder-main">
        <ProjectDetail project={selected} compact={compact} onBack={() => setSelected(null)} />
      </div>
    );
  }

  const projectItem = (p: Project): LibItem => ({ key: p.name, label: p.name, sub: p.tags[0] ?? "Project", icon: <ProjectIcon project={p} size="lg" />, open: () => setSelected(p) });
  const appItem = (id: LauncherId): LibItem => {
    const launcher = launchers.find((l) => l.id === id)!;
    return { key: id, label: launcher.name, sub: "App", icon: <AppIcon launcher={launcher} size="lg" />, open: () => (isLink(id) ? window.open(externalLinks[id], "_blank", "noopener,noreferrer") : onLaunch?.(id)) };
  };
  const folders = [
    { name: "Featured", items: allProjects.filter((p) => featuredNames.has(p.name)).map(projectItem) },
    { name: "Side Projects", items: allProjects.filter((p) => !featuredNames.has(p.name)).map(projectItem) },
    ...libraryFolders.map((f) => ({ name: f.name, items: f.ids.filter((id) => isLink(id) || onLaunch).map(appItem) })),
  ].filter((f) => f.items.length > 0);
  const everything = folders.flatMap((f) => f.items).filter((item, i, list) => list.findIndex((x) => x.key === item.key) === i);
  const q = query.trim().toLowerCase();
  const matches = everything.filter((item) => `${item.label} ${item.sub}`.toLowerCase().includes(q));

  return (
    <div className="os-library">
      <label className="os-lib-search">
        <Search aria-hidden="true" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="App Library" aria-label="Search apps and projects" />
      </label>
      {q ? (
        <ul className="os-lib-list">
          {matches.map((item) => (
            <li key={item.key}>
              <button onClick={item.open}>
                {item.icon}
                <span><strong>{item.label}</strong><small>{item.sub}</small></span>
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
                  {a && <LibraryTile item={a} />}
                  {b && <LibraryTile item={b} />}
                  {rest.length === 1 && <LibraryTile item={rest[0]} />}
                  {rest.length > 1 && (
                    <div className="os-lib-mini">
                      {rest.slice(0, 4).map((item) => <LibraryTile key={item.key} item={item} />)}
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

export function AppContent({ id, compact = false, projectName, onLaunch }: { id: AppId; compact?: boolean; projectName?: string; onLaunch?: (id: LauncherId) => void }) {
  switch (id) {
    case "projects": return <ProjectsApp compact={compact} initial={projectName} onLaunch={onLaunch} />;
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
  if (launcher.id === "x") return <span className={`os-icon os-icon-${size} os-x`} aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" /></svg></span>;
  if (launcher.id === "linkedin") return <span className={`os-icon os-icon-${size} os-linkedin`} aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.85 1.637-1.75 3.37-1.75 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452z" /></svg></span>;
  if (launcher.id === "cv") return <span className={`os-icon os-icon-${size} os-pages`} aria-hidden="true"><PenLine /></span>;
  if (launcher.id === "contact") return <span className={`os-icon os-icon-${size} os-contacts`} aria-hidden="true"><span className="os-contacts-head" /><span className="os-contacts-body" /><span className="os-contacts-tabs" /></span>;
  if (launcher.id === "instagram") return <span className={`os-icon os-icon-${size} os-insta`} aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5.5" /><circle cx="12" cy="12" r="4.2" /><circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" /></svg></span>;
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

const messageTimes = ["Yesterday", "Tuesday", "Monday"];

function Avatar({ name, large = false }: { name: string; large?: boolean }) {
  const initials = name.split(" ").map((part) => part.charAt(0)).join("").slice(0, 2);
  return <span className={`os-msg-avatar ${large ? "os-msg-avatar-lg" : ""}`}>{initials}</span>;
}

function MessagesApp() {
  const [active, setActive] = useState<number | null>(null);
  const person = active === null ? null : testimonials[active];
  if (person) {
    return (
      <div className="os-msg os-msg-chat">
        <div className="os-msg-head">
          <button className="os-msg-back" onClick={() => setActive(null)} aria-label="Back to Messages"><ChevronLeft aria-hidden="true" /></button>
          <Avatar name={person.author} large />
          <strong>{person.author} <ChevronLeft className="os-msg-chev" aria-hidden="true" /></strong>
        </div>
        <div className="os-msg-thread">
          <span className="os-msg-stamp">iMessage<br />{messageTimes[active ?? 0]}</span>
          <p className="os-bubble os-bubble-in">{person.quote}</p>
          <span className="os-msg-role">{person.role}</span>
        </div>
      </div>
    );
  }
  return (
    <div className="os-msg">
      <h2 className="os-large-title">Messages</h2>
      <label className="os-search-field"><Search aria-hidden="true" /><input placeholder="Search" aria-label="Search messages" /></label>
      <ul className="os-msg-list">
        {testimonials.map((item, index) => (
          <li key={item.author}>
            <button onClick={() => setActive(index)}>
              <Avatar name={item.author} />
              <span className="os-msg-preview">
                <span className="os-msg-row"><strong>{item.author}</strong><time>{messageTimes[index]}</time></span>
                <span>{item.quote}</span>
              </span>
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
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="os-health">
      <span className="os-health-date">{format(new Date(), "EEEE d MMMM").toUpperCase()}</span>
      <h2 className="os-large-title">Summary</h2>
      <p className="os-health-section">Pinned</p>
      {groups.map((group) => {
        const expanded = open === group.title;
        const shown = expanded ? group.items : group.items.slice(0, 4);
        return (
          <button key={group.title} className={`os-health-card os-health-${group.tone}`} onClick={() => setOpen(expanded ? null : group.title)} aria-expanded={expanded}>
            <span className="os-health-head"><Activity aria-hidden="true" /><strong>{group.title}</strong><ChevronLeft className="os-health-chev" aria-hidden="true" /></span>
            <span className="os-health-value"><b>{group.items.length}</b> skills</span>
            <span className="os-health-list">{shown.join(" · ")}{!expanded && group.items.length > 4 ? ` · +${group.items.length - 4} more` : ""}</span>
          </button>
        );
      })}
    </div>
  );
}

function RemindersApp() {
  const [done, setDone] = useState<string[]>([]);
  const toggle = (id: string) => setDone((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]));
  return (
    <div className="os-rem">
      <h2 className="os-rem-title">How I Work</h2>
      <ul>
        {workSteps.map((step) => {
          const checked = done.includes(step.number);
          return (
            <li key={step.number}>
              <button className={`os-rem-check ${checked ? "on" : ""}`} onClick={() => toggle(step.number)} aria-pressed={checked} aria-label={`Mark ${step.title} done`} />
              <span className={checked ? "os-rem-done" : ""}><strong>{step.title}</strong><small>{step.text}</small></span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const pinSpots = [{ x: 22, y: 70 }, { x: 52, y: 42 }, { x: 80, y: 22 }];

function JourneyApp() {
  const [active, setActive] = useState(0);
  return (
    <div className="os-maps">
      <svg className="os-maps-canvas" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <rect width="100" height="100" className="os-map-land" />
        <path d="M60 0 C 70 30, 95 35, 100 60 L100 0 Z" className="os-map-water" />
        <rect x="6" y="12" width="22" height="18" rx="3" className="os-map-park" />
        <rect x="62" y="68" width="26" height="20" rx="3" className="os-map-park" />
        <path d="M0 55 L100 48 M0 85 L100 78 M35 0 L40 100 M70 0 L66 100" className="os-map-road" />
        <path d="M0 30 L100 20 M15 0 L12 100 M88 0 L92 100" className="os-map-street" />
        <polyline points={pinSpots.map((p) => `${p.x},${p.y}`).join(" ")} className="os-map-route" />
      </svg>
      <div className="os-maps-pins">
        {pinSpots.map((spot, index) => (
          <button key={index} className={`os-maps-pin ${active === index ? "on" : ""}`} style={{ left: `${spot.x}%`, top: `${spot.y}%` }} onClick={() => setActive(index)} aria-label={journeySteps[index].title}>
            <span>{index + 1}</span>
          </button>
        ))}
      </div>
      <div className="os-maps-sheet">
        <span className="os-maps-grabber" aria-hidden="true" />
        <h2>Journey</h2>
        <small className="os-maps-sub">Architecture to Product Management · {journeySteps.length} stops</small>
        <ol>
          {journeySteps.map((step, index) => (
            <li key={step.title}>
              <button className={active === index ? "on" : ""} onClick={() => setActive(index)}>
                <span className="os-maps-dot">{index + 1}</span>
                <span><strong>{step.title}</strong><small>{step.text}</small></span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

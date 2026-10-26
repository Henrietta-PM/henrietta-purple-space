import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Activity, MapPin, MessageCircle, Linkedin, Twitter, ArrowUpRight, ChevronLeft, ChevronRight, ChevronDown, Briefcase, Calendar, Download, FileText, Heart, Instagram, PenLine, ListChecks, Mail, MoreHorizontal, PenSquare, Search, Send, Share, ShoppingBag, StickyNote, User, Folder, Grid2X2, List, Check, SlidersHorizontal, Navigation, type LucideIcon } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import HeartModal from "@/components/HeartModal";
import portrait from "@/assets/henrietta-portrait.jpg";
import { Button } from "@/components/ui/button";
import { featuredProjects, projectsData, type Project } from "@/data/projects";
import cvAsset from "@/assets/henrietta-cv.pdf.asset.json";
import sallyLogo from "@/assets/sally-logo.png";
import appleCameraIcon from "@/assets/apple-camera-icon.jpg";
import applePhotosIcon from "@/assets/apple-photos-icon.jpg";
import targettLogo from "@/assets/targett-logo-featured.png";
import vibestackLogo from "@/assets/vibestack-logo.png";
import bloomieLogo from "@/assets/bloomie-logo-featured.png";
import proxyIcon from "@/assets/proxymedicine-icon.png.asset.json";
import prdTemplateComplete from "@/assets/prd-template-complete.png";
import prdTemplateOverview from "@/assets/prd-template-overview.png";
import { differenceInDays, differenceInHours, differenceInMinutes, format } from "date-fns";
import { HIRE_CALENDAR_URL, openHireCalendar } from "@/lib/booking";
import { skillCategories } from "@/pages/CV";
import MessagesApp from "./messages-app";
import { journeySteps } from "@/components/JourneySection";
import { workSteps } from "@/components/HowIWork";
import WeatherApp from "./weather-app";
import { CameraApp, PhotosApp, ReportDialog, ShoutOutComposer, useVisitorPosts } from "./visitor-guestbook";
import { Camera, Images } from "lucide-react";
import NotesApp from "./notes-app";
import type { NoteId } from "@/data/notes";
import { AppleSearch, AppleSections } from "./apple-app-chrome";

export type AppId = "projects" | "cv" | "letter" | "contact" | "shop" | "love" | "messages" | "health" | "reminders" | "maps" | "weather" | "camera" | "photos";
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
  { id: "letter", name: "Notes", icon: StickyNote, tone: "letter" },
  { id: "contact", name: "Contacts", icon: Mail, tone: "contact" },
  { id: "shop", name: "Shop", icon: ShoppingBag, tone: "shop" },
  { id: "love", name: "Love Portfolio", icon: Heart, tone: "love" },
  { id: "messages", name: "Testimonials", icon: MessageCircle, tone: "messages" },
  { id: "health", name: "Skills", icon: Activity, tone: "health" },
  { id: "reminders", name: "How I Work", icon: ListChecks, tone: "reminders" },
  { id: "maps", name: "My Journey", icon: MapPin, tone: "maps" },
  { id: "camera", name: "Camera", icon: Camera, tone: "camera" },
  { id: "photos", name: "Photos", icon: Images, tone: "photos" },
  { id: "hire", name: "Hire Me", icon: Calendar, tone: "hire" },
  { id: "instagram", name: "Instagram", icon: Instagram, tone: "insta" },
  { id: "linkedin", name: "LinkedIn", icon: Linkedin, tone: "linkedin" },
  { id: "x", name: "X", icon: Twitter, tone: "x" },
];

export const appTitles: Record<AppId, string> = {
  projects: "Projects",
  cv: "Henrietta-Onwuneme-CV.pdf",
  letter: "Notes",
  contact: "Contact",
  shop: "Shop",
  love: "Love Portfolio",
  messages: "Testimonials",
  health: "Skills",
  reminders: "How I Work",
  maps: "My Journey",
  weather: "Weather",
  camera: "Camera",
  photos: "Photos",
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
  { name: "Social", ids: ["love", "instagram", "linkedin", "x", "messages", "camera", "photos"] },
  { name: "Productivity", ids: ["hire", "contact", "shop"] },
];

export function AppLibrary({ onOpenProject, onLaunch }: { onOpenProject: (name: string) => void; onLaunch: (id: LauncherId) => void }) {
  const [query, setQuery] = useState("");

  const projectItem = (p: Project): LibItem => ({ key: p.name, label: p.name, sub: p.tags[0] ?? "Project", icon: <ProjectIcon project={p} size="lg" />, open: () => onOpenProject(p.name) });
  const appItem = (id: LauncherId): LibItem => {
    const launcher = launchers.find((l) => l.id === id)!;
    return { key: id, label: launcher.name, sub: "App", icon: <AppIcon launcher={launcher} size="lg" />, open: () => (isLink(id) ? window.open(externalLinks[id], "_blank", "noopener,noreferrer") : onLaunch(id)) };
  };
  const byName = (name: string) => allProjects.find((p) => p.name === name);
  const pick = (names: string[]) => names.map(byName).filter((p): p is Project => Boolean(p)).map(projectItem);
  const folders = [
    { name: "Suggestions", items: [...pick(["Sally"]), appItem("letter"), appItem("cv"), appItem("hire")] },
    { name: "Recently Added", items: pick(["Sally", "Targett", "VibeStack", "Bloomie AI"]) },
    { name: "Featured", items: allProjects.filter((p) => featuredNames.has(p.name)).map(projectItem) },
    { name: "Side Projects", items: allProjects.filter((p) => !featuredNames.has(p.name)).map(projectItem) },
    ...libraryFolders.map((f) => ({ name: f.name, items: f.ids.map(appItem) })),
  ].filter((f) => f.items.length > 0);
  const everything = folders.slice(2).flatMap((f) => f.items).filter((item, i, list) => list.findIndex((x) => x.key === item.key) === i);
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
            const big = folder.items.length <= 4 ? folder.items : folder.items.slice(0, 3);
            const rest = folder.items.length <= 4 ? [] : folder.items.slice(3, 7);
            return (
              <div key={folder.name} className="os-lib-folder">
                <div className="os-lib-box">
                  {big.map((item) => <LibraryTile key={item.key} item={item} />)}
                  {rest.length > 0 && (
                    <div className="os-lib-mini">
                      {rest.map((item) => <LibraryTile key={item.key} item={item} />)}
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

const fileFolders = [
  { name: "Featured", items: () => allProjects.filter((p) => featuredNames.has(p.name)) },
  { name: "Side Projects", items: () => allProjects.filter((p) => !featuredNames.has(p.name)) },
];

function FolderGlyph() {
  return <span className="os-files-glyph" aria-hidden="true"><span /></span>;
}

function ProjectsApp({ compact, initial }: { compact: boolean; initial?: string }) {
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [section, setSection] = useState("browse");
  const [folder, setFolder] = useState<string | null>(null);
  const [selected, setSelected] = useState<Project | null>(() => allProjects.find((p) => p.name === initial) ?? null);

  if (selected) {
    return (
      <div className="os-finder-main">
        <ProjectDetail project={selected} compact={compact} onBack={() => setSelected(null)} />
      </div>
    );
  }

  const current = fileFolders.find((f) => f.name === folder);
  const q = query.trim().toLowerCase();
  const list = (current ? current.items() : allProjects).filter((p) => !q || `${p.name} ${p.tags.join(" ")}`.toLowerCase().includes(q));
  const showFolders = !current && !q && section === "browse";

  return (
    <AppleSections compact={compact} title={compact ? "Files" : "Finder"} sections={[{ id: "browse", label: "Browse", icon: Folder }, { id: "all", label: "Projects", icon: Briefcase }, { id: "search", label: "Search", icon: Search }]} selected={section} onSelect={(id) => { setSection(id); setFolder(null); setQuery(""); }}>
    <div className={`os-files-app apple-files ${view === "list" ? "apple-files-list" : ""}`}>
      <header className="apple-toolbar">
        {current ? <Button variant="ghost" size="icon" aria-label="Back to project folders" onClick={() => setFolder(null)}><ChevronLeft /></Button> : <span />}
        <h2>{compact ? "" : current?.name ?? "Projects"}</h2>
        <Button variant="ghost" size="icon" aria-label={view === "grid" ? "View projects as list" : "View projects as icons"} title={view === "grid" ? "List view" : "Icon view"} onClick={() => setView(view === "grid" ? "list" : "grid")}>{view === "grid" ? <List /> : <Grid2X2 />}</Button>
      </header>
      {compact && <h2 className="os-large-title">{current ? current.name : section === "search" ? "Search" : "Projects"}</h2>}
      <AppleSearch value={query} onChange={setQuery} label="Search projects" />
      <div className="os-files-grid">
        {showFolders && fileFolders.map((f) => (
          <Button variant="ghost" key={f.name} className="os-files-item" onClick={() => setFolder(f.name)}>
            <FolderGlyph />
            <strong>{f.name}</strong>
            <small>{f.items().length} items</small>
          </Button>
        ))}
        {!showFolders && list.map((p) => (
          <Button variant="ghost" key={p.name} className="os-files-item" onClick={() => setSelected(p)}>
            <span className="os-files-thumb"><img src={p.image} alt="" loading="lazy" /></span>
            <strong>{p.name}</strong>
            <small>{p.tags[0] ?? "Project"}</small>
          </Button>
        ))}
        {!showFolders && list.length === 0 && <p className="os-muted">No results</p>}
      </div>
      {showFolders && <p className="os-files-count">{fileFolders.length} folders, {allProjects.length} projects</p>}
    </div>
    </AppleSections>
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

const SHARE_URL = "https://hirehenrietta.lovable.app";

function copyWithFallback(text: string): boolean {
  const field = document.createElement("textarea");
  field.value = text;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.opacity = "0";
  document.body.appendChild(field);
  field.select();
  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch {
    copied = false;
  }
  document.body.removeChild(field);
  return copied;
}

async function copyShareLink() {
  try {
    await navigator.clipboard.writeText(SHARE_URL);
    toast.success("Link copied");
    return;
  } catch {
    if (copyWithFallback(SHARE_URL)) {
      toast.success("Link copied");
      return;
    }
  }
  toast(`Share this link: ${SHARE_URL}`);
}

async function shareContact() {
  const data = { title: "Henrietta Onwuneme, Product Manager", text: "Henrietta Onwuneme, Product Manager", url: SHARE_URL };
  if (typeof navigator.share === "function" && (!navigator.canShare || navigator.canShare(data))) {
    try {
      await navigator.share(data);
      return;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
    }
  }
  await copyShareLink();
}

function ContactApp({ compact }: { compact: boolean }) {
  const [composing, setComposing] = useState(false);
  if (composing) return <MailCompose onCancel={() => setComposing(false)} />;
  const actions = [
    { label: "mail", Icon: Mail, onClick: () => setComposing(true) },
    { label: "book", Icon: Calendar, onClick: () => window.open(HIRE_CALENDAR_URL, "_blank", "noopener,noreferrer") },
    { label: "linkedin", Icon: Linkedin, onClick: () => window.open(externalLinks.linkedin, "_blank", "noopener,noreferrer") },
    { label: "share", Icon: Share, onClick: shareContact },
  ];
  return (
    <AppleSections compact={compact} title="Contacts" sections={[{ id: "contacts", label: "Contacts", icon: User }]} selected="contacts" onSelect={() => undefined}>
    <div className={compact ? "" : "apple-contact-mac"}>
    <header className="apple-toolbar"><span /><h2>Contacts</h2><Button variant="ghost" size="icon" aria-label="Share contact" title="Share contact" onClick={shareContact}><Share /></Button></header>
    <div className="os-contact">
      <div className="os-contact-hero">
        <img src={portrait} alt="Henrietta Onwuneme" className="os-contact-avatar" />
        <h2>Henrietta Onwuneme</h2>
        <p>Product Manager</p>
      </div>
      <div className="os-contact-actions">
        {actions.map(({ label, Icon, onClick }) => (
          <Button variant="ghost" key={label} onClick={onClick}><Icon aria-hidden="true" /><span>{label}</span></Button>
        ))}
      </div>
      <div className="os-contact-group">
        <Button variant="ghost" className="os-contact-row" onClick={() => setComposing(true)}><span>email</span>{CONTACT_EMAIL}</Button>
        <a className="os-contact-row" href={HIRE_CALENDAR_URL} onClick={openHireCalendar} target="_blank" rel="noopener noreferrer"><span>calendar</span>Book a hiring call</a>
        <div className="os-contact-row"><span>location</span><em>Lagos, Nigeria</em></div>
      </div>
      <div className="os-contact-group">
        <a className="os-contact-row" href={externalLinks.linkedin} target="_blank" rel="noopener noreferrer"><span>LinkedIn</span>henrietta-onwuneme</a>
        <a className="os-contact-row" href={externalLinks.x} target="_blank" rel="noopener noreferrer"><span>X</span>@henrietta_bby</a>
        <a className="os-contact-row" href={externalLinks.instagram} target="_blank" rel="noopener noreferrer"><span>Instagram</span>@henriettaofpm</a>
      </div>
    </div>
    </div>
    </AppleSections>
  );
}

async function fetchHearts() {
  const { data, error } = await supabase.from("hearts").select("id, created_at").order("created_at", { ascending: false }).limit(60);
  if (error) throw error;
  return data ?? [];
}

function LoveApp() {
  const client = useQueryClient();
  const [sendOpen, setSendOpen] = useState(false);
  const [composing, setComposing] = useState(false);
  const [reportId, setReportId] = useState<string | null>(null);
  const { data: hearts = [], isLoading } = useQuery({ queryKey: ["hearts-feed"], queryFn: fetchHearts, refetchInterval: 30000 });
  const { data: visits = [] } = useVisitorPosts();
  const { data: total = 0 } = useQuery({
    queryKey: ["hearts-total"],
    queryFn: async () => {
      const { count, error } = await supabase.from("hearts").select("*", { count: "exact", head: true });
      if (error) throw error;
      return count ?? 0;
    },
    refetchInterval: 30000,
  });
  type Activity = { id: string; created_at: string; kind: "like" | "shout" | "photo"; name?: string; message?: string; photo?: string | null; visitId?: string };
  const activity: Activity[] = [
    ...hearts.map((h) => ({ id: `h-${h.id}`, created_at: h.created_at, kind: "like" as const })),
    ...visits.map((v) => ({ id: `v-${v.id}`, created_at: v.created_at, kind: v.message ? "shout" as const : "photo" as const, name: v.display_name, message: v.message, photo: v.photo_url, visitId: v.id })),
  ].sort((a, b) => b.created_at.localeCompare(a.created_at));
  const now = new Date();
  const groups = [
    { label: "Today", items: activity.filter((h) => differenceInHours(now, new Date(h.created_at)) < 24) },
    { label: "This week", items: activity.filter((h) => { const d = differenceInDays(now, new Date(h.created_at)); return differenceInHours(now, new Date(h.created_at)) >= 24 && d < 7; }) },
    { label: "Earlier", items: activity.filter((h) => differenceInDays(now, new Date(h.created_at)) >= 7) },
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
        <div className="os-love-actions"><Button size="sm" variant="secondary" onClick={() => setComposing((v) => !v)}><MessageCircle /> Shout-out</Button>
        <Button size="sm" onClick={() => setSendOpen(true)}><Heart /> Like</Button></div>
      </div>
      {composing && <ShoutOutComposer onClose={() => setComposing(false)} />}
      {isLoading && <p className="os-muted os-love-empty">Loading activity</p>}
      {!isLoading && activity.length === 0 && <p className="os-muted os-love-empty">No activity yet. Be the first.</p>}
      {groups.map((group) => (
        <section key={group.label}>
          <h3 className="os-love-head">{group.label}</h3>
          {group.items.map((item) => (
            <div key={item.id} className="os-love-row">
              <span className="os-love-avatar" aria-hidden="true"><User />{item.kind === "like" ? <Heart className="os-love-badge" /> : <MessageCircle className="os-love-badge" />}</span>
              <p>
                <strong>{item.name ?? "Someone"}</strong>{" "}
                {item.kind === "like" ? "liked your portfolio." : item.kind === "photo" ? "stopped by and shared a photo." : <>left a shout-out: {item.message}</>}{" "}
                <span className="os-muted">{ago(item.created_at)}</span>
                {item.visitId && <button type="button" className="os-love-report" onClick={() => setReportId(item.visitId!)}>Report</button>}
              </p>
              <img src={item.photo ?? portrait} alt="" className="os-love-thumb" referrerPolicy="no-referrer" />
            </div>
          ))}
        </section>
      ))}
      <HeartModal isOpen={sendOpen} onClose={() => setSendOpen(false)} onSent={() => { setSendOpen(false); client.invalidateQueries({ queryKey: ["hearts-feed"] }); client.invalidateQueries({ queryKey: ["hearts-total"] }); }} />
      <ReportDialog id={reportId} onClose={() => setReportId(null)} />
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

export function AppContent({ id, compact = false, projectName, initialNote, onLaunch }: { id: AppId; compact?: boolean; projectName?: string; initialNote?: NoteId; onLaunch?: (id: LauncherId) => void }) {
  switch (id) {
    case "projects": return <ProjectsApp compact={compact} initial={projectName} />;
    case "cv": return <CvApp compact={compact} />;
    case "letter": return <NotesApp key={initialNote ?? "all-notes"} compact={compact} initialNote={initialNote} letter={<LetterApp />} />;
    case "contact": return <ContactApp compact={compact} />;
    case "shop": return <ShopApp />;
    case "love": return <LoveApp />;
    case "messages": return <MessagesApp compact={compact} />;
    case "health": return <SkillsApp compact={compact} />;
    case "reminders": return <RemindersApp compact={compact} />;
    case "maps": return <JourneyApp compact={compact} />;
    case "weather": return <WeatherApp compact={compact} />;
    case "camera": return <CameraApp onOpen={onLaunch} />;
    case "photos": return <PhotosApp compact={compact} />;
  }
}

export function AppIcon({ launcher, size = "md" }: { launcher: Launcher; size?: "sm" | "md" | "lg" }) {
  if (launcher.id === "camera") return <ImageIcon src={appleCameraIcon} size={size} />;
  if (launcher.id === "photos") return <ImageIcon src={applePhotosIcon} size={size} />;
  if (launcher.id === "hire") return <CalendarIcon size={size} />;
  if (launcher.id === "letter") return <NotesIcon size={size} />;
  if (launcher.id === "projects") return <span className={`os-icon os-icon-${size} os-files`} aria-hidden="true"><span className="os-files-folder" /></span>;
  if (launcher.id === "shop") return <span className={`os-icon os-icon-${size} os-appstore`} aria-hidden="true"><AppStoreGlyph /></span>;
  if (launcher.id === "messages") return <span className={`os-icon os-icon-${size} os-apple-messages`} aria-hidden="true"><svg viewBox="0 0 60 60"><path d="M30 13c-11.6 0-21 7.4-21 16.6 0 5.4 3.2 10.1 8.2 13.2-.4 2.6-1.8 5-3.9 6.7 4.2.1 7.9-1.4 10.5-3.6 2 .5 4 .7 6.2.7 11.6 0 21-7.4 21-16.6S41.6 13 30 13Z" fill="currentColor" /></svg></span>;
  if (launcher.id === "health") return <span className={`os-icon os-icon-${size} os-apple-health`} aria-hidden="true"><svg viewBox="0 0 60 60"><defs><linearGradient id="hh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="hsl(350 100% 70%)" /><stop offset="1" stopColor="hsl(345 95% 52%)" /></linearGradient></defs><path d="M44 8.5c-3.6 0-6.4 2-8 4.7-1.6-2.7-4.4-4.7-8-4.7-5 0-8.6 4-8.6 8.8 0 7.6 9.2 13.4 16.6 19.2 7.4-5.8 16.6-11.6 16.6-19.2 0-4.8-3.6-8.8-8.6-8.8Z" fill="url(#hh)" /></svg></span>;
  if (launcher.id === "reminders") return <span className={`os-icon os-icon-${size} os-apple-reminders`} aria-hidden="true"><svg viewBox="0 0 60 60">{[["hsl(211 100% 50%)", 15], ["hsl(4 90% 58%)", 30], ["hsl(32 100% 52%)", 45]].map(([color, y]) => (<g key={y as number}><circle cx="15" cy={y as number} r="5.2" fill={color as string} /><circle cx="15" cy={y as number} r="2.4" fill="hsl(0 0% 100%)" /><rect x="25" y={(y as number) - 1.2} width="24" height="2.4" rx="1.2" fill="hsl(0 0% 82%)" /></g>))}</svg></span>;
  if (launcher.id === "maps") return <span className={`os-icon os-icon-${size} os-apple-maps`} aria-hidden="true"><svg viewBox="0 0 60 60"><rect width="60" height="60" fill="hsl(48 45% 90%)" /><path d="M0 0h26L0 26Z" fill="hsl(105 45% 72%)" /><path d="M60 34v26H36Z" fill="hsl(105 45% 72%)" /><path d="M-4 44 64 10" stroke="hsl(0 0% 100%)" strokeWidth="9" /><path d="M-4 44 64 10" stroke="hsl(45 95% 62%)" strokeWidth="5" /><path d="M20 -4 40 64" stroke="hsl(0 0% 100%)" strokeWidth="5" /><path d="M14 52 C 24 40, 30 30, 46 18" stroke="hsl(211 100% 52%)" strokeWidth="4" fill="none" strokeLinecap="round" /><circle cx="46" cy="18" r="6" fill="hsl(4 88% 56%)" stroke="hsl(0 0% 100%)" strokeWidth="2" /><path d="M43 47l5-12 5 12-5-3Z" fill="hsl(211 100% 52%)" /></svg></span>;
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
    <svg viewBox="100 130 600 530" fill="currentColor">
      <path d="M396.6 183.8l16.2-28c10-17.5 32.3-23.4 49.8-13.4s23.4 32.3 13.4 49.8L319.9 462.4h112.9c36.6 0 57.1 43 41.2 72.8H143c-20.2 0-36.4-16.2-36.4-36.4 0-20.2 16.2-36.4 36.4-36.4h92.8l118.8-205.9-37.1-64.4c-10-17.5-4.1-39.6 13.4-49.8 17.5-10 39.6-4.1 49.8 13.4l19.5 33.7Zm-140.4 388.9-35 60.7c-10 17.5-32.3 23.4-49.8 13.4S148 614.5 158 597l26-45c29.4-9.1 53.3-2.1 72.2 20.7Zm301.4-110.1h94.7c20.2 0 36.4 16.2 36.4 36.4 0 20.2-16.2 36.4-36.4 36.4h-52.6l35.5 61.6c10 17.5 4.1 39.6-13.4 49.8-17.5 10-39.6 4.1-49.8-13.4-59.8-103.7-104.7-181.3-134.5-233-30.5-52.6-8.7-105.4 12.8-123.3 23.9 41 59.6 102.9 107.3 185.5Z" />
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

function SkillsApp({ compact }: { compact: boolean }) {
  const groups = [
    { title: "Soft Skills", tone: "soft", items: skillCategories.softSkills },
    { title: "Technical Skills", tone: "tech", items: skillCategories.technicalSkills },
    { title: "Tools", tone: "tools", items: skillCategories.tools },
  ];
  const [open, setOpen] = useState<string | null>(null);
  const [section, setSection] = useState("summary");
  const [query, setQuery] = useState("");
  return (
    <div className="apple-health apple-height">
    <AppleSections compact={compact} title="Health" sections={[{ id: "summary", label: "Summary", icon: Heart }, { id: "browse", label: "Browse", icon: Grid2X2 }, { id: "search", label: "Search", icon: Search }]} selected={section} onSelect={setSection}>
    <div className="os-health">
      <span className="os-health-date">{format(new Date(), "EEEE d MMMM").toUpperCase()}</span>
      <h2 className="os-large-title">{section === "summary" ? "Summary" : section === "browse" ? "Browse" : "Search"}</h2>
      {section === "search" && <AppleSearch value={query} onChange={setQuery} label="Search skills" />}
      <p className="os-health-section">{section === "summary" ? "Pinned" : "Skills"}</p>
      {groups.filter((group) => `${group.title} ${group.items.join(" ")}`.toLowerCase().includes(query.toLowerCase())).map((group) => {
        const expanded = open === group.title;
        const shown = expanded ? group.items : group.items.slice(0, 4);
        return (
          <Button variant="ghost" key={group.title} className={`os-health-card os-health-${group.tone}`} onClick={() => setOpen(expanded ? null : group.title)} aria-expanded={expanded}>
            <span className="os-health-head"><Activity aria-hidden="true" /><strong>{group.title}</strong><ChevronLeft className="os-health-chev" aria-hidden="true" /></span>
            <span className="os-health-value"><b>{group.items.length}</b> skills</span>
            <span className="os-health-list">{shown.join(" · ")}{!expanded && group.items.length > 4 ? ` · +${group.items.length - 4} more` : ""}</span>
          </Button>
        );
      })}
    </div>
    </AppleSections>
    </div>
  );
}

function RemindersApp({ compact }: { compact: boolean }) {
  const [done, setDone] = useState<string[]>([]);
  const [section, setSection] = useState("all");
  const [query, setQuery] = useState("");
  const toggle = (id: string) => setDone((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]));
  return (
    <div className="apple-reminders apple-height">
    <AppleSections compact={compact} title="Reminders" sections={[{ id: "all", label: "All", icon: ListChecks }, { id: "completed", label: "Completed", icon: Check }, { id: "search", label: "Search", icon: Search }]} selected={section} onSelect={setSection}>
    <header className="apple-toolbar"><span /><h2>Reminders</h2><span /></header>
    <div className="os-rem">
      <h2 className="os-rem-title">How I Work <span>{workSteps.length - done.length}</span></h2>
      {section === "search" && <AppleSearch value={query} onChange={setQuery} label="Search work steps" />}
      <ul>
        {workSteps.filter((step) => (section !== "completed" || done.includes(step.number)) && `${step.title} ${step.text}`.toLowerCase().includes(query.toLowerCase())).map((step) => {
          const checked = done.includes(step.number);
          return (
            <li key={step.number}>
              <Button variant="ghost" size="icon" className={`os-rem-check ${checked ? "on" : ""}`} onClick={() => toggle(step.number)} aria-pressed={checked} aria-label={`Mark ${step.title} ${checked ? "not done" : "done"}`}>{checked && <Check />}</Button>
              <span className={checked ? "os-rem-done" : ""}><strong>{step.title}</strong><small>{step.text}</small></span>
            </li>
          );
        })}
      </ul>
    </div>
    </AppleSections>
    </div>
  );
}

function JourneyApp({ compact }: { compact: boolean }) {
  const [active, setActive] = useState<number | null>(0);
  const [query, setQuery] = useState("");
  return (
    <div className={`os-maps apple-maps ${compact ? "apple-maps-phone" : "apple-maps-mac"}`}>
      <iframe className="apple-map-frame" title="Map of Lagos" src="https://www.openstreetmap.org/export/embed.html?bbox=3.26%2C6.35%2C3.6%2C6.62&layer=mapnik" loading="lazy" />
      <a className="apple-map-location" href="https://maps.apple.com/?q=Lagos%2C%20Nigeria" target="_blank" rel="noopener noreferrer" aria-label="Open Lagos in Apple Maps" title="Open in Apple Maps"><Navigation /></a>
      <div className="os-maps-sheet">
        <span className="os-maps-grabber" aria-hidden="true" />
        <AppleSearch value={query} onChange={setQuery} label="Search my journey" />
        <h2>My Journey</h2>
        <small className="os-maps-sub">Architecture to Product Management · {journeySteps.length} stops</small>
        <ol>
          {journeySteps.map((step, index) => ({ ...step, index })).filter((step) => `${step.title} ${step.text}`.toLowerCase().includes(query.toLowerCase())).map((step) => (
            <li key={step.title}>
              <Button variant="ghost" className={active === step.index ? "on" : ""} aria-expanded={active === step.index} onClick={() => setActive((current) => current === step.index ? null : step.index)}>
                <span className="os-maps-dot">{step.index + 1}</span>
                <span><strong>{step.title}</strong>{active === step.index && <small>{step.text}</small>}</span>{active === step.index ? <ChevronDown aria-hidden="true" /> : <ChevronRight aria-hidden="true" />}
              </Button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

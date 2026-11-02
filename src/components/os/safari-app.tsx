import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, BookOpen, ChevronLeft, ChevronRight, Globe, LockKeyhole, Plus, RotateCw, Share, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { featuredProjects, projectsData, type Project } from "@/data/projects";
import { blocksEmbedding, safeWebsiteUrl, visitPage, type SafariPage } from "./safari-navigation";
import "./safari-app.css";

interface SafariTab { id: number; history: SafariPage[]; index: number }
export interface SafariRequest { url: string; projectName?: string; mode: "tour" | "website"; entry: number }
const projects = [...featuredProjects, ...projectsData].filter((project, index, list) => list.findIndex((item) => item.name === project.name) === index);

function ProjectTour({ project, onWebsite }: { project: Project; onWebsite: () => void }) {
  const [chapter, setChapter] = useState(0);
  const reducedMotion = useReducedMotion();
  const chapters = [
    { title: project.name, label: "What it is", paragraphs: [project.overview] },
    { title: "The problem", label: "The problem", paragraphs: project.problem ? [project.problem] : [] },
    { title: "What I did", label: "What I did", paragraphs: project.whatIDid ? [project.whatIDid] : project.responsibilities ?? [] },
    { title: "The strategy", label: "The strategy", paragraphs: project.strategy ?? [] },
    { title: "Outcome", label: "Outcome", paragraphs: project.outcome ?? project.achievements ?? [] },
    { title: "Stack and tools", label: "Stack and tools", paragraphs: project.stack ? [project.stack] : [] },
  ].filter((item) => item.paragraphs.length);
  const current = chapters[chapter];
  if (!current) return null;
  return <article className="safari-tour">
    <header className="safari-tour-nav"><strong>{project.name}</strong>{project.link !== "#" && <Button variant="ghost" onClick={onWebsite}>Visit website <ArrowUpRight /></Button>}</header>
    <div className="safari-chapter">
      <AnimatePresence mode="wait"><motion.div key={chapter} initial={reducedMotion ? false : { opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} transition={{ duration:.16 }}>
        {chapter === 0 && <img className="safari-tour-image" src={project.image} alt={`${project.name} product preview`} />}
        <div className="safari-story"><small>{String(chapter + 1).padStart(2,"0")} / {String(chapters.length).padStart(2,"0")} · {current.label}</small><h1>{current.title}</h1><div className={current.label === "Outcome" ? "safari-outcomes" : ""}>{current.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></div>
      </motion.div></AnimatePresence>
    </div>
    <footer className="safari-chapters"><Button variant="ghost" size="icon" aria-label="Previous tour chapter" disabled={chapter === 0} onClick={() => setChapter(chapter - 1)}><ChevronLeft /></Button><div>{chapters.map((item,index) => <Button variant="ghost" key={item.label} size="icon" aria-label={item.label} title={item.label} aria-current={chapter === index} onClick={() => setChapter(index)}><i /></Button>)}</div><Button variant="ghost" size="icon" aria-label="Next tour chapter" disabled={chapter === chapters.length - 1} onClick={() => setChapter(chapter + 1)}><ChevronRight /></Button></footer>
  </article>;
}

export default function SafariApp({ compact = false, request }: { compact?: boolean; request?: SafariRequest }) {
  const nextId = useRef(1);
  const [tabs, setTabs] = useState<SafariTab[]>([{ id:0, history:[], index:-1 }]);
  const [activeId, setActiveId] = useState(0);
  const [address, setAddress] = useState("");
  const [reload, setReload] = useState(0);
  const [showTabs, setShowTabs] = useState(false);
  const active = tabs.find((tab) => tab.id === activeId) ?? tabs[0];
  const page = active?.history[active.index];
  const project = projects.find((item) => item.name === page?.projectName);
  const handledEntry = useRef<number | undefined>();

  useEffect(() => {
    if (!request || handledEntry.current === request.entry) return;
    handledEntry.current = request.entry;
    const id = nextId.current++;
    const destination: SafariPage = { url:request.url, projectName:request.projectName, mode:request.mode };
    setTabs((list) => [...list.filter((tab) => tab.history.length), { id, history:[destination], index:0 }]);
    setActiveId(id);
  }, [request]);
  useEffect(() => { setAddress(page ? page.mode === "tour" ? `henriettaofpm.online/projects/${encodeURIComponent(page.projectName ?? "")}` : page.url : ""); }, [page]);

  const navigate = (destination: SafariPage) => {
    setTabs((list) => list.map((tab) => tab.id === activeId ? { ...tab, history:visitPage(tab.history,tab.index,destination), index:tab.index + 1 } : tab));
  };
  const addTab = () => { const id = nextId.current++; setTabs((list) => [...list,{ id, history:[], index:-1 }]); setActiveId(id); };
  const closeTab = (id: number) => {
    if (tabs.length === 1) { setTabs([{ id, history:[], index:-1 }]); return; }
    const remaining = tabs.filter((tab) => tab.id !== id);
    setTabs(remaining);
    if (id === activeId) setActiveId(remaining[0]?.id ?? 0);
  };
  const stepHistory = (delta: number) => setTabs((list) => list.map((tab) => tab.id === activeId ? { ...tab,index:Math.max(-1,Math.min(tab.history.length - 1,tab.index + delta)) } : tab));
  const openWebsite = (item: Project) => { if (item.link !== "#") navigate({ url:item.link,projectName:item.name,mode:"website" }); };
  const share = async () => {
    const url = page?.mode === "website" ? page.url : "https://henriettaofpm.online";
    try { await navigator.clipboard.writeText(url); toast.success("Link copied"); } catch { toast.error("The link couldn't be copied. Please try again."); }
  };
  const backButton = <Button variant="ghost" size="icon" aria-label="Safari back" title="Back" disabled={!active || active.index < 0} onClick={() => stepHistory(-1)}><ChevronLeft /></Button>;
  const forwardButton = <Button variant="ghost" size="icon" aria-label="Safari forward" title="Forward" disabled={!active || active.index >= active.history.length - 1} onClick={() => stepHistory(1)}><ChevronRight /></Button>;
  return <div className={`safari-app ${compact ? "safari-mobile" : ""}`}>
    <header className="safari-toolbar">
      {!compact && <>{backButton}{forwardButton}</>}
      <form className="safari-address" onSubmit={(event) => { event.preventDefault(); const url = safeWebsiteUrl(address); if (!url) { toast.error("Enter a valid HTTPS website address."); return; } navigate({ url,mode:"website",projectName:projects.find((item) => safeWebsiteUrl(item.link) === url)?.name }); }}>
        {page ? <LockKeyhole aria-hidden="true" /> : <Globe aria-hidden="true" />}<input aria-label="Safari address" value={address} onChange={(event) => setAddress(event.target.value)} onFocus={(event) => event.target.select()} placeholder="Search or enter website name" /><Button variant="ghost" size="icon" aria-label="Reload page" title="Reload" type="button" onClick={() => setReload((value) => value + 1)}><RotateCw /></Button>
      </form>
      {!compact && <><Button variant="ghost" size="icon" aria-label="Share page" title="Share" onClick={share}><Share /></Button><Button variant="ghost" size="icon" aria-label="New Safari tab" title="New tab" onClick={addTab}><Plus /></Button></>}
    </header>
    {(!compact || showTabs) && <nav className="safari-tabs" aria-label="Safari tabs">{tabs.map((tab) => { const current = tab.history[tab.index]; return <div key={tab.id} className={tab.id === activeId ? "active" : ""}><Button variant="ghost" onClick={() => { setActiveId(tab.id); setShowTabs(false); }}><span>{current?.projectName ?? (current ? new URL(current.url).hostname : "Start Page")}</span></Button><Button variant="ghost" size="icon" aria-label={`Close ${current?.projectName ?? "Start Page"} tab`} onClick={() => closeTab(tab.id)}><X /></Button></div>; })}</nav>}
    <main className="safari-content">
      {!page ? <div className="safari-start"><h1>Start Page</h1><h2>Favourites</h2><div className="safari-favorites">{projects.map((item) => <Button key={item.name} variant="ghost" onClick={() => navigate({ url:"https://henriettaofpm.online",projectName:item.name,mode:"tour" })}><img src={item.image} alt="" /><span>{item.name}</span></Button>)}</div></div>
      : page.mode === "tour" && project ? <ProjectTour key={`${activeId}-${project.name}-${reload}`} project={project} onWebsite={() => openWebsite(project)} />
      : <div className="safari-website">
        <div className="safari-site-actions"><span>{project?.name ?? new URL(page.url).hostname}</span>{project && <Button variant="ghost" aria-label="View project tour" onClick={() => navigate({ ...page,mode:"tour" })}><BookOpen /> Tour</Button>}<Button variant="ghost" size="icon" aria-label="Open website in browser" title="Open in browser" asChild><a href={page.url} target="_blank" rel="noopener noreferrer"><ArrowUpRight /></a></Button></div>
        {blocksEmbedding(page.url) ? <div className="safari-blocked"><Globe /><h2>This website doesn't allow an embedded view.</h2><p>{project?.name ?? "This website"} requires a separate browser tab. {project ? "Its project tour is still available here." : ""}</p><Button asChild><a href={page.url} target="_blank" rel="noopener noreferrer">Open website <ArrowUpRight /></a></Button></div>
        : <iframe key={`${page.url}-${reload}`} src={page.url} title={`${project?.name ?? "Website"} live website`} sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox" referrerPolicy="strict-origin-when-cross-origin" />}
      </div>}
    </main>
    {compact && <footer className="safari-bottom">{backButton}{forwardButton}<Button variant="ghost" size="icon" aria-label="Share page" title="Share" onClick={share}><Share /></Button><Button variant="ghost" size="icon" aria-label="New Safari tab" title="New tab" onClick={addTab}><Plus /></Button><Button variant="ghost" size="icon" aria-label="Show Safari tabs" title="Tabs" onClick={() => setShowTabs(!showTabs)}><span>{tabs.length}</span></Button></footer>}
  </div>;
}
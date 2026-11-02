import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, BookOpen, ChevronLeft, ChevronRight, Globe, PanelLeft, PanelsTopLeft, MoreHorizontal, Mic, Check, Plus, RotateCw, Share, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { friendlyError } from "@/lib/friendly-error";
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
  const [showSidebar, setShowSidebar] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);
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
    try { await navigator.clipboard.writeText(url); toast.success("Link copied"); } catch { toast.error(friendlyError(null, "The link couldn't be copied. Please try again.")); }
  };
  const backButton = <Button variant="ghost" size="icon" aria-label="Safari back" title="Back" disabled={!active || active.index < 0} onClick={() => stepHistory(-1)}><ChevronLeft /></Button>;
  const forwardButton = <Button variant="ghost" size="icon" aria-label="Safari forward" title="Forward" disabled={!active || active.index >= active.history.length - 1} onClick={() => stepHistory(1)}><ChevronRight /></Button>;
  const titleFor = (tab: SafariTab) => {
    const destination = tab.history[tab.index];
    return destination?.projectName ?? (destination ? new URL(destination.url).hostname : "Start Page");
  };
  const displayAddress = page?.mode === "tour" ? "henriettaofpm.online" : page ? new URL(page.url).hostname.replace(/^www\./, "") : "Search or enter website name";
  const pageMenu = <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" aria-label="Page menu" title="Page menu"><PanelsTopLeft /></Button></DropdownMenuTrigger><DropdownMenuContent className="safari-menu" align="start">{project && <DropdownMenuItem onSelect={() => navigate({ ...page, url:page?.url ?? "https://henriettaofpm.online", mode:"tour" })}><BookOpen />View project tour</DropdownMenuItem>}<DropdownMenuItem onSelect={() => setReload((value) => value + 1)}><RotateCw />Reload</DropdownMenuItem>{page?.mode === "website" && <DropdownMenuItem onSelect={() => window.open(page.url,"_blank","noopener,noreferrer")}><ArrowUpRight />Open in browser</DropdownMenuItem>}</DropdownMenuContent></DropdownMenu>;
  const addressForm = <form className="safari-address" onSubmit={(event) => {
    event.preventDefault();
    const url = safeWebsiteUrl(address);
    if (!url) { toast.error("Enter a valid HTTPS website address."); return; }
    navigate({ url, mode:"website", projectName:projects.find((item) => safeWebsiteUrl(item.link) === url)?.name });
    setEditingAddress(false);
  }}>
    {pageMenu}
    <input aria-label="Safari address" value={editingAddress ? address : page ? displayAddress : ""} onChange={(event) => setAddress(event.target.value)} onFocus={(event) => { setEditingAddress(true); window.setTimeout(() => event.target.select(),0); }} onBlur={() => setEditingAddress(false)} placeholder="Search or enter website name" />
    <Button variant="ghost" size="icon" aria-label={page ? "Reload page" : "Enter website address"} title={page ? "Reload" : "Enter address"} type={page ? "button" : "submit"} onClick={page ? () => setReload((value) => value + 1) : undefined}>{page ? <RotateCw /> : <Mic />}</Button>
  </form>;
  return <div className={`safari-app ${compact ? "safari-mobile" : "safari-desktop"}`}>
    <header className="safari-toolbar">
      {!compact && <><Button variant="ghost" size="icon" aria-label="Toggle Safari sidebar" title="Sidebar" onClick={() => setShowSidebar(!showSidebar)}><PanelLeft /></Button><div className="safari-navigation">{backButton}{forwardButton}</div></>}
      {compact && backButton}
      {addressForm}
      {!compact ? <div className="safari-tools"><Button variant="ghost" size="icon" aria-label="Share page" title="Share" onClick={share}><Share /></Button><Button variant="ghost" size="icon" aria-label="New Safari tab" title="New tab" onClick={addTab}><Plus /></Button><Button variant="ghost" size="icon" aria-label="Show Safari tabs" title="Tab overview" onClick={() => setShowTabs(!showTabs)}><PanelsTopLeft /></Button></div>
      : <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="safari-more" aria-label="Safari more" title="More"><MoreHorizontal /></Button></DropdownMenuTrigger><DropdownMenuContent className="safari-menu" align="end"><DropdownMenuItem onSelect={() => setShowTabs(true)}><PanelsTopLeft />{tabs.length} {tabs.length === 1 ? "Tab" : "Tabs"}</DropdownMenuItem><DropdownMenuItem onSelect={addTab}><Plus />New Tab</DropdownMenuItem><DropdownMenuItem onSelect={share}><Share />Share</DropdownMenuItem><DropdownMenuItem disabled={!active || active.index >= active.history.length - 1} onSelect={() => stepHistory(1)}><ChevronRight />Forward</DropdownMenuItem>{page?.mode === "website" && <DropdownMenuItem onSelect={() => window.open(page.url,"_blank","noopener,noreferrer")}><ArrowUpRight />Open in browser</DropdownMenuItem>}</DropdownMenuContent></DropdownMenu>}
    </header>
    {!compact && tabs.length > 1 && <nav className="safari-tabs" aria-label="Safari tabs">{tabs.map((tab) => <div key={tab.id} className={tab.id === activeId ? "active" : ""}><Button variant="ghost" size="icon" aria-label={`Close ${titleFor(tab)} tab`} onClick={() => closeTab(tab.id)}><X /></Button><Button variant="ghost" onClick={() => { setActiveId(tab.id); setShowTabs(false); }}><span>{titleFor(tab)}</span></Button></div>)}</nav>}
    <div className="safari-browser-body">
      {!compact && showSidebar && <aside className="safari-sidebar"><h2>Safari</h2><Button variant="ghost" onClick={() => { setShowTabs(true); setShowSidebar(false); }}><PanelsTopLeft />{tabs.length} Tabs</Button><h3>Bookmarks</h3>{projects.map((item) => <Button key={item.name} variant="ghost" onClick={() => navigate({ url:"https://henriettaofpm.online", projectName:item.name, mode:"tour" })}><Globe />{item.name}</Button>)}</aside>}
      <main className="safari-content">
        {!page ? <div className="safari-start"><h2>Favorites</h2><div className="safari-favorites">{projects.map((item) => <Button key={item.name} variant="ghost" onClick={() => navigate({ url:"https://henriettaofpm.online", projectName:item.name, mode:"tour" })}><img src={item.image} alt="" /><span>{item.name}</span></Button>)}</div></div>
        : page.mode === "tour" && project ? <ProjectTour key={`${activeId}-${project.name}-${reload}`} project={project} onWebsite={() => openWebsite(project)} />
        : <div className="safari-website">
          {blocksEmbedding(page.url) ? <div className="safari-blocked"><Globe /><h2>This website doesn't allow an embedded view.</h2><p>{project?.name ?? "This website"} requires a separate browser tab. {project ? "Its project tour is still available here." : ""}</p>{project && <Button variant="ghost" onClick={() => navigate({ ...page, mode:"tour" })}><BookOpen />View project tour</Button>}<Button asChild><a href={page.url} target="_blank" rel="noopener noreferrer">Open website <ArrowUpRight /></a></Button></div>
          : <iframe key={`${page.url}-${reload}`} src={page.url} title={`${project?.name ?? "Website"} live website`} sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox" referrerPolicy="strict-origin-when-cross-origin" />}
        </div>}
      </main>
    </div>
    <AnimatePresence>{showTabs && <motion.section className="safari-overview" aria-label="Safari tab overview" initial={{ opacity:0, scale:.96 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:.96 }}>
      <header><h2>{tabs.length} {tabs.length === 1 ? "Tab" : "Tabs"}</h2></header>
      <div className="safari-overview-grid">{tabs.map((tab) => { const destination = tab.history[tab.index]; const item = projects.find((entry) => entry.name === destination?.projectName); return <div className="safari-tab-preview" key={tab.id}><Button variant="ghost" className="safari-tab-select" onClick={() => { setActiveId(tab.id); setShowTabs(false); }}><div className="safari-tab-page">{item ? <><img src={item.image} alt="" /><strong>{item.name}</strong><p>{item.overview}</p></> : <><Globe /><strong>{titleFor(tab)}</strong></>}</div><span>{titleFor(tab)}</span></Button><Button variant="ghost" size="icon" className="safari-tab-close" aria-label={`Close ${titleFor(tab)} tab`} onClick={() => closeTab(tab.id)}><X /></Button></div>; })}</div>
      <footer><Button variant="ghost" size="icon" aria-label="New Safari tab" onClick={() => { addTab(); setShowTabs(false); }}><Plus /></Button><span>{tabs.length} {tabs.length === 1 ? "Tab" : "Tabs"}</span><Button variant="ghost" size="icon" aria-label="Done with tabs" onClick={() => setShowTabs(false)}><Check /></Button></footer>
    </motion.section>}</AnimatePresence>
  </div>;
}

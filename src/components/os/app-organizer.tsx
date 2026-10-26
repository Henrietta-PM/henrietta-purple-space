import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { DndContext, DragOverlay, KeyboardSensor, MouseSensor, TouchSensor, pointerWithin, rectIntersection, useDraggable, useDroppable, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Grip, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { appCatalog, type OrganizedApp } from "./app-catalog";
import { extractApp, moveTile, restoreLayout, type AppLayout, type AppTile } from "./app-layout";
import "./app-organizer.css";

interface Organization {
  layout: AppLayout;
  editing: boolean;
  active: string | null;
  openFolder: (id: string) => void;
  launch: (app: OrganizedApp) => void;
  openIds: string[];
}
const OrganizationContext = createContext<Organization | null>(null);
const MotionButton = motion.create(Button);

export default function AppOrganizer({ storageKey, defaults, mobile = false, onLaunch, children, onPageEdge, openIds = [], hideControls = false }: {
  hideControls?: boolean;
  storageKey: string; defaults: AppLayout; mobile?: boolean; onLaunch: (app: OrganizedApp) => void; children: ReactNode;
  onPageEdge?: (direction: number) => void; openIds?: string[];
}) {
  const [layout, setLayout] = useState<AppLayout>(() => {
    try { return restoreLayout(JSON.parse(localStorage.getItem(storageKey) ?? "null"), defaults); } catch { return defaults; }
  });
  const [editing, setEditing] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [folderId, setFolderId] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const lastPageTurn = useRef(0);
  const folderBounds = useRef<HTMLDivElement>(null);
  const draggingFromFolder = useRef(false);
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: editing ? { distance: 5 } : { delay: 450, tolerance: 8 } }),
    useSensor(KeyboardSensor),
  );
  useEffect(() => { try { localStorage.setItem(storageKey, JSON.stringify(layout)); } catch { /* Private browsing can disable storage. */ } }, [layout, storageKey]);
  const allTiles = Object.values(layout).flat();
  const activeTile = active?.startsWith("folder-app:") ? { id: active, apps: [active.slice("folder-app:".length)] } : allTiles.find((tile) => tile.id === active);
  const folder = allTiles.find((tile) => tile.id === folderId && tile.apps.length > 1);
  useEffect(() => {
    if (!folderId) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setFolderId(null); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [folderId]);
  const launch = (app: OrganizedApp) => { setFolderId(null); setEditing(false); onLaunch(app); };
  const endDrag = (event: DragEndEvent) => {
    setActive(null);
    if (!event.over) return;
    const sourceFolder = event.active.data.current?.folderId as string | undefined;
    const sourceApp = event.active.data.current?.appId as string | undefined;
    if (sourceFolder && !draggingFromFolder.current) return;
    const sourceId = sourceApp ? `extracted:${sourceApp}` : String(event.active.id);
    const zone = event.over.data.current?.zone as string | undefined;
    if (!zone) return;
    const targetId = event.over.data.current?.tileId as string | undefined;
    const targetRect = event.over.rect;
    const translated = event.active.rect.current.translated;
    const centerX = translated ? translated.left + translated.width / 2 : 0;
    const centerY = translated ? translated.top + translated.height / 2 : 0;
    const group = Boolean(targetId && centerX > targetRect.left + targetRect.width * .22 && centerX < targetRect.right - targetRect.width * .22 && centerY > targetRect.top + targetRect.height * .15 && centerY < targetRect.bottom - targetRect.height * .15);
    setLayout((current) => {
      const extracted = sourceFolder && sourceApp ? extractApp(current, sourceFolder, sourceApp) : current;
      let next = moveTile(extracted, sourceId, zone, targetId, sourceFolder ? false : group, appCatalog);
      if (!mobile && zone === "desktop" && !targetId && translated) {
        const x = Math.max(0, Math.min(1, (translated.left - targetRect.left) / Math.max(1, targetRect.width - 88)));
        const y = Math.max(0, Math.min(1, (translated.top - targetRect.top) / Math.max(1, targetRect.height - 90)));
        next = { ...next, desktop: next.desktop.map((tile) => tile.id === sourceId ? { ...tile, position: { x, y } } : tile) };
      }
      return next;
    });
    setAnnouncement(group ? "Apps grouped into a folder" : "App moved");
  };
  return (
    <OrganizationContext.Provider value={{ layout, editing, active, openFolder: setFolderId, launch, openIds }}>
      <DndContext sensors={sensors} collisionDetection={(args) => {
        const hits = pointerWithin(args);
        return (hits.length ? hits : rectIntersection(args)).sort((a, b) => Number(String(a.id).startsWith("zone:")) - Number(String(b.id).startsWith("zone:")));
      }} onDragStart={({ active: item }) => { draggingFromFolder.current = false; setActive(String(item.id)); setEditing(true); }} onDragMove={({ active: item }) => {
        const rect = item.rect.current.translated;
        if (!rect) return;
        const bounds = folderBounds.current?.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        if (item.data.current?.folderId && bounds && (x < bounds.left - 10 || x > bounds.right + 10 || y < bounds.top - 10 || y > bounds.bottom + 10)) {
          draggingFromFolder.current = true;
          setFolderId(null);
        }
        if (!mobile || Date.now() - lastPageTurn.current < 800) return;
        if (x < 28 || x > window.innerWidth - 28) { lastPageTurn.current = Date.now(); onPageEdge?.(x < 28 ? -1 : 1); }
      }} onDragEnd={endDrag} onDragCancel={() => setActive(null)}>
        {children}
        {!hideControls && <div className={`os-organize-controls ${mobile ? "phone" : "desktop"}`}>
          {editing && <Button variant="ghost" size="icon" aria-label="Reset app layout" title="Reset app layout" onClick={() => { setLayout(defaults); setFolderId(null); }}><RotateCcw /></Button>}
          <Button variant="ghost" size="icon" aria-label={editing ? "Finish arranging apps" : "Arrange apps"} title={editing ? "Done" : "Arrange apps"} onClick={() => setEditing((value) => !value)}>{editing ? <Check /> : <Grip />}</Button>
        </div>}
        <DragOverlay zIndex={150} dropAnimation={null}>{activeTile && <div className="os-drag-preview"><TileIcon tile={activeTile} /></div>}</DragOverlay>
        <AnimatePresence>{folder && <motion.div className="os-folder-layer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .18 }}>
          <Button variant="ghost" className="os-folder-backdrop" aria-label="Close folder" onClick={() => setFolderId(null)} />
          <motion.section className="os-folder-view" role="dialog" aria-label={folder.name ?? "Apps"} initial={{ scale: .85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: .9, opacity: 0 }} transition={{ type: "spring", stiffness: 380, damping: 32 }}>
            <Input aria-label="Folder name" className="os-folder-name" value={folder.name ?? "Apps"} maxLength={32} onChange={(event) => {
              const name = event.target.value;
              setLayout((current) => Object.fromEntries(Object.entries(current).map(([zone, tiles]) => [zone, tiles.map((tile) => tile.id === folder.id ? { ...tile, name } : tile)])));
            }} onBlur={() => setLayout((current) => Object.fromEntries(Object.entries(current).map(([zone, tiles]) => [zone, tiles.map((tile) => tile.id === folder.id && !tile.name?.trim() ? { ...tile, name: "Apps" } : tile)])))} />
            <div className="os-folder-apps" ref={folderBounds}>{folder.apps.map((id) => {
              const app = appCatalog.find((item) => item.id === id);
              if (!app) return null;
              return <FolderApp key={id} app={app} folderId={folder.id} />;
            })}</div>
          </motion.section>
        </motion.div>}</AnimatePresence>
      </DndContext>
      <span className="sr-only" role="status">{announcement}</span>
    </OrganizationContext.Provider>
  );
}

function FolderApp({ app, folderId }: { app: OrganizedApp; folderId: string }) {
  const context = useContext(OrganizationContext);
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: `folder-app:${app.id}`, data: { folderId, appId: app.id } });
  return <MotionButton ref={setNodeRef} variant="ghost" {...attributes} {...listeners} aria-label={app.name} className={`os-organized-tile ${context?.editing ? "editing" : ""} ${isDragging ? "dragging" : ""}`} whileTap={{ scale: .92 }} onClick={() => { if (!context?.active && !context?.editing) context?.launch(app); }}>
    {app.icon}<span className="os-tile-name">{app.name}</span>
  </MotionButton>;
}

function TileIcon({ tile }: { tile: AppTile }) {
  if (tile.apps.length === 1) return appCatalog.find((app) => app.id === tile.apps[0])?.icon ?? null;
  return <span className="os-folder-icon">{tile.apps.slice(0, 9).map((id) => <span key={id}>{appCatalog.find((app) => app.id === id)?.icon}</span>)}</span>;
}

function MovableTile({ tile, zone, index, desktop }: { tile: AppTile; zone: string; index: number; desktop: boolean }) {
  const context = useContext(OrganizationContext);
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: tile.id });
  const { setNodeRef: dropRef, isOver } = useDroppable({ id: `tile:${tile.id}`, data: { zone, tileId: tile.id } });
  if (!context) return null;
  const app = appCatalog.find((item) => item.id === tile.apps[0]);
  const name = tile.apps.length > 1 ? tile.name ?? "Apps" : app?.name ?? "App";
  return <div ref={dropRef} className={`os-tile-slot ${isOver && context.active !== tile.id ? "drop-target" : ""} ${desktop ? "free-position" : ""}`} style={desktop ? { left: tile.position ? `calc(${tile.position.x * 100}% - ${tile.position.x * 88}px)` : "calc(100% - 108px)", top: tile.position ? `calc(${tile.position.y * 100}% - ${tile.position.y * 90}px)` : 24 + index * 96 } : undefined}>
    <MotionButton ref={setNodeRef} variant="ghost" {...attributes} {...listeners} aria-label={name} title={name} className={`os-organized-tile ${context.editing ? "editing" : ""} ${isDragging ? "dragging" : ""}`} whileTap={{ scale: .92 }} onDoubleClick={() => { if (desktop && app && tile.apps.length === 1) context.launch(app); }} onClick={(event) => {
      if (context.active) return;
      if (tile.apps.length > 1) context.openFolder(tile.id);
      else if (app && !context.editing && (!desktop || event.detail === 0)) context.launch(app);
    }}>
      <TileIcon tile={tile} /><span className="os-tile-name">{name}</span>
      {zone === "dock" && <span className={`os-organized-dot ${tile.apps.some((id) => context.openIds.includes(id)) ? "on" : ""}`} />}
    </MotionButton>
  </div>;
}

export function AppZone({ zone, className, children, desktop = false }: { zone: string; className?: string; children?: ReactNode; desktop?: boolean }) {
  const context = useContext(OrganizationContext);
  const { setNodeRef, isOver } = useDroppable({ id: `zone:${zone}`, data: { zone } });
  return <div ref={setNodeRef} className={`${className ?? ""} os-app-zone ${desktop ? "os-free-zone" : ""} ${isOver ? "zone-over" : ""}`} data-app-zone={zone}>
    {children}
    {context?.layout[zone]?.map((tile, index) => <MovableTile key={tile.id} tile={tile} zone={zone} index={index} desktop={desktop} />)}
  </div>;
}
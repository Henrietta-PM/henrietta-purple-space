import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { DndContext, DragOverlay, KeyboardSensor, MouseSensor, TouchSensor, pointerWithin, rectIntersection, useDraggable, useDroppable, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { motion } from "framer-motion";
import { Check, Grip, RotateCcw, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
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
}
const OrganizationContext = createContext<Organization | null>(null);
const MotionButton = motion.create(Button);

export default function AppOrganizer({ storageKey, defaults, mobile = false, onLaunch, children }: {
  storageKey: string; defaults: AppLayout; mobile?: boolean; onLaunch: (app: OrganizedApp) => void; children: ReactNode;
}) {
  const [layout, setLayout] = useState<AppLayout>(() => {
    try { return restoreLayout(JSON.parse(localStorage.getItem(storageKey) ?? "null"), defaults); } catch { return defaults; }
  });
  const [editing, setEditing] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [folderId, setFolderId] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: editing ? { distance: 5 } : { delay: 450, tolerance: 8 } }),
    useSensor(KeyboardSensor),
  );
  useEffect(() => { try { localStorage.setItem(storageKey, JSON.stringify(layout)); } catch { /* Private browsing can disable storage. */ } }, [layout, storageKey]);
  const allTiles = Object.values(layout).flat();
  const activeTile = allTiles.find((tile) => tile.id === active);
  const folder = allTiles.find((tile) => tile.id === folderId && tile.apps.length > 1);
  const launch = (app: OrganizedApp) => { setFolderId(null); setEditing(false); onLaunch(app); };
  const endDrag = (event: DragEndEvent) => {
    setActive(null);
    if (!event.over) return;
    const sourceId = String(event.active.id);
    const zone = event.over.data.current?.zone as string | undefined;
    if (!zone) return;
    const targetId = event.over.data.current?.tileId as string | undefined;
    const targetRect = event.over.rect;
    const translated = event.active.rect.current.translated;
    const centerX = translated ? translated.left + translated.width / 2 : 0;
    const centerY = translated ? translated.top + translated.height / 2 : 0;
    const group = Boolean(targetId && centerX > targetRect.left + targetRect.width * .22 && centerX < targetRect.right - targetRect.width * .22 && centerY > targetRect.top + targetRect.height * .15 && centerY < targetRect.bottom - targetRect.height * .15);
    setLayout((current) => {
      let next = moveTile(current, sourceId, zone, targetId, group, appCatalog);
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
    <OrganizationContext.Provider value={{ layout, editing, active, openFolder: setFolderId, launch }}>
      <DndContext sensors={sensors} collisionDetection={(args) => {
        const hits = pointerWithin(args);
        return (hits.length ? hits : rectIntersection(args)).sort((a, b) => Number(String(a.id).startsWith("zone:")) - Number(String(b.id).startsWith("zone:")));
      }} onDragStart={({ active: item }) => { setActive(String(item.id)); setEditing(true); }} onDragEnd={endDrag} onDragCancel={() => setActive(null)}>
        {children}
        <div className={`os-organize-controls ${mobile ? "phone" : "desktop"}`}>
          {editing && <Button variant="ghost" size="icon" aria-label="Reset app layout" title="Reset app layout" onClick={() => { setLayout(defaults); setFolderId(null); }}><RotateCcw /></Button>}
          <Button variant="ghost" size="icon" aria-label={editing ? "Finish arranging apps" : "Arrange apps"} title={editing ? "Done" : "Arrange apps"} onClick={() => setEditing((value) => !value)}>{editing ? <Check /> : <Grip />}</Button>
        </div>
        <DragOverlay dropAnimation={null}>{activeTile && <div className="os-drag-preview"><TileIcon tile={activeTile} /></div>}</DragOverlay>
      </DndContext>
      <span className="sr-only" role="status">{announcement}</span>
      <Dialog open={Boolean(folder)} onOpenChange={(value) => { if (!value) setFolderId(null); }}>
        <DialogContent className="os-organized-folder" aria-describedby={undefined}>
          <DialogTitle className="sr-only">{folder?.name ?? "Apps"}</DialogTitle>
          {folder && <>
            <Input aria-label="Folder name" className="os-folder-name" value={folder.name ?? "Apps"} maxLength={32} onChange={(event) => {
              const name = event.target.value;
              setLayout((current) => Object.fromEntries(Object.entries(current).map(([zone, tiles]) => [zone, tiles.map((tile) => tile.id === folder.id ? { ...tile, name } : tile)])));
            }} onBlur={() => setLayout((current) => Object.fromEntries(Object.entries(current).map(([zone, tiles]) => [zone, tiles.map((tile) => tile.id === folder.id && !tile.name?.trim() ? { ...tile, name: "Apps" } : tile)])))} />
            <div className="os-folder-apps">{folder.apps.map((id) => {
              const app = appCatalog.find((item) => item.id === id);
              if (!app) return null;
              return <div className="os-folder-app" key={id}>
                <Button variant="ghost" className="os-organized-tile" onClick={() => launch(app)} aria-label={app.name}>{app.icon}<span>{app.name}</span></Button>
                {editing && <Button variant="ghost" size="icon" aria-label={`Move ${app.name} out of folder`} title="Move out of folder" onClick={() => setLayout((current) => extractApp(current, folder.id, id))}><ArrowUpRight /></Button>}
              </div>;
            })}</div>
          </>}
        </DialogContent>
      </Dialog>
    </OrganizationContext.Provider>
  );
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
    <MotionButton ref={setNodeRef} variant="ghost" {...attributes} {...listeners} aria-label={name} className={`os-organized-tile ${context.editing ? "editing" : ""} ${isDragging ? "dragging" : ""}`} whileTap={{ scale: .92 }} onClick={() => {
      if (context.active) return;
      if (tile.apps.length > 1) context.openFolder(tile.id);
      else if (app && !context.editing) context.launch(app);
    }}>
      <TileIcon tile={tile} /><span className="os-tile-name">{name}</span>
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
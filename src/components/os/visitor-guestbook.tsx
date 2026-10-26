import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Flag, Image as ImageIcon, LayoutGrid, RefreshCw, SwitchCamera, X, Search, SlidersHorizontal, Share, Info } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { friendlyError } from "@/lib/friendly-error";
import { wallpapers } from "./use-wallpaper";
import "./visitor-guestbook.css";
import { AppleSearch, AppleSections } from "./apple-app-chrome";

export interface Visit { id: string; display_name: string; message: string; photo_url: string | null; created_at: string; kind?: "shoutout" | "message" }
const nameSchema = z.string().trim().min(1).max(40);
const shoutSchema = z.object({ name: nameSchema, message: z.string().trim().min(1).max(240), consent: z.literal(true) });

async function invokeGuestbook(body?: unknown) {
  const { data, error } = await supabase.functions.invoke("visitor-guestbook", { method: body ? "POST" : "GET", ...(body ? { body } : {}) });
  if (error) throw error;
  return data;
}

export function useVisitorPosts(enabled = true) {
  return useQuery<Visit[], Error, Visit[]>({ queryKey: ["visitor-posts"], queryFn: fetchVisits, enabled, refetchInterval: 30000, select: (posts) => posts.filter((post) => post.kind !== "message") });
}

const fetchVisits = async (): Promise<Visit[]> => (await invokeGuestbook()).posts;

export function useVisitorMessages() {
  return useQuery<Visit[], Error, Visit[]>({ queryKey: ["visitor-posts"], queryFn: fetchVisits, refetchInterval: 30000, select: (posts) => posts.filter((post) => post.kind === "message") });
}

const ownedKey = "henrietta-owned-messages";

export function loadOwnedMessages(): Record<string, string> {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(ownedKey) ?? "{}");
    if (!parsed || typeof parsed !== "object") return {};
    return Object.fromEntries(Object.entries(parsed).filter((entry): entry is [string, string] => typeof entry[1] === "string"));
  } catch {
    return {};
  }
}

function saveOwnedMessages(owned: Record<string, string>) {
  try { localStorage.setItem(ownedKey, JSON.stringify(owned)); } catch { /* storage unavailable */ }
}

export async function sendVisitorMessage(name: string, message: string) {
  const result = await invokeGuestbook({ name, message, consent: true, kind: "message" });
  if (result?.id && result?.deleteToken) saveOwnedMessages({ ...loadOwnedMessages(), [result.id]: result.deleteToken });
  return result;
}

export async function deleteVisitorMessage(id: string) {
  const owned = loadOwnedMessages();
  const token = owned[id];
  if (!token) throw new Error("Not owner");
  await invokeGuestbook({ action: "delete", id, token });
  delete owned[id];
  saveOwnedMessages(owned);
}

async function preparePhoto(file: File): Promise<string> {
  if (!file.type.startsWith("image/") || file.size > 15 * 1024 * 1024) throw new Error("Invalid photo");
  const bitmap = await createImageBitmap(file);
  const ratio = Math.min(1, 1200 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * ratio);
  canvas.height = Math.round(bitmap.height * ratio);
  const ctx = canvas.getContext("2d");
  if (!ctx) { bitmap.close(); throw new Error("Photo unavailable"); }
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas.toDataURL("image/jpeg", 0.8);
}

function ReportDialog({ id, onClose }: { id: string | null; onClose: () => void }) {
  const [reason, setReason] = useState("Inappropriate content");
  const [busy, setBusy] = useState(false);
  return (
    <Dialog open={id !== null} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent><DialogTitle>Report this visit</DialogTitle>
        <div className="visitor-report">
          <label className="visitor-field">Reason<select value={reason} onChange={(event) => setReason(event.target.value)}>{["Inappropriate content", "Spam", "Privacy concern"].map((option) => <option key={option}>{option}</option>)}</select></label>
          <Button disabled={busy} onClick={async () => { if (!id) return; setBusy(true); try { await invokeGuestbook({ action: "report", id, reason }); onClose(); toast.success("Report received. Thank you."); } catch (error) { toast.error(friendlyError(error, "Your report couldn't be sent. Please try again shortly.")); } finally { setBusy(false); } }}>Send report</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function CameraApp({ onOpen }: { onOpen?: (id: "photos") => void }) {
  const client = useQueryClient();
  const { data: posts = [] } = useVisitorPosts();
  const lastPhoto = posts.find((post) => post.photo_url)?.photo_url ?? wallpapers[0];
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facing, setFacing] = useState<"user" | "environment">("user");
  const [photo, setPhoto] = useState<string>();
  const [flash, setFlash] = useState(false);
  const [name, setName] = useState("");
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [starting, setStarting] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  useEffect(() => {
    if (stream && video.current) video.current.srcObject = stream;
    return () => stream?.getTracks().forEach((track) => track.stop());
  }, [stream]);
  const stop = () => { stream?.getTracks().forEach((track) => track.stop()); setStream(null); };
  const start = async (mode = facing) => {
    if (starting) return;
    setStarting(true);
    try {
      const next = await navigator.mediaDevices.getUserMedia({ video: { facingMode: mode }, audio: false });
      if (!mounted.current) { next.getTracks().forEach((track) => track.stop()); return; }
      setStream(next);
    } catch (error) { toast.error(friendlyError(error, "Camera unavailable. You can choose a photo instead.")); }
    finally { if (mounted.current) setStarting(false); }
  };
  const shutter = () => {
    const source = video.current;
    if (!stream || !source?.videoWidth) { start(); return; }
    const canvas = document.createElement("canvas");
    const ratio = Math.min(1, 1200 / Math.max(source.videoWidth, source.videoHeight));
    canvas.width = Math.round(source.videoWidth * ratio);
    canvas.height = Math.round(source.videoHeight * ratio);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (facing === "user") { ctx.translate(canvas.width, 0); ctx.scale(-1, 1); }
    ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
    setFlash(true);
    window.setTimeout(() => setFlash(false), 180);
    setPhoto(canvas.toDataURL("image/jpeg", 0.8));
    stop();
  };
  const flip = () => { const next = facing === "user" ? "environment" : "user"; setFacing(next); if (stream) { stop(); start(next); } };
  const post = async (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = nameSchema.safeParse(name);
    if (!parsed.success || !consent || !photo) { toast.error("Add your name and permission to share publicly."); return; }
    setBusy(true);
    try {
      await invokeGuestbook({ name: parsed.data, consent: true, photo });
      setPhoto(undefined); setConsent(false);
      await client.invalidateQueries({ queryKey: ["visitor-posts"] });
      toast.success("Your photo is now in Photos.");
      onOpen?.("photos");
    } catch (error) { toast.error(friendlyError(error, "Your photo couldn't be posted. Wait a minute if you just posted.")); }
    finally { setBusy(false); }
  };

  return (
    <div className="cam-app">
      <div className="cam-top"><span /><span className="cam-top-dot" /><Button variant="ghost" size="icon" className="cam-round" aria-label="Choose from your photos" title="Choose photo" onClick={() => fileInput.current?.click()}><ImageIcon /></Button></div>
      <div className="cam-view">
        {photo ? <img src={photo} alt="Your photo" /> : stream ? <video ref={video} autoPlay playsInline muted aria-label="Camera preview" className={facing === "user" ? "is-mirror" : ""} /> : (
          <Button variant="ghost" type="button" className="cam-allow" onClick={() => start()} disabled={starting}>{starting ? "Starting camera..." : "Turn on camera"}</Button>
        )}
        {flash && <span className="cam-flash" />}
      </div>
      {photo ? (
        <form className="cam-review" onSubmit={post}>
          <input value={name} onChange={(event) => setName(event.target.value)} maxLength={40} placeholder="Your name" aria-label="Your name" autoComplete="nickname" />
          <label className="cam-consent"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} /><span>Share my name and photo publicly. Everyone in it agreed.</span></label>
          <div className="cam-review-actions"><Button type="button" variant="ghost" onClick={() => { setPhoto(undefined); start(); }}>Retake</Button><Button type="submit" disabled={busy}>{busy ? "Posting..." : "Use Photo"}</Button></div>
        </form>
      ) : (
        <>
          <div className="cam-modes"><span className="on">PHOTO</span></div>
          <div className="cam-bar">
            <Button variant="ghost" size="icon" type="button" className="cam-thumb" aria-label="Open Photos" onClick={() => onOpen?.("photos")}><img src={lastPhoto} alt="" /></Button>
            <Button variant="ghost" size="icon" type="button" className="cam-shutter" aria-label="Take photo" onClick={shutter}><span /></Button>
            <Button variant="ghost" size="icon" className="cam-round cam-flip" aria-label="Switch camera" onClick={flip}><SwitchCamera /></Button>
          </div>
        </>
      )}
      <input ref={fileInput} type="file" accept="image/*" className="hidden" onChange={async (event) => { const input = event.currentTarget; const file = input.files?.[0]; if (!file) return; try { const result = await preparePhoto(file); stop(); setPhoto(result); } catch (error) { toast.error(friendlyError(error, "Choose a photo under 15 MB that your browser can open.")); } input.value = ""; }} />
    </div>
  );
}

interface Shot { id: string; src: string; date?: string; by?: string; visitId?: string }

export function PhotosApp({ compact = false }: { compact?: boolean }) {
  const { data: posts = [], isLoading, isError, refetch } = useVisitorPosts();
  const [tab, setTab] = useState("library");
  const [query, setQuery] = useState("");
  const [info, setInfo] = useState(false);
  const [album, setAlbum] = useState<"all" | "henrietta" | "visitors">("all");
  const [index, setIndex] = useState<number | null>(null);
  const [reportId, setReportId] = useState<string | null>(null);
  const visitors: Shot[] = posts.flatMap((post) => post.photo_url ? [{ id: post.id, src: post.photo_url, date: post.created_at, by: post.display_name, visitId: post.id }] : []);
  const mine: Shot[] = wallpapers.map((src, i) => ({ id: `h-${i}`, src, by: "Henrietta" }));
  const shots = (album === "henrietta" ? mine : album === "visitors" ? visitors : [...visitors, ...mine]).filter((shot) => `${shot.by ?? ""} ${shot.date ?? ""}`.toLowerCase().includes(query.toLowerCase()));
  const current = index === null ? null : shots[index];
  const title = album === "henrietta" ? "Henrietta" : album === "visitors" ? "Visitors" : "Library";
  const albums = [{ id: "henrietta" as const, name: "Henrietta", items: mine }, { id: "visitors" as const, name: "Visitors", items: visitors }];

  return (
    <AppleSections compact={compact} title="Photos" sections={[{ id: "library", label: "Library", icon: ImageIcon }, { id: "albums", label: compact ? "Collections" : "Albums", icon: LayoutGrid }, { id: "search", label: "Search", icon: Search }]} selected={tab} onSelect={(id) => { setTab(id); setAlbum("all"); setQuery(""); }}>
    <div className={`ph-app ${compact ? "ph-phone" : "ph-mac"}`}>
      <header className="ph-head">
        {album !== "all" && <Button variant="ghost" size="icon" aria-label="Back to albums" onClick={() => { setAlbum("all"); setTab("albums"); }}><ChevronLeft /></Button>}
        <h2>{tab === "albums" && album === "all" ? compact ? "Collections" : "Albums" : tab === "search" ? "Search" : title}</h2>
        <span className="ph-profile">H</span>
      </header>
      {tab === "search" && <div className="ph-search"><AppleSearch value={query} onChange={setQuery} label="Search photos" /></div>}
      <div className="ph-body">
        {tab === "albums" && album === "all" ? (
          <div className="ph-albums">{albums.map((item) => (
            <Button variant="ghost" key={item.id} type="button" className="ph-album" onClick={() => { setAlbum(item.id); setTab("library"); }}>
              <span className="ph-album-cover">{item.items[0] ? <img src={item.items[0].src} alt="" loading="lazy" referrerPolicy="no-referrer" /> : <ImageIcon />}</span>
              <strong>{item.name}</strong><small>{item.items.length}</small>
            </Button>
          ))}</div>
        ) : (
          <>
            {isError && album !== "henrietta" && <p className="ph-note">Visitor photos couldn't load. <button type="button" onClick={() => refetch()}><RefreshCw className="inline h-3 w-3" /> Try again</button></p>}
            {isLoading && album !== "henrietta" && <p className="ph-note">Loading visitor photos...</p>}
            <div className="ph-grid">{shots.map((shot, i) => (
              <Button variant="ghost" key={shot.id} type="button" className="ph-tile" aria-label={`Open photo by ${shot.by}`} onClick={() => { setIndex(i); setInfo(false); }}><img src={shot.src} alt="" loading="lazy" referrerPolicy="no-referrer" /></Button>
            ))}</div>
            <p className="ph-count">{shots.length} Photos</p>
          </>
        )}
      </div>
      <Dialog open={current !== null} onOpenChange={(open) => { if (!open) setIndex(null); }}>
        <DialogContent className="ph-viewer"><DialogTitle className="sr-only">Photo</DialogTitle>
          {current && index !== null && <>
            <header className="ph-viewer-head"><strong>{current.by}</strong>{current.date && <time dateTime={current.date}>{format(new Date(current.date), "d MMMM yyyy")}</time>}</header>
            <img className="ph-full" src={current.src} alt={`Photo by ${current.by}`} referrerPolicy="no-referrer" />
            {info && <p className="ph-photo-info">{current.by}{current.date && ` · ${format(new Date(current.date), "d MMMM yyyy")}`}</p>}
            <footer className="ph-viewer-bar">
              <Button variant="ghost" size="icon" disabled={index <= 0} aria-label="Previous photo" onClick={() => setIndex(index - 1)}><ChevronLeft /></Button>
              <Button variant="ghost" size="icon" aria-label="Photo information" onClick={() => setInfo((value) => !value)}><Info /></Button>
              {current.visitId ? <Button variant="ghost" size="icon" aria-label="Report photo" onClick={() => { setReportId(current.visitId ?? null); setIndex(null); }}><Flag /></Button> : <span />}
              <Button variant="ghost" size="icon" disabled={index >= shots.length - 1} aria-label="Next photo" onClick={() => setIndex(index + 1)}><ChevronRight /></Button>
            </footer>
          </>}
        </DialogContent>
      </Dialog>
      <ReportDialog id={reportId} onClose={() => setReportId(null)} />
    </div>
    </AppleSections>
  );
}

export function ShoutOutComposer({ onClose }: { onClose: () => void }) {
  const client = useQueryClient();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = shoutSchema.safeParse({ name, message, consent });
    if (!parsed.success) { toast.error("Add your name, a shout-out and permission to share publicly."); return; }
    setBusy(true);
    try {
      await invokeGuestbook(parsed.data);
      await client.invalidateQueries({ queryKey: ["visitor-posts"] });
      toast.success("Shout-out posted.");
      onClose();
    } catch (error) { toast.error(friendlyError(error, "Your shout-out couldn't be posted. Wait a minute if you just posted.")); }
    finally { setBusy(false); }
  };
  return (
    <form className="shout-form" onSubmit={submit}>
      <div className="shout-form-head"><strong>Leave a shout-out</strong><Button type="button" variant="ghost" size="icon" aria-label="Close" onClick={onClose}><X /></Button></div>
      <input value={name} onChange={(event) => setName(event.target.value)} maxLength={40} placeholder="Your name" aria-label="Your name" autoComplete="nickname" />
      <textarea value={message} onChange={(event) => setMessage(event.target.value)} maxLength={240} rows={2} placeholder="Henrietta was hia" aria-label="Your shout-out" />
      <label className="cam-consent"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} /><span>Show my name and shout-out to everyone.</span></label>
      <Button type="submit" disabled={busy}>{busy ? "Posting..." : "Post"}</Button>
    </form>
  );
}

export { ReportDialog };

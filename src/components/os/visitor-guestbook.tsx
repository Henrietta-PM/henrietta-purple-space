import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Camera, Circle, Flag, ImagePlus, Plus, RefreshCw, X } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { friendlyError } from "@/lib/friendly-error";
import "./visitor-guestbook.css";

interface Visit { id: string; display_name: string; message: string; photo_url: string | null; created_at: string }
const visitSchema = z.object({ name: z.string().trim().min(1).max(40), message: z.string().trim().min(1).max(240), consent: z.literal(true) });

async function invokeGuestbook(body?: unknown) {
  const { data, error } = await supabase.functions.invoke("visitor-guestbook", { method: body ? "POST" : "GET", ...(body ? { body } : {}) });
  if (error) throw error;
  return data;
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

export default function VisitorGuestbook({ mode, onOpen }: { mode: "camera" | "photos"; onOpen?: (id: "camera" | "photos") => void }) {
  const client = useQueryClient();
  const [photo, setPhoto] = useState<string>();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [cameraBusy, setCameraBusy] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [reportId, setReportId] = useState<string | null>(null);
  const [reason, setReason] = useState("Inappropriate content");
  const video = useRef<HTMLVideoElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  useEffect(() => {
    if (stream && video.current) video.current.srcObject = stream;
    return () => stream?.getTracks().forEach((track) => track.stop());
  }, [stream]);
  const stopCamera = () => { stream?.getTracks().forEach((track) => track.stop()); setStream(null); };
  const { data: posts = [], isLoading, isError, refetch } = useQuery<Visit[]>({ queryKey: ["visitor-posts"], queryFn: async () => (await invokeGuestbook()).posts, enabled: mode === "photos", refetchInterval: 30000 });

  const startCamera = async () => {
    if (cameraBusy) return;
    setCameraBusy(true);
    try {
      const next = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      if (!mounted.current) { next.getTracks().forEach((track) => track.stop()); return; }
      setPhoto(undefined);
      setStream(next);
    } catch (error) { toast.error(friendlyError(error, "Camera unavailable. You can choose a photo instead.")); }
    finally { if (mounted.current) setCameraBusy(false); }
  };
  const capture = () => {
    const source = video.current;
    if (!source || !source.videoWidth) return;
    const canvas = document.createElement("canvas");
    const ratio = Math.min(1, 1200 / Math.max(source.videoWidth, source.videoHeight));
    canvas.width = Math.round(source.videoWidth * ratio);
    canvas.height = Math.round(source.videoHeight * ratio);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
    setPhoto(canvas.toDataURL("image/jpeg", 0.8));
    stopCamera();
  };
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = visitSchema.safeParse({ name, message, consent });
    if (!parsed.success) { toast.error("Add your name, a shout-out and permission to share publicly."); return; }
    setBusy(true);
    try {
      await invokeGuestbook({ ...parsed.data, photo });
      stopCamera();
      setPhoto(undefined); setMessage(""); setConsent(false);
      await client.invalidateQueries({ queryKey: ["visitor-posts"] });
      toast.success("Your visit is now in Photos.");
      onOpen?.("photos");
    } catch (error) { toast.error(friendlyError(error, "Your visit couldn't be posted. Please try again shortly. Wait a minute if you just posted.")); }
    finally { setBusy(false); }
  };
  return (
    <div className="visitor-app">
      <header className="visitor-toolbar"><h2>{mode === "camera" ? "Camera" : "Photos"}</h2><Button variant="ghost" size="icon" aria-label={mode === "photos" ? "Leave a shout-out" : "Open visitor photos"} title={mode === "photos" ? "Leave a shout-out" : "Visitor photos"} onClick={() => onOpen?.(mode === "photos" ? "camera" : "photos")}>{mode === "photos" ? <Plus /> : <ImagePlus />}</Button></header>
      {mode === "camera" ? <>
        <div className="visitor-preview">{stream ? <video ref={video} autoPlay playsInline muted aria-label="Camera preview" /> : photo ? <img src={photo} alt="Your photo preview" /> : <Camera className="h-12 w-12 text-muted-foreground" />}</div>
        <div className="visitor-tools">
          {stream ? <><Button variant="ghost" size="icon" onClick={capture} aria-label="Take photo" title="Take photo"><Circle /></Button><Button variant="ghost" size="icon" onClick={stopCamera} aria-label="Stop camera" title="Stop camera"><X /></Button></> : <Button variant="ghost" size="icon" onClick={startCamera} disabled={cameraBusy} aria-label="Start camera" title="Start camera"><Camera /></Button>}
          <Button variant="ghost" size="icon" onClick={() => fileInput.current?.click()} aria-label="Choose photo" title="Choose photo"><ImagePlus /></Button>
          {photo && <Button variant="ghost" size="icon" onClick={() => setPhoto(undefined)} aria-label="Remove photo" title="Remove photo"><X /></Button>}
          <input ref={fileInput} type="file" accept="image/*" className="hidden" onChange={async (event) => { const input = event.currentTarget; const file = input.files?.[0]; if (!file) return; try { const result = await preparePhoto(file); stopCamera(); setPhoto(result); } catch (error) { toast.error(friendlyError(error, "Choose a photo under 15 MB that your browser can open.")); } input.value = ""; }} />
        </div>
        <form className="visitor-form" onSubmit={submit}>
          <label className="visitor-field">Your name<input value={name} onChange={(event) => setName(event.target.value)} maxLength={40} required autoComplete="nickname" /></label>
          <label className="visitor-field">Your shout-out<textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Henrietta was hia" maxLength={240} required rows={3} /></label>
          <label className="visitor-consent"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} required /><span>I agree to publish my name, shout-out and optional photo for everyone to see. I have permission from anyone in my photo.</span></label>
          <Button type="submit" disabled={busy}>{busy ? "Posting..." : "Post my visit"}</Button>
        </form>
      </> : <>
        {isLoading && <p className="visitor-empty">Loading visits...</p>}
        {isError && <div className="visitor-empty"><p>Visits couldn't load.</p><Button variant="ghost" onClick={() => refetch()}><RefreshCw /> Try again</Button></div>}
        {!isLoading && !isError && !posts.length && <div className="visitor-empty"><p>No visits yet.</p><Button variant="ghost" onClick={() => onOpen?.("camera")}><Plus /> Leave the first shout-out</Button></div>}
        <div className="visitor-grid">{posts.map((post) => <article className="visitor-post" key={post.id}>{post.photo_url && <img src={post.photo_url} alt={`Photo shared by ${post.display_name}`} loading="lazy" referrerPolicy="no-referrer" />}<div className="visitor-post-body"><strong>{post.display_name}</strong><p>{post.message}</p><div className="visitor-post-footer"><time dateTime={post.created_at}>{format(new Date(post.created_at), "d MMM yyyy")}</time><Button variant="ghost" size="icon" aria-label={`Report visit by ${post.display_name}`} title="Report visit" onClick={() => setReportId(post.id)}><Flag /></Button></div></div></article>)}</div>
      </>}
      <Dialog open={reportId !== null} onOpenChange={(open) => { if (!open) setReportId(null); }}><DialogContent><DialogTitle>Report this visit</DialogTitle><div className="visitor-report"><label className="visitor-field">Reason<select value={reason} onChange={(event) => setReason(event.target.value)}>{["Inappropriate content", "Spam", "Privacy concern"].map((option) => <option key={option}>{option}</option>)}</select></label><Button disabled={busy} onClick={async () => { if (!reportId) return; setBusy(true); try { await invokeGuestbook({ action: "report", id: reportId, reason }); setReportId(null); toast.success("Report received. Thank you."); } catch (error) { toast.error(friendlyError(error, "Your report couldn't be sent. Please try again shortly.")); } finally { setBusy(false); } }}>Send report</Button></div></DialogContent></Dialog>
    </div>
  );
}
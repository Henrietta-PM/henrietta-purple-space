import { useState } from "react";
import { ArrowUp, ChevronLeft, ChevronRight, Inbox, PenSquare, Send, FileText, Trash2, Loader2, X, Reply, Folder, Archive, Search } from "lucide-react";
import { FunctionsHttpError } from "@supabase/supabase-js";
import { format, isToday } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { friendlyError, RateLimitError } from "@/lib/friendly-error";
import "./mail-app.css";

const ownerEmail = "mypvrplespace@gmail.com";
const ownerName = "Henrietta Onwuneme";
const storageKey = "portfolio-mail-v1";
interface Draft { name: string; email: string; subject: string; message: string }
interface SentMail extends Draft { id: string; sentAt: string }
interface MailStore { draft: Draft; sent: SentMail[] }
type FolderId = "inbox" | "drafts" | "sent" | "trash";
const emptyDraft: Draft = { name: "", email: "", subject: "", message: "" };

function loadMail(): MailStore {
  try {
    const value = JSON.parse(localStorage.getItem(storageKey) || "null");
    const validDraft = (draft: unknown): draft is Draft => {
      if (!draft || typeof draft !== "object") return false;
      const fields = draft as Record<string, unknown>;
      return ["name", "email", "subject", "message"].every((key) => typeof fields[key] === "string") && String(fields.message).length <= 3000;
    };
    return { draft: validDraft(value?.draft) ? value.draft : emptyDraft, sent: Array.isArray(value?.sent) ? value.sent.filter((mail: unknown) => {
      if (!validDraft(mail)) return false;
      const sent = mail as SentMail;
      return typeof sent.id === "string" && typeof sent.sentAt === "string" && Number.isFinite(Date.parse(sent.sentAt));
    }).slice(0, 50) : [] };
  } catch { return { draft: emptyDraft, sent: [] }; }
}

const mailTime = (iso: string) => { const date = new Date(iso); return isToday(date) ? format(date, "HH:mm") : format(date, "dd/MM/yyyy"); };
const initials = (name: string) => name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("") || "HO";

export default function MailApp({ compact = false, initialCompose = false, onCancel }: { compact?: boolean; initialCompose?: boolean; onCancel?: () => void }) {
  const [store, setStore] = useState(loadMail);
  const [folder, setFolder] = useState<FolderId>("sent");
  const [mailboxes, setMailboxes] = useState(compact && !initialCompose);
  const [composing, setComposing] = useState(initialCompose);
  const [selected, setSelected] = useState<SentMail | null>(null);
  const [query, setQuery] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [website, setWebsite] = useState("");
  const save = (next: MailStore) => {
    setStore(next);
    try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch { /* Mail still works without local storage. */ }
  };
  const updateDraft = (key: keyof Draft, value: string) => save({ ...store, draft: { ...store.draft, [key]: value } });
  const draftExists = Boolean(store.draft.subject || store.draft.message);
  const folders: { id: FolderId; label: string; icon: typeof Inbox; count: number }[] = [
    { id: "inbox", label: "Inbox", icon: Inbox, count: 0 },
    { id: "drafts", label: "Drafts", icon: FileText, count: draftExists ? 1 : 0 },
    { id: "sent", label: "Sent", icon: Send, count: 0 },
    { id: "trash", label: "Bin", icon: Trash2, count: 0 },
  ];
  const folderLabel = folders.find((item) => item.id === folder)?.label ?? "Sent";
  const openFolder = (id: FolderId) => { setFolder(id); setMailboxes(false); setComposing(false); setSelected(null); setQuery(""); };
  const compose = () => { setComposing(true); setMailboxes(false); setError(""); };
  const cancel = () => { if (sending) return; setComposing(false); setError(""); onCancel?.(); };
  const removeSelected = () => { if (!selected) return; save({ ...store, sent: store.sent.filter((mail) => mail.id !== selected.id) }); setSelected(null); };
  const sendMail = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending) return;
    setSending(true); setError("");
    try {
      const { data, error: sendError } = await supabase.functions.invoke("send-contact-email", { body: { ...store.draft, website } });
      if (sendError) {
        if (sendError instanceof FunctionsHttpError && sendError.context.status === 429) throw new RateLimitError();
        throw sendError;
      }
      if (!data?.success) throw new Error("send_failed");
      const sent: SentMail = { ...store.draft, id: crypto.randomUUID(), sentAt: new Date().toISOString() };
      save({ draft: { ...emptyDraft, name: store.draft.name, email: store.draft.email }, sent: [sent, ...store.sent].slice(0, 50) });
      setComposing(false); setFolder("sent"); setSelected(compact ? null : sent);
      toast.success("Your email has been sent to Henrietta.");
    } catch (sendError) { setError(friendlyError(sendError, "Your email couldn't be sent. Your draft is saved. Please try again shortly.")); }
    finally { setSending(false); }
  };

  const q = query.toLowerCase();
  const visibleSent = folder === "sent" ? store.sent.filter((mail) => `${mail.subject} ${mail.message}`.toLowerCase().includes(q)) : [];
  const showDraft = folder === "drafts" && draftExists && (!q || `${store.draft.subject} ${store.draft.message}`.toLowerCase().includes(q));
  const listCount = folder === "sent" ? store.sent.length : folder === "drafts" ? (draftExists ? 1 : 0) : 0;
  const countLabel = `${listCount} ${listCount === 1 ? "message" : "messages"}`;

  const composeSheet = <form className="mail-compose" onSubmit={sendMail}>
    <header className="mail-compose-bar">
      <Button variant="ghost" className="mail-circle" onClick={cancel} disabled={sending} aria-label="Cancel" title="Cancel"><X /></Button>
      <strong>{store.draft.subject || "New Message"}</strong>
      <Button type="submit" className="mail-circle mail-send" title="Send" aria-label="Send email" disabled={sending}>{sending ? <Loader2 className="animate-spin" /> : <ArrowUp />}</Button>
    </header>
    <div className="mail-form-scroll">
      <div className="mail-field"><span>To:</span><b className="mail-token">{ownerName}</b></div>
      <div className="mail-field"><span>Cc/Bcc, From:</span><input required type="email" autoComplete="email" aria-label="Your email" placeholder="you@example.com" maxLength={254} value={store.draft.email} onChange={(event) => updateDraft("email", event.target.value)} disabled={sending} /></div>
      <label className="mail-field"><span>Name:</span><input required autoComplete="name" aria-label="Your name" maxLength={80} value={store.draft.name} onChange={(event) => updateDraft("name", event.target.value)} disabled={sending} /></label>
      <label className="mail-field"><span>Subject:</span><input required aria-label="Subject" maxLength={150} value={store.draft.subject} onChange={(event) => updateDraft("subject", event.target.value)} disabled={sending} /></label>
      <label className="mail-honeypot" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} /></label>
      <textarea className="mail-body" required aria-label="Email message" maxLength={3000} value={store.draft.message} onChange={(event) => updateDraft("message", event.target.value)} disabled={sending} />
      {error && <p className="mail-error" role="alert">{error}</p>}
    </div>
  </form>;

  const list = <div className="mail-list">
    {showDraft && <Button variant="ghost" className="mail-row" onClick={compose}>
      <span className="mail-dot" aria-hidden="true" />
      <div className="mail-row-content"><div className="mail-row-top"><strong className="mail-draft-label">Draft</strong><span className="mail-row-meta"><ChevronRight /></span></div><b>{store.draft.subject || "No Subject"}</b><span className="mail-row-preview">{store.draft.message || "No content"}</span></div>
    </Button>}
    {visibleSent.map((mail) => <Button key={mail.id} variant="ghost" className={`mail-row ${selected?.id === mail.id ? "active" : ""}`} onClick={() => setSelected(mail)}>
      <span className="mail-dot" aria-hidden="true" />
      <div className="mail-row-content"><div className="mail-row-top"><strong>{ownerName}</strong><span className="mail-row-meta"><time>{mailTime(mail.sentAt)}</time>{compact && <ChevronRight />}</span></div><b>{mail.subject}</b><span className="mail-row-preview">{mail.message}</span></div>
    </Button>)}
    {!showDraft && !visibleSent.length && <div className="mail-empty"><h3>{query ? "No Results" : folder === "drafts" ? "No Drafts" : "No Mail"}</h3></div>}
  </div>;

  const reader = (mail: SentMail) => <article className="mail-reader">
    <header className="mail-reader-head">
      <span className="mail-avatar" aria-hidden="true">{initials(mail.name)}</span>
      <div className="mail-reader-who"><div className="mail-row-top"><strong>{mail.name}</strong><time>{mailTime(mail.sentAt)}</time></div><span>To: {ownerName}</span></div>
    </header>
    <h2>{mail.subject}</h2>
    <p className="mail-reader-body">{mail.message}</p>
    <p className="mail-reader-meta">Sent to {ownerEmail} on {format(new Date(mail.sentAt), "d MMMM yyyy 'at' HH:mm")}</p>
  </article>;

  if (initialCompose) return <div className="mail-app mail-sheet-only">{composeSheet}</div>;

  if (compact) return <div className="mail-app mail-phone">
    {composing && <div className="mail-sheet-layer"><div className="mail-sheet">{composeSheet}</div></div>}
    {mailboxes ? <>
      <header className="mail-nav"><span /><Button variant="ghost" className="mail-pill">Edit</Button></header>
      <div className="mail-scroll">
        <h1 className="mail-large-title">Mailboxes</h1>
        <h4 className="mail-section">Portfolio</h4>
        <div className="mail-group">{folders.map(({ id, label, icon: Icon, count }) => <Button key={id} variant="ghost" className="mail-group-row" onClick={() => openFolder(id)}><Icon /><b>{label}</b>{count > 0 && <span>{count}</span>}<ChevronRight className="mail-chev" /></Button>)}</div>
      </div>
      <footer className="mail-bottom"><span className="mail-status">Updated Just Now</span><Button variant="ghost" className="mail-circle mail-glass" onClick={compose} aria-label="Compose email" title="Compose"><PenSquare /></Button></footer>
    </> : selected ? <>
      <header className="mail-nav"><Button variant="ghost" className="mail-circle mail-glass" onClick={() => setSelected(null)} aria-label="Back to mailbox" title="Back"><ChevronLeft /></Button></header>
      <div className="mail-scroll">{reader(selected)}</div>
      <footer className="mail-bottom mail-reader-bar"><div className="mail-glass-pill"><Button variant="ghost" className="mail-circle" onClick={removeSelected} aria-label="Remove local copy" title="Bin"><Trash2 /></Button><Button variant="ghost" className="mail-circle" aria-label="Move" title="Move" disabled><Folder /></Button><Button variant="ghost" className="mail-circle" onClick={compose} aria-label="Reply" title="Reply"><Reply /></Button></div><Button variant="ghost" className="mail-circle mail-glass" onClick={compose} aria-label="Compose email" title="Compose"><PenSquare /></Button></footer>
    </> : <>
      <header className="mail-nav"><Button variant="ghost" className="mail-circle mail-glass" onClick={() => setMailboxes(true)} aria-label="Mailboxes" title="Mailboxes"><ChevronLeft /></Button><Button variant="ghost" className="mail-pill">Edit</Button></header>
      <div className="mail-scroll"><h1 className="mail-large-title">{folderLabel}</h1>{list}</div>
      <footer className="mail-bottom"><label className="mail-search-pill"><Search aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" aria-label="Search mail" /></label><Button variant="ghost" className="mail-circle mail-glass" onClick={compose} aria-label="Compose email" title="Compose"><PenSquare /></Button></footer>
    </>}
  </div>;

  return <div className="mail-app mail-mac">
    {composing && <div className="mail-sheet-layer"><div className="mail-sheet">{composeSheet}</div></div>}
    <aside className="mail-sidebar">
      <h4>Favourites</h4>
      {folders.map(({ id, label, icon: Icon, count }) => <Button key={id} variant="ghost" className={`mail-side-row ${folder === id ? "active" : ""}`} onClick={() => openFolder(id)}><Icon /><b>{label}</b>{count > 0 && <span>{count}</span>}</Button>)}
    </aside>
    <section className="mail-column">
      <header className="mail-column-head"><div><strong>{folderLabel}</strong><span>{countLabel}</span></div><Button variant="ghost" className="mail-circle" onClick={compose} aria-label="Compose email" title="Compose"><PenSquare /></Button></header>
      <label className="mail-search-pill mail-mac-search"><Search aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" aria-label="Search mail" /></label>
      {list}
    </section>
    <section className="mail-preview">
      <header className="mail-preview-bar"><Button variant="ghost" className="mail-circle" aria-label="Archive" title="Archive" disabled><Archive /></Button><Button variant="ghost" className="mail-circle" onClick={removeSelected} disabled={!selected} aria-label="Remove local copy" title="Bin"><Trash2 /></Button><Button variant="ghost" className="mail-circle" onClick={compose} disabled={!selected} aria-label="Reply" title="Reply"><Reply /></Button></header>
      {selected ? <div className="mail-scroll">{reader(selected)}</div> : <div className="mail-empty"><h3>No Message Selected</h3></div>}
    </section>
  </div>;
}

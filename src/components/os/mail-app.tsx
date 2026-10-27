import { useState } from "react";
import { ArrowUp, ChevronLeft, ChevronRight, Inbox, Mail, PenSquare, Send, FileText, Trash2, Loader2 } from "lucide-react";
import { FunctionsHttpError } from "@supabase/supabase-js";
import { format } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { friendlyError, RateLimitError } from "@/lib/friendly-error";
import { AppleSearch } from "./apple-app-chrome";
import "./mail-app.css";

const ownerEmail = "mypvrplespace@gmail.com";
const storageKey = "portfolio-mail-v1";
interface Draft { name: string; email: string; subject: string; message: string }
interface SentMail extends Draft { id: string; sentAt: string }
interface MailStore { draft: Draft; sent: SentMail[] }
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

export default function MailApp({ compact = false, initialCompose = false, onCancel }: { compact?: boolean; initialCompose?: boolean; onCancel?: () => void }) {
  const [store, setStore] = useState(loadMail);
  const [folder, setFolder] = useState("sent");
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
  const folders = [{ id: "sent", label: "Sent", icon: Send, count: store.sent.length }, { id: "drafts", label: "Drafts", icon: FileText, count: draftExists ? 1 : 0 }];
  const openFolder = (id: string) => { setFolder(id); setMailboxes(false); setComposing(false); setSelected(null); setQuery(""); };
  const compose = () => { setComposing(true); setMailboxes(false); setSelected(null); setError(""); };
  const cancel = () => { if (sending) return; setComposing(false); setError(""); onCancel?.(); };
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
      setComposing(false); setFolder("sent"); setSelected(sent);
      toast.success("Your email has been sent to Henrietta.");
    } catch (sendError) { setError(friendlyError(sendError, "Your email couldn't be sent. Your draft is saved. Please try again shortly.")); }
    finally { setSending(false); }
  };
  const matching = store.sent.filter((mail) => `${mail.subject} ${mail.message}`.toLowerCase().includes(query.toLowerCase()));
  return <div className={`mail-app apple-app-layout ${compact ? "mail-phone" : "mail-mac"}`}>
    {!compact && !initialCompose && <aside className="mail-sidebar"><h2>Mailboxes</h2>{folders.map(({ id, label, icon: Icon, count }) => <Button key={id} variant="ghost" className={`mail-folder ${folder === id ? "active" : ""}`} onClick={() => openFolder(id)}><Icon /><b>{label}</b>{count > 0 && <span>{count}</span>}</Button>)}</aside>}
    <div className="mail-main">
      {composing ? <form className="mail-compose" onSubmit={sendMail}>
        <header className="mail-toolbar"><Button variant="ghost" className="mail-cancel" onClick={cancel} disabled={sending}>Cancel</Button><strong>New Message</strong><Button type="submit" className="mail-tool mail-send" title="Send email" aria-label="Send email" disabled={sending}>{sending ? <Loader2 className="animate-spin" /> : <ArrowUp />}</Button></header>
        <div className="mail-form-scroll">
          <div className="mail-field"><span>To:</span><b className="mail-recipient">Henrietta Onwuneme</b></div>
          <label className="mail-field"><span>Name:</span><input required autoComplete="name" aria-label="Your name" maxLength={80} value={store.draft.name} onChange={(event) => updateDraft("name", event.target.value)} disabled={sending} /></label>
          <label className="mail-field"><span>From:</span><input required type="email" autoComplete="email" aria-label="Your email" maxLength={254} value={store.draft.email} onChange={(event) => updateDraft("email", event.target.value)} disabled={sending} /></label>
          <label className="mail-field"><span>Subject:</span><input required aria-label="Subject" maxLength={150} value={store.draft.subject} onChange={(event) => updateDraft("subject", event.target.value)} disabled={sending} /></label>
          <label className="mail-honeypot" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} /></label>
          <textarea className="mail-body" required aria-label="Email message" placeholder="Hi Henrietta," maxLength={3000} value={store.draft.message} onChange={(event) => updateDraft("message", event.target.value)} disabled={sending} />
          {error && <p className="mail-error" role="alert">{error}</p>}
        </div>
      </form> : <>
        <header className="mail-toolbar"><div>{compact && !mailboxes && <Button variant="ghost" className="mail-tool" title={selected ? "Back to mailbox" : "Mailboxes"} aria-label={selected ? "Back to mailbox" : "Mailboxes"} onClick={() => selected ? setSelected(null) : setMailboxes(true)}><ChevronLeft /></Button>}{!compact && <strong>{selected ? selected.subject : folder === "drafts" ? "Drafts" : "Sent"}</strong>}</div><Button variant="ghost" className="mail-tool" title="Compose email" aria-label="Compose email" onClick={compose}><PenSquare /></Button></header>
        {compact && <h1 className="mail-heading">{mailboxes ? "Mailboxes" : selected ? "" : folder === "drafts" ? "Drafts" : "Sent"}</h1>}
        {mailboxes ? <div className="mail-content">{folders.map(({ id, label, icon: Icon, count }) => <Button key={id} variant="ghost" className="mail-folder" onClick={() => openFolder(id)}><Icon /><b>{label}</b>{count > 0 && <span>{count}</span>}<ChevronRight /></Button>)}</div> : selected ? <div className="mail-content mail-reader"><h2>{selected.subject}</h2><p>From: {selected.name} &lt;{selected.email}&gt;</p><p>To: {ownerEmail}</p><p>{format(new Date(selected.sentAt), "d MMM yyyy 'at' HH:mm")}</p><article>{selected.message}</article><Button variant="ghost" className="mail-tool" title="Remove local copy" aria-label="Remove local copy" onClick={() => { save({ ...store, sent: store.sent.filter((mail) => mail.id !== selected.id) }); setSelected(null); }}><Trash2 /></Button></div> : <>
          <div className="mail-search"><AppleSearch value={query} onChange={setQuery} label="Search mail" /></div>
          <div className="mail-content">{folder === "drafts" ? draftExists && (!query || `${store.draft.subject} ${store.draft.message}`.toLowerCase().includes(query.toLowerCase())) ? <Button variant="ghost" className="mail-row" onClick={compose}><div className="mail-row-content"><strong>{store.draft.subject || "No Subject"}</strong><span className="mail-row-preview">{store.draft.message}</span></div></Button> : <div className="mail-empty"><FileText /><h3>No Drafts</h3></div> : matching.length ? matching.map((mail) => <Button key={mail.id} variant="ghost" className="mail-row" onClick={() => setSelected(mail)}><div className="mail-row-content"><div className="mail-row-top"><strong>Henrietta Onwuneme</strong><time>{format(new Date(mail.sentAt), "d MMM")}</time></div><b>{mail.subject}</b><span className="mail-row-preview">{mail.message}</span></div></Button>) : <div className="mail-empty"><Inbox /><h3>{query ? "No Results" : "No Mail"}</h3></div>}</div>
        </>}
        <footer className="mail-footer">{mailboxes ? "Mail" : folder === "sent" ? `${store.sent.length} ${store.sent.length === 1 ? "Message" : "Messages"}` : `${draftExists ? 1 : 0} Drafts`}</footer>
      </>}
    </div>
  </div>;
}
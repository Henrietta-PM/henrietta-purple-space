import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { format, isThisWeek, isToday, isYesterday } from "date-fns";
import { ArrowUp, ChevronLeft, ChevronRight, Flag, Info, ListFilter, Mic, Search, SquarePen } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { testimonials } from "@/components/Testimonials";
import { friendlyError } from "@/lib/friendly-error";
import { ReportDialog, sendVisitorMessage, useVisitorMessages } from "./visitor-guestbook";
import "./messages-app.css";

const messageSchema = z.object({ name: z.string().trim().min(1).max(40), message: z.string().trim().min(1).max(240) });
const readStorageKey = "henrietta-messages-read";

type Selection = { kind: "pinned"; index: number } | { kind: "visitor"; id: string } | { kind: "new" };

function MessageAvatar({ name }: { name: string }) {
  return <span className="am-avatar" aria-hidden="true">{name.split(" ").map((part) => part.charAt(0)).join("").slice(0, 2).toUpperCase()}</span>;
}

function listTime(value: string) {
  const date = new Date(value);
  if (isToday(date)) return format(date, "HH:mm");
  if (isYesterday(date)) return "Yesterday";
  if (isThisWeek(date)) return format(date, "EEEE");
  return format(date, "dd/MM/yyyy");
}

function loadRead(): string[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(readStorageKey) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string").slice(-300) : [];
  } catch {
    return [];
  }
}

export default function MessagesApp({ compact = false }: { compact?: boolean }) {
  const [active, setActive] = useState<Selection | undefined>();
  const [search, setSearch] = useState("");
  const [details, setDetails] = useState(false);
  const [filter, setFilter] = useState(false);
  const [editing, setEditing] = useState(false);
  const [read, setRead] = useState<string[]>(loadRead);
  const [name, setName] = useState("");
  const [draft, setDraft] = useState("");
  const [consent, setConsent] = useState(false);
  const [sending, setSending] = useState(false);
  const [reportId, setReportId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { data: visitorMessages = [] } = useVisitorMessages();
  const query = search.toLowerCase().trim();
  const pinned = testimonials.map((item, index) => ({ ...item, index })).filter((item) => `${item.author} ${item.quote} ${item.role}`.toLowerCase().includes(query));
  const visitors = visitorMessages.filter((item) => `${item.display_name} ${item.message}`.toLowerCase().includes(query));
  const person = active?.kind === "pinned" ? testimonials[active.index] : undefined;
  const visitor = active?.kind === "visitor" ? visitorMessages.find((item) => item.id === active.id) : undefined;
  const markRead = (id: string) => {
    setRead((current) => {
      if (current.includes(id)) return current;
      const next = [...current, id].slice(-300);
      try { localStorage.setItem(readStorageKey, JSON.stringify(next)); } catch { /* storage unavailable */ }
      return next;
    });
  };
  const open = (selection: Selection) => {
    setActive(selection);
    setDetails(false);
    if (selection.kind === "visitor") markRead(selection.id);
  };
  const searchField = <label className="am-search"><Search aria-hidden="true" /><input placeholder="Search" aria-label="Search messages" value={search} onChange={(event) => setSearch(event.target.value)} />{compact && <Mic className="am-mic" aria-hidden="true" />}</label>;

  const send = async () => {
    const parsed = messageSchema.safeParse({ name, message: draft });
    if (!parsed.success) { toast.error("Add your name and a message."); return; }
    if (!consent) { toast.error("Please agree to show your message publicly."); return; }
    setSending(true);
    try {
      const result = await sendVisitorMessage(parsed.data.name, parsed.data.message);
      await queryClient.invalidateQueries({ queryKey: ["visitor-posts"] });
      setDraft("");
      setConsent(false);
      toast.success("Message sent. Thank you!");
      if (result?.id) open({ kind: "visitor", id: result.id });
    } catch (error) {
      toast.error(friendlyError(error, "Your message couldn't be sent. Please try again shortly."));
    } finally {
      setSending(false);
    }
  };

  const showThread = Boolean(person || visitor || active?.kind === "new");

  return <div className={`apple-messages ${compact ? "am-phone" : "am-mac"}`}>
    {(!compact || !showThread) && <section className="am-conversations">
      <header className="am-list-top">
        <div className="am-list-controls">
          {compact
            ? <Button variant="ghost" className="am-control am-edit" aria-pressed={editing} onClick={() => setEditing((value) => !value)}>{editing ? "Done" : "Edit"}</Button>
            : <Button variant="ghost" size="icon" className="am-control" aria-label="Message filters" title="Filters" onClick={() => setFilter((value) => !value)}><ListFilter /></Button>}
          {compact && <h1>Messages</h1>}
          {compact
            ? <Button variant="ghost" size="icon" className="am-control" aria-label="Message filters" title="Filters" onClick={() => setFilter((value) => !value)}><ListFilter /></Button>
            : <Button variant="ghost" size="icon" className="am-control" aria-label="New message" title="New message" onClick={() => open({ kind: "new" })}><SquarePen /></Button>}
        </div>
        {filter && <div className="am-filter-row"><span>Showing all messages</span><Button variant="ghost" className="am-control" onClick={() => { setSearch(""); setFilter(false); }}>Done</Button></div>}
        {!compact && searchField}
      </header>
      <div className="am-rows">
        {pinned.length > 0 && <div className="am-pinned" aria-label="Pinned">
          {pinned.map((item) => <Button key={item.author} variant="ghost" className={`am-pin ${active?.kind === "pinned" && active.index === item.index ? "selected" : ""}`} onClick={() => open({ kind: "pinned", index: item.index })}>
            <MessageAvatar name={item.author} /><span className="am-pin-name">{item.author.split(" ")[0]}</span>
          </Button>)}
        </div>}
        {!compact && pinned.map((item) => <Button key={`row-${item.author}`} variant="ghost" className={`am-row ${active?.kind === "pinned" && active.index === item.index ? "selected" : ""}`} onClick={() => open({ kind: "pinned", index: item.index })}>
          <span className="am-unread" aria-hidden="true" />
          <MessageAvatar name={item.author} /><span className="am-preview"><span className="am-preview-heading"><strong>{item.author}</strong></span><span className="am-preview-text">{item.quote}</span></span>
        </Button>)}
        {visitors.map((item) => {
          const unread = !read.includes(item.id);
          return <div key={item.id} className="am-row-wrap">
            <Button variant="ghost" className={`am-row ${active?.kind === "visitor" && active.id === item.id ? "selected" : ""}`} aria-label={`${item.display_name}${unread ? ", unread" : ""}`} onClick={() => open({ kind: "visitor", id: item.id })}>
              <span className={`am-unread ${unread ? "on" : ""}`} aria-hidden="true" />
              <MessageAvatar name={item.display_name} /><span className="am-preview"><span className="am-preview-heading"><strong>{item.display_name}</strong><small>{listTime(item.created_at)}{compact && <ChevronRight aria-hidden="true" />}</small></span><span className="am-preview-text">{item.message}</span></span>
            </Button>
            {compact && editing && <Button variant="ghost" size="icon" className="am-row-report" aria-label={`Report message from ${item.display_name}`} onClick={() => setReportId(item.id)}><Flag /></Button>}
          </div>;
        })}
        {pinned.length === 0 && visitors.length === 0 && <p className="am-empty">No Results</p>}
      </div>
      {compact && <div className="am-list-bottom">{searchField}<Button variant="ghost" size="icon" className="am-control am-new-bottom" aria-label="New message" title="New message" onClick={() => open({ kind: "new" })}><SquarePen /></Button></div>}
    </section>}
    {showThread ? <section className="am-thread">
      <header className="am-thread-header">
        {compact && <Button variant="ghost" size="icon" className="am-back" aria-label="Back to Messages" onClick={() => { setActive(undefined); setDetails(false); }}><ChevronLeft /></Button>}
        {active?.kind === "new"
          ? <div className="am-person"><strong>New Message</strong></div>
          : <div className="am-person"><MessageAvatar name={person?.author ?? visitor?.display_name ?? ""} /><strong>{person?.author ?? visitor?.display_name}{compact && <ChevronRight aria-hidden="true" />}</strong></div>}
        {person && <Button variant="ghost" size="icon" className="am-details" aria-label="Contact details" title="Contact details" onClick={() => setDetails((value) => !value)}><Info /></Button>}
        {visitor && <Button variant="ghost" size="icon" className="am-details" aria-label="Report message" title="Report" onClick={() => setReportId(visitor.id)}><Flag /></Button>}
      </header>
      <div className="am-thread-scroll">
        {person && <>
          {details && <div className="am-contact-details"><strong>{person.author}</strong><p>{person.role}</p></div>}
          <p className="am-incoming">{person.quote}</p>
          <p className="am-person-role">{person.role}</p>
        </>}
        {visitor && <>
          <p className="am-time">{format(new Date(visitor.created_at), "EEE, d MMM 'at' HH:mm")}</p>
          <p className="am-incoming">{visitor.message}</p>
        </>}
        {active?.kind === "new" && <div className="am-compose-intro">
          <label className="am-to">To: <span>Henrietta</span></label>
          <input className="am-name" placeholder="Your name" aria-label="Your name" maxLength={40} value={name} onChange={(event) => setName(event.target.value)} />
          <label className="am-consent"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} /> Show my name and message publicly in Messages</label>
        </div>}
      </div>
      <footer className="am-composer">
        {active?.kind !== "new" && <Button variant="ghost" size="icon" className="am-compose-start" aria-label="Write a new message" title="Write a new message" onClick={() => open({ kind: "new" })}><SquarePen /></Button>}
        {active?.kind === "new" ? <>
        <input placeholder="iMessage" aria-label="Message" maxLength={240} value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") void send(); }} />
        <Button size="icon" className="am-send" aria-label="Send message" disabled={sending || !draft.trim()} onClick={() => void send()}><ArrowUp /></Button>
        </> : <Button variant="ghost" className="am-compose-placeholder" onClick={() => open({ kind: "new" })}>iMessage</Button>}
      </footer>
    </section> : !compact && <div className="am-empty">No Conversation Selected</div>}
    <ReportDialog id={reportId} onClose={() => setReportId(null)} />
  </div>;
}

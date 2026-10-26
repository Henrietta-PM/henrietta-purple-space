import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { ArrowUp, ChevronLeft, ChevronRight, Flag, Info, ListFilter, Search, SquarePen } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { testimonials } from "@/components/Testimonials";
import { friendlyError } from "@/lib/friendly-error";
import { ReportDialog, sendVisitorMessage, useVisitorMessages } from "./visitor-guestbook";
import "./messages-app.css";

const messageSchema = z.object({ name: z.string().trim().min(1).max(40), message: z.string().trim().min(1).max(240) });

type Selection = { kind: "pinned"; index: number } | { kind: "visitor"; id: string } | { kind: "new" };

function MessageAvatar({ name }: { name: string }) {
  return <span className="am-avatar" aria-hidden="true">{name.split(" ").map((part) => part.charAt(0)).join("").slice(0, 2).toUpperCase()}</span>;
}

export default function MessagesApp({ compact = false }: { compact?: boolean }) {
  const [active, setActive] = useState<Selection | undefined>();
  const [search, setSearch] = useState("");
  const [details, setDetails] = useState(false);
  const [filter, setFilter] = useState(false);
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
  const open = (selection: Selection) => { setActive(selection); setDetails(false); };
  const searchField = <label className="am-search"><Search aria-hidden="true" /><input placeholder="Search" aria-label="Search messages" value={search} onChange={(event) => setSearch(event.target.value)} /></label>;

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
          <Button variant="ghost" size="icon" className="am-control" aria-label="Message filters" title="Filters" onClick={() => setFilter((value) => !value)}><ListFilter /></Button>
          {!compact && <Button variant="ghost" size="icon" className="am-control" aria-label="New message" title="New message" onClick={() => open({ kind: "new" })}><SquarePen /></Button>}
        </div>
        {filter && <Button variant="ghost" className="am-control" onClick={() => { setSearch(""); setFilter(false); }}>All Messages</Button>}
        {compact && <h1>Messages</h1>}
        {!compact && searchField}
      </header>
      <div className="am-rows">
        {pinned.length > 0 && <div className="am-pinned" aria-label="Pinned">
          {pinned.map((item) => <Button key={item.author} variant="ghost" className={`am-pin ${active?.kind === "pinned" && active.index === item.index ? "selected" : ""}`} onClick={() => open({ kind: "pinned", index: item.index })}>
            <MessageAvatar name={item.author} /><span>{item.author.split(" ")[0]}</span>
          </Button>)}
        </div>}
        {visitors.map((item) => <Button key={item.id} variant="ghost" className={`am-row ${active?.kind === "visitor" && active.id === item.id ? "selected" : ""}`} onClick={() => open({ kind: "visitor", id: item.id })}>
          <MessageAvatar name={item.display_name} /><span className="am-preview"><span className="am-preview-heading"><strong>{item.display_name}</strong><small>{format(new Date(item.created_at), "d MMM")}</small></span><span className="am-preview-text">{item.message}</span></span>
        </Button>)}
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

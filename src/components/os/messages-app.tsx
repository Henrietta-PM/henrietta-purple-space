import { useState } from "react";
import { ChevronLeft, ChevronRight, Info, ListFilter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { testimonials } from "@/components/Testimonials";
import "./messages-app.css";

function MessageAvatar({ name }: { name: string }) {
  return <span className="am-avatar" aria-hidden="true">{name.split(" ").map((part) => part.charAt(0)).join("").slice(0, 2)}</span>;
}

export default function MessagesApp({ compact = false }: { compact?: boolean }) {
  const [active, setActive] = useState<number | undefined>();
  const [search, setSearch] = useState("");
  const [details, setDetails] = useState(false);
  const [filter, setFilter] = useState(false);
  const person = active === undefined ? undefined : testimonials[active];
  const conversations = testimonials.map((item, index) => ({ ...item, index })).filter((item) => `${item.author} ${item.quote} ${item.role}`.toLowerCase().includes(search.toLowerCase().trim()));
  const searchField = <label className="am-search"><Search aria-hidden="true" /><input placeholder="Search" aria-label="Search messages" value={search} onChange={(event) => setSearch(event.target.value)} /></label>;

  return <div className={`apple-messages ${compact ? "am-phone" : "am-mac"}`}>
    {(!compact || !person) && <section className="am-conversations">
      <header className="am-list-top">
        <div className="am-list-controls"><Button variant="ghost" size="icon" className="am-control" aria-label="Message filters" title="Filters" onClick={() => setFilter((value) => !value)}><ListFilter /></Button></div>
        {filter && <Button variant="ghost" className="am-control" onClick={() => { setSearch(""); setFilter(false); }}>All Messages</Button>}
        <h1>Messages</h1>
        {!compact && searchField}
      </header>
      <div className="am-rows">{conversations.map((item) => <Button key={item.author} variant="ghost" className={`am-row ${active === item.index ? "selected" : ""}`} onClick={() => { setActive(item.index); setDetails(false); }}>
        <MessageAvatar name={item.author} /><span className="am-preview"><span className="am-preview-heading"><strong>{item.author}</strong><ChevronRight aria-hidden="true" /></span><span className="am-preview-text">{item.quote}</span></span>
      </Button>)}{conversations.length === 0 && <p className="am-empty">No Results</p>}</div>
      {compact && <div className="am-list-bottom">{searchField}</div>}
    </section>}
    {person ? <section className="am-thread">
      <header className="am-thread-header">
        {compact && <Button variant="ghost" size="icon" className="am-back" aria-label="Back to Messages" onClick={() => { setActive(undefined); setDetails(false); }}><ChevronLeft /></Button>}
        <div className="am-person"><MessageAvatar name={person.author} /><strong>{person.author}{compact && <ChevronRight aria-hidden="true" />}</strong></div>
        <Button variant="ghost" size="icon" className="am-details" aria-label="Contact details" title="Contact details" onClick={() => setDetails((value) => !value)}><Info /></Button>
      </header>
      <div className="am-thread-scroll">
        {details && <div className="am-contact-details"><strong>{person.author}</strong><p>{person.role}</p></div>}
        <p className="am-thread-label">Testimonial</p>
        <p className="am-incoming">{person.quote}</p>
        <p className="am-person-role">{person.role}</p>
      </div>
    </section> : !compact && <div className="am-empty">No Conversation Selected</div>}
  </div>;
}
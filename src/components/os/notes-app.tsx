import { useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, Folder, Grid2X2, List, MoreHorizontal, PanelLeft, Search, Share, Pin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { aboutMeNote, portfolioNotes, type NoteId } from "@/data/notes";
import EditableNote from "./editable-note";
import "./notes-app.css";

export default function NotesApp({ initialNote, letter, compact = false }: { initialNote?: NoteId; letter: ReactNode; compact?: boolean }) {
  const [selected, setSelected] = useState<NoteId | undefined>(initialNote);
  const [search, setSearch] = useState("");
  const [folders, setFolders] = useState(false);
  const [sidebar, setSidebar] = useState(true);
  const [gallery, setGallery] = useState(false);
  const [pinned, setPinned] = useState<NoteId[]>([]);
  const readingRef = useRef<HTMLDivElement>(null);
  const notes = portfolioNotes.filter((note) => `${note.title} ${note.preview} ${note.id === "about-me" ? [aboutMeNote.intro, ...aboutMeNote.paragraphs].join(" ") : ""}`.toLowerCase().includes(search.toLowerCase().trim()));
  const shareNote = async () => {
    const text = readingRef.current?.innerText;
    if (!text) return;
    try {
      if (navigator.share) { await navigator.share({ title: portfolioNotes.find((note) => note.id === selected)?.title, text }); return; }
      await navigator.clipboard.writeText(text);
      toast.success("Note copied");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      toast("Sharing isn't available here. You can select and copy the note.");
    }
  };
  const menu = <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="an-icon" aria-label="More note options" title="More"><MoreHorizontal /></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="rounded-2xl">
    {selected ? <DropdownMenuItem onSelect={() => setPinned((items) => items.includes(selected) ? items.filter((id) => id !== selected) : [...items, selected])}><Pin className="mr-2 h-4 w-4" />{pinned.includes(selected) ? "Unpin Note" : "Pin Note"}</DropdownMenuItem> : <DropdownMenuItem onSelect={() => setGallery((value) => !value)}>{gallery ? <List className="mr-2 h-4 w-4" /> : <Grid2X2 className="mr-2 h-4 w-4" />}{gallery ? "View as List" : "View as Gallery"}</DropdownMenuItem>}
  </DropdownMenuContent></DropdownMenu>;
  const searchField = <label className="an-search"><Search aria-hidden="true" /><input aria-label="Search notes" placeholder="Search" value={search} onChange={(event) => setSearch(event.target.value)} /></label>;
  const noteList = <div className={`an-note-list ${gallery ? "gallery" : ""}`}>
    {pinned.length > 0 && <h2>Pinned</h2>}
    {[...notes].sort((a, b) => Number(pinned.includes(b.id)) - Number(pinned.includes(a.id))).map((note) => <Button key={note.id} variant="ghost" className={`an-note-row ${selected === note.id ? "selected" : ""}`} onClick={() => { setSelected(note.id); setFolders(false); }}>
      <strong>{pinned.includes(note.id) && <Pin aria-hidden="true" />}{note.title}</strong><span>{note.preview}</span><small><Folder /> Notes</small>
    </Button>)}
    {notes.length === 0 && <p className="an-empty">No notes found</p>}
  </div>;
  const folderList = <div className="an-folder-list"><h2>On My {compact ? "iPhone" : "Mac"}</h2><Button variant="ghost" className="an-folder-row" onClick={() => { setFolders(false); setSelected(undefined); }}><Folder /><span>Notes</span><small>{portfolioNotes.length}</small>{compact && <ChevronRight />}</Button></div>;
  const reader = <div className="os-notes-reading" ref={readingRef}>
    {selected && <EditableNote key={selected} noteId={selected}>{selected === "about-me" ? <article><h1>{aboutMeNote.title}</h1><h2>{aboutMeNote.greeting}</h2><p>{aboutMeNote.preview}</p><p>{aboutMeNote.intro}</p><p>{aboutMeNote.highlightsLead}</p><ul className="os-notes-highlights">{aboutMeNote.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>{aboutMeNote.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<p className="font-handwritten os-note-sign">Henrietta</p></article> : letter}</EditableNote>}
  </div>;

  return (
    <div className={`os-notes-app ${compact ? "an-phone" : "an-mac"} ${selected ? "reading" : ""}`}>
      {compact ? <>
        <header className="an-toolbar">
          {!folders ? <Button variant="ghost" className={`an-back ${selected ? "an-reader-back" : ""}`} aria-label={selected ? "Back to Notes" : "Folders"} title={selected ? "Back to Notes" : "Folders"} onClick={() => { if (selected) setSelected(undefined); else setFolders(true); }}><ChevronLeft />{!selected && "Folders"}</Button> : <span />}
          <div className="an-tools">{selected && <Button variant="ghost" size="icon" className="an-icon" aria-label="Share note" title="Share" onClick={shareNote}><Share /></Button>}{menu}</div>
        </header>
        {selected ? reader : <div className="an-phone-list"><h1>{folders ? "Folders" : "Notes"}</h1>{searchField}{folders ? folderList : noteList}</div>}
        {!selected && <footer className="an-footer">{notes.length} {notes.length === 1 ? "Note" : "Notes"}</footer>}
      </> : <>
        {sidebar && <aside className="an-sidebar">{folderList}</aside>}
        <section className="an-mac-list"><header className="an-toolbar"><Button variant="ghost" size="icon" className="an-icon" aria-label="Toggle folders" title="Toggle folders" onClick={() => setSidebar((value) => !value)}><PanelLeft /></Button><strong>Notes</strong>{!selected && menu}</header>{searchField}{noteList}<footer className="an-footer">{notes.length} Notes</footer></section>
        <section className="an-mac-reader"><header className="an-toolbar"><span /><div className="an-tools">{selected && <><Button variant="ghost" size="icon" className="an-icon" aria-label="Share note" title="Share" onClick={shareNote}><Share /></Button>{menu}</>}</div></header>{selected ? reader : <div className="an-no-selection">No Note Selected</div>}</section>
      </>}
    </div>
  );
}
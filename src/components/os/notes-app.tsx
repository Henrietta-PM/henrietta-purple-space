import { useState, type ReactNode } from "react";
import { ChevronLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { aboutMeNote, portfolioNotes, type NoteId } from "@/data/notes";
import "./notes-app.css";

export default function NotesApp({ initialNote, letter }: { initialNote?: NoteId; letter: ReactNode }) {
  const [selected, setSelected] = useState<NoteId | undefined>(initialNote);
  const [search, setSearch] = useState("");
  const notes = portfolioNotes.filter((note) => `${note.title} ${note.preview} ${note.id === "about-me" ? aboutMeNote.paragraphs.join(" ") : ""}`.toLowerCase().includes(search.toLowerCase().trim()));

  return (
    <div className="os-notes-app">
      {selected ? <>
        <header className="os-notes-nav">
          <Button variant="ghost" className="os-notes-back" onClick={() => setSelected(undefined)}><ChevronLeft /> Notes</Button>
          <small>Henrietta's notes</small>
        </header>
        <div className="os-notes-reading">
          {selected === "about-me" ? <article>
            <h1>{aboutMeNote.title}</h1>
            <h2>{aboutMeNote.greeting}</h2>
            <p>{aboutMeNote.preview}</p>
            <ul className="os-notes-highlights">{aboutMeNote.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
            {aboutMeNote.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <p className="font-handwritten os-note-sign">Henrietta</p>
          </article> : letter}
        </div>
      </> : <div className="os-notes-library">
        <h1>Notes</h1>
        <label className="os-notes-search"><Search aria-hidden="true" /><input aria-label="Search notes" placeholder="Search" value={search} onChange={(event) => setSearch(event.target.value)} /></label>
        <h2>All Notes</h2>
        <div className="os-notes-list">
          {notes.map((note) => <Button key={note.id} variant="ghost" className="os-notes-row" onClick={() => setSelected(note.id)}><strong>{note.title}</strong><span>{note.preview}</span></Button>)}
        </div>
        <p className="os-notes-count">{notes.length === 0 ? "No notes found" : `${notes.length} ${notes.length === 1 ? "note" : "notes"}`}</p>
      </div>}
    </div>
  );
}
import { useEffect, useRef, useState, type ReactNode } from "react";
import DOMPurify from "dompurify";
import { Bold, Highlighter, Italic, RotateCcw, Strikethrough, Underline } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const storageKey = (noteId: string) => `portfolio-note-edits-v1:${noteId}`;

const readSaved = (noteId: string): string | null => {
  try {
    return window.localStorage.getItem(storageKey(noteId));
  } catch {
    return null;
  }
};

export default function EditableNote({ noteId, children }: { noteId: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [edited, setEdited] = useState(() => readSaved(noteId) !== null);
  const [version, setVersion] = useState(0);
  const [formatting, setFormatting] = useState(false);

  useEffect(() => {
    const saved = readSaved(noteId);
    if (saved !== null && ref.current) ref.current.innerHTML = DOMPurify.sanitize(saved);
  }, [noteId, version]);

  const save = () => {
    if (!ref.current) return;
    try {
      window.localStorage.setItem(storageKey(noteId), DOMPurify.sanitize(ref.current.innerHTML));
      setEdited(true);
    } catch {
      toast("Your changes can't be saved on this browser.");
    }
  };

  const format = (command: "bold" | "italic" | "underline" | "strikeThrough" | "hiliteColor") => {
    ref.current?.focus();
    document.execCommand(command, false, command === "hiliteColor" ? "hsl(48 100% 60%)" : undefined);
    save();
  };

  const reset = () => {
    try {
      window.localStorage.removeItem(storageKey(noteId));
    } catch {
      return;
    }
    setEdited(false);
    setVersion((value) => value + 1);
    toast.success("Note restored to the original");
  };

  return (
    <>
      <div
        key={version}
        ref={ref}
        className="an-editable"
        contentEditable
        suppressContentEditableWarning
        spellCheck
        onInput={save}
        aria-label="Note. Your edits stay on this device only."
      >
        {children}
      </div>
      <div className="an-format-dock">
        {formatting && <div className="an-format-panel" role="toolbar" aria-label="Format">
          {([["bold", Bold, "Bold"], ["italic", Italic, "Italic"], ["underline", Underline, "Underline"], ["strikeThrough", Strikethrough, "Strikethrough"], ["hiliteColor", Highlighter, "Highlight"]] as const).map(([command, Icon, label]) => (
            <Button key={command} variant="ghost" size="icon" aria-label={label} title={label} onMouseDown={(event) => event.preventDefault()} onClick={() => format(command)}><Icon /></Button>
          ))}
        </div>}
        <div className="an-bottom-bar">
          <Button variant="ghost" className="an-aa" aria-label="Format" aria-pressed={formatting} title="Format" onMouseDown={(event) => event.preventDefault()} onClick={() => setFormatting((value) => !value)}>Aa</Button>
          <Button variant="ghost" size="icon" aria-label="Highlight" title="Highlight" onMouseDown={(event) => event.preventDefault()} onClick={() => format("hiliteColor")}><Highlighter /></Button>
          <Button variant="ghost" size="icon" aria-label="Restore original note" title="Restore original" disabled={!edited} onClick={reset}><RotateCcw /></Button>
        </div>
      </div>
    </>
  );
}

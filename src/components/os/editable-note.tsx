import { useEffect, useRef, useState, type ReactNode } from "react";
import DOMPurify from "dompurify";
import { Bold, Highlighter, Italic, RotateCcw, Underline } from "lucide-react";
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

  const format = (command: "bold" | "italic" | "underline" | "hiliteColor") => {
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
      <div className="an-format-bar" role="toolbar" aria-label="Formatting">
        <Button variant="ghost" size="icon" aria-label="Highlight" title="Highlight" onMouseDown={(event) => event.preventDefault()} onClick={() => format("hiliteColor")}><Highlighter /></Button>
        <Button variant="ghost" size="icon" aria-label="Bold" title="Bold" onMouseDown={(event) => event.preventDefault()} onClick={() => format("bold")}><Bold /></Button>
        <Button variant="ghost" size="icon" aria-label="Italic" title="Italic" onMouseDown={(event) => event.preventDefault()} onClick={() => format("italic")}><Italic /></Button>
        <Button variant="ghost" size="icon" aria-label="Underline" title="Underline" onMouseDown={(event) => event.preventDefault()} onClick={() => format("underline")}><Underline /></Button>
        {edited && <Button variant="ghost" size="icon" aria-label="Restore original note" title="Restore original" onClick={reset}><RotateCcw /></Button>}
      </div>
    </>
  );
}

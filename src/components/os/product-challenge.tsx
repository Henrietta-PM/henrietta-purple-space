import { useEffect, useRef, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowUp, Square, Calendar, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { friendlyError } from "@/lib/friendly-error";
import { openHireCalendar } from "@/lib/booking";
import "./product-challenge.css";

export default function ProductChallenge() {
  const [challenge, setChallenge] = useState("");
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const controller = useRef<AbortController | null>(null);
  useEffect(() => () => controller.current?.abort(), []);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (busy || challenge.trim().length < 20) return;
    setBusy(true); setAnswer(""); setError("");
    const abort = new AbortController();
    controller.current = abort;
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/product-challenge`, {
        method: "POST", signal: abort.signal,
        headers: { "Content-Type": "application/json", apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
        body: JSON.stringify({ challenge }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw { safeMessage: typeof data.message === "string" ? data.message : undefined };
      }
      if (!response.body) throw new Error("empty_response");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let pending = "";
      let output = "";
      while (true) {
        const chunk = await reader.read();
        pending += decoder.decode(chunk.value, { stream: !chunk.done });
        const lines = pending.split("\n");
        pending = lines.pop() || "";
        for (const line of lines) {
          if (!line.trim()) continue;
          const data = JSON.parse(line);
          if (data.error) throw { safeMessage: data.error };
          if (typeof data.text === "string") { output += data.text; setAnswer(output); }
        }
        if (chunk.done) break;
      }
    } catch (failure) {
      if (!abort.signal.aborted) {
        const safe = typeof failure === "object" && failure !== null && "safeMessage" in failure && typeof failure.safeMessage === "string" ? failure.safeMessage : undefined;
        const message = friendlyError(failure, safe || "Your recommendation could not be completed. Please try again later.");
        setError(message); setAnswer(""); toast.error(message);
      }
    } finally { setBusy(false); controller.current = null; }
  };
  return <section className="product-challenge">
    <header><h2>Your product challenge</h2><span className="pc-caption">Lovable AI</span></header>
    <form onSubmit={submit}>
      <label htmlFor="product-challenge-input">What are you trying to solve?</label>
      <Textarea id="product-challenge-input" value={challenge} onChange={(event) => setChallenge(event.target.value)} placeholder="Our users sign up but rarely complete their first booking. We need to understand why and decide what to improve." maxLength={2000} rows={5} disabled={busy} />
      <div className="pc-input-footer"><small>{challenge.length}/2,000</small>{busy ? <Button type="button" variant="ghost" onClick={() => controller.current?.abort()}><Square aria-hidden="true" />Stop</Button> : <Button type="submit" disabled={challenge.trim().length < 20}><ArrowUp aria-hidden="true" />Recommend an approach</Button>}</div>
      <p className="pc-caption">Leave out confidential or personal information. Your challenge is sent to Lovable AI, not saved in the portfolio.</p>
    </form>
    {busy && !answer && <p role="status" className="pc-caption">Considering your challenge…</p>}
    {error && <p role="alert" className="pc-error">{error}</p>}
    {answer && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pc-result">
      <h3>A suggested approach</h3><div className="pc-answer">{answer.split("\n").map((line, index) => /^#{1,4}\s/.test(line) ? <h4 key={index}>{line.replace(/^#{1,4}\s+/, "")}</h4> : <span key={index}>{line}{"\n"}</span>)}</div>
      {!busy && <><p className="pc-caption">An AI recommendation, not a commitment or a guaranteed outcome.</p><div className="pc-actions"><Button onClick={openHireCalendar}><Calendar aria-hidden="true" />Discuss with Henrietta</Button><Button variant="ghost" onClick={() => { setAnswer(""); setError(""); }}><RotateCcw aria-hidden="true" />Start again</Button></div></>}
    </motion.div>}
  </section>;
}
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { friendlyError } from "@/lib/friendly-error";

type Status = "idle" | "working" | "done" | "error";

export const Moderate = () => {
  const [params] = useSearchParams();
  const id = params.get("id") ?? "";
  const token = params.get("token") ?? "";
  const decision = params.get("decision") === "delete" ? "delete" : "keep";
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const confirm = async () => {
    setStatus("working");
    const { data, error } = await supabase.functions.invoke("visitor-guestbook", { body: { action: "moderate", id, token, decision } });
    if (error || !data?.success) {
      setStatus("error");
      setMessage(friendlyError(error, "This link is no longer valid, or the post was already handled."));
      return;
    }
    setStatus("done");
    setMessage(decision === "delete" ? "The post was deleted." : "The post is visible on your site again.");
  };

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background p-6 text-foreground">
      <div className="w-full max-w-sm space-y-4 rounded-2xl border border-border bg-card p-6 text-center">
        <h1 className="text-xl font-semibold">{decision === "delete" ? "Delete this visitor post?" : "Keep this visitor post?"}</h1>
        {status === "idle" || status === "working" ? (
          <>
            <p className="text-sm text-muted-foreground">
              {decision === "delete" ? "The post and its photo will be removed for good." : "The post will show on your site again and its reports will be cleared."}
            </p>
            <Button className="w-full" variant={decision === "delete" ? "destructive" : "default"} disabled={status === "working" || !id || !token} onClick={confirm}>
              {status === "working" ? "Working..." : decision === "delete" ? "Delete post" : "Keep it up"}
            </Button>
          </>
        ) : (
          <p className="text-sm text-muted-foreground" role="status">{message}</p>
        )}
      </div>
    </main>
  );
};

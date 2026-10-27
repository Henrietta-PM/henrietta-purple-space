import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { isContactMail, OWNER_EMAIL, MAIL_COOLDOWN_SECONDS } from "./validation.ts";

Deno.serve(async (request) => {
  const reply = (status: number, data: unknown) => new Response(JSON.stringify(data), { status, headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store", ...(status === 429 ? { "Retry-After": String(MAIL_COOLDOWN_SECONDS) } : {}) } });
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return reply(405, { error: "Please use the send button." });
  const apiKey = Deno.env.get("RESEND_API_KEY");
  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!apiKey || !url || !serviceKey) return reply(503, { error: "Mail is temporarily unavailable." });
  try {
    if (Number(request.headers.get("content-length") || 0) > 20000) return reply(413, { error: "Please shorten your message." });
    const raw = await request.text();
    if (new TextEncoder().encode(raw).length > 20000) return reply(413, { error: "Please shorten your message." });
    let body: unknown;
    try { body = JSON.parse(raw); } catch { return reply(400, { error: "Please check your message." }); }
    if (!isContactMail(body)) return reply(400, { error: "Please check your name, email, subject and message." });
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${serviceKey}:mail:${ip}`));
    const requestKey = `mail:${Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, "0")).join("")}`;
    const admin = createClient(url, serviceKey);
    const { data: allowed, error } = await admin.rpc("claim_visitor_request", { request_key: requestKey });
    if (error) return reply(503, { error: "Mail is temporarily unavailable." });
    if (!allowed) return reply(429, { error: "Please wait a minute before sending another email." });
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ from: "Portfolio <onboarding@resend.dev>", to: [OWNER_EMAIL], reply_to: body.email.trim(), subject: body.subject.trim(), text: `From: ${body.name.trim()} <${body.email.trim()}>\nSent from Henrietta's portfolio\n\n${body.message.trim()}` }),
    });
    if (!response.ok) {
      console.error("Contact email provider rejected request", response.status);
      return reply(502, { error: "Your email could not be sent. Your draft is saved." });
    }
    return reply(200, { success: true });
  } catch {
    return reply(503, { error: "Your email could not be sent. Please try again shortly." });
  }
});
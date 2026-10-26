import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3";
import jpeg from "npm:jpeg-js@0.4.4";

const postSchema = z.object({
  name: z.string().trim().min(1).max(40),
  message: z.string().trim().max(240).default(""),
  consent: z.literal(true),
  website: z.string().max(0).optional(),
  photo: z.string().max(2800000).optional(),
}).refine((value) => value.message.length > 0 || Boolean(value.photo));
const reportSchema = z.object({ id: z.string().uuid(), reason: z.enum(["Inappropriate content", "Spam", "Privacy concern"]) });
const moderateSchema = z.object({ action: z.literal("moderate"), id: z.string().uuid(), token: z.string().uuid(), decision: z.enum(["keep", "delete"]) });
const REPORT_THRESHOLD = 3;
const SITE_URL = "https://hirehenrietta.lovable.app";
const OWNER_EMAIL = "mypvrplespace@gmail.com";
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char] as string));
const reply = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const admin = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "");
  try {
    if (req.method === "GET") {
      const { data, error } = await admin.from("visitor_posts").select("id,display_name,message,photo_path,created_at").eq("hidden", false).order("created_at", { ascending: false }).limit(100);
      if (error) throw error;
      const posts = await Promise.all((data ?? []).map(async ({ photo_path, ...post }) => {
        if (!photo_path) return { ...post, photo_url: null };
        const { data: photo } = await admin.storage.from("visitor-photos").createSignedUrl(photo_path, 3600);
        return { ...post, photo_url: photo?.signedUrl ?? null };
      }));
      return reply({ posts });
    }
    if (req.method !== "POST") return reply({ error: "This action is not available." }, 405);
    if (Number(req.headers.get("content-length") ?? 0) > 2900000) return reply({ error: "Please choose a smaller photo." }, 413);
    const raw = await req.text();
    if (raw.length > 2900000) return reply({ error: "Please choose a smaller photo." }, 413);
    let body;
    try { body = JSON.parse(raw); } catch { return reply({ error: "Please check your submission." }, 400); }
    if (body.action === "moderate") {
      const decision = moderateSchema.safeParse(body);
      if (!decision.success) return reply({ error: "This link is not valid." }, 400);
      const { id, token } = decision.data;
      const { data: entry } = await admin.from("visitor_moderation").select("token,resolved_at").eq("post_id", id).maybeSingle();
      if (!entry || entry.token !== token) return reply({ error: "This link is not valid." }, 403);
      if (entry.resolved_at) return reply({ error: "This post was already handled." }, 409);
      if (decision.data.decision === "keep") {
        await admin.from("visitor_posts").update({ hidden: false }).eq("id", id);
        await admin.from("visitor_reports").delete().eq("post_id", id);
      } else {
        const { data: post } = await admin.from("visitor_posts").select("photo_path").eq("id", id).maybeSingle();
        if (post?.photo_path) await admin.storage.from("visitor-photos").remove([post.photo_path]);
        await admin.from("visitor_reports").delete().eq("post_id", id);
        await admin.from("visitor_posts").delete().eq("id", id);
      }
      await admin.from("visitor_moderation").update({ resolved_at: new Date().toISOString() }).eq("post_id", id);
      return reply({ success: true, decision: decision.data.decision });
    }
    const reporting = body.action === "report";
    const parsed = reporting ? reportSchema.safeParse(body) : postSchema.safeParse(body);
    if (!parsed.success) return reply({ error: "Please check your name, message and consent." }, 400);
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}:${ip}`));
    const visitorHash = Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, "0")).join("");
    const key = `${reporting ? "report" : "post"}:${visitorHash}`;
    const { data: allowed, error: limitError } = await admin.rpc("claim_visitor_request", { request_key: key });
    if (limitError) throw limitError;
    if (!allowed) return reply({ error: "Please wait a minute before submitting again." }, 429);
    if (reporting) {
      const report = reportSchema.parse(body);
      const { data: token, error } = await admin.rpc("record_visitor_report", { _post_id: report.id, _reason: report.reason, _reporter_hash: visitorHash, _threshold: REPORT_THRESHOLD });
      if (error) throw error;
      if (token) await emailOwner(admin, report.id, token as string);
      return reply({ success: true });
    }
    const post = postSchema.parse(body);
    let photoPath: string | null = null;
    if (post.photo) {
      if (!/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(post.photo)) return reply({ error: "Please choose a JPEG photo." }, 400);
      let bytes = Uint8Array.from(atob(post.photo.split(",")[1]), (char) => char.charCodeAt(0));
      if (bytes.length > 2 * 1024 * 1024 || bytes[0] !== 255 || bytes[1] !== 216 || bytes[2] !== 255) return reply({ error: "Please choose a smaller, valid photo." }, 400);
      try {
        const image = jpeg.decode(bytes, { useTArray: true, maxResolutionInMP: 2, maxMemoryUsageInMB: 32 });
        if (image.width > 1200 || image.height > 1200) return reply({ error: "Please choose a smaller photo." }, 400);
        bytes = new Uint8Array(jpeg.encode({ width: image.width, height: image.height, data: image.data }, 80).data);
      } catch { return reply({ error: "That photo couldn't be opened. Please choose another." }, 400); }
      photoPath = `${crypto.randomUUID()}.jpg`;
      const { error } = await admin.storage.from("visitor-photos").upload(photoPath, bytes, { contentType: "image/jpeg", upsert: false });
      if (error) throw error;
    }
    const { data, error } = await admin.from("visitor_posts").insert({ display_name: post.name, message: post.message, photo_path: photoPath }).select("id").single();
    if (error) {
      if (photoPath) await admin.storage.from("visitor-photos").remove([photoPath]);
      throw error;
    }
    return reply({ id: data.id, success: true }, 201);
  } catch {
    return reply({ error: "We couldn't complete that. Please try again shortly." }, 500);
  }
});
// deno-lint-ignore no-explicit-any
async function emailOwner(admin: any, postId: string, token: string) {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) { console.error("RESEND_API_KEY missing, report email not sent"); return; }
  const { data: post } = await admin.from("visitor_posts").select("display_name,message,photo_path,created_at").eq("id", postId).maybeSingle();
  const { data: reports } = await admin.from("visitor_reports").select("reason").eq("post_id", postId);
  let photoUrl: string | null = null;
  if (post?.photo_path) {
    const { data } = await admin.storage.from("visitor-photos").createSignedUrl(post.photo_path, 60 * 60 * 24 * 7);
    photoUrl = data?.signedUrl ?? null;
  }
  const reasons = (reports ?? []).map((row: { reason: string }) => `<li>${escapeHtml(row.reason)}</li>`).join("");
  const link = (decision: string) => `${SITE_URL}/moderate?id=${postId}&token=${token}&decision=${decision}`;
  const html = `<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:20px;color:#111">
    <h2 style="margin:0 0 12px">A visitor post was hidden</h2>
    <p>${REPORT_THRESHOLD} different visitors reported this post, so it is hidden from your site until you decide.</p>
    <p><strong>From:</strong> ${escapeHtml(post?.display_name ?? "Unknown")}</p>
    ${post?.message ? `<p><strong>Message:</strong> ${escapeHtml(post.message)}</p>` : ""}
    ${photoUrl ? `<p><img src="${photoUrl}" alt="Reported photo" style="max-width:100%;border-radius:8px"/></p>` : ""}
    <p><strong>Reasons:</strong></p><ul>${reasons}</ul>
    <p><a href="${link("keep")}" style="display:inline-block;padding:10px 18px;background:#6d28d9;color:#fff;border-radius:8px;text-decoration:none;margin-right:8px">Keep it up</a>
    <a href="${link("delete")}" style="display:inline-block;padding:10px 18px;background:#b91c1c;color:#fff;border-radius:8px;text-decoration:none">Delete</a></p>
  </div>`;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ from: "Portfolio <onboarding@resend.dev>", to: [OWNER_EMAIL], subject: "A visitor post was reported and hidden", html }),
  });
  if (!response.ok) console.error("Report email failed", response.status);
}

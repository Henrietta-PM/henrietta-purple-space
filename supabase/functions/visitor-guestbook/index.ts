import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3";
import jpeg from "npm:jpeg-js@0.4.4";

const postSchema = z.object({
  name: z.string().trim().min(1).max(40),
  message: z.string().trim().min(1).max(240),
  consent: z.literal(true),
  website: z.string().max(0).optional(),
  photo: z.string().max(2800000).optional(),
});
const reportSchema = z.object({ id: z.string().uuid(), reason: z.enum(["Inappropriate content", "Spam", "Privacy concern"]) });
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
    const reporting = body.action === "report";
    const parsed = reporting ? reportSchema.safeParse(body) : postSchema.safeParse(body);
    if (!parsed.success) return reply({ error: "Please check your name, message and consent." }, 400);
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}:${ip}`));
    const key = `${reporting ? "report" : "post"}:${Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, "0")).join("")}`;
    const { data: allowed, error: limitError } = await admin.rpc("claim_visitor_request", { request_key: key });
    if (limitError) throw limitError;
    if (!allowed) return reply({ error: "Please wait a minute before submitting again." }, 429);
    if (reporting) {
      const report = reportSchema.parse(body);
      const { error } = await admin.from("visitor_reports").insert({ post_id: report.id, reason: report.reason });
      if (error) throw error;
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
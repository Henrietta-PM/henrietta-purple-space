import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Persistent DB-backed rate limiting (survives cold starts / multiple instances)
const RATE_LIMIT_WINDOW_SECONDS = 60; // 1 minute per IP

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Persistent rate limit by IP
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    const { data: existing, error: lookupError } = await supabaseAdmin
      .from("rate_limits")
      .select("last_called_at")
      .eq("ip", ip)
      .maybeSingle();

    if (lookupError) {
      console.error("Rate limit lookup error:", lookupError);
      return new Response(
        JSON.stringify({ error: "An internal error occurred. Please try again later." }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    if (
      existing?.last_called_at &&
      Date.now() - new Date(existing.last_called_at).getTime() < RATE_LIMIT_WINDOW_SECONDS * 1000
    ) {
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        {
          status: 429,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const { error: upsertError } = await supabaseAdmin
      .from("rate_limits")
      .upsert({ ip, last_called_at: new Date().toISOString() }, { onConflict: "ip" });

    if (upsertError) {
      console.error("Rate limit upsert error:", upsertError);
      return new Response(
        JSON.stringify({ error: "An internal error occurred. Please try again later." }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("Sending heart notification email...");

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "An internal error occurred. Please try again later." }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Portfolio <onboarding@resend.dev>",
        to: ["mypvrplespace@gmail.com"],
        subject: "A user loves your portfolio! 💜",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #8B5CF6;">🎉 Someone sent you a heart!</h1>
            <p style="font-size: 16px; line-height: 1.6;">
              A visitor to your portfolio was impressed and sent you a heart! 💜
            </p>
            <p style="font-size: 14px; color: #666;">
              Sent at: ${new Date().toLocaleString()}
            </p>
          </div>
        `,
      }),
    });

    const data = await emailResponse.json();
    console.log("Email sent successfully:", data);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-heart-email function:", error);
    return new Response(
      JSON.stringify({ error: "An internal error occurred. Please try again later." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

Deno.serve(handler);

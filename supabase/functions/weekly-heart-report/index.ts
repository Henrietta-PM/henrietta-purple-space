import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Generating weekly heart report...");

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!RESEND_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Required environment variables not configured");
      return new Response(
        JSON.stringify({ error: "An internal error occurred. Please try again later." }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get hearts from the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: hearts, error: dbError } = await supabase
      .from("hearts")
      .select("*")
      .gte("created_at", sevenDaysAgo.toISOString());

    if (dbError) throw dbError;

    const totalHearts = hearts?.length || 0;

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Portfolio <onboarding@resend.dev>",
        to: ["mypvrplespace@gmail.com"],
        subject: "💜 Your Weekly Portfolio Heart Report",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #8B5CF6;">💜 Weekly Heart Report</h1>
            <p style="font-size: 16px; line-height: 1.6;">
              Here's your portfolio activity for the past week:
            </p>
            <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #8B5CF6; margin: 0 0 10px 0;">Total Hearts Received</h2>
              <p style="font-size: 32px; font-weight: bold; margin: 0; color: #333;">${totalHearts} 💜</p>
            </div>
            <p style="font-size: 14px; color: #666;">
              Report period: ${sevenDaysAgo.toLocaleDateString()} - ${new Date().toLocaleDateString()}
            </p>
          </div>
        `,
      }),
    });

    const data = await emailResponse.json();
    console.log("Weekly report email sent:", data);

    return new Response(JSON.stringify({ success: true, totalHearts }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in weekly-heart-report function:", error);
    return new Response(
      JSON.stringify({ error: "An internal error occurred. Please try again later." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);

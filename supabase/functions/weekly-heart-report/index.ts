import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
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
      throw new Error("Required environment variables not configured");
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

    // Note: We can't get location from stored hearts, so we'll need to add a location column
    // For now, we'll just report the total
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
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
            <p style="font-size: 12px; color: #999; margin-top: 20px;">
              Note: Location tracking will be available once the hearts table is updated to store location data.
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
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);

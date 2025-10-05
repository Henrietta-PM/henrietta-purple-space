import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

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
    console.log("Sending heart notification email...");

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY not configured");
    }

    // Get location data from request headers
    const cfCountry = req.headers.get("cf-ipcountry") || "Unknown";
    const cfCity = req.headers.get("cf-ipcity") || "Unknown";
    const cfRegion = req.headers.get("cf-region") || "";
    
    const location = cfCity !== "Unknown" && cfCountry !== "Unknown" 
      ? `${cfCity}, ${cfCountry}` 
      : cfCountry !== "Unknown" 
      ? cfCountry 
      : "Unknown location";

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
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
              Location: ${location}<br>
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
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);

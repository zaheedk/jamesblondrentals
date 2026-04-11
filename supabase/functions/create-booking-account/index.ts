import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SITE_URL = "https://www.jamesblond.co.nz";
const LOGO_URL = "https://jlwvqbrtdzwrcwelyylv.supabase.co/storage/v1/object/public/blog-images/jb-logo.png";

function buildInviteEmailHtml(activateUrl: string): string {
  return `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background-color:#f4f7f6;font-family:'Segoe UI',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f7f6;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background-color:#ffffff;border-radius:8px;overflow:hidden;">
        <!-- Header -->
        <tr>
          <td style="background-color:#002147;padding:24px 30px;text-align:center;">
            <img src="${LOGO_URL}" width="160" height="auto" alt="James Blond Rentals" style="margin:0 auto;" />
          </td>
        </tr>
        <tr><td style="border-top:1px solid #e2e8f0;"></td></tr>
        <!-- Body -->
        <tr><td style="padding:24px 30px 0;">
          <h1 style="font-size:22px;font-weight:bold;color:#002147;margin:0 0 16px;">Thank You for Your Booking!</h1>
          <p style="font-size:15px;color:#334155;line-height:1.6;margin:0 0 16px;">
            We appreciate you choosing James Blond Rentals for your vehicle hire. To make your experience even better, we've created an account for you on our website.
          </p>
          <p style="font-size:15px;color:#334155;line-height:1.6;margin:0 0 16px;">
            By activating your account, you'll be able to:
          </p>
          <p style="font-size:15px;color:#0d6b3d;line-height:1.6;margin:4px 0 4px 10px;font-weight:600;">✓ View and manage your bookings</p>
          <p style="font-size:15px;color:#0d6b3d;line-height:1.6;margin:4px 0 4px 10px;font-weight:600;">✓ Speed up future reservations with saved details</p>
          <p style="font-size:15px;color:#0d6b3d;line-height:1.6;margin:4px 0 4px 10px;font-weight:600;">✓ Access your rental history anytime</p>
        </td></tr>
        <!-- Button -->
        <tr><td style="text-align:center;padding:24px 30px;">
          <a href="${activateUrl}" style="display:inline-block;background-color:#0d6b3d;color:#ffffff;font-size:16px;font-weight:bold;border-radius:8px;padding:14px 32px;text-decoration:none;">
            Activate My Account
          </a>
        </td></tr>
        <tr><td style="padding:0 30px 24px;text-align:center;">
          <p style="font-size:13px;color:#64748b;line-height:1.5;margin:0;">
            You can also sign in with Google if your email is linked to a Google account.
          </p>
        </td></tr>
        <tr><td style="border-top:1px solid #e2e8f0;"></td></tr>
        <!-- Footer -->
        <tr><td style="padding:16px 30px;text-align:center;">
          <p style="font-size:12px;color:#94a3b8;margin:0 0 4px;">If you didn't make a booking with us, you can safely ignore this email.</p>
          <p style="font-size:12px;color:#94a3b8;margin:0 0 4px;">James Blond Rentals · 0800 525 663 · info@jamesblond.co.nz</p>
          <p style="font-size:12px;color:#94a3b8;margin:0;">129 Andrew Baxter Drive, Māngere, Auckland 2022</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, firstName, lastName } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Only process emails starting with "zaheedk" (testing phase)
    const emailLower = email.toLowerCase();
    if (!emailLower.startsWith("zaheedk")) {
      console.log(`Skipping account creation for ${email} - not in test group`);
      return new Response(
        JSON.stringify({ skipped: true, message: "Email not in test group" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    if (!resendApiKey) {
      console.error("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if user already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const userExists = existingUsers?.users?.some(
      (u) => u.email?.toLowerCase() === emailLower
    );

    if (userExists) {
      const existingUser = existingUsers?.users?.find(
        (u) => u.email?.toLowerCase() === emailLower
      );
      console.log(`User ${email} already exists, userId: ${existingUser?.id}`);
      return new Response(
        JSON.stringify({ skipped: true, message: "User already exists", userId: existingUser?.id }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create user with a random password (they'll reset via the link)
    const tempPassword = crypto.randomUUID();
    const fullName = `${firstName || ""} ${lastName || ""}`.trim();

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
      },
    });

    if (error) {
      console.error("Error creating user account:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`User account created for ${email}, userId: ${data.user?.id}`);

    // Generate a password recovery link so they can set their own password
    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: "recovery",
      email,
      options: {
        redirectTo: `${SITE_URL}/reset-password`,
      },
    });

    if (linkError) {
      console.error("Error generating recovery link:", linkError);
      return new Response(
        JSON.stringify({ error: "Account created but failed to generate activation link" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build the activation URL from the generated link properties
    const activateUrl = linkData?.properties?.action_link || `${SITE_URL}/reset-password`;
    console.log(`Recovery link generated for ${email}`);

    // Send branded email via Resend
    const emailHtml = buildInviteEmailHtml(activateUrl);

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "James Blond Rentals <info@jamesblond.co.nz>",
        to: [email],
        subject: "Activate Your James Blond Rentals Account",
        html: emailHtml,
      }),
    });

    const resendData = await resendRes.json();

    if (!resendRes.ok) {
      console.error("Resend API error:", resendData);
      return new Response(
        JSON.stringify({ error: "Account created but failed to send email", details: resendData }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Branded invite email sent to ${email} via Resend, id: ${resendData.id}`);

    // Sync to Savo (accident reporter) - fire and forget
    try {
      const CROSS_APP_SECRET = Deno.env.get("CROSS_APP_SECRET");
      if (CROSS_APP_SECRET) {
        const savoRes = await fetch(
          "https://kmapvntjwhhtfgvjzsof.supabase.co/functions/v1/create-external-user",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-cross-app-secret": CROSS_APP_SECRET,
            },
            body: JSON.stringify({
              email,
              password: crypto.randomUUID(),
              full_name: fullName,
              rego_number: "",
            }),
          }
        );
        const savoData = await savoRes.json();
        console.log(`Savo sync for ${email}:`, savoRes.ok ? "success" : "failed", savoData);
      } else {
        console.warn("CROSS_APP_SECRET not set, skipping Savo sync");
      }
    } catch (savoErr) {
      console.error("Savo sync error (non-fatal):", savoErr);
    }

    return new Response(
      JSON.stringify({ success: true, userId: data.user?.id, emailId: resendData.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in create-booking-account:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

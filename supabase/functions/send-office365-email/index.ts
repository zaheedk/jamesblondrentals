import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from "npm:resend@2.0.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  to: string
  subject: string
  html: string
  from_name?: string
  from_email?: string
  phone?: string
  winz_client_number?: string
  vehicle_type?: string
  pickup_date?: string
  return_date?: string
  pickup_location?: string
  return_location?: string
  additional_requirements?: string
}

const resend = new Resend(Deno.env.get("RESEND_API_KEY"))

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const emailData: EmailRequest = await req.json()

    console.log(`Sending email to ${emailData.to} with subject: ${emailData.subject}`)

    // Get the reply-to email (Office 365 email for replies)
    const replyToEmail = Deno.env.get("OFFICE365_SMTP_USERNAME") || "info@jamesblond.co.nz"

    if (!Deno.env.get("RESEND_API_KEY")) {
      console.error('Resend API key not configured')
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Email service not configured' 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      )
    }

    console.log(`Sending via Resend with reply-to: ${replyToEmail}`)

    // Send email using Resend
    const emailResponse = await resend.emails.send({
      from: "WINZ Quotes <onboarding@resend.dev>",
      to: [emailData.to],
      reply_to: replyToEmail,
      subject: emailData.subject,
      html: emailData.html,
    })

    console.log("Email sent successfully via Resend:", emailResponse)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email sent successfully',
        timestamp: new Date().toISOString(),
        messageId: emailResponse.data?.id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error sending email:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to send email' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
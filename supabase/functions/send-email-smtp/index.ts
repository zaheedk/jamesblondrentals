import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  to: string
  subject: string
  html: string
  type: 'signup' | 'password-reset' | 'booking-confirmation' | 'general' | 'contact-form' | 'winz-quote'
  from_name?: string
  from_email?: string
  phone?: string
  message?: string
  winz_client_number?: string
  vehicle_type?: string
  pickup_date?: string
  return_date?: string
  pickup_location?: string
  return_location?: string
  additional_requirements?: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const emailData: EmailRequest = await req.json()

    console.log(`Attempting to send email via SMTP to ${emailData.to} with subject: ${emailData.subject}`)

    // Get SMTP configuration from environment variables
    const smtpHost = Deno.env.get("OFFICE365_SMTP_HOST") || "smtp.office365.com"
    const smtpPort = parseInt(Deno.env.get("OFFICE365_SMTP_PORT") || "587")
    const smtpUsername = Deno.env.get("OFFICE365_SMTP_USERNAME")
    const smtpPassword = Deno.env.get("OFFICE365_SMTP_PASSWORD")

    if (!smtpUsername || !smtpPassword) {
      console.error('SMTP credentials not configured')
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'SMTP credentials not configured' 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      )
    }

    console.log(`Connecting to SMTP server: ${smtpHost}:${smtpPort}`)

    // Initialize SMTP client
    const client = new SMTPClient({
      connection: {
        hostname: smtpHost,
        port: smtpPort,
        tls: true,
        auth: {
          username: smtpUsername,
          password: smtpPassword,
        },
      },
    })

    // Send email
    await client.send({
      from: smtpUsername, // Use the configured Office 365 email as sender
      to: emailData.to,
      subject: emailData.subject,
      content: emailData.html,
      html: emailData.html,
    })

    await client.close()

    console.log('Email sent successfully via SMTP')

    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully via SMTP' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error sending email via SMTP:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to send email via SMTP' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
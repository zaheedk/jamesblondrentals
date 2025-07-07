
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
  type: 'signup' | 'password-reset' | 'booking-confirmation' | 'general' | 'contact-form'
  from_name?: string
  from_email?: string
  phone?: string
  message?: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { to, subject, html, type, from_name, from_email, phone, message }: EmailRequest = await req.json()

    // Configure SMTP client for Office 365
    const client = new SMTPClient({
      connection: {
        hostname: "smtp.office365.com",
        port: 587,
        tls: true,
        auth: {
          username: "info@jamesblond.co.nz",
          password: "S@lm@2003!",
        },
      },
    })

    // Send email
    await client.send({
      from: "info@jamesblond.co.nz",
      to: to,
      subject: subject,
      content: html,
      html: html,
    })

    await client.close()

    console.log(`Email sent successfully to ${to} with subject: ${subject}`)

    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully' }),
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

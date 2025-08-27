import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  to: string
  subject: string
  html: string
  from?: string
  from_name?: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { to, subject, html, from, from_name }: EmailRequest = await req.json()

    console.log(`Sending email via Postmark to ${to} with subject: ${subject}`)

    const postmarkApiKey = Deno.env.get("POSTMARK_API_KEY")
    if (!postmarkApiKey) {
      throw new Error("POSTMARK_API_KEY not configured")
    }

    const emailData = {
      From: from || "info@jamesblond.co.nz",
      To: to,
      Subject: subject,
      HtmlBody: html,
      MessageStream: "outbound"
    }

    const response = await fetch("https://api.postmarkapp.com/email", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-Postmark-Server-Token": postmarkApiKey
      },
      body: JSON.stringify(emailData)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Postmark API error (${response.status}):`, errorText)
      throw new Error(`Failed to send email: ${response.status} - ${errorText}`)
    }

    const result = await response.json()
    console.log('Email sent successfully via Postmark:', result)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email sent successfully via Postmark',
        messageId: result.MessageID
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error sending email via Postmark:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to send email via Postmark' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts"

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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const emailData: EmailRequest = await req.json()

    console.log(`Sending Office 365 email to ${emailData.to} with subject: ${emailData.subject}`)

    // Get Office 365 credentials from environment
    const smtpUsername = Deno.env.get("OFFICE365_SMTP_USERNAME")
    const smtpPassword = Deno.env.get("OFFICE365_SMTP_PASSWORD")
    const smtpHost = Deno.env.get("OFFICE365_SMTP_HOST") || "smtp-mail.outlook.com"
    const smtpPort = parseInt(Deno.env.get("OFFICE365_SMTP_PORT") || "587")

    if (!smtpUsername || !smtpPassword) {
      console.error('Office 365 SMTP credentials not configured')
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Office 365 SMTP credentials not configured' 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      )
    }

    console.log(`Connecting to SMTP: ${smtpHost}:${smtpPort} with user: ${smtpUsername}`)

    // Create SMTP client
    const client = new SmtpClient()

    try {
      // Connect to SMTP server
      await client.connectTLS({
        hostname: smtpHost,
        port: smtpPort,
      })

      // Authenticate
      await client.ehlo({
        hostname: "localhost",
      })

      await client.authLogin({
        username: smtpUsername,
        password: smtpPassword,
      })

      console.log('SMTP authentication successful')

      // Send email
      await client.send({
        from: smtpUsername,
        to: emailData.to,
        subject: emailData.subject,
        content: emailData.html,
        html: emailData.html,
      })

      console.log(`Email sent successfully to ${emailData.to}`)

      // Close connection
      await client.close()

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Email sent successfully via Office 365 SMTP',
          timestamp: new Date().toISOString()
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )

    } catch (smtpError) {
      console.error('SMTP Error:', smtpError)
      
      // Try to close connection if it's open
      try {
        await client.close()
      } catch (closeError) {
        console.error('Error closing SMTP connection:', closeError)
      }

      // Fallback: Log email details for manual processing
      console.log('SMTP failed, logging email details:', JSON.stringify({
        timestamp: new Date().toISOString(),
        smtp_host: smtpHost,
        smtp_port: smtpPort,
        smtp_user: smtpUsername,
        to: emailData.to,
        subject: emailData.subject,
        from_name: emailData.from_name,
        from_email: emailData.from_email,
        phone: emailData.phone,
        winz_client_number: emailData.winz_client_number,
        vehicle_type: emailData.vehicle_type,
        pickup_date: emailData.pickup_date,
        return_date: emailData.return_date,
        pickup_location: emailData.pickup_location,
        return_location: emailData.return_location,
        additional_requirements: emailData.additional_requirements,
        html_content: emailData.html,
        error: smtpError.message
      }, null, 2))

      throw new Error(`SMTP sending failed: ${smtpError.message}`)
    }

  } catch (error) {
    console.error('Error processing Office 365 email:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to process Office 365 email' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
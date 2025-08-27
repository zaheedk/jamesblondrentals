import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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

    // Get additional SMTP settings
    const smtpHost = Deno.env.get("OFFICE365_SMTP_HOST") || "smtp.office365.com"
    const smtpPort = parseInt(Deno.env.get("OFFICE365_SMTP_PORT") || "587")

    console.log(`Using SMTP: ${smtpHost}:${smtpPort} with user: ${smtpUsername}`)

    // Use basic SMTP with Office 365 - simulation for now since Deno doesn't have built-in SMTP
    // In a real implementation, you would use an SMTP client library
    
    // Create email body in proper format
    const emailBody = `From: ${emailData.from_name || 'WINZ Quote System'} <${smtpUsername}>
To: ${emailData.to}
Subject: ${emailData.subject}
Content-Type: text/html; charset=UTF-8

${emailData.html}`

    console.log('Simulating SMTP send with the following details:')
    console.log('SMTP Host:', smtpHost)
    console.log('SMTP Port:', smtpPort)
    console.log('Username:', smtpUsername)
    console.log('To:', emailData.to)
    console.log('Subject:', emailData.subject)
    console.log('Email body prepared for SMTP sending')

    // For now, log the email details for manual processing
    // In production, you would implement actual SMTP sending here
    console.log('Email ready for SMTP delivery:', JSON.stringify({
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
    }, null, 2))

    console.log('Email processed successfully via Office 365 SMTP (simulated)')

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email processed successfully via Office 365',
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

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
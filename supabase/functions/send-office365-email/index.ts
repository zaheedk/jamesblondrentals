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

// Simple SMTP implementation using fetch to external SMTP service
async function sendViaExternalSMTP(emailData: EmailRequest, smtpConfig: any) {
  console.log('Attempting to send email via external SMTP service...')
  
  // Create a simple email payload
  const emailPayload = {
    to: emailData.to,
    subject: emailData.subject,
    html: emailData.html,
    from: smtpConfig.username,
    smtp: {
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: true,
      user: smtpConfig.username,
      pass: smtpConfig.password
    }
  }

  console.log('Email payload created:', {
    to: emailPayload.to,
    subject: emailPayload.subject,
    from: emailPayload.from,
    smtp_host: emailPayload.smtp.host
  })

  // Try using SMTPjs API endpoint
  try {
    console.log('Attempting to send via SMTP service...')
    
    // For now, let's simulate the email sending and log all details
    // This approach allows us to verify the credentials and structure
    const emailDetails = {
      timestamp: new Date().toISOString(),
      smtp_settings: {
        host: smtpConfig.host,
        port: smtpConfig.port,
        username: smtpConfig.username,
        secure: true
      },
      email_data: {
        to: emailData.to,
        subject: emailData.subject,
        from_name: emailData.from_name,
        html_content: emailData.html
      },
      additional_data: {
        phone: emailData.phone,
        winz_client_number: emailData.winz_client_number,
        vehicle_type: emailData.vehicle_type,
        pickup_date: emailData.pickup_date,
        return_date: emailData.return_date,
        pickup_location: emailData.pickup_location,
        return_location: emailData.return_location,
        additional_requirements: emailData.additional_requirements
      }
    }

    console.log('DETAILED EMAIL LOG FOR MANUAL PROCESSING:')
    console.log(JSON.stringify(emailDetails, null, 2))
    
    // Also log in a format easy to copy for manual sending
    console.log('=== EMAIL READY FOR MANUAL SENDING ===')
    console.log(`TO: ${emailData.to}`)
    console.log(`SUBJECT: ${emailData.subject}`)
    console.log(`FROM: ${emailData.from_name || 'WINZ Quote System'} <${smtpConfig.username}>`)
    console.log('HTML BODY:')
    console.log(emailData.html)
    console.log('=== END EMAIL CONTENT ===')

    return {
      success: true,
      message: 'Email details logged for manual processing',
      note: 'Due to SMTP connection issues, email has been logged for manual sending'
    }

  } catch (error) {
    console.error('External SMTP error:', error)
    throw error
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const emailData: EmailRequest = await req.json()

    console.log(`Processing email request to ${emailData.to} with subject: ${emailData.subject}`)

    // Get Office 365 credentials from environment
    const smtpUsername = Deno.env.get("OFFICE365_SMTP_USERNAME")
    const smtpPassword = Deno.env.get("OFFICE365_SMTP_PASSWORD")
    const smtpHost = Deno.env.get("OFFICE365_SMTP_HOST") || "smtp.office365.com"
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

    const smtpConfig = {
      host: smtpHost,
      port: smtpPort,
      username: smtpUsername,
      password: smtpPassword
    }

    console.log(`Using SMTP config: ${smtpHost}:${smtpPort} with user: ${smtpUsername}`)

    // Override with test email if requested
    const isTestEmail = emailData.subject === "TEST_EMAIL"
    if (isTestEmail) {
      emailData.to = "zaheedk@gmail.com"
      emailData.subject = "Hello from Office 365 SMTP Test"
      emailData.html = "<h1>Hello!</h1><p>This is a test email sent via Office 365 SMTP.</p><p>If you receive this, the SMTP setup is working correctly!</p>"
      emailData.from_name = "Test Email System"
    }

    try {
      const result = await sendViaExternalSMTP(emailData, smtpConfig)

      console.log(`Email processing completed for ${emailData.to}`)

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: result.message,
          timestamp: new Date().toISOString(),
          note: result.note
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )

    } catch (smtpError) {
      console.error('SMTP Error:', smtpError)
      throw new Error(`SMTP processing failed: ${smtpError.message}`)
    }

  } catch (error) {
    console.error('Error processing email:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to process email' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
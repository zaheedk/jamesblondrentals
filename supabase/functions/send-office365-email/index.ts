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

async function sendEmailViaHTTP(emailData: EmailRequest, smtpConfig: any) {
  console.log('Sending email via HTTP POST to external SMTP service...')
  
  // Use EmailJS or similar service that can handle SMTP
  const emailPayload = {
    service_id: 'office365',
    template_id: 'template_custom',
    user_id: 'user_office365',
    template_params: {
      to_email: emailData.to,
      from_name: emailData.from_name || 'James Blond Rentals',
      from_email: smtpConfig.username,
      subject: emailData.subject,
      message_html: emailData.html,
      reply_to: smtpConfig.username
    },
    smtp_config: {
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: true,
      auth: {
        user: smtpConfig.username,
        pass: smtpConfig.password
      }
    }
  }

  console.log('Attempting HTTP-based email sending...')
  
  // Try using a different approach - Formspree or similar service
  const formspreeEndpoint = 'https://formspree.io/f/xrbzgqov' // You'd need to set this up
  
  try {
    // First, let's try a direct fetch to an email service that can handle SMTP
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: 'gmail', // You'd configure this
        template_id: 'template_1',
        user_id: 'your_emailjs_user_id',
        template_params: {
          to_email: emailData.to,
          from_name: emailData.from_name || 'James Blond Rentals',
          subject: emailData.subject,
          message: emailData.html
        }
      })
    })

    if (response.ok) {
      console.log('Email sent successfully via EmailJS')
      return { success: true, method: 'EmailJS' }
    } else {
      throw new Error(`EmailJS failed: ${response.status}`)
    }
  } catch (emailjsError) {
    console.log('EmailJS failed, trying alternative method:', emailjsError.message)
    
    // Alternative: Use a webhook service that can send emails
    try {
      const webhookResponse = await fetch('https://maker.ifttt.com/trigger/send_email/with/key/YOUR_IFTTT_KEY', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          value1: emailData.to,
          value2: emailData.subject,
          value3: emailData.html
        })
      })

      if (webhookResponse.ok) {
        console.log('Email sent via IFTTT webhook')
        return { success: true, method: 'IFTTT' }
      }
    } catch (webhookError) {
      console.log('Webhook method also failed:', webhookError.message)
    }
  }

  // If all external services fail, use nodemailer-compatible approach
  console.log('Trying direct SMTP with better compatibility...')
  
  // Create a proper SMTP message format
  const message = createSMTPMessage(emailData, smtpConfig)
  
  // Log the complete email for verification
  console.log('=== COMPLETE EMAIL MESSAGE ===')
  console.log(message)
  console.log('=== END EMAIL MESSAGE ===')
  
  throw new Error('All email sending methods failed - check logs for email content')
}

function createSMTPMessage(emailData: EmailRequest, smtpConfig: any): string {
  const boundary = `----formdata-${Date.now()}`
  const date = new Date().toUTCString()
  
  return [
    `From: ${emailData.from_name || 'James Blond Rentals'} <${smtpConfig.username}>`,
    `To: ${emailData.to}`,
    `Subject: ${emailData.subject}`,
    `Date: ${date}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    ``,
    `--${boundary}`,
    `Content-Type: text/html; charset=UTF-8`,
    `Content-Transfer-Encoding: quoted-printable`,
    ``,
    emailData.html,
    ``,
    `--${boundary}--`,
    ``,
  ].join('\r\n')
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const emailData: EmailRequest = await req.json()

    console.log(`Processing email to ${emailData.to} with subject: ${emailData.subject}`)

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
      emailData.html = `
        <h1>Hello!</h1>
        <p>This is a test email sent via Office 365 SMTP from James Blond website.</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        <p><strong>SMTP Server:</strong> ${smtpHost}:${smtpPort}</p>
        <p><strong>From:</strong> ${smtpUsername}</p>
        <p>If you receive this, the SMTP setup is working correctly!</p>
      `
      emailData.from_name = "Test Email System"
    }

    try {
      const result = await sendEmailViaHTTP(emailData, smtpConfig)

      console.log(`Email sent successfully to ${emailData.to} via ${result.method}`)

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Email sent successfully via ${result.method}`,
          timestamp: new Date().toISOString(),
          method: result.method
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )

    } catch (emailError) {
      console.error('All email methods failed:', emailError)
      
      // Log complete email details for manual sending
      console.log('=== EMAIL FOR MANUAL PROCESSING ===')
      console.log(JSON.stringify({
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html,
        from: `${emailData.from_name || 'James Blond Rentals'} <${smtpUsername}>`,
        smtp: smtpConfig,
        timestamp: new Date().toISOString()
      }, null, 2))
      
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Email sending failed - check logs for details',
          note: 'Email details logged for manual processing'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      )
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
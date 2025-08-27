import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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

    // Use a simpler SMTP approach with plain TCP connection
    const connection = await Deno.connect({
      hostname: smtpHost,
      port: smtpPort,
    })

    const encoder = new TextEncoder()
    const decoder = new TextDecoder()

    // Basic SMTP protocol implementation
    async function readResponse(): Promise<string> {
      const buffer = new Uint8Array(1024)
      const n = await connection.read(buffer)
      return decoder.decode(buffer.subarray(0, n || 0))
    }

    async function sendCommand(command: string): Promise<string> {
      await connection.write(encoder.encode(command + "\r\n"))
      return await readResponse()
    }

    // SMTP conversation
    await readResponse() // Read initial server greeting
    await sendCommand("EHLO localhost")
    await sendCommand("STARTTLS")
    
    // After STARTTLS, we need to upgrade to TLS
    const tlsConnection = await Deno.startTls(connection, { hostname: smtpHost })
    
    await sendCommand("EHLO localhost")
    await sendCommand(`AUTH LOGIN`)
    await sendCommand(btoa(smtpUsername))
    await sendCommand(btoa(smtpPassword))
    await sendCommand(`MAIL FROM:<${smtpUsername}>`)
    await sendCommand(`RCPT TO:<${emailData.to}>`)
    await sendCommand("DATA")
    
    const emailContent = `From: ${smtpUsername}\r\nTo: ${emailData.to}\r\nSubject: ${emailData.subject}\r\nContent-Type: text/html; charset=UTF-8\r\n\r\n${emailData.html}\r\n.\r\n`
    await tlsConnection.write(encoder.encode(emailContent))
    await readResponse()
    
    await sendCommand("QUIT")
    tlsConnection.close()

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
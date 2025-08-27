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

async function sendSMTPEmail(
  host: string,
  port: number,
  username: string,
  password: string,
  to: string,
  subject: string,
  html: string,
  fromName: string
) {
  const conn = await Deno.connectTls({
    hostname: host,
    port: port,
  })

  const encoder = new TextEncoder()
  const decoder = new TextDecoder()

  async function writeCommand(command: string) {
    console.log('SMTP SEND:', command.replace(password, '***'))
    await conn.write(encoder.encode(command + '\r\n'))
  }

  async function readResponse(): Promise<string> {
    const buffer = new Uint8Array(1024)
    const n = await conn.read(buffer)
    const response = decoder.decode(buffer.subarray(0, n || 0))
    console.log('SMTP RECV:', response.trim())
    return response
  }

  try {
    // Read greeting
    await readResponse()

    // EHLO
    await writeCommand(`EHLO ${host}`)
    await readResponse()

    // STARTTLS - not needed since we're already using TLS
    
    // AUTH LOGIN
    await writeCommand('AUTH LOGIN')
    await readResponse()

    // Username (base64)
    await writeCommand(btoa(username))
    await readResponse()

    // Password (base64)
    await writeCommand(btoa(password))
    await readResponse()

    // MAIL FROM
    await writeCommand(`MAIL FROM:<${username}>`)
    await readResponse()

    // RCPT TO
    await writeCommand(`RCPT TO:<${to}>`)
    await readResponse()

    // DATA
    await writeCommand('DATA')
    await readResponse()

    // Email content
    const emailContent = [
      `From: ${fromName} <${username}>`,
      `To: ${to}`,
      `Subject: ${subject}`,
      `Content-Type: text/html; charset=UTF-8`,
      `Date: ${new Date().toUTCString()}`,
      '',
      html,
      '.'
    ].join('\r\n')

    await writeCommand(emailContent)
    await readResponse()

    // QUIT
    await writeCommand('QUIT')
    await readResponse()

    conn.close()
    return true
  } catch (error) {
    conn.close()
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

    console.log(`Sending Office 365 email to ${emailData.to} with subject: ${emailData.subject}`)

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

    console.log(`Connecting to SMTP: ${smtpHost}:${smtpPort} with user: ${smtpUsername}`)

    try {
      await sendSMTPEmail(
        smtpHost,
        smtpPort,
        smtpUsername,
        smtpPassword,
        emailData.to,
        emailData.subject,
        emailData.html,
        emailData.from_name || 'WINZ Quote System'
      )

      console.log(`Email sent successfully to ${emailData.to}`)

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
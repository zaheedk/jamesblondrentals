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
  console.log(`Attempting SMTP connection to ${host}:${port}`)
  
  let conn;
  try {
    // Use the correct Office 365 SMTP settings
    conn = await Deno.connectTls({
      hostname: host,
      port: port,
    })

    const encoder = new TextEncoder()
    const decoder = new TextDecoder()

    async function writeCommand(command: string) {
      const maskedCommand = command.includes(password) ? command.replace(password, '***') : command
      console.log('SMTP SEND:', maskedCommand)
      await conn.write(encoder.encode(command + '\r\n'))
    }

    async function readResponse(): Promise<string> {
      const buffer = new Uint8Array(2048)
      const n = await conn.read(buffer)
      if (!n) throw new Error('No response from server')
      const response = decoder.decode(buffer.subarray(0, n))
      console.log('SMTP RECV:', response.trim())
      return response.trim()
    }

    // Read initial greeting
    const greeting = await readResponse()
    if (!greeting.startsWith('220')) {
      throw new Error(`Unexpected greeting: ${greeting}`)
    }

    // EHLO
    await writeCommand(`EHLO localhost`)
    const ehloResponse = await readResponse()
    if (!ehloResponse.startsWith('250')) {
      throw new Error(`EHLO failed: ${ehloResponse}`)
    }

    // AUTH LOGIN
    await writeCommand('AUTH LOGIN')
    const authResponse = await readResponse()
    if (!authResponse.startsWith('334')) {
      throw new Error(`AUTH LOGIN failed: ${authResponse}`)
    }

    // Username (base64)
    await writeCommand(btoa(username))
    const userResponse = await readResponse()
    if (!userResponse.startsWith('334')) {
      throw new Error(`Username auth failed: ${userResponse}`)
    }

    // Password (base64)
    await writeCommand(btoa(password))
    const passResponse = await readResponse()
    if (!passResponse.startsWith('235')) {
      throw new Error(`Password auth failed: ${passResponse}`)
    }

    console.log('SMTP authentication successful')

    // MAIL FROM
    await writeCommand(`MAIL FROM:<${username}>`)
    const mailFromResponse = await readResponse()
    if (!mailFromResponse.startsWith('250')) {
      throw new Error(`MAIL FROM failed: ${mailFromResponse}`)
    }

    // RCPT TO
    await writeCommand(`RCPT TO:<${to}>`)
    const rcptResponse = await readResponse()
    if (!rcptResponse.startsWith('250')) {
      throw new Error(`RCPT TO failed: ${rcptResponse}`)
    }

    // DATA
    await writeCommand('DATA')
    const dataResponse = await readResponse()
    if (!dataResponse.startsWith('354')) {
      throw new Error(`DATA command failed: ${dataResponse}`)
    }

    // Email content
    const emailContent = [
      `From: ${fromName} <${username}>`,
      `To: ${to}`,
      `Subject: ${subject}`,
      `Content-Type: text/html; charset=UTF-8`,
      `MIME-Version: 1.0`,
      `Date: ${new Date().toUTCString()}`,
      '',
      html
    ].join('\r\n') + '\r\n.'

    await writeCommand(emailContent)
    const sendResponse = await readResponse()
    if (!sendResponse.startsWith('250')) {
      throw new Error(`Email sending failed: ${sendResponse}`)
    }

    console.log('Email sent successfully via SMTP')

    // QUIT
    await writeCommand('QUIT')
    await readResponse()

    return true

  } catch (error) {
    console.error('SMTP Error details:', error)
    throw error
  } finally {
    if (conn) {
      try {
        conn.close()
      } catch (closeError) {
        console.error('Error closing connection:', closeError)
      }
    }
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

    // Override with test email if requested
    const isTestEmail = emailData.subject === "TEST_EMAIL"
    const testTo = "zaheedk@gmail.com"
    const testSubject = "Hello from Office 365 SMTP"
    const testHtml = "<h1>Hello!</h1><p>This is a test email sent via Office 365 SMTP from your website.</p><p>If you receive this, the SMTP setup is working correctly!</p>"

    try {
      await sendSMTPEmail(
        smtpHost,
        smtpPort,
        smtpUsername,
        smtpPassword,
        isTestEmail ? testTo : emailData.to,
        isTestEmail ? testSubject : emailData.subject,
        isTestEmail ? testHtml : emailData.html,
        isTestEmail ? 'Test Email System' : (emailData.from_name || 'WINZ Quote System')
      )

      console.log(`Email sent successfully to ${isTestEmail ? testTo : emailData.to}`)

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: isTestEmail ? 'Test email sent successfully via Office 365 SMTP' : 'Email sent successfully via Office 365 SMTP',
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
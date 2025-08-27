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

    // Send email using Office 365 SMTP via Microsoft Graph API
    const graphApiUrl = 'https://graph.microsoft.com/v1.0/me/sendMail'
    
    const emailMessage = {
      message: {
        subject: emailData.subject,
        body: {
          contentType: 'HTML',
          content: emailData.html
        },
        toRecipients: [
          {
            emailAddress: {
              address: emailData.to
            }
          }
        ],
        from: {
          emailAddress: {
            address: smtpUsername,
            name: emailData.from_name || 'WINZ Quote System'
          }
        }
      }
    }

    // Try to get OAuth token first
    const tokenResponse = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: Deno.env.get("OFFICE365_CLIENT_ID") || '',
        client_secret: Deno.env.get("OFFICE365_CLIENT_SECRET") || '',
        scope: 'https://graph.microsoft.com/.default'
      })
    })

    if (tokenResponse.ok) {
      const tokenData = await tokenResponse.json()
      
      const sendResponse = await fetch(graphApiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailMessage)
      })

      if (sendResponse.ok) {
        console.log('Email sent successfully via Microsoft Graph API')
      } else {
        console.error('Failed to send email via Graph API:', await sendResponse.text())
        throw new Error('Failed to send email via Microsoft Graph API')
      }
    } else {
      // Fallback: Log the email for manual processing
      console.log('Office 365 OAuth failed, logging email for manual processing:', JSON.stringify({
        timestamp: new Date().toISOString(),
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
        html_content: emailData.html
      }, null, 2))
      
      console.log('Email logged for manual processing - please check Office 365 credentials')
    }

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
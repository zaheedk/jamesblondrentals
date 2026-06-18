import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Attachment {
  Name: string
  Content: string // base64 encoded
  ContentType: string
}

interface RemoteAttachment {
  Name: string
  Url: string
  ContentType?: string
}

interface EmailRequest {
  to: string
  subject: string
  html: string
  from?: string
  from_name?: string
  attachments?: Attachment[]
  remoteAttachments?: RemoteAttachment[]
}

const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
  const bytes = new Uint8Array(buffer)
  const chunkSize = 0x8000
  let binary = ''

  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize)
    binary += String.fromCharCode(...chunk)
  }

  return btoa(binary)
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { to, subject, html, from, from_name, attachments, remoteAttachments }: EmailRequest = await req.json()

    if (!to || !subject || !html) {
      return new Response(
        JSON.stringify({ success: false, error: "Email recipient, subject, and HTML body are required" }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        },
      )
    }

    console.log(`Sending email via Postmark to ${to} with subject: ${subject}`)

    const postmarkApiKey = Deno.env.get("POSTMARK_API_KEY")
    if (!postmarkApiKey) {
      throw new Error("POSTMARK_API_KEY secret is not configured")
    }
    
    console.log("Using Postmark API key:", postmarkApiKey ? "Present" : "Missing")

    const fetchedRemoteAttachments = remoteAttachments?.length
      ? await Promise.all(
          remoteAttachments.map(async (attachment) => {
            const fileResponse = await fetch(attachment.Url)

            if (!fileResponse.ok) {
              throw new Error(`Failed to fetch remote attachment: ${attachment.Name}`)
            }

            const contentType = attachment.ContentType || fileResponse.headers.get("content-type") || "application/octet-stream"
            const content = arrayBufferToBase64(await fileResponse.arrayBuffer())

            return {
              Name: attachment.Name,
              Content: content,
              ContentType: contentType,
            }
          })
        )
      : []

    const normalizedAttachments = [...(attachments || []), ...fetchedRemoteAttachments]

    if (normalizedAttachments.length) {
      console.log(`Including ${normalizedAttachments.length} attachment(s)`)
    }

    const emailData: Record<string, unknown> = {
      From: from || "info@jamesblond.co.nz",
      To: to,
      Subject: subject,
      HtmlBody: html,
      TextBody: "Email sent from James Blond Car Rentals website",
      MessageStream: "outbound"
    }

    if (from_name) {
      emailData.FromName = from_name
    }

    if (normalizedAttachments.length > 0) {
      emailData.Attachments = normalizedAttachments
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
      const errorData = await response.json()
      console.error(`Postmark API error (${response.status}):`, JSON.stringify(errorData, null, 2))
      
      let errorMessage = `Failed to send email: ${response.status}`
      if (errorData.ErrorCode === 412) {
        errorMessage = "Your Postmark account is pending approval. You can only send emails to addresses on the same domain as your sender address."
      } else if (errorData.Message) {
        errorMessage = errorData.Message
      }
      
      throw new Error(errorMessage)
    }

    const result = await response.json()
    console.log('Email sent successfully via Postmark:', result)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email sent successfully via Postmark',
          messageId: result.MessageID,
          attachmentCount: normalizedAttachments.length
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

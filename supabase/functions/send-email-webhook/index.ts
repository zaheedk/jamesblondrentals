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

    console.log(`Processing email webhook for ${emailData.to} with subject: ${emailData.subject}`)

    // For WINZ quotes, we can use a webhook service like Zapier or Make.com
    // For now, let's create a detailed log that can be monitored
    const emailPayload = {
      timestamp: new Date().toISOString(),
      recipient: emailData.to,
      subject: emailData.subject,
      type: emailData.type,
      content: emailData.html,
      metadata: {
        from_name: emailData.from_name,
        from_email: emailData.from_email,
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

    console.log('WINZ Quote Request Details:', JSON.stringify(emailPayload, null, 2))

    // In a real implementation, you would send this to:
    // 1. A webhook URL (like Zapier)
    // 2. A third-party email service
    // 3. Your own email server
    
    console.log('Email webhook processed successfully')

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email webhook processed successfully',
        timestamp: emailPayload.timestamp 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error processing email webhook:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to process email webhook' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
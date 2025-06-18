
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  to: string
  subject: string
  html: string
  type: 'signup' | 'password-reset' | 'booking-confirmation' | 'general'
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get environment variables (stored securely in Supabase)
    const OFFICE365_EMAIL = Deno.env.get('OFFICE365_EMAIL')
    const OFFICE365_PASSWORD = Deno.env.get('OFFICE365_PASSWORD')
    
    if (!OFFICE365_EMAIL || !OFFICE365_PASSWORD) {
      throw new Error('Office 365 credentials not configured')
    }

    const { to, subject, html, type }: EmailRequest = await req.json()

    // Create SMTP configuration for Office 365
    const smtpConfig = {
      hostname: 'smtp.office365.com',
      port: 587,
      username: OFFICE365_EMAIL,
      password: OFFICE365_PASSWORD,
    }

    // Send email using Deno's built-in SMTP functionality
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: 'outlook',
        template_id: 'template_' + type,
        user_id: 'your_emailjs_user_id',
        template_params: {
          to_email: to,
          subject: subject,
          message_html: html,
          from_email: OFFICE365_EMAIL,
        }
      })
    })

    if (!response.ok) {
      throw new Error('Failed to send email')
    }

    console.log(`Email sent successfully to ${to} with subject: ${subject}`)

    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error sending email:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to send email' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

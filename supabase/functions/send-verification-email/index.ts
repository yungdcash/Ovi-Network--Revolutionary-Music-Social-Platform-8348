import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, code, userName } = await req.json()

    // In a real implementation, you would integrate with an email service like:
    // - SendGrid
    // - Resend
    // - AWS SES
    // - Mailgun
    
    // For now, we'll simulate sending the email and log it
    console.log(`
=====================================
📧 EMAIL VERIFICATION CODE
=====================================
To: ${email}
Subject: Verify Your Ovi Network Account

Hi ${userName},

Your verification code is: ${code}

This code will expire in 15 minutes.

Welcome to Ovi Network!
=====================================
    `)

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Verification email sent successfully' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
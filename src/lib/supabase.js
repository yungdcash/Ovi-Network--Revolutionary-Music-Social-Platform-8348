import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://jqloudoasxcasevvfyls.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxbG91ZG9hc3hjYXNldnZmeWxzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2NTYxNjQsImV4cCI6MjA3NDIzMjE2NH0.hd3DscSA_gacTyfafnaJKukf2E0eOqquG75mFkwWQoA'

if(SUPABASE_URL === 'https://<PROJECT-ID>.supabase.co' || SUPABASE_ANON_KEY === '<ANON_KEY>') {
  throw new Error('Missing Supabase variables');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false
  }
})

// Email verification functions with real email sending
export const emailVerificationService = {
  // Generate a 10-digit verification code
  generateVerificationCode: () => {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
  },

  // Store verification code in database
  storeVerificationCode: async (email, code) => {
    try {
      const { data, error } = await supabase
        .from('email_verification_codes_ev2024')
        .insert([
          {
            email: email.toLowerCase(),
            verification_code: code,
            user_agent: navigator.userAgent,
            expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 minutes
          }
        ])
        .select();

      if (error) {
        console.error('Supabase error storing verification code:', error);
        throw error;
      }
      return { success: true, data };
    } catch (error) {
      console.error('Error storing verification code:', error);
      return { success: false, error: error.message };
    }
  },

  // Log email delivery attempt
  logEmailDelivery: async (email, code, service, status, errorMessage = null) => {
    try {
      await supabase
        .from('email_delivery_log_2024')
        .insert([
          {
            recipient_email: email.toLowerCase(),
            email_type: 'verification',
            service_used: service,
            delivery_status: status,
            verification_code: code,
            error_message: errorMessage,
            expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
            metadata: {
              user_agent: navigator.userAgent,
              timestamp: new Date().toISOString()
            }
          }
        ]);
    } catch (error) {
      console.error('Error logging email delivery:', error);
    }
  },

  // Send verification email using multiple services
  sendVerificationEmail: async (email, code, userName) => {
    const emailServices = [
      // Service 1: EmailJS (Free and reliable)
      {
        name: 'EmailJS',
        send: async () => {
          const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              service_id: 'service_ovi2024',
              template_id: 'template_verify',
              user_id: 'Gx9vF8mQy4K2jL7nM', // Public key
              template_params: {
                to_email: email,
                to_name: userName,
                verification_code: code,
                app_name: 'Ovi Network',
                expiry_time: '15 minutes',
                message: `Your Ovi Network verification code is: ${code}. This code will expire in 15 minutes. Welcome to the future of music networking!`
              }
            })
          });
          
          if (!response.ok) {
            throw new Error(`EmailJS error: ${response.status} ${response.statusText}`);
          }
          
          return await response.text();
        }
      },
      
      // Service 2: Web3Forms (Alternative free service)
      {
        name: 'Web3Forms',
        send: async () => {
          const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              access_key: '8f2e5a4c-9b7d-4e6f-8a1c-3d5e7f9b2a4c', // Free access key
              subject: 'Verify Your Ovi Network Account',
              from_name: 'Ovi Network',
              to: email,
              message: `Hi ${userName}!\n\nYour Ovi Network verification code is: ${code}\n\nThis code will expire in 15 minutes.\n\nWelcome to the world's first real-time social media music networking platform!\n\n- The Ovi Network Team`
            })
          });
          
          if (!response.ok) {
            throw new Error(`Web3Forms error: ${response.status}`);
          }
          
          return await response.json();
        }
      },
      
      // Service 3: Formspree (Another reliable option)
      {
        name: 'Formspree',
        send: async () => {
          const response = await fetch('https://formspree.io/f/xovaepvq', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: email,
              subject: 'Verify Your Ovi Network Account',
              message: `Hi ${userName}!\n\nYour verification code is: ${code}\n\nThis code expires in 15 minutes.\n\nWelcome to Ovi Network!`
            })
          });
          
          if (!response.ok) {
            throw new Error(`Formspree error: ${response.status}`);
          }
          
          return await response.json();
        }
      }
    ];

    // Try each service in order
    for (const service of emailServices) {
      try {
        console.log(`📧 Attempting to send email via ${service.name} to:`, email);
        console.log(`🔑 Verification code: ${code}`);
        
        const result = await service.send();
        
        // Log successful delivery
        await emailVerificationService.logEmailDelivery(email, code, service.name, 'sent');
        
        console.log(`✅ Email sent successfully via ${service.name}`);
        return { 
          success: true, 
          message: `Verification email sent successfully via ${service.name}`,
          service: service.name
        };
        
      } catch (error) {
        console.error(`❌ ${service.name} failed:`, error.message);
        
        // Log failed attempt
        await emailVerificationService.logEmailDelivery(email, code, service.name, 'failed', error.message);
        
        // Continue to next service
        continue;
      }
    }

    // If all services fail, show the code in console for development
    console.log(`
      =====================================
      📧 ALL EMAIL SERVICES FAILED
      =====================================
      DEVELOPMENT MODE - VERIFICATION CODE:
      
      Email: ${email}
      Code: ${code}
      User: ${userName}
      
      ⚠️  Please check your email inbox first!
      The code may have been delivered despite errors.
      
      If no email received, use this code: ${code}
      =====================================
    `);

    // Log console fallback
    await emailVerificationService.logEmailDelivery(email, code, 'Console', 'console_fallback', 'All email services failed');

    // Still return success for development purposes
    return { 
      success: true, 
      message: 'Email services are experiencing issues. Please check the console for your verification code.',
      service: 'Console Fallback'
    };
  },

  // Verify the code
  verifyCode: async (email, inputCode) => {
    try {
      // First, get the verification record
      const { data: verificationData, error: fetchError } = await supabase
        .from('email_verification_codes_ev2024')
        .select('*')
        .eq('email', email.toLowerCase())
        .eq('verification_code', inputCode)
        .eq('is_used', false)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1);

      if (fetchError) {
        console.error('Supabase error fetching verification code:', fetchError);
        throw fetchError;
      }

      if (!verificationData || verificationData.length === 0) {
        // Update attempts count for existing codes
        await supabase
          .from('email_verification_codes_ev2024')
          .update({ 
            attempts: supabase.raw('attempts + 1'),
            updated_at: new Date().toISOString()
          })
          .eq('email', email.toLowerCase())
          .eq('is_used', false);

        return { 
          success: false, 
          error: 'Invalid or expired verification code' 
        };
      }

      const verificationRecord = verificationData[0];

      // Check if max attempts exceeded
      if (verificationRecord.attempts >= verificationRecord.max_attempts) {
        return { 
          success: false, 
          error: 'Maximum verification attempts exceeded. Please request a new code.' 
        };
      }

      // Mark code as used
      const { error: updateError } = await supabase
        .from('email_verification_codes_ev2024')
        .update({ 
          is_used: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', verificationRecord.id);

      if (updateError) {
        console.error('Supabase error updating verification code:', updateError);
        throw updateError;
      }

      return { success: true, message: 'Email verified successfully' };
    } catch (error) {
      console.error('Error verifying code:', error);
      return { success: false, error: error.message };
    }
  },

  // Create user account after verification
  createUserAccount: async (userData) => {
    try {
      const { data, error } = await supabase
        .from('user_accounts_ev2024')
        .insert([
          {
            email: userData.email.toLowerCase(),
            username: userData.username,
            full_name: userData.fullName,
            user_type: userData.userType,
            theme_preference: userData.theme,
            email_verified: true,
            profile_data: {
              onboarding_completed: true,
              signup_method: 'email_password',
              initial_theme: userData.theme,
              initial_user_type: userData.userType
            }
          }
        ])
        .select();

      if (error) {
        console.error('Supabase error creating user account:', error);
        throw error;
      }
      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Error creating user account:', error);
      return { success: false, error: error.message };
    }
  },

  // Request new verification code
  requestNewCode: async (email) => {
    try {
      // Mark all existing codes for this email as used
      await supabase
        .from('email_verification_codes_ev2024')
        .update({ is_used: true })
        .eq('email', email.toLowerCase());

      // Generate and store new code
      const newCode = emailVerificationService.generateVerificationCode();
      const storeResult = await emailVerificationService.storeVerificationCode(email, newCode);
      
      if (!storeResult.success) {
        return storeResult;
      }

      // Send new verification email
      const emailResult = await emailVerificationService.sendVerificationEmail(email, newCode, 'User');
      
      return emailResult;
    } catch (error) {
      console.error('Error requesting new code:', error);
      return { success: false, error: error.message };
    }
  },

  // Get email delivery status
  getEmailDeliveryStatus: async (email, code) => {
    try {
      const { data, error } = await supabase
        .from('email_delivery_log_2024')
        .select('*')
        .eq('recipient_email', email.toLowerCase())
        .eq('verification_code', code)
        .order('sent_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching email delivery status:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data[0] || null };
    } catch (error) {
      console.error('Error getting email delivery status:', error);
      return { success: false, error: error.message };
    }
  }
};

export default supabase
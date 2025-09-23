import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://zkpdnbwzvrkguvjjrruk.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprcGRuYnd6dnJrZ3V2ampycnVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2NDczMTYsImV4cCI6MjA3NDIyMzMxNn0.QW3cWmBDx0u6HUKd19PQmHgAKClyLx9rpznAUCqcs4M'

if(SUPABASE_URL === 'https://<PROJECT-ID>.supabase.co' || SUPABASE_ANON_KEY === '<ANON_KEY>') {
  throw new Error('Missing Supabase variables');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})

// Email verification functions
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

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error storing verification code:', error);
      return { success: false, error: error.message };
    }
  },

  // Send verification email (mock implementation)
  sendVerificationEmail: async (email, code, userName) => {
    try {
      // In a real implementation, this would integrate with an email service
      // For now, we'll simulate the email sending and log the code
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
      `);

      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      return { success: true, message: 'Verification email sent successfully' };
    } catch (error) {
      console.error('Error sending verification email:', error);
      return { success: false, error: error.message };
    }
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

      if (fetchError) throw fetchError;

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

        return { success: false, error: 'Invalid or expired verification code' };
      }

      const verificationRecord = verificationData[0];

      // Check if max attempts exceeded
      if (verificationRecord.attempts >= verificationRecord.max_attempts) {
        return { success: false, error: 'Maximum verification attempts exceeded. Please request a new code.' };
      }

      // Mark code as used
      const { error: updateError } = await supabase
        .from('email_verification_codes_ev2024')
        .update({
          is_used: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', verificationRecord.id);

      if (updateError) throw updateError;

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

      if (error) throw error;
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
  }
};

export default supabase
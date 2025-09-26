import { createClient } from '@supabase/supabase-js'

// Use placeholder values that won't cause network requests during build
const SUPABASE_URL = 'https://placeholder.supabase.co'
const SUPABASE_ANON_KEY = 'placeholder_key'

// Create a mock client for development/build that doesn't make actual network requests
const supabase = {
  from: () => ({
    insert: () => ({ select: () => Promise.resolve({ data: null, error: null }) }),
    select: () => ({ 
      eq: () => ({ 
        eq: () => ({ 
          eq: () => ({ 
            gt: () => ({ 
              order: () => ({ 
                limit: () => Promise.resolve({ data: [], error: null }) 
              }) 
            }) 
          }) 
        }) 
      }) 
    }),
    update: () => ({ 
      eq: () => Promise.resolve({ data: null, error: null }) 
    })
  }),
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false
  }
}

// Email verification service with mock functionality
export const emailVerificationService = {
  generateVerificationCode: () => {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
  },

  storeVerificationCode: async (email, code) => {
    try {
      console.log('Mock: Storing verification code for', email);
      return { success: true, data: { email, code } };
    } catch (error) {
      console.error('Mock: Error storing verification code:', error);
      return { success: false, error: error.message };
    }
  },

  logEmailDelivery: async (email, code, service, status, errorMessage = null) => {
    try {
      console.log('Mock: Logging email delivery:', { email, service, status });
      return { success: true };
    } catch (error) {
      console.error('Mock: Error logging email delivery:', error);
      return { success: false, error: error.message };
    }
  },

  sendVerificationEmail: async (email, code, userName) => {
    console.log(`
      =====================================
      📧 MOCK EMAIL SERVICE
      =====================================
      DEVELOPMENT MODE - VERIFICATION CODE:
      
      Email: ${email}
      Code: ${code}
      User: ${userName}
      
      ⚠️  This is a mock email service for development.
      In production, this would send a real email.
      
      Use this code: ${code}
      =====================================
    `);

    return { 
      success: true, 
      message: 'Mock email sent successfully. Check console for verification code.',
      service: 'Mock Service'
    };
  },

  verifyCode: async (email, inputCode) => {
    try {
      console.log('Mock: Verifying code for', email, inputCode);
      
      // Simple mock verification - accept any 10-digit code for development
      if (inputCode && inputCode.length === 10) {
        return { success: true, message: 'Code verified successfully (mock)' };
      } else {
        return { success: false, error: 'Invalid verification code format' };
      }
    } catch (error) {
      console.error('Mock: Error verifying code:', error);
      return { success: false, error: error.message };
    }
  },

  createUserAccount: async (userData) => {
    try {
      console.log('Mock: Creating user account:', userData);
      return { 
        success: true, 
        data: {
          id: Date.now(),
          email: userData.email,
          username: userData.username,
          full_name: userData.fullName,
          user_type: userData.userType,
          theme_preference: userData.theme
        }
      };
    } catch (error) {
      console.error('Mock: Error creating user account:', error);
      return { success: false, error: error.message };
    }
  },

  requestNewCode: async (email) => {
    try {
      console.log('Mock: Requesting new code for', email);
      const newCode = emailVerificationService.generateVerificationCode();
      
      const emailResult = await emailVerificationService.sendVerificationEmail(email, newCode, 'User');
      return emailResult;
    } catch (error) {
      console.error('Mock: Error requesting new code:', error);
      return { success: false, error: error.message };
    }
  },

  getEmailDeliveryStatus: async (email, code) => {
    try {
      console.log('Mock: Getting email delivery status:', email, code);
      return { 
        success: true, 
        data: {
          recipient_email: email,
          verification_code: code,
          delivery_status: 'delivered',
          service_used: 'Mock Service'
        }
      };
    } catch (error) {
      console.error('Mock: Error getting email delivery status:', error);
      return { success: false, error: error.message };
    }
  }
};

export default supabase
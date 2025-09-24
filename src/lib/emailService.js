// Alternative email service configurations

// Configuration for different email services
export const emailServiceConfig = {
  // EmailJS (Free tier available)
  emailjs: {
    serviceId: 'service_ovi_network',
    templateId: 'template_verification',
    publicKey: 'your_emailjs_public_key'
  },
  
  // Resend (Modern email API)
  resend: {
    apiKey: 'your_resend_api_key',
    fromEmail: 'noreply@ovinetwork.com'
  },
  
  // SendGrid (Popular choice)
  sendgrid: {
    apiKey: 'your_sendgrid_api_key',
    fromEmail: 'noreply@ovinetwork.com'
  }
};

// Email template for verification
export const getVerificationEmailTemplate = (userName, verificationCode) => {
  return {
    subject: 'Verify Your Ovi Network Account',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Ovi Network Account</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
          }
          .container {
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 32px;
          }
          .logo {
            font-size: 28px;
            font-weight: bold;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 8px;
          }
          .title {
            font-size: 24px;
            font-weight: 600;
            color: #1a1a1a;
            margin-bottom: 16px;
          }
          .code-container {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 24px;
            border-radius: 12px;
            text-align: center;
            margin: 32px 0;
          }
          .code {
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 4px;
            font-family: 'Courier New', monospace;
          }
          .code-label {
            font-size: 14px;
            opacity: 0.9;
            margin-bottom: 8px;
          }
          .instructions {
            background: #f8f9ff;
            padding: 20px;
            border-radius: 8px;
            margin: 24px 0;
            border-left: 4px solid #667eea;
          }
          .footer {
            text-align: center;
            margin-top: 32px;
            padding-top: 24px;
            border-top: 1px solid #e1e5e9;
            color: #6b7280;
            font-size: 14px;
          }
          .warning {
            background: #fef3cd;
            color: #856404;
            padding: 16px;
            border-radius: 8px;
            margin: 20px 0;
            border: 1px solid #ffeaa7;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🎵 Ovi Network</div>
            <h1 class="title">Verify Your Email Address</h1>
            <p>Hi ${userName}! Welcome to the world's first real-time social media music networking platform.</p>
          </div>
          
          <div class="code-container">
            <div class="code-label">Your Verification Code</div>
            <div class="code">${verificationCode}</div>
          </div>
          
          <div class="instructions">
            <h3 style="margin-top: 0; color: #667eea;">📋 How to verify:</h3>
            <ol style="margin: 0; padding-left: 20px;">
              <li>Copy the 10-digit code above</li>
              <li>Return to the Ovi Network signup page</li>
              <li>Paste the code in the verification field</li>
              <li>Click "Verify Email" to complete your registration</li>
            </ol>
          </div>
          
          <div class="warning">
            <strong>⏰ Important:</strong> This verification code will expire in 15 minutes for security reasons. If you don't verify within this time, you'll need to request a new code.
          </div>
          
          <div style="text-align: center; margin: 32px 0;">
            <p style="color: #6b7280; margin-bottom: 16px;">Ready to start your music journey?</p>
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px; border-radius: 8px; display: inline-block;">
              <strong>🎵 Stream • Connect • Earn</strong><br>
              <small>Real-time music networking like never before</small>
            </div>
          </div>
          
          <div class="footer">
            <p><strong>Didn't request this email?</strong><br>
            If you didn't create an account with Ovi Network, you can safely ignore this email.</p>
            
            <p style="margin-top: 20px;">
              <strong>Need help?</strong> Contact our support team<br>
              © 2024 Ovi Network. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Hi ${userName}!
      
      Welcome to Ovi Network - the world's first real-time social media music networking platform.
      
      Your email verification code is: ${verificationCode}
      
      Please enter this code on the signup page to complete your registration.
      
      This code will expire in 15 minutes for security reasons.
      
      If you didn't create an account with Ovi Network, you can safely ignore this email.
      
      Welcome to the future of music networking!
      
      - The Ovi Network Team
    `
  };
};

// Email service implementations
export const sendEmailViaResend = async (to, subject, html, text) => {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${emailServiceConfig.resend.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: emailServiceConfig.resend.fromEmail,
        to: [to],
        subject: subject,
        html: html,
        text: text,
      }),
    });

    if (!response.ok) {
      throw new Error(`Resend API error: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Resend email error:', error);
    return { success: false, error: error.message };
  }
};

export const sendEmailViaSendGrid = async (to, subject, html, text) => {
  try {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${emailServiceConfig.sendgrid.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: to }],
            subject: subject,
          },
        ],
        from: { email: emailServiceConfig.sendgrid.fromEmail },
        content: [
          {
            type: 'text/plain',
            value: text,
          },
          {
            type: 'text/html',
            value: html,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`SendGrid API error: ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    console.error('SendGrid email error:', error);
    return { success: false, error: error.message };
  }
};
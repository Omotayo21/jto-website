import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { sendEmail } from '@/lib/brevo';

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // For security reasons, don't reveal if a user exists or not
      return NextResponse.json({ success: true, message: 'If an account exists, a reset link has been sent.' }, { status: 200 });
    }

    // 1. Generate a random token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // 2. Hash the token to store in the DB (prevents theft if DB is compromised)
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // 3. Save to User model with 1 hour expiry
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // 4. Create the Reset URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

    // 5. Send the Email
    await sendEmail({
      to: user.email,
      subject: 'Password Reset Request — JTOtheLabel',
      htmlContent: `
        <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #f0f0f0; border-radius: 24px;">
          <h1 style="color: #4F46E5; font-size: 28px; font-weight: 900; margin-bottom: 24px;">Reset Your Password</h1>
          <p style="font-size: 16px; color: #374151; line-height: 1.5;">Hello ${user.name},</p>
          <p style="font-size: 16px; color: #374151; line-height: 1.5;">We received a request to reset your password for your JTOtheLabel account. Click the button below to set a new password:</p>
          
          <div style="margin: 32px 0; text-align: center;">
            <a href="${resetUrl}" style="background-color: #4F46E5; color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; font-size: 14px; box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3);">
              Reset Password
            </a>
          </div>
          
          <p style="font-size: 14px; color: #9ca3af; margin-top: 32px;">This link will expire in 1 hour. If you did not request a password reset, please ignore this email.</p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
          <p style="color: #9ca3af; font-size: 12px; text-align: center; font-weight: 700; text-transform: uppercase; letter-spacing: 0.2em;">Premium Shopping Experience</p>
        </div>
      `
    });

    return NextResponse.json({ success: true, message: 'Reset link sent successfully.' }, { status: 200 });

  } catch (error) {
    console.error('Forgot Password Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to process request' }, { status: 500 });
  }
}

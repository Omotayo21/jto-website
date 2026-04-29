import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { hashPassword, signToken } from '@/lib/auth';
import validator from 'validator';
import { sendEmail } from '@/lib/brevo';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(req) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    const limitResult = rateLimit(`reg-${ip}`, 3, 10 * 60 * 1000); // 3 registrations per 10 mins

    if (!limitResult.success) {
      return NextResponse.json({ success: false, error: 'Too many registrations from this IP. Please wait 10 minutes.' }, { status: 429 });
    }

    const { name, email, password } = await req.json();

    // 1. Validation
    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400 });
    }

    if (!validator.isEmail(email)) {
      return NextResponse.json({ success: false, error: 'Invalid email format' }, { status: 400 });
    }

    // Password: min 8 chars, must contain number
    const passwordRegex = /^(?=.*[0-9]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Password must be at least 8 characters long and contain at least one number' 
      }, { status: 400 });
    }

    // 2. Connect DB
    await connectDB();

    // 3. Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ success: false, error: 'Email already registered' }, { status: 400 });
    }

    // 4. Hash Password
    const hashedPassword = await hashPassword(password);

    // 5. Create User
    const user = await User.create({
      name: validator.escape(name),
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    // 6. Sign JWT
    const token = signToken({ id: user._id, email: user.email, name: user.name });

    // 7. Send Welcome Email
    try {
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; text-align: center; color: #000;">
          <h4 style="font-size: 24px; font-weight: bold; margin-bottom: 20px;">WELCOME TO JTOTHELABEL</h4>
          <p style="font-size: 16px; margin-bottom: 30px;">
            You've activated your customer account. Next time, login for faster checkout.
          </p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://jtothelabel.com'}/products" 
             style="display: inline-block; background-color: #000; color: #fff; padding: 15px 30px; text-decoration: none; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px;">
            Visit Our Store
          </a>
          <div style="margin-top: 50px; border-top: 1px solid #eee; padding-top: 20px; font-size: 12px; color: #666;">
            If you have any questions, reply to this email or contact us at support@jtothelabel@gmail.com
          </div>
        </div>
      `;
      await sendEmail({
        to: user.email,
        subject: 'Welcome to JTOtheLabel',
        htmlContent: emailHtml,
      });
    } catch (emailError) {
      console.error('Welcome Email Error:', emailError);
      // We don't fail registration if email fails
    }

    // 8. Set Cookie and Return User
    const response = NextResponse.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        status: user.status,
      }
    }, { status: 201 });

    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

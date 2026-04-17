import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { hashPassword, signToken } from '@/lib/auth';
import validator from 'validator';

export async function POST(req) {
  try {
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
    const token = signToken({ id: user._id, email: user.email });

    // 7. Set Cookie and Return User
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

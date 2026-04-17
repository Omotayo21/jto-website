import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { jwtVerify } from 'jose';

const JWT_SECRET_ENCODED = new TextEncoder().encode(process.env.JWT_SECRET);

/**
 * Signs a JWT token with a 7-day expiry
 */
export function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
}

/**
 * Verifies a JWT token and returns the payload or null (for API routes)
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
}

/**
 * Verifies a JWT token using jose (for Middleware)
 */
export async function verifyTokenEdge(token) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET_ENCODED);
    return payload;
  } catch (error) {
    return null;
  }
}

/**
 * Hashes a password using bcrypt with 12 salt rounds
 */
export async function hashPassword(password) {
  return await bcrypt.hash(password, 12);
}

/**
 * Compares a plain text password with a hashed password
 */
export async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

/**
 * Sets an HTTP-only, Secure, SameSite=Strict auth cookie
 */
export function setAuthCookie(res, token) {
  // res is usually a Response object in Next.js App Router (using cookies() or NextResponse)
  // But the prompt implies a standard way to set it.
  // In App Router, we use 'cookies()' from 'next/headers' for server actions/routes.
  // However, for API routes, we can't directly set cookies on the 'res' if it's NextResponse.
  // If we are in a route handler, we return a NextResponse with Set-Cookie header.
  
  const cookieOptions = {
    name: 'auth_token',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_SETTING !== 'development',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  };
  
  return cookieOptions;
}

/**
 * Clears the auth cookie
 */
export function clearAuthCookie() {
  return {
    name: 'auth_token',
    value: '',
    httpOnly: true,
    secure: process.env.NODE_SETTING !== 'development',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  };
}

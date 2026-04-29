'use server';
import { cookies, headers } from 'next/headers';
import { rateLimit } from '@/lib/rate-limit';

/**
 * Server Action to verify the administrative passkey.
 * Comparing the input on the server prevents the passkey from being exposed in client-side code.
 */
export async function verifyAdminPasskey(input) {
  const keys = {
    admin: process.env.ADMIN_PASSKEY,
    content: process.env.CONTENT_PASSKEY,
    stock: process.env.STOCK_PASSKEY,
    finance: process.env.FINANCE_PASSKEY,
  };

  const role = Object.keys(keys).find(key => keys[key] && input === keys[key]);
  
  if (role) {
    // Set a secure, http-only cookie for backend verification
    cookies().set('admin_passkey', input, {
      httpOnly: true,
      secure: process.env.NODE_SETTING !== 'development',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });
    return { success: true, role };
  }

  return { success: false, error: 'Invalid Authorization Passkey' };
}

/**
 * Server Action to clear the administrative session.
 */
export async function logoutAdmin() {
  cookies().set('admin_passkey', '', { maxAge: 0 });
}

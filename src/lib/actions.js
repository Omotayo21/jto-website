'use server';
import { cookies } from 'next/headers';

/**
 * Server Action to verify the administrative passkey.
 * Comparing the input on the server prevents the passkey from being exposed in client-side code.
 */
export async function verifyAdminPasskey(input) {
  const secret = process.env.ADMIN_PASSKEY;
  
  if (!secret) {
    console.error('CRITICAL: ADMIN_PASSKEY is not defined in environment variables.');
    return { success: false, error: 'Authorization system misconfigured.' };
  }

  if (input === secret) {
    // Set a secure, http-only cookie for backend verification
    cookies().set('admin_passkey', input, {
      httpOnly: true,
      secure: process.env.NODE_SETTING !== 'development',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });
    return { success: true };
  }

  return { success: false, error: 'Invalid Administrative Passkey' };
}

/**
 * Server Action to clear the administrative session.
 */
export async function logoutAdmin() {
  cookies().set('admin_passkey', '', { maxAge: 0 });
}

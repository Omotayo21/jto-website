import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET_ENCODED = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;

  // Define route protection
  const isAccountRoute = pathname.startsWith('/account');
  const isAdminRoute = pathname.startsWith('/management-portal') || pathname.startsWith('/api/management-portal');
  const isCartRoute = pathname.startsWith('/cart');
  const isCheckoutRoute = pathname.startsWith('/checkout');
  
  // State-changing API routes (POST, PUT, PATCH, DELETE)
  const isProtectedApi = pathname.startsWith('/api/') && 
    ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method) && 
    !pathname.startsWith('/api/auth/') && 
    !pathname.startsWith('/api/webhooks/'); // Webhooks have their own signature verification

  const requiresAuth = isAccountRoute || isAdminRoute || isCartRoute || isCheckoutRoute || isProtectedApi;

  if (requiresAuth) {
    // Specialized protection for Admin Management Portal (Passkey based)
    if (isAdminRoute) {
      const adminPasskey = request.cookies.get('admin_passkey')?.value;
      const secret = process.env.ADMIN_PASSKEY;
      
      if (adminPasskey !== secret) {
        if (pathname.startsWith('/api/')) {
          return NextResponse.json({ success: false, error: 'Unauthorized. Admin passkey required.' }, { status: 401 });
        }
        // For the frontend UI, we allow the request to proceed so the SecretGate component can show the prompt
        return NextResponse.next();
      }
      // If passkey matches, allow the request (even without a user account login)
      return NextResponse.next();
    }

    if (!token) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ success: false, error: 'Unauthorized. Please login.' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      // Verify JWT using jose (Edge compatible)
      const { payload } = await jwtVerify(token, JWT_SECRET_ENCODED);
      
      // Handle "Banned users -> 403 on every protected request" accurately
      const statusRes = await fetch(new URL(`/api/auth/status?id=${payload.id}`, request.url));
      const { status } = await statusRes.json();

      if (status === 'banned') {
        if (pathname.startsWith('/api/')) {
          return NextResponse.json({ success: false, error: 'Account banned.' }, { status: 403 });
        }
        const response = NextResponse.redirect(new URL('/login?error=banned', request.url));
        response.cookies.set('auth_token', '', { maxAge: 0 }); // Clear token if banned
        return response;
      }

    } catch (error) {
      console.error('Middleware JWT Error:', error);
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ success: false, error: 'Invalid session.' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
   
    '/account/:path*',
    '/cart/:path*',
    '/checkout/:path*',
    '/api/:path*'
  ]
};

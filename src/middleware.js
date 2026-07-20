import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET_ENCODED = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;
  const adminPasskey = request.cookies.get('admin_passkey')?.value;

  const isAdminPageRoute = pathname.startsWith('/management-portal');
  const isAdminApiRoute = pathname.startsWith('/api/products') ||
    pathname.startsWith('/api/orders') ||
    pathname.startsWith('/api/categories') ||
    pathname.startsWith('/api/users') ||
    pathname.startsWith('/api/coupons') ||
    pathname.startsWith('/api/delivery-zones') ||
    pathname.startsWith('/api/upload') ||
    pathname.startsWith('/api/delete-media') ||
    pathname.startsWith('/api/admin');

  // ── ADMIN CHECK ─────────────────────────────────────────────
  // If it's an admin route (page or API), only passkey is needed
  // No JWT required at all for admin
  if (isAdminPageRoute || isAdminApiRoute) {
    if (adminPasskey === process.env.ADMIN_PASSKEY) {
      return NextResponse.next(); // valid passkey — let through
    }

    // Invalid or missing passkey
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin passkey required.' },
        { status: 401 }
      );
    }

    // For page routes let SecretGate component handle showing the prompt
    return NextResponse.next();
  }

  // ── NORMAL USER ROUTES ───────────────────────────────────────
  const isAccountRoute = pathname.startsWith('/account');
  const isCartRoute = pathname.startsWith('/cart');
  const isCheckoutRoute = pathname.startsWith('/checkout');
  const isProtectedApi = pathname.startsWith('/api/') &&
    ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method) &&
    !pathname.startsWith('/api/auth/') &&
    !pathname.startsWith('/api/webhooks/');

  const requiresAuth = isAccountRoute || isCartRoute || isCheckoutRoute || isProtectedApi;

  if (requiresAuth) {
    if (!token) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized. Please login.' },
          { status: 401 }
        );
      }
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET_ENCODED);

      const statusRes = await fetch(new URL(`/api/auth/status?id=${payload.id}`, request.url));
      const { status } = await statusRes.json();

      if (status === 'banned') {
        if (pathname.startsWith('/api/')) {
          return NextResponse.json({ success: false, error: 'Account banned.' }, { status: 403 });
        }
        const response = NextResponse.redirect(new URL('/login?error=banned', request.url));
        response.cookies.set('auth_token', '', { maxAge: 0 });
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
    '/management-portal/:path*',
    '/api/:path*'
  ]
};
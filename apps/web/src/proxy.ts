import { NextRequest, NextResponse } from 'next/server';

// Customer-only routes (role: 'user')
const USER_ROUTES = ['/account', '/cart', '/checkout', '/wishlists'];

// Admin-only routes (role: 'admin')
const ADMIN_ROUTES = ['/admin'];

// Seller-only routes (role: 'seller')
const SELLER_ROUTES = ['/seller'];

// Routes only accessible when NOT logged in
const AUTH_ROUTES = ['/login', '/register'];

function matchesPrefix(pathname: string, prefixes: string[]) {
  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + '/')
  );
}

/** Returns the correct home dashboard URL for a given role */
function roleDashboard(role: string | null): string {
  if (role === 'admin') return '/admin';
  if (role === 'seller') return '/seller';
  return '/account'; // default for 'user' or unknown
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const hasSession = req.cookies.has('refreshToken');

  // Decode role from JWT payload in the refresh token cookie.
  // We only base64-decode the payload — no secret needed for routing.
  // The API always re-verifies the signature before returning any data.
  let userRole: string | null = null;
  const rawToken = req.cookies.get('refreshToken')?.value;
  if (rawToken) {
    try {
      const payloadB64 = rawToken.split('.')[1];
      const payload = JSON.parse(
        Buffer.from(payloadB64, 'base64url').toString('utf8')
      );
      userRole = payload.role ?? null;
    } catch {
      // Malformed token — treat as unauthenticated
    }
  }

  // 1. Logged-in users visiting /login or /register → redirect to their dashboard
  if (hasSession && matchesPrefix(pathname, AUTH_ROUTES)) {
    return NextResponse.redirect(new URL(roleDashboard(userRole), req.url));
  }

  // 2. /account, /cart, /checkout, /wishlists — normal users only
  //    Admins and sellers must use their own dashboards.
  if (matchesPrefix(pathname, USER_ROUTES)) {
    if (!hasSession) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (userRole === 'admin') {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
    if (userRole === 'seller') {
      return NextResponse.redirect(new URL('/seller', req.url));
    }
  }

  // 3. /admin — strictly admin only
  if (matchesPrefix(pathname, ADMIN_ROUTES)) {
    if (!hasSession) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (userRole !== 'admin') {
      // Seller → /seller, normal user → /account
      return NextResponse.redirect(new URL(roleDashboard(userRole), req.url));
    }
  }

  // 4. /seller — strictly seller only (admins are NOT sellers)
  if (matchesPrefix(pathname, SELLER_ROUTES)) {
    if (!hasSession) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (userRole !== 'seller') {
      // Admin → /admin, normal user → /account
      return NextResponse.redirect(new URL(roleDashboard(userRole), req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|api/).*)',
  ],
};

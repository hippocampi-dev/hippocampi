import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_ROUTES = [
  '/dashboard',
  '/onboarding',
  '/checkout',
  '/select-route'
];

export default async function middleware(req: NextRequest) {
  // Get the pathname of the request (e.g. /, /protected)
  const path = req.nextUrl.pathname;

  // If it's the root path, just render it
  if (path === '/') {
    return NextResponse.next();
  }

  const session = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  });

  // Check if route requires authentication
  const isProtected = PROTECTED_ROUTES.some(route => 
    path.includes(route)
  );

  if (!session && isProtected) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  } else if (session && path === '/auth/login') {
    return NextResponse.redirect(new URL('/middle', req.url));
  }
  return NextResponse.next();
}
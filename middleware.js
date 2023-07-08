import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { EnvConstants } from "util/EnvConstants.js";
import PathConstants from "util/PathConstants";
export async function middleware(request) {
  const jwt = request.cookies.get(EnvConstants.REACT_APP_TOKEN)

  if (request.nextUrl.pathname.includes('/dashboard')) {
    if (jwt === undefined) return NextResponse.redirect(new URL(PathConstants.auth_login, request.url))
    try {
      await jwtVerify(jwt.value, new TextEncoder().encode(EnvConstants.APP_TOKEN_AUTH))
      return NextResponse.next();
    } catch (error) {
      return NextResponse.redirect(new URL(PathConstants.auth_login, request.url))
    }
  }

  if (request.nextUrl.pathname.includes('/auth/login')) {
    if (jwt) {
      try {
        const {payload} = await jwtVerify(jwt.value, new TextEncoder().encode(EnvConstants.APP_TOKEN_AUTH))
        return NextResponse.redirect(new URL(PathConstants.home_admin, request.url))
      } catch (error) {
        return NextResponse.next()
      }
    }
  }

  return NextResponse.next()
}

// export const config = { matcher: ['/dashboard', '/dashboard/:path*'] }
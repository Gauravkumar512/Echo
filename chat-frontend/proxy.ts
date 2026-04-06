import { NextResponse, NextRequest } from 'next/server'
 
export function proxy(request: NextRequest) {
    const path = request.nextUrl.pathname

    const token = request.cookies.get("accessToken")?.value

    const isPublicRoute = path === '/login' || path === '/register'

    if(!isPublicRoute && !token){
        return NextResponse.redirect(new URL('/login', request.url))
    }

    if(isPublicRoute && token){
        return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()

}
 

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/room/:path*',
    '/login',
    '/register'
  ]
}
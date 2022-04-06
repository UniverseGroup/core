import { NextResponse, NextRequest } from 'next/server'
export async function middleware(req, ev) {
    const { pathname,origin } = req.nextUrl
    if (pathname == '/developers') {
        return NextResponse.redirect(origin+'/developers/applications')
    }
    return NextResponse.next()
}
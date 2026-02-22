import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Protect all of /station-b except the login page itself
    if (pathname.startsWith('/station-b') && !pathname.startsWith('/station-b/login')) {
        const session = request.cookies.get('facilitator_session');
        if (!session || session.value !== 'authenticated') {
            return NextResponse.redirect(new URL('/station-b/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/station-b/:path*'],
};

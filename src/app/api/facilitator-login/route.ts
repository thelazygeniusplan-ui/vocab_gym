import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { password } = await request.json();
    const expected = process.env.FACILITATOR_PASSWORD || 'coach2024';

    if (password !== expected) {
        return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set('facilitator_session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 8, // 8 hours
        path: '/',
    });

    return response;
}

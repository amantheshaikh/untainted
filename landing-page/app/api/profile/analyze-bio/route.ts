
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Forward to Python backend
        const res = await fetch(`${BACKEND_URL}/profile/analyze-bio`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Forward auth token if present? 
                // The backend checks _authenticate_request.
                // The frontend request to this route should have the token.
                'Authorization': request.headers.get('Authorization') || '',
                'X-API-Key': process.env.BACKEND_API_KEY || '', // Fallback or if needed
            },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const errorText = await res.text();
            return NextResponse.json(
                { error: `Backend error: ${res.status} ${errorText}` },
                { status: res.status }
            );
        }

        const data = await res.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error("Profile analysis proxy error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

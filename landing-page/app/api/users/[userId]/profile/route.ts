import { NextResponse } from 'next/server';

// Use environment variable with fallback for local development only
// Use environment variable with fallback for local development only
const DEFAULT_API_BASE = process.env.NODE_ENV === 'production' ? "https://api.untainted.io" : "http://127.0.0.1:8080";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.includes('8000')
    ? "http://127.0.0.1:8080"
    : (process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE);

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ userId: string }> }
) {
    if (!API_BASE_URL) {
        return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    try {
        const { userId } = await params;
        const body = await request.json();
        const apiKey = process.env.UNTAINTED_API_KEY;

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (apiKey) {
            headers['x-api-key'] = apiKey;
        } else {
            return NextResponse.json({ error: "Server Configuration Error: Missing UNTAINTED_API_KEY" }, { status: 500 });
        }

        const response = await fetch(`${API_BASE_URL}/users/${userId}/profile`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(body),
        });

        // Handle case where downstream API returns 204 No Content
        if (response.status === 204) {
            return new NextResponse(null, { status: 204 });
        }

        const data = await response.json().catch(() => ({}));
        return NextResponse.json(data, { status: response.status });

    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}

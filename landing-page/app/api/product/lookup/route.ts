import { NextResponse } from 'next/server';

// Use environment variable with fallback for local development only
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL;

if (!API_BASE_URL) {
    console.error("CRITICAL: API_BASE_URL not configured. Set NEXT_PUBLIC_API_BASE_URL in environment.");
}

export async function POST(request: Request) {
    if (!API_BASE_URL) {
        return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    try {
        const body = await request.json();
        const apiKey = process.env.UNTAINTED_API_KEY;

        const authHeader = request.headers.get("Authorization");
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (authHeader) {
            headers['Authorization'] = authHeader;
        } else if (apiKey) {
            headers['x-api-key'] = apiKey;
        } else {
            return NextResponse.json({ error: "Server Configuration Error: Missing UNTAINTED_API_KEY" }, { status: 500 });
        }

        const response = await fetch(`${API_BASE_URL}/product/lookup`, {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
        });

        if (response.status === 404) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });

    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';

// Use environment variable with fallback for local development only
const DEFAULT_API_BASE = process.env.NODE_ENV === 'production' ? "https://api.untainted.io" : "http://127.0.0.1:8080";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || DEFAULT_API_BASE;

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

        console.log(`[Proxy] Forwarding to: ${API_BASE_URL}/extract/ingredients`);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

        const response = await fetch(`${API_BASE_URL}/extract/ingredients`, {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
            signal: controller.signal
        }).finally(() => clearTimeout(timeoutId));

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });

    } catch (error: any) {
        console.error("Frontend Proxy Error:", error);
        console.error("Cause:", error.cause);
        return NextResponse.json({ error: error.message || "fetch failed", details: String(error) }, { status: 500 });
    }
}

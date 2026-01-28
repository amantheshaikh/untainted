import { NextResponse } from 'next/server';

// Use environment variable with fallback for local development only
// Use environment variable with fallback for local development only
// Note: User running backend on 8080, so prioritizing that for local dev if env is 8000
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.includes('8000')
    ? "http://127.0.0.1:8080"
    : (process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8080");

if (!API_BASE_URL) {
    console.error("CRITICAL: API_BASE_URL not configured. Set NEXT_PUBLIC_API_BASE_URL in environment.");
}

export async function POST(request: Request) {
    console.log("Analyze Proxy: Received request");
    console.log("Analyze Proxy: API_BASE_URL:", API_BASE_URL ? "Configured" : "MISSING");
    console.log("Analyze Proxy: UNTAINTED_API_KEY:", process.env.UNTAINTED_API_KEY ? "Configured" : "MISSING");

    if (!API_BASE_URL) {
        console.error("Analyze Proxy: Missing API_BASE_URL");
        return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    try {
        const body = await request.json();
        // console.log("Analyze Proxy: Request Body:", JSON.stringify(body, null, 2));

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
            console.error("Analyze Proxy: Missing Auth Credentials");
            return NextResponse.json({ error: "Server Configuration Error: Missing UNTAINTED_API_KEY" }, { status: 500 });
        }

        const upstreamUrl = `${API_BASE_URL}/analyze`;
        console.log(`Analyze Proxy: Forwarding to ${upstreamUrl}`);

        const response = await fetch(upstreamUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
        });

        console.log("Analyze Proxy: Upstream status:", response.status);

        const data = await response.json();

        if (!response.ok) {
            console.error("Analyze Proxy: Upstream error:", data);
        }

        return NextResponse.json(data, { status: response.status });

    } catch (error: any) {
        console.error("Analyze Proxy: Caught exception:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}

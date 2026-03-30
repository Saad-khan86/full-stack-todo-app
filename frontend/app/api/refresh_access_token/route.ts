import { cookies } from 'next/headers';

export async function POST(req: Request) {
    const cookieStore = await cookies();
    const body = await req.json();
    const refresh_token = body.refresh_token;

    if (!refresh_token) {
        return new Response(JSON.stringify({ error: "No refresh token" }), { status: 401 });
    }

    const res = await fetch("http://localhost:8000/refresh", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            refresh_token: refresh_token
        })
    });

    const data = await res.json();
    
    if (res.status == 401) {
        cookieStore.delete('access_token')
        cookieStore.delete('refresh_token')
    }
    
    cookieStore.set("access_token", data.access_token, {
        httpOnly: true,
        path: "/",
    });

    const access_token = data.access_token
    return Response.json({ access_token });
}
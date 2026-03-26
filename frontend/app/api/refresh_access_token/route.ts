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
    console.log("checking status in route.ts", res.status);
    console.log("checking access_token in route.ts", data.access_token);
    
    if (res.status == 401) {
        cookieStore.delete('access_token')
        cookieStore.delete('refresh_token')
    }

    console.log("before cookies setting in route.ts");
    
    cookieStore.set("access_token", data.access_token, {
        httpOnly: true,
        path: "/",
    });

    console.log("after cookies setting in route.ts");

    const access_token = data.access_token
    return Response.json({ access_token });
}
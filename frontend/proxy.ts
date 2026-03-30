import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  const access_token = request.cookies.get('access_token')?.value;
  const refresh_token = request.cookies.get('refresh_token')?.value;
  
  // 2. Helper function to clean up and redirect
  const handleAuthFailure = () => {
    const response = NextResponse.next()
    response.cookies.delete('access_token');
    response.cookies.delete('refresh_token');
    return response;
  };

  // 1. Agar dono tokens nahi hain
  if (!access_token && !refresh_token) {
    return handleAuthFailure();
  }

  // 2. Refresh logic agar access token expire ho chuka hai
  let response = NextResponse.next()
  
  if (!access_token && refresh_token) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refresh_token })
      });

      if (res.ok) {
        const data = await res.json();
      
        response.cookies.set('access_token', data.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          maxAge: 60 // 1 minute (60 seconds)
        });

        return response;
      } else {
        // Refresh fail (e.g. refresh token expired)
        return handleAuthFailure();
      }
    } catch (error) {
      // Network issue or server down
      return handleAuthFailure();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/'], 
};
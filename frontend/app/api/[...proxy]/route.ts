import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4000';

const EXCLUDED_HEADERS = ['connection', 'host', 'content-length'];

function getSetCookies(response: Response): string[] {
  const headers = response.headers as Headers & { getSetCookie?: () => string[] };
  const cookies = headers.getSetCookie?.();
  if (cookies?.length) return cookies;

  const cookie = response.headers.get('set-cookie');
  return cookie ? [cookie] : [];
}

function getCookieValue(cookies: string[], name: string): string | null {
  const prefix = `${name}=`;
  const cookie = cookies.find((value) => value.startsWith(prefix));
  return cookie ? cookie.slice(prefix.length).split(';', 1)[0] : null;
}

function replaceCookie(cookieHeader: string, name: string, value: string): string {
  const cookies = cookieHeader
    .split(';')
    .map((cookie) => cookie.trim())
    .filter((cookie) => cookie && !cookie.startsWith(`${name}=`));

  cookies.push(`${name}=${value}`);
  return cookies.join('; ');
}

export async function handler(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const searchParams = req.nextUrl.searchParams;
  
  // Extract /api/{path*} and rebuild URL to backend
  const pathMatch = pathname.match(/^\/api\/(.*)$/);
  if (!pathMatch) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const apiPath = pathMatch[1];
  const backendUrl = new URL(`${BACKEND_URL}/api/${apiPath}`);
  
  // Preserve query parameters
  searchParams.forEach((value, key) => {
    backendUrl.searchParams.append(key, value);
  });

  // Prepare request body
  let body: BodyInit | undefined;
  const contentType = req.headers.get('content-type');
  
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    if (contentType?.includes('application/json')) {
      body = await req.text();
    } else if (contentType?.includes('application/x-www-form-urlencoded') || 
               contentType?.includes('multipart/form-data')) {
      body = await req.arrayBuffer();
    } else {
      body = await req.text();
    }
  }

  // Forward request headers
  const headers = new Headers();
  req.headers.forEach((value, key) => {
    if (!EXCLUDED_HEADERS.includes(key.toLowerCase())) {
      headers.set(key, value);
    }
  });
  // Ensure content-type is set
  if (contentType) {
    headers.set('content-type', contentType);
  }

  try {
    let response = await fetch(backendUrl.toString(), {
      method: req.method,
      headers,
      body,
      credentials: 'include',
    });

    // El access token dura 15 minutos. Si ya expiró pero el refresh token sigue
    // vigente, renueva la sesión y repite la petición original de forma transparente.
    let refreshedCookies: string[] = [];
    if (response.status === 401 && !['auth/login', 'auth/google', 'auth/refresh'].includes(apiPath)) {
      const refreshResponse = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: { cookie: req.headers.get('cookie') || '' },
        credentials: 'include',
      });

      if (refreshResponse.ok) {
        refreshedCookies = getSetCookies(refreshResponse);
        const accessToken = getCookieValue(refreshedCookies, 'accessToken');

        if (accessToken) {
          const retryHeaders = new Headers(headers);
          retryHeaders.set(
            'cookie',
            replaceCookie(req.headers.get('cookie') || '', 'accessToken', accessToken)
          );

          response = await fetch(backendUrl.toString(), {
            method: req.method,
            headers: retryHeaders,
            body,
            credentials: 'include',
          });
        }
      }
    }

    // Forward response without decoding it as text so PDFs and other binaries stay intact.
    const responseBody = await response.arrayBuffer();
    const responseHeaders = new Headers(response.headers);

    refreshedCookies.forEach((cookie) => responseHeaders.append('set-cookie', cookie));
    
    // Allow CORS
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return new NextResponse(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('[API Proxy Error]', error);
    return NextResponse.json(
      { error: 'Backend error', details: String(error) },
      { status: 502 }
    );
  }
}

export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const DELETE = handler;
export const PUT = handler;
export const OPTIONS = handler;

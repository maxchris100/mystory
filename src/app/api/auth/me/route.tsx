
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value ?? null;
  const expiresCookie = cookieStore.get("auth_token_expires")?.value ?? null;

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }

  let isExpired = false;
  let expiresAt: string | null = null;
  if (expiresCookie) {
    expiresAt = expiresCookie;
    const expiresMs = Date.parse(expiresCookie);
    if (!Number.isNaN(expiresMs)) {
      isExpired = Date.now() >= expiresMs;
    }
  }

  if (isExpired) {
    return NextResponse.json({ authenticated: false, expired: true }, { status: 200 });
  }

  return NextResponse.json({ authenticated: true, token, expiresAt }, { status: 200 });
}


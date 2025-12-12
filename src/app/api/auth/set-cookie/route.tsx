import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const token: string | undefined = body?.token;
    const expiresAt: string | undefined = body?.expiresAt;

    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: (globalThis as any).process?.env?.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: expiresAt ? new Date(expiresAt) : undefined,
    });
    if (expiresAt) {
      response.cookies.set("auth_token_expires", expiresAt, {
        httpOnly: true,
        secure: (globalThis as any).process?.env?.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: new Date(expiresAt),
      });
    }
    return response;
  } catch (error) {
    return NextResponse.json({ error: "Failed to set cookie" }, { status: 500 });
  }
}


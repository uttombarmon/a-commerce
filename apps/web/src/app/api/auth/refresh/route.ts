import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-jwt-key";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const oldRefreshToken = cookieStore.get('refreshToken')?.value;

    if (!oldRefreshToken) {
      return NextResponse.json({ success: false, error: "No refresh token" }, { status: 401 });
    }

    // 1. Verify refresh token in DB
    // const session = await db.query.sessions.findFirst({ where: eq(sessions.refreshToken, oldRefreshToken) });
    // if (!session || session.expiresAt < new Date()) {
    //   return 401
    // }
    
    // Mock user lookup based on session.userId
    const mockUser = { id: 1, role: "customer" };

    // 2. Generate new tokens (Rotation)
    const newAccessToken = jwt.sign(
      { userId: mockUser.id, role: mockUser.role }, 
      JWT_SECRET, 
      { expiresIn: '15m' }
    );
    
    const newRefreshToken = crypto.randomBytes(64).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // 3. Update DB Session
    // await db.update(sessions).set({ refreshToken: newRefreshToken, expiresAt }).where(eq(sessions.refreshToken, oldRefreshToken));

    const response = NextResponse.json({
      success: true,
      accessToken: newAccessToken
    });

    response.cookies.set({
      name: 'refreshToken',
      value: newRefreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt,
      path: '/'
    });

    console.log("[Auth API] Token refreshed");
    return response;

  } catch (error) {
    return NextResponse.json({ success: false, error: "Refresh failed" }, { status: 500 });
  }
}

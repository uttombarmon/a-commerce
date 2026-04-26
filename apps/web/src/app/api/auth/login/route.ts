import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-jwt-key";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "super-secret-refresh-key";
const MAX_LOGIN_ATTEMPTS = 5;

export async function POST(request: Request) {
  try {
    const { email, password, code } = await request.json();

    // 1. Mock Find User
    // const user = await db.query.users.findFirst({ where: eq(users.email, email) });
    const mockUser = {
      id: 1,
      email,
      name: "Test User",
      role: "customer",
      passwordHash: await bcrypt.hash("password123", 12),
      failedLoginAttempts: 0,
      lockedUntil: null,
      twoFactorEnabled: false,
    };
    
    if (!mockUser || !mockUser.passwordHash) {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
    }

    // 2. Check Lockout
    if (mockUser.lockedUntil && new Date(mockUser.lockedUntil) > new Date()) {
      return NextResponse.json({ success: false, error: "Account locked. Try again later." }, { status: 403 });
    }

    // 3. Verify Password
    const isValid = await bcrypt.compare(password, mockUser.passwordHash);
    
    if (!isValid) {
      // Increment failed attempts mock logic
      console.log(`[Auth API] Failed login attempt for ${email}`);
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
    }

    // 4. Check 2FA
    if (mockUser.twoFactorEnabled) {
      if (!code) {
        return NextResponse.json({ success: true, require2FA: true });
      }
      // Verify TOTP logic here
    }

    // 5. Generate Tokens
    const accessToken = jwt.sign(
      { userId: mockUser.id, role: mockUser.role }, 
      JWT_SECRET, 
      { expiresIn: '15m' }
    );
    
    const refreshToken = crypto.randomBytes(64).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    
    // Insert session into DB
    // await db.insert(sessions).values({ userId: mockUser.id, refreshToken, expiresAt, ipAddress: request.headers.get('x-forwarded-for'), userAgent: request.headers.get('user-agent') })

    // 6. Set HttpOnly Cookie
    const response = NextResponse.json({
      success: true,
      user: { id: mockUser.id, name: mockUser.name, email: mockUser.email, role: mockUser.role },
      accessToken
    });

    response.cookies.set({
      name: 'refreshToken',
      value: refreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt,
      path: '/'
    });

    console.log(`[Auth API] User ${email} logged in successfully`);
    return response;

  } catch (error) {
    console.error("[Auth API] Login Error:", error);
    return NextResponse.json({ success: false, error: "Login failed" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) return NextResponse.json({ success: false, error: "Email required" }, { status: 400 });

    // 1. Check if user exists
    // const user = await db.query.users.findFirst({ where: eq(users.email, email) });
    // if (!user) {
    //    We return success anyway to prevent email enumeration attacks
    //    return NextResponse.json({ success: true }); 
    // }

    // 2. Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

    // await db.insert(verificationTokens).values({ identifier: email, token: resetToken, type: 'password_reset', expiresAt });

    console.log(`[Auth API] Password reset requested for ${email}`);
    console.log(`[Email Mock] Sent password reset email to ${email} with link: http://localhost:3000/reset-password?token=${resetToken}`);

    return NextResponse.json({ 
      success: true, 
      message: "If an account exists with that email, a password reset link has been sent." 
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Request failed" }, { status: 500 });
  }
}

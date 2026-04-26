import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Mock DB insert
    // const newUser = await db.insert(users).values({ name, email, passwordHash }).returning();
    
    // Generate verification token
    const token = crypto.randomBytes(32).toString('hex');
    // await db.insert(verificationTokens).values({ identifier: email, token, type: 'email_verification', expiresAt: Date.now() + 24*60*60*1000 });

    console.log(`[Auth API] Registered user ${email}. Verification token: ${token}`);
    
    // Mock sending email
    console.log(`[Email Mock] Sent verification email to ${email} with link: http://localhost:3000/verify?token=${token}`);

    return NextResponse.json({ 
      success: true, 
      message: "Registration successful. Please check your email to verify your account." 
    });
  } catch (error) {
    console.error("[Auth API] Registration Error:", error);
    return NextResponse.json({ success: false, error: "Registration failed" }, { status: 500 });
  }
}

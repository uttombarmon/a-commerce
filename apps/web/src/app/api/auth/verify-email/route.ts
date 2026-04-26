import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) return NextResponse.json({ success: false, error: "Missing token" }, { status: 400 });

    // 1. Find token in DB
    // const verifyToken = await db.query.verificationTokens.findFirst({ where: eq(verificationTokens.token, token) });
    // if (!verifyToken || verifyToken.type !== 'email_verification' || verifyToken.expiresAt < new Date()) {
    //   return 400 "Invalid or expired token"
    // }

    // 2. Update user
    // await db.update(users).set({ emailVerified: new Date() }).where(eq(users.email, verifyToken.identifier));

    // 3. Delete token
    // await db.delete(verificationTokens).where(eq(verificationTokens.token, token));

    console.log(`[Auth API] Email verified using token ${token}`);

    return NextResponse.json({ success: true, message: "Email successfully verified!" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Verification failed" }, { status: 500 });
  }
}

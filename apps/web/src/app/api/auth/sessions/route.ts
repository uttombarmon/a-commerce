import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-jwt-key";

// Helper to authenticate requests in App Router
const getUserId = (request: Request): number | null => {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  
  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    return decoded.userId;
  } catch (e) {
    return null;
  }
};

export async function GET(request: Request) {
  const userId = getUserId(request);
  if (!userId) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  // const activeSessions = await db.query.sessions.findMany({ where: eq(sessions.userId, userId) });
  
  // Mock Active Sessions
  const mockSessions = [
    { id: 1, userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36", ipAddress: "192.168.1.10", createdAt: new Date().toISOString() },
    { id: 2, userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6) Safari/604.1", ipAddress: "10.0.0.5", createdAt: new Date(Date.now() - 86400000).toISOString() }
  ];

  return NextResponse.json({ success: true, sessions: mockSessions });
}

export async function DELETE(request: Request) {
  const userId = getUserId(request);
  if (!userId) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('id');

    if (!sessionId) return NextResponse.json({ success: false, error: "Session ID required" }, { status: 400 });

    // await db.delete(sessions).where(and(eq(sessions.id, parseInt(sessionId)), eq(sessions.userId, userId)));
    console.log(`[Auth API] Revoked session ${sessionId} for user ${userId}`);

    return NextResponse.json({ success: true, message: "Session revoked" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to revoke session" }, { status: 500 });
  }
}

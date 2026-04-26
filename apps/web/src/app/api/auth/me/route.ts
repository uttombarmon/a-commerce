import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-jwt-key";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number, role: string };

    // Fetch full user profile from DB using decoded.userId
    // const user = await db.query.users.findFirst({ where: eq(users.id, decoded.userId) });

    const mockUser = {
      id: decoded.userId,
      name: "Test User",
      email: "test@example.com",
      role: decoded.role,
      avatar: null
    };

    return NextResponse.json({ success: true, user: mockUser });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
  }
}

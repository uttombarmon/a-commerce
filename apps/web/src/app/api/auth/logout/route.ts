import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refreshToken')?.value;

  if (refreshToken) {
    // Delete session from database
    // await db.delete(sessions).where(eq(sessions.refreshToken, refreshToken));
    console.log("[Auth API] Session removed from DB");
  }

  const response = NextResponse.json({ success: true });
  
  // Clear the cookie
  response.cookies.delete('refreshToken');
  
  return response;
}

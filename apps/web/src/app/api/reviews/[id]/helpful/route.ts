import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { action } = body; // "up" | "down"

  console.log(`[Reviews API] Marking review ${id} as ${action === 'up' ? 'helpful' : 'not helpful'}`);

  // In DB: UPDATE reviews SET helpful_votes = helpful_votes + 1 WHERE id = id
  
  return NextResponse.json({ success: true, message: "Vote recorded" });
}

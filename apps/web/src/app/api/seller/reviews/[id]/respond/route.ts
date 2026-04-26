import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { response } = body;

  console.log(`[Seller API] Responding to review ${id}: ${response}`);

  // In DB: UPDATE reviews SET seller_response = response WHERE id = id AND seller_id matches user's seller ID
  
  return NextResponse.json({ success: true, message: "Response submitted" });
}

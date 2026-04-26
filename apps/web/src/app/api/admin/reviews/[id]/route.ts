import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { status } = body; // 'approved' | 'rejected'

  console.log(`[Admin API] Setting review ${id} status to ${status}`);

  // In DB: UPDATE reviews SET status = status WHERE id = id
  
  return NextResponse.json({ success: true, message: `Review ${status}` });
}



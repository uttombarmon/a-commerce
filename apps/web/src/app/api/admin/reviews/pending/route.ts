import { NextResponse } from "next/server";

export async function GET() {
  console.log(`[Admin API] Fetching pending reviews`);

  // In DB: SELECT * FROM reviews WHERE status = 'pending'
  
  return NextResponse.json({ 
    success: true, 
    reviews: [
      {
        id: "201",
        productId: "1",
        productTitle: "Sony Headphones",
        authorName: "Test User",
        rating: 1,
        title: "Terrible",
        comment: "This is spam.",
        status: "pending",
        date: "2024-03-01T10:00:00Z"
      }
    ]
  });
}

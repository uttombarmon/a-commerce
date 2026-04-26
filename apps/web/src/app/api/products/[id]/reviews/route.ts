import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const sort = searchParams.get('sort') || 'recent';

  console.log(`[Reviews API] Fetching reviews for product ${id}, sorted by ${sort}`);

  // Mock returning reviews
  // In a real app, we would query the database WHERE productId = id AND status = 'approved'
  // and ORDER BY according to the sort parameter
  
  return NextResponse.json({
    success: true,
    reviews: [
      {
        id: "101",
        authorName: "John Doe",
        rating: 5,
        title: "Incredible product!",
        body: "Exceeded my expectations in every way.",
        pros: "Great build quality, fast shipping.",
        cons: "None so far.",
        date: "2024-02-15T10:00:00Z",
        verified: true,
        helpful: 12,
        notHelpful: 1,
        images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200"],
      },
      {
        id: "102",
        authorName: "Jane Smith",
        rating: 4,
        title: "Very good, but missing one feature",
        body: "I really like the device, but it lacks the carrying case mentioned.",
        date: "2024-02-10T14:30:00Z",
        verified: true,
        helpful: 5,
        notHelpful: 0,
        sellerResponse: "Hi Jane, we apologize for the missing case. Please contact our support team to get one shipped immediately!"
      }
    ],
    rating: 4.5,
    totalReviews: 2,
    breakdown: [
      { stars: 5, count: 1, pct: 50 },
      { stars: 4, count: 1, pct: 50 },
      { stars: 3, count: 0, pct: 0 },
      { stars: 2, count: 0, pct: 0 },
      { stars: 1, count: 0, pct: 0 },
    ]
  });
}

import { NextResponse } from "next/server";

// Mock DB
// import { db } from "database";
// import { reviews } from "database/schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, rating, title, comment, pros, cons, images } = body;

    // 1. Check if user is verified buyer
    // const hasPurchased = await checkUserPurchaseHistory(userId, productId);
    const mockVerified = true; // In real app, enforce based on DB query
    
    if (!mockVerified) {
      return NextResponse.json(
        { success: false, error: "Only verified buyers can review this product." },
        { status: 403 }
      );
    }

    // 2. Insert Review into DB with status pending
    console.log("[Reviews API] Submitting review for product:", productId, { title, rating });

    /*
    await db.insert(reviews).values({
      userId: 1, // Mocked from session
      productId: parseInt(productId),
      rating,
      title,
      comment,
      pros,
      cons,
      images,
      verifiedPurchase: true,
      status: 'pending' // Admin moderation queue
    });
    */

    return NextResponse.json({ 
      success: true, 
      message: "Review submitted successfully and is pending moderation." 
    });
  } catch (error) {
    console.error("[Reviews API] Error submitting review:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit review" }, 
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Simulate complex processing and DB insertion
    console.log("[Seller API] Creating product:", body.title);
    console.log("[Seller API] Variants generated:", body.variants?.length || 0);
    
    // Simulate artificial delay
    await new Promise(r => setTimeout(r, 1500));
    
    return NextResponse.json({ 
      success: true, 
      productId: Math.floor(Math.random() * 1000000),
      message: "Product published successfully!" 
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to process product creation" }, { status: 500 });
  }
}

export async function GET() {
  // Simulate listing products for the seller
  return NextResponse.json({
    products: [
      { id: 1, title: "Mock Sony Headphones", status: "active", stock: 45, price: 299.99 },
      { id: 2, title: "Mock Bose Buds", status: "draft", stock: 0, price: 199.99 },
    ]
  });
}

import { NextResponse } from "next/server";

export async function GET() {
  // Mock fetching saved addresses for the logged-in user
  console.log("[Addresses API] Fetching saved addresses");
  
  return NextResponse.json({
    success: true,
    addresses: [
      {
        id: 1,
        fullName: "John Doe",
        phone: "+1 234 567 890",
        street: "123 Main St, Apt 4B",
        city: "New York",
        state: "NY",
        zip: "10001",
        country: "USA",
        isDefault: true,
      }
    ]
  });
}

export async function POST(request: Request) {
  try {
    const address = await request.json();
    
    // In a real app:
    // 1. Get user session
    // 2. If address.isDefault is true, set others to false
    // 3. INSERT INTO addresses
    
    console.log("[Addresses API] Saving new address:", address);
    
    return NextResponse.json({ 
      success: true, 
      message: "Address saved successfully",
      address: { ...address, id: Date.now() } 
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to save address" }, { status: 500 });
  }
}

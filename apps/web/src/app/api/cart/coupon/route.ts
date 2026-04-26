import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, cartSubtotal } = body;
    
    // 1. SELECT * FROM coupons WHERE code = code AND expiry > NOW()
    // 2. if not found -> return error
    // 3. if found, check min_order condition
    // 4. Calculate discount
    
    console.log(`[Coupon API] Validating coupon: ${code}`);

    if (code.toLowerCase() === 'save20') {
      return NextResponse.json({ 
        success: true, 
        discount: 20,
        type: 'fixed_amount',
        message: "Coupon applied successfully" 
      });
    }

    return NextResponse.json({ success: false, message: "Invalid or expired coupon" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to apply coupon" }, { status: 500 });
  }
}

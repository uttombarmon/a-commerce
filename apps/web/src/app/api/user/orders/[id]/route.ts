import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // Mock fetching order details
  const mockOrder = {
    id: id,
    createdAt: "2023-10-28T09:15:00Z",
    status: "shipped",
    subtotal: 115.00,
    tax: 9.50,
    shippingFee: 5.00,
    total: 129.50,
    shippingMethod: "standard",
    paymentMethod: "credit_card",
    shippingAddress: {
      fullName: "Jane Doe",
      street: "456 Tech Ave",
      city: "San Francisco",
      state: "CA",
      zip: "94105",
      country: "USA"
    },
    trackingNumber: "TRK123456789",
    deliveryDate: "2023-11-02T18:00:00Z",
    items: [
      {
        productId: 1,
        title: "Mechanical Keyboard Pro",
        image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&auto=format&fit=crop",
        quantity: 1,
        priceAtPurchase: 115.00
      }
    ]
  };

  return NextResponse.json({ success: true, order: mockOrder });
}

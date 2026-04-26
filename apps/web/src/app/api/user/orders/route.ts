import { NextResponse } from "next/server";

export async function GET() {
  // Mock fetching user orders
  const mockOrders = [
    {
      id: "ORD-20231015-X9Y8",
      createdAt: "2023-10-15T14:30:00Z",
      status: "delivered",
      total: 245.99,
      itemCount: 3,
    },
    {
      id: "ORD-20231028-A1B2",
      createdAt: "2023-10-28T09:15:00Z",
      status: "shipped",
      total: 129.50,
      itemCount: 1,
    },
    {
      id: "ORD-20231102-C3D4",
      createdAt: new Date().toISOString(),
      status: "processing",
      total: 89.99,
      itemCount: 2,
    }
  ];

  return NextResponse.json({ success: true, orders: mockOrders });
}

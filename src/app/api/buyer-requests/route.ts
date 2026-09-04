import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";

export async function GET() {
  try {
    const requests = await db.buyerRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: 60,
    });
    return NextResponse.json({ requests });
  } catch (error) {
    console.error("GET /api/buyer-requests error:", error);
    return NextResponse.json({ error: "Failed to load buyer requests" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const rl = checkRateLimit(req);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rl.retryAfterMs ?? 60000) / 1000)) } }
    );
  }

  try {
    const body = await req.json();
    const { buyerName, company, country, crop, quantity, targetPrice, incoterm, notes } =
      body;

    if (!buyerName || !company || !country || !crop || !quantity || !targetPrice || !incoterm) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const request = await db.buyerRequest.create({
      data: {
        buyerName: String(buyerName).slice(0, 120),
        company: String(company).slice(0, 160),
        country: String(country).slice(0, 80),
        crop: String(crop).slice(0, 80),
        quantity: String(quantity).slice(0, 80),
        targetPrice: String(targetPrice).slice(0, 80),
        incoterm: String(incoterm).slice(0, 40),
        notes: notes ? String(notes).slice(0, 600) : null,
      },
    });

    return NextResponse.json({ request }, { status: 201 });
  } catch (error) {
    console.error("POST /api/buyer-requests error:", error);
    return NextResponse.json({ error: "Failed to create buyer request" }, { status: 500 });
  }
}

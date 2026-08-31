import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const listings = await db.listing.findMany({
      where: { status: "active" },
      orderBy: { createdAt: "desc" },
      take: 60,
    });
    return NextResponse.json({ listings });
  } catch (error) {
    console.error("GET /api/listings error:", error);
    return NextResponse.json({ error: "Failed to load listings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      farmerName,
      farmerContact,
      county,
      crop,
      variety,
      quantity,
      unit,
      price,
      certifications,
      description,
      harvestWindow,
    } = body;

    if (
      !farmerName ||
      !farmerContact ||
      !county ||
      !crop ||
      !quantity ||
      !unit ||
      price === undefined ||
      price === null
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const listing = await db.listing.create({
      data: {
        farmerName: String(farmerName).slice(0, 120),
        farmerContact: String(farmerContact).slice(0, 160),
        county: String(county).slice(0, 80),
        crop: String(crop).slice(0, 80),
        variety: variety ? String(variety).slice(0, 80) : null,
        quantity: Number(quantity),
        unit: String(unit).slice(0, 40),
        price: Number(price),
        currency: "KES",
        certifications: certifications ? String(certifications).slice(0, 200) : null,
        description: description ? String(description).slice(0, 600) : null,
        harvestWindow: harvestWindow ? String(harvestWindow).slice(0, 80) : null,
      },
    });

    return NextResponse.json({ listing }, { status: 201 });
  } catch (error) {
    console.error("POST /api/listings error:", error);
    return NextResponse.json({ error: "Failed to create listing" }, { status: 500 });
  }
}

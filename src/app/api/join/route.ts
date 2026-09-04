import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";

// Free registration for farmers and buyers
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
    const { role, name, email, phone, county, farmSizeAcres, crops, company, country, website, exportReady } =
      body;

    if (!role || !name || !email) {
      return NextResponse.json(
        { error: "Role, name and email are required" },
        { status: 400 }
      );
    }

    const emailStr = String(email).toLowerCase().trim();

    if (role === "farmer") {
      if (!county || !crops) {
        return NextResponse.json(
          { error: "County and crops are required for farmers" },
          { status: 400 }
        );
      }

      // Upsert — re-joining is fine and free
      const farmer = await db.farmer.upsert({
        where: { email: emailStr },
        update: {
          name: String(name).slice(0, 120),
          phone: phone ? String(phone).slice(0, 40) : null,
          county: String(county).slice(0, 80),
          farmSizeAcres: farmSizeAcres ? Number(farmSizeAcres) : null,
          crops: String(crops).slice(0, 400),
          exportReady: Boolean(exportReady),
        },
        create: {
          name: String(name).slice(0, 120),
          email: emailStr,
          phone: phone ? String(phone).slice(0, 40) : null,
          county: String(county).slice(0, 80),
          farmSizeAcres: farmSizeAcres ? Number(farmSizeAcres) : null,
          crops: String(crops).slice(0, 400),
          exportReady: Boolean(exportReady),
        },
      });

      return NextResponse.json({ role: "farmer", profile: farmer }, { status: 201 });
    }

    if (role === "buyer") {
      if (!company || !country || !crops) {
        return NextResponse.json(
          { error: "Company, country and crops of interest are required" },
          { status: 400 }
        );
      }

      const buyer = await db.buyer.upsert({
        where: { email: emailStr },
        update: {
          name: String(name).slice(0, 120),
          company: String(company).slice(0, 160),
          country: String(country).slice(0, 80),
          crops: String(crops).slice(0, 400),
          website: website ? String(website).slice(0, 200) : null,
        },
        create: {
          name: String(name).slice(0, 120),
          email: emailStr,
          company: String(company).slice(0, 160),
          country: String(country).slice(0, 80),
          crops: String(crops).slice(0, 400),
          website: website ? String(website).slice(0, 200) : null,
        },
      });

      return NextResponse.json({ role: "buyer", profile: buyer }, { status: 201 });
    }

    return NextResponse.json({ error: "Role must be 'farmer' or 'buyer'" }, { status: 400 });
  } catch (error) {
    console.error("POST /api/join error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}

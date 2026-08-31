import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Kilimo Radar marketplace…");

  // Clear existing seeds
  await prisma.listing.deleteMany();
  await prisma.buyerRequest.deleteMany();

  const listings = [
    {
      farmerName: "Wanjiku Kariuki",
      farmerContact: "wanjiku.k@example.co.ke · 0722 481 903",
      county: "Muranga",
      crop: "Avocado (Hass)",
      variety: "Hass",
      quantity: 3200,
      unit: "kg",
      price: 54,
      certifications: "GlobalG.A.P. (via exporter partner)",
      description:
        "Clean orchard, 480 trees, picked to export grade. Fruit size 12-16. Can stagger harvest over 6 weeks. Looking for a buyer linked to Netherlands or China protocols.",
      harvestWindow: "Jun–Aug",
      createdAt: new Date(Date.now() - 2 * 864e5),
    },
    {
      farmerName: "Kericho Smallholders Group",
      farmerContact: "info@kerichosmallholders.example · 0733 905 217",
      county: "Kericho",
      crop: "Tea",
      variety: "Black CTC (MBK grade)",
      quantity: 14500,
      unit: "kg",
      price: 372,
      certifications: "Rainforest Alliance",
      description:
        "Consolidated green leaf from 64 member farms, processed at KTDA-affiliated factory. Consistent monthly volume available year-round.",
      harvestWindow: "Year-round",
      createdAt: new Date(Date.now() - 4 * 864e5),
    },
    {
      farmerName: "Aisha Mwinyi",
      farmerContact: "aisha.mwinyi@example.co.ke · 0711 344 872",
      county: "Kilifi",
      crop: "Chilli",
      variety: "Bird's Eye",
      quantity: 850,
      unit: "kg",
      price: 145,
      certifications: "In transition to organic",
      description:
        "Hot bird's eye chilli, dried to 12% moisture. Ideal for EU spice blenders. Can supply 200 kg weekly.",
      harvestWindow: "Year-round (irrigated)",
      createdAt: new Date(Date.now() - 1 * 864e5),
    },
    {
      farmerName: "Naivasha Bloom Growers",
      farmerContact: "sales@naivashabloom.example · 0720 118 556",
      county: "Nakuru",
      crop: "Cut Flowers",
      variety: "Rose (spray)",
      quantity: 18000,
      unit: "stems",
      price: 13.5,
      certifications: "GlobalG.A.P. · Fairtrade",
      description:
        "Spray roses, 50cm+, five colour lines. Weekly standing volume, air freight via NBO with consolidated cool chain.",
      harvestWindow: "Year-round",
      createdAt: new Date(Date.now() - 6 * 864e5),
    },
    {
      farmerName: "Joseph Otieno",
      farmerContact: "joseph.otieno@example.co.ke · 0740 226 991",
      county: "Kisii",
      crop: "Avocado (Fuerte)",
      variety: "Fuerte",
      quantity: 1900,
      unit: "kg",
      price: 41,
      certifications: "None yet",
      description:
        "Early-season Fuerte, ready from February. Farm is 3 km from Kisii town tarmac road, easy collection. Open to exporter partnership for certification.",
      harvestWindow: "Feb–Apr",
      createdAt: new Date(Date.now() - 3 * 864e5),
    },
    {
      farmerName: "Mwea Fine Beans Cooperative",
      farmerContact: "mweabeans@example.co.ke · 0719 883 402",
      county: "Kirinyaga",
      crop: "French Beans",
      variety: "Sereni (fine)",
      quantity: 2400,
      unit: "kg",
      price: 96,
      certifications: "KenyaGAP",
      description:
        "Fine beans, hand-picked to export spec, graded and hydro-cooled same day. 137 member farms on irrigation — reliable weekly volumes.",
      harvestWindow: "Year-round",
      createdAt: new Date(Date.now() - 8 * 864e5),
    },
    {
      farmerName: "Embu Nut Growers CBO",
      farmerContact: "embunuts@example.co.ke · 0726 550 118",
      county: "Embu",
      crop: "Macadamia",
      variety: "Nut-in-shell (NIS)",
      quantity: 5600,
      unit: "kg",
      price: 178,
      certifications: "None yet",
      description:
        "Freshly dehusked NIS, moisture 22%, crack-out 32%. Collected from 40 member farms on the slopes of Mt Kenya. China-linked buyers welcome.",
      harvestWindow: "Mar–Aug",
      createdAt: new Date(Date.now() - 5 * 864e5),
    },
    {
      farmerName: "Peter Mwangi",
      farmerContact: "peter.mwangi@example.co.ke · 0734 771 095",
      county: "Nyeri",
      crop: "Coffee",
      variety: "SL28 (fully washed)",
      quantity: 4300,
      unit: "kg",
      price: 118,
      certifications: "Fairtrade (via factory)",
      description:
        "Fully washed SL28 cherry from red volcanic soils. Cupping scores typically 84+. Factory registered with CBK; GPS mapping done for EUDR.",
      harvestWindow: "Oct–Jan",
      createdAt: new Date(Date.now() - 9 * 864e5),
    },
    {
      farmerName: "Makueni Mango Association",
      farmerContact: "makuenimango@example.co.ke · 0790 442 667",
      county: "Makueni",
      crop: "Mango",
      variety: "Apple mango",
      quantity: 7800,
      unit: "kg",
      price: 32,
      certifications: "None yet",
      description:
        "Apple mango, fruit fly-controlled zone with county traps. Hot water treatment available at Makueni aggregation centre for export prep.",
      harvestWindow: "Nov–Mar",
      createdAt: new Date(Date.now() - 7 * 864e5),
    },
    {
      farmerName: "Baringo Sesame Collective",
      farmerContact: "baringosesame@example.co.ke · 0755 909 218",
      county: "Baringo",
      crop: "Sesame",
      variety: "White (Sesim-2)",
      quantity: 3100,
      unit: "kg",
      price: 128,
      certifications: "None yet",
      description:
        "Clean white sesame, 99.5% purity, dried to 8% moisture. With China duty-free access from May 2026 we want serious buyers for 2026/27 season.",
      harvestWindow: "Aug–Oct",
      createdAt: new Date(Date.now() - 10 * 864e5),
    },
  ];

  const buyerRequests = [
    {
      buyerName: "Sanne Verhoeven",
      company: "Tulip Fresh Produce B.V.",
      country: "Netherlands",
      crop: "Avocado (Hass)",
      quantity: "1 x 40ft reefer / week (≈21 MT)",
      targetPrice: "EUR 8.50–9.20 / kg CFR Rotterdam",
      incoterm: "CFR",
      notes:
        "Seeking GlobalG.A.P. certified Hass for our EU retail program. Need EUDR GPS data per plot. We support farms through audits and offer 30-day payment.",
      createdAt: new Date(Date.now() - 3 * 864e5),
    },
    {
      buyerName: "Zhang Wei",
      company: "Guangdong Nutrimart Co.",
      country: "China",
      crop: "Macadamia",
      quantity: "20 MT / month (nut-in-shell)",
      targetPrice: "USD 5.80 / kg FOB Mombasa",
      incoterm: "FOB",
      notes:
        "New duty-free access makes Kenyan NIS competitive. Prefer crack-out above 30%. Long-term annual contracts possible.",
      createdAt: new Date(Date.now() - 5 * 864e5),
    },
    {
      buyerName: "Imran Sheikh",
      company: "Karachi Tea Traders",
      country: "Pakistan",
      crop: "Tea",
      quantity: "2 containers (≈44 MT) monthly",
      targetPrice: "USD 3.10 / kg FOB Mombasa",
      incoterm: "FOB",
      notes:
        "Buying bulk CTC grades via Mombasa auction plus direct contracts. LC at sight. Priority to suppliers who can guarantee volumes through Red Sea disruptions.",
      createdAt: new Date(Date.now() - 2 * 864e5),
    },
    {
      buyerName: "Clara Mensah",
      company: "London Fine Foods Ltd",
      country: "United Kingdom",
      crop: "Coffee",
      quantity: "10 MT specialty arabica (annual)",
      targetPrice: "USD 6.20–7.50 / kg FOB",
      incoterm: "FOB",
      notes:
        "Single-origin micro-lots for specialty roasters. SL28 or SL34, 84+ cupping score, full traceability. Pay 50% upfront on contract.",
      createdAt: new Date(Date.now() - 6 * 864e5),
    },
    {
      buyerName: "Fatima Al Rashid",
      company: "Gulf Fresh Trading",
      country: "United Arab Emirates",
      crop: "Mango",
      quantity: "8 MT / fortnight",
      targetPrice: "USD 0.95 / kg FOB Nairobi",
      incoterm: "FOB",
      notes:
        "Apple mango for Gulf retail. Hot-water treated, 5kg cartons. Dubai Municipality registration handled on our side.",
      createdAt: new Date(Date.now() - 4 * 864e5),
    },
    {
      buyerName: "Hans Müller",
      company: "Bremen Gemüse GmbH",
      country: "Germany",
      crop: "French Beans",
      quantity: "12 MT / week",
      targetPrice: "EUR 2.80 / kg FOB Nairobi",
      incoterm: "FOB",
      notes:
        "Year-round program with strict MRL compliance — KenyaGAP required. Air freight consolidated via NBO. We provide agronomy support to partner farms.",
      createdAt: new Date(Date.now() - 8 * 864e5),
    },
    {
      buyerName: "Sarah Kimani",
      company: "Nairobi Bloom Direct",
      country: "Kenya",
      crop: "Cut Flowers",
      quantity: "25,000 stems / week",
      targetPrice: "KES 12.5–15.0 / stem (by grade)",
      incoterm: "EXW",
      notes:
        "Direct-to-consumer flower subscription. Spraying roses 50cm+, mixed colours. Buying direct from farms around Naivasha — better prices than auction.",
      createdAt: new Date(Date.now() - 1 * 864e5),
    },
    {
      buyerName: "Amina Yusuf",
      company: "Mombasa Agro Exports",
      country: "Kenya",
      crop: "Sesame",
      quantity: "10 MT monthly",
      targetPrice: "KES 122–135 / kg (farm gate)",
      incoterm: "EXW",
      notes:
        "Aggregating white sesame for the China duty-free window. We collect from farms with our own transport. Immediate contracts available.",
      createdAt: new Date(Date.now() - 7 * 864e5),
    },
  ];

  for (const l of listings) {
    await prisma.listing.create({ data: l });
  }
  for (const r of buyerRequests) {
    await prisma.buyerRequest.create({ data: r });
  }

  console.log(`✅ Seeded ${listings.length} listings and ${buyerRequests.length} buyer requests.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

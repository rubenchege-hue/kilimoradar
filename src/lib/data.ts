// ─────────────────────────────────────────────────────────────
// Kilimo Radar — static intelligence data
// Grounded in 2024–2026 research: OEC trade data, Kenya Economic
// Survey 2024, USDA FAS reports, WTO/UNCTAD shipping analysis.
// ─────────────────────────────────────────────────────────────

export type Severity = "high" | "medium" | "low" | "opportunity";
export type AlertCategory =
  | "shipping"
  | "inputs"
  | "regulation"
  | "market"
  | "currency"
  | "opportunity";

export interface RiskAlert {
  id: string;
  title: string;
  category: AlertCategory;
  severity: Severity;
  summary: string;
  farmerImpact: string;
  actionAdvice: string[];
  affectedCrops: string[];
  affectedMarkets: string[];
  source: string;
  publishedAt: string;
}

export interface Commodity {
  id: string;
  name: string;
  emoji: string;
  exportValue: string;
  rank: number;
  unit: string;
  price: number;
  currency: string;
  changePct: number;
  trend: number[];
  topMarkets: string[];
  note: string;
  season: string;
}

export interface DestinationMarket {
  id: string;
  name: string;
  flag: string;
  value: string;
  share: number;
  keyImports: string[];
  requirements: string[];
  riskLevel: "low" | "medium" | "high";
  riskNote: string;
}

export interface CountyInfo {
  name: string;
  mainCrops: string[];
}

export const CROPS = [
  "Tea",
  "Coffee",
  "Avocado (Hass)",
  "Avocado (Fuerte)",
  "Macadamia",
  "Cut Flowers",
  "French Beans",
  "Snow Peas",
  "Mango",
  "Pineapple",
  "Passion Fruit",
  "Chilli",
  "Banana",
  "Sesame",
  "Sweet Potato",
  "Onion",
  "Tomato",
  "Irish Potato",
] as const;

export const COUNTIES: CountyInfo[] = [
  { name: "Nakuru", mainCrops: ["Tea", "Coffee", "Macadamia", "Cut Flowers"] },
  { name: "Kiambu", mainCrops: ["Coffee", "Avocado", "Cut Flowers", "French Beans"] },
  { name: "Muranga", mainCrops: ["Avocado", "Coffee", "Macadamia", "Tea"] },
  { name: "Nyeri", mainCrops: ["Coffee", "Tea", "Macadamia", "Dairy"] },
  { name: "Meru", mainCrops: ["Avocado", "Banana", "Miraa", "Tea"] },
  { name: "Kirinyaga", mainCrops: ["French Beans", "Rice", "Tomato", "Avocado"] },
  { name: "Embú", mainCrops: ["Coffee", "Tea", "Avocado", "Macadamia"] },
  { name: "Machakos", mainCrops: ["Mango", "Avocado", "Sesame", "Dairy"] },
  { name: "Makueni", mainCrops: ["Mango", "Avocado", "Sesame", "Green Gram"] },
  { name: "Kitui", mainCrops: ["Sesame", "Mango", "Sorghum", "Green Gram"] },
  { name: "Kakamega", mainCrops: ["Sugarcane", "Tea", "Maize", "Avocado"] },
  { name: "Kericho", mainCrops: ["Tea", "Dairy", "Maize"] },
  { name: "Nandi", mainCrops: ["Tea", "Maize", "Dairy"] },
  { name: "Bomet", mainCrops: ["Tea", "Dairy", "Irish Potato"] },
  { name: "Uasin Gishu", mainCrops: ["Maize", "Wheat", "Irish Potato", "Dairy"] },
  { name: "Trans Nzoia", mainCrops: ["Maize", "Irish Potato", "Dairy"] },
  { name: "Bungoma", mainCrops: ["Sugarcane", "Maize", "Tea"] },
  { name: "Kisii", mainCrops: ["Tea", "Banana", "Avocado", "Dairy"] },
  { name: "Kilifi", mainCrops: ["Cashew Nut", "Coconut", "Mango", "Chilli"] },
  { name: "Mombasa", mainCrops: ["Chilli", "Coconut", "Cashew Nut"] },
  { name: "Laikipia", mainCrops: ["Wheat", "Dairy", "Avocado", "Cut Flowers"] },
  { name: "Nairobi", mainCrops: ["Cut Flowers", "Vegetables", "Dairy"] },
  { name: "Kajiado", mainCrops: ["Dairy", "Onion", "Tomato"] },
  { name: "Narok", mainCrops: ["Wheat", "Maize", "Irish Potato"] },
  { name: "Isiolo", mainCrops: ["Sesame", "Dairy", "Goats"] },
  { name: "Nyahururu", mainCrops: ["Cut Flowers", "Dairy", "Irish Potato"] },
];

// ─────────────────────────────────────────────────────────────
// Kenya export commodities (2024 values, OEC / Economic Survey)
// ─────────────────────────────────────────────────────────────
export const COMMODITIES: Commodity[] = [
  {
    id: "tea",
    name: "Tea",
    emoji: "🍃",
    exportValue: "$1.4B",
    rank: 1,
    unit: "kg (MBK auction)",
    price: 385,
    currency: "KES",
    changePct: 4.2,
    trend: [340, 348, 352, 361, 355, 368, 372, 370, 378, 381, 383, 385],
    topMarkets: ["Pakistan", "UAE", "UK", "Egypt", "Sudan"],
    note: "Kenya's #1 export earner — Sh188.7B in 2024. Black CTC tea sold via Mombasa auction. Over 600M kg produced annually.",
    season: "Year-round (peak Mar–Jun & Nov–Dec)",
  },
  {
    id: "flowers",
    name: "Cut Flowers",
    emoji: "🌹",
    exportValue: "$780M",
    rank: 2,
    unit: "stem (roses, FOB)",
    price: 14,
    currency: "KES",
    changePct: 2.8,
    trend: [11, 11.5, 12, 12.2, 12.8, 13, 12.6, 13.1, 13.4, 13.6, 13.8, 14],
    topMarkets: ["Netherlands", "UK", "Germany", "Russia", "USA"],
    note: "Kenya supplies ~35% of Europe's roses, mostly through Dutch auctions (Naivasha & Nakuru farms). Highly perishable — air freight sensitive.",
    season: "Year-round (Valentine's & Mother's Day peaks)",
  },
  {
    id: "avocado",
    name: "Avocado",
    emoji: "🥑",
    exportValue: "$140M+",
    rank: 3,
    unit: "kg (Hass, farm gate)",
    price: 52,
    currency: "KES",
    changePct: -3.5,
    trend: [58, 57, 56, 57, 55, 54, 55, 53, 52, 53, 51, 52],
    topMarkets: ["Netherlands", "China", "UK", "France", "Egypt"],
    note: "Kenya is Africa's largest avocado exporter — ~135,000 MT projected for 2025. China trade agreement (effective May 2026) opens duty-free access for 20+ commodities.",
    season: "Hass: Mar–Oct · Fuerte: Feb–Apr",
  },
  {
    id: "coffee",
    name: "Coffee",
    emoji: "☕",
    exportValue: "$313M",
    rank: 4,
    unit: "kg (cherry, farm gate)",
    price: 115,
    currency: "KES",
    changePct: 6.1,
    trend: [92, 94, 95, 98, 99, 101, 103, 105, 107, 110, 112, 115],
    topMarkets: ["Germany", "Belgium", "USA", "Sweden", "South Korea"],
    note: "Specialty SL28/SL34 & Ruiru 11 varieties earn premiums. EU Deforestation Regulation requires farm GPS coordinates from 2026.",
    season: "Main: Oct–Jan · Fly crop: May–Jul",
  },
  {
    id: "macadamia",
    name: "Macadamia",
    emoji: "🌰",
    exportValue: "$110M+",
    rank: 5,
    unit: "kg (nut-in-shell)",
    price: 180,
    currency: "KES",
    changePct: 8.5,
    trend: [140, 145, 148, 152, 158, 160, 165, 168, 172, 174, 176, 180],
    topMarkets: ["China", "Vietnam", "USA", "Netherlands"],
    note: "China duty-free entry from May 2026. Strict quality grading; 2024 export bans on raw nuts pushed domestic processing. High farm-gate prices.",
    season: "Mar–Aug (main)",
  },
  {
    id: "french-beans",
    name: "French Beans & Vegetables",
    emoji: "🫛",
    exportValue: "$90M+",
    rank: 6,
    unit: "kg (export grade)",
    price: 95,
    currency: "KES",
    changePct: -1.8,
    trend: [98, 97, 96, 97, 95, 94, 95, 93, 94, 93, 94, 95],
    topMarkets: ["UK", "Netherlands", "France", "Germany"],
    note: "Fine beans & snow peas core to EU/UK supermarket programs. Pesticide MRL limits are the #1 rejection cause — KenyaGAP certification essential.",
    season: "Year-round (irrigated)",
  },
];

// ─────────────────────────────────────────────────────────────
// Geopolitical risk alerts — editorial intelligence feed
// ─────────────────────────────────────────────────────────────
export const RISK_ALERTS: RiskAlert[] = [
  {
    id: "a1",
    title: "Strait of Hormuz conflict pushes fertilizer prices up",
    category: "inputs",
    severity: "high",
    summary:
      "Conflict in the Persian Gulf has severely disrupted global trade in urea and phosphate fertilizers (WTO, July 2026). About 26% of Kenya's sea-imported fertilizer comes from Gulf suppliers, putting supply and prices at risk ahead of the planting season.",
    farmerImpact:
      "Your planting-season fertilizer may cost 15–30% more or arrive late. Every shilling of extra input cost eats directly into your margin at harvest, and late application can cut yields for maize, tea and vegetables.",
    actionAdvice: [
      "Register now for the government-subsidized fertilizer programme through your county agriculture office",
      "Team up with neighbours or your cooperative for bulk buying — a shared lorry cuts both price and transport cost",
      "Do a soil test (KSh ~1,500) before buying — many farms over-apply DAP/CAN where manure or lime would do the job",
      "Consider compost and intercropping with legumes to reduce reliance on imported fertilizer this season",
    ],
    affectedCrops: ["All crops", "Maize", "Tea", "Coffee", "Vegetables"],
    affectedMarkets: ["Global inputs", "Persian Gulf suppliers"],
    source: "WTO Trade Analysis · UNCTAD",
    publishedAt: "2026-07-10",
  },
  {
    id: "a2",
    title: "Red Sea shipping crisis lengthens routes to Europe",
    category: "shipping",
    severity: "high",
    summary:
      "Attacks on commercial vessels have forced many shipping lines to re-route Kenya–Europe cargo around the Cape of Good Hope, adding 10–14 days transit time. Freight rates and war-risk insurance premiums remain elevated.",
    farmerImpact:
      "Sea-freighted exports (tea, avocado, macadamia, coffee) face higher freight deductions and slower payment cycles. Buyers may discount Kenyan produce versus closer suppliers. Perishable flower exporters face the sharpest cost pressure.",
    actionAdvice: [
      "Ask for freight-adjustment clauses in your buyer contracts instead of fixed prices for the year",
      "For high-value perishables (flowers, French beans), explore consolidated air freight through NBO — rates are negotiated per volume",
      "Book shipping space 3–4 weeks ahead and stagger harvests so no single shipment carries your whole season",
      "Get quotes from multiple freight forwarders in Mombasa and Nairobi before committing",
    ],
    affectedCrops: ["Tea", "Avocado", "Coffee", "Macadamia", "Cut Flowers"],
    affectedMarkets: ["European Union", "UK", "Netherlands"],
    source: "UNCTAD · IFPRI · J.P. Morgan Research",
    publishedAt: "2026-03-10",
  },
  {
    id: "a3",
    title: "China opens duty-free access for 20+ Kenyan farm products",
    category: "opportunity",
    severity: "opportunity",
    summary:
      "Under the Kenya–China trade agreement effective 1 May 2026, over 20 Kenyan agricultural commodities — including avocado, macadamia, coffee, tea, sesame, cut flowers and French beans — enter China at zero tariff.",
    farmerImpact:
      "Zero tariffs can add 10–20% to your take-home price on China-bound produce versus taxed competitors. China is the world's fastest-growing market for macadamia and avocado, and demand currently outstrips Kenyan supply.",
    actionAdvice: [
      "Check if your buyer/exporter holds a China phytosanitary protocol registration — only registered exporters can ship avocado and macadamia",
      "Work towards GlobalG.A.P. or China-specific certification with your exporter's support — they often share audit costs",
      "Scale gradually: plant to contract, not to hope — secure a China-linked buyer before expanding acreage",
      "Attend Horticultural Crops Directorate (HCD) exporter-farmer link forums to meet protocol-registered exporters",
    ],
    affectedCrops: ["Avocado", "Macadamia", "Coffee", "Tea", "Sesame", "Cut Flowers", "French Beans"],
    affectedMarkets: ["China"],
    source: "Kenya–China Trade Agreement · FreshPlaza",
    publishedAt: "2026-05-01",
  },
  {
    id: "a4",
    title: "EU Deforestation Regulation (EUDR): farms need GPS data",
    category: "regulation",
    severity: "medium",
    summary:
      "The EU now requires coffee, cocoa and other deforestation-linked commodities to come with geolocation coordinates of the producing plots, proving they were not grown on land deforested after 2020. Non-compliant consignments are rejected at the border.",
    farmerImpact:
      "If you grow coffee (or plan to expand into cocoa/avocado for the EU market), your produce cannot enter Europe unless your exact farm plot coordinates are registered and declared by your exporter. Smallholders without documented plots risk being locked out of the EU price premium.",
    actionAdvice: [
      "Record your farm's GPS boundary — most smartphones can do this with free apps; your cooperative can help map plots",
      "Register your plot details with your cooperative or county agriculture office so your exporter can file your data",
      "Keep any land-clearing documentation proving your farm predates 2020",
      "Ask your exporter if they are EUDR-ready — those who are will pay better for traceable coffee",
    ],
    affectedCrops: ["Coffee", "Avocado", "Rubber"],
    affectedMarkets: ["European Union", "UK"],
    source: "European Commission · EU Regulation 2023/1115",
    publishedAt: "2026-01-15",
  },
  {
    id: "a5",
    title: "EU tightens pesticide residue limits on vegetables",
    category: "regulation",
    severity: "medium",
    summary:
      "The European Union has lowered Maximum Residue Limits (MRLs) for several common insecticides used on beans, peas and flowers. Kenyan consignments failing border tests face destruction at the exporter's cost and repeat offenders lose their approved status.",
    farmerImpact:
      "One failed residue test can blacklist an entire exporter's licence — putting every farmer supplying them at risk of losing their best-paying market. French bean and snow pea growers are most exposed.",
    actionAdvice: [
      "Follow pre-harvest interval labels strictly — spraying too close to harvest is the top cause of rejections",
      "Switch to biological pest control (neem, sticky traps, parasitic wasps) where possible for export crops",
      "Enrol in KenyaGAP — Kenya's nationally recognized safe-use standard accepted by EU buyers",
      "Keep spray records per plot; buyers increasingly demand them before contracting",
    ],
    affectedCrops: ["French Beans", "Snow Peas", "Cut Flowers", "Chilli"],
    affectedMarkets: ["European Union", "UK"],
    source: "KEPHIS · EU Pesticides Database",
    publishedAt: "2026-02-20",
  },
  {
    id: "a6",
    title: "Shilling volatility reshapes export earnings",
    category: "currency",
    severity: "medium",
    summary:
      "The Kenya shilling has seen significant swings against the US dollar over the past 18 months. Since most export contracts are priced in USD, currency movements can add or erase several percentage points of income between signing and payment.",
    farmerImpact:
      "You are paid weeks or months after delivery. If the shilling strengthens 5% in that window, your KES income drops 5% even if the crop price never moved. Input costs (fertilizer, fuel) also swing with the exchange rate.",
    actionAdvice: [
      "Ask buyers for shorter payment terms (14–21 days) instead of 60–90 days to cut currency exposure",
      "Some exporters now offer USD-linked farm-gate prices — compare the KES equivalent on payment day before signing",
      "Time major input purchases and consider paying school fees/expenses from harvest windfalls rather than holding cash",
      "Watch CBK's weekly forex updates — your cooperative treasurer can track and advise members",
    ],
    affectedCrops: ["All crops"],
    affectedMarkets: ["Global"],
    source: "Central Bank of Kenya",
    publishedAt: "2026-06-05",
  },
  {
    id: "a7",
    title: "AGOA access under review as US trade talks continue",
    category: "market",
    severity: "low",
    summary:
      "The African Growth and Opportunity Act (AGOA), which gives Kenyan goods duty-free access to the US market, is in a renewal review cycle amid broader US trade-policy shifts. Agricultural exports under AGOA face uncertainty in program extensions.",
    farmerImpact:
      "The USA is Kenya's 2nd-largest export market ($791M). If duty-free access is reduced, US buyers may demand lower prices or shift to other suppliers. Macadamia and specialty coffee growers are most exposed in the medium term.",
    actionAdvice: [
      "Diversify: don't build your whole sales plan on one country — the EU and China offer growing demand",
      "Ask your exporter how much of their US business depends on AGOA preference margins",
      "Watch formal announcements from the Kenya Association of Manufacturers and Ministry of Trade — not social media rumours",
      "Focus on quality (specialty grades) that win markets on merit, not just on tariff preference",
    ],
    affectedCrops: ["Macadamia", "Coffee", "Cut Flowers", "Processed foods"],
    affectedMarkets: ["United States"],
    source: "Office of the US Trade Representative",
    publishedAt: "2026-04-18",
  },
];

// ─────────────────────────────────────────────────────────────
// Destination markets (2024 values, OEC/WITS data)
// ─────────────────────────────────────────────────────────────
export const DESTINATION_MARKETS: DestinationMarket[] = [
  {
    id: "uganda",
    name: "Uganda",
    flag: "🇺🇬",
    value: "$951M",
    share: 100,
    keyImports: ["Manufactured goods", "Fuel re-exports", "Foodstuffs", "Beverages"],
    requirements: [
      "EAC common market — minimal tariffs within East Africa",
      "Standard EAC sanitary certificates via KEPHIS",
      "Competitive road transport (Eldoret–Kampala corridor)",
    ],
    riskLevel: "low",
    riskNote: "Stable regional trade under the EAC Customs Union; occasional non-tariff border delays.",
  },
  {
    id: "usa",
    name: "United States",
    flag: "🇺🇸",
    value: "$791M",
    share: 83,
    keyImports: ["Apparel (EPZ)", "Coffee", "Macadamia", "Tea", "Cut Flowers"],
    requirements: [
      "AGOA duty-free access (under review — verify status)",
      "FDA food facility registration for processed goods",
      " fumigation & phytosanitary certificates (KEPHIS)",
    ],
    riskLevel: "medium",
    riskNote: "AGOA renewal uncertainty; strict residue testing at ports.",
  },
  {
    id: "uae",
    name: "United Arab Emirates",
    flag: "🇦🇪",
    value: "$754M",
    share: 79,
    keyImports: ["Tea", "Re-exports", "Fresh produce", "Coffee"],
    requirements: [
      "Dubai Municipality food safety registration",
      "Halal certification for processed foods",
      "Arabic labelling requirements",
    ],
    riskLevel: "low",
    riskNote: "Growing re-export hub — UAE buyers on-sell to the wider Gulf and Central Asia.",
  },
  {
    id: "netherlands",
    name: "Netherlands (EU)",
    flag: "🇳🇱",
    value: "$639M",
    share: 67,
    keyImports: ["Cut Flowers", "Avocado", "French Beans", "Coffee", "Macadamia"],
    requirements: [
      "GlobalG.A.P. certification for fresh produce",
      "EUDR plot-level GPS data (coffee/avocado)",
      "Strict EU MRL pesticide limits — KenyaGAP compliance",
      "TRACES phyto documentation",
    ],
    riskLevel: "medium",
    riskNote: "The gateway to all of Europe — strictest compliance regime but highest premiums.",
  },
  {
    id: "pakistan",
    name: "Pakistan",
    flag: "🇵🇰",
    value: "$589M",
    share: 62,
    keyImports: ["Tea", "Rice re-exports", "Leather"],
    requirements: [
      "PSQCA conformity for packaged goods",
      "Bulk tea shipments via Mombasa auction",
      "Letter-of-credit financing common",
    ],
    riskLevel: "medium",
    riskNote: "Pakistan's economy and rupee swings can slow tea payments; strong demand base.",
  },
  {
    id: "china",
    name: "China",
    flag: "🇨🇳",
    value: "$400M+",
    share: 42,
    keyImports: ["Avocado", "Macadamia", "Tea", "Coffee", "Cut Flowers", "Sesame"],
    requirements: [
      "GACC phytosanitary protocol registration (exporter-level)",
      "Duty-free access for 20+ commodities since May 2026",
      "Cold-treatment for avocado shipments",
      "Chinese labelling for retail packs",
    ],
    riskLevel: "low",
    riskNote: "Fast-growing demand; protocol registration is the main barrier — partner with registered exporters.",
  },
];

// Kenya export profile summary
export const KENYA_STATS = {
  totalExports: "$8.2B",
  agriShare: "65% of export earnings",
  smallholders: "Over 70% of Kenyan export crops are grown by smallholder farmers",
  employment: "4 in 10 Kenyans earn their living from agriculture",
  topExport: "Tea — Sh188.7B (2024)",
  flowersRank: "#1 flower supplier to the EU (~35% of roses)",
  avocadoRank: "#1 avocado exporter in Africa (~135,000 MT/yr)",
  markets: 5,
};

export const CATEGORY_LABELS: Record<AlertCategory, string> = {
  shipping: "Shipping & Logistics",
  inputs: "Farm Inputs",
  regulation: "Regulations & Compliance",
  market: "Market Access",
  currency: "Currency & Finance",
  opportunity: "🚀 New Opportunity",
};

export const SEVERITY_STYLES: Record<
  Severity,
  { label: string; badge: string; dot: string }
> = {
  high: {
    label: "High Impact",
    badge: "bg-red-100 text-red-800 border-red-200",
    dot: "bg-red-500",
  },
  medium: {
    label: "Medium Impact",
    badge: "bg-amber-100 text-amber-800 border-amber-200",
    dot: "bg-amber-500",
  },
  low: {
    label: "Low Impact",
    badge: "bg-slate-100 text-slate-700 border-slate-200",
    dot: "bg-slate-400",
  },
  opportunity: {
    label: "Opportunity",
    badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
    dot: "bg-emerald-500",
  },
};

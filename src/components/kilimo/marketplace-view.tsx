"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CROPS, COUNTIES } from "@/lib/data";
import {
  Plus,
  MapPin,
  Package,
  Tag,
  Verified,
  Handshake,
  Loader2,
  Store,
  Search,
} from "lucide-react";

interface Listing {
  id: string;
  farmerName: string;
  farmerContact: string;
  county: string;
  crop: string;
  variety: string | null;
  quantity: number;
  unit: string;
  price: number;
  currency: string;
  certifications: string | null;
  description: string | null;
  harvestWindow: string | null;
  createdAt: string;
}

interface BuyerRequest {
  id: string;
  buyerName: string;
  company: string;
  country: string;
  crop: string;
  quantity: string;
  targetPrice: string;
  incoterm: string;
  notes: string | null;
  createdAt: string;
}

const COUNTRIES = [
  "Kenya", "Netherlands", "China", "United Arab Emirates", "United Kingdom",
  "Germany", "Pakistan", "United States", "France", "Egypt", "Saudi Arabia",
  "India", "South Africa", "Uganda", "Tanzania", "Rwanda", "Other",
];

const INCOTERMS = ["EXW", "FOB", "CFR", "CIF", "DAP"];

export function MarketplaceView() {
  const [tab, setTab] = useState<"produce" | "requests">("produce");
  const [search, setSearch] = useState("");
  const [cropFilter, setCropFilter] = useState<string>("all");

  const queryClient = useQueryClient();

  const listingsQuery = useQuery({
    queryKey: ["listings"],
    queryFn: async () => {
      const res = await fetch("/api/listings");
      if (!res.ok) throw new Error("Failed to load listings");
      const data = await res.json();
      return data.listings as Listing[];
    },
  });

  const requestsQuery = useQuery({
    queryKey: ["buyer-requests"],
    queryFn: async () => {
      const res = await fetch("/api/buyer-requests");
      if (!res.ok) throw new Error("Failed to load buyer requests");
      const data = await res.json();
      return data.requests as BuyerRequest[];
    },
  });

  const filteredListings = (listingsQuery.data ?? []).filter((l) => {
    const q = search.toLowerCase();
    if (
      q &&
      !`${l.crop} ${l.farmerName} ${l.county} ${l.description ?? ""}`.toLowerCase().includes(q)
    )
      return false;
    if (cropFilter !== "all" && l.crop !== cropFilter) return false;
    return true;
  });

  const filteredRequests = (requestsQuery.data ?? []).filter((r) => {
    const q = search.toLowerCase();
    if (
      q &&
      !`${r.crop} ${r.buyerName} ${r.company} ${r.country} ${r.notes ?? ""}`.toLowerCase().includes(q)
    )
      return false;
    if (cropFilter !== "all" && r.crop !== cropFilter) return false;
    return true;
  });

  const uniqueCrops = Array.from(
    new Set([
      ...(listingsQuery.data ?? []).map((l) => l.crop),
      ...(requestsQuery.data ?? []).map((r) => r.crop),
    ])
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold sm:text-3xl">Marketplace</h1>
          <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground leading-relaxed">
            Farmers list produce. Buyers post what they need. No fees, no
            commissions, no broker cuts — contact each other directly and agree
            your own price.
          </p>
        </div>
        <div className="flex gap-2">
          <NewListingDialog onSuccess={() => queryClient.invalidateQueries({ queryKey: ["listings"] })} />
          <NewRequestDialog
            onSuccess={() => queryClient.invalidateQueries({ queryKey: ["buyer-requests"] })}
          />
        </div>
      </div>

      {/* Search + filter */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search crop, county, buyer, company…"
            className="pl-8"
            aria-label="Search marketplace"
          />
        </div>
        <Select value={cropFilter} onValueChange={setCropFilter}>
          <SelectTrigger className="w-full sm:w-[200px]" aria-label="Filter by crop">
            <SelectValue placeholder="All crops" />
          </SelectTrigger>
          <SelectContent className="max-h-72">
            <SelectItem value="all">All crops</SelectItem>
            {uniqueCrops.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as "produce" | "requests")}>
        <TabsList className="mb-4">
          <TabsTrigger value="produce" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Store className="mr-1.5 h-4 w-4" aria-hidden="true" />
            Farmers&apos; produce ({listingsQuery.data?.length ?? 0})
          </TabsTrigger>
          <TabsTrigger value="requests" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Handshake className="mr-1.5 h-4 w-4" aria-hidden="true" />
            Buyers looking for ({requestsQuery.data?.length ?? 0})
          </TabsTrigger>
        </TabsList>

        {/* Listings grid */}
        {tab === "produce" && (
          <>
            {listingsQuery.isLoading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-56 rounded-xl" />
                ))}
              </div>
            ) : filteredListings.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-sm text-muted-foreground">
                  No produce listings match your search. Try clearing filters — or be the first to{" "}
                  <NewListingDialog
                    trigger={<span className="cursor-pointer font-medium text-primary underline">list your produce</span>}
                    onSuccess={() => queryClient.invalidateQueries({ queryKey: ["listings"] })}
                  />
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredListings.map((l) => (
                  <ListingCard key={l.id} listing={l} />
                ))}
              </div>
            )}
          </>
        )}

        {/* Buyer requests */}
        {tab === "requests" && (
          <>
            {requestsQuery.isLoading ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-48 rounded-xl" />
                ))}
              </div>
            ) : filteredRequests.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-sm text-muted-foreground">
                  No buyer requests match your search. Buyers —{" "}
                  <NewRequestDialog
                    trigger={<span className="cursor-pointer font-medium text-primary underline">post what you need</span>}
                    onSuccess={() => queryClient.invalidateQueries({ queryKey: ["buyer-requests"] })}
                  />
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {filteredRequests.map((r) => (
                  <RequestCard key={r.id} request={r} />
                ))}
              </div>
            )}
          </>
        )}
      </Tabs>
    </div>
  );
}

function ListingCard({ listing: l }: { listing: Listing }) {
  return (
    <Card className="flex flex-col transition-shadow hover:shadow-md">
      <CardContent className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold">{l.crop}</h3>
            {l.variety && (
              <p className="text-xs text-muted-foreground">{l.variety}</p>
            )}
          </div>
          <Badge variant="secondary" className="shrink-0">
            <Tag className="mr-1 h-3 w-3" aria-hidden="true" />
            KSh {l.price.toLocaleString()}/{l.unit.includes("stem") ? "stem" : "kg"}
          </Badge>
        </div>

        <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
          <Package className="h-3.5 w-3.5" aria-hidden="true" />
          {l.quantity.toLocaleString()} {l.unit} available
          {l.harvestWindow ? ` · Harvest: ${l.harvestWindow}` : ""}
        </p>
        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
          {l.county} · {l.farmerName}
        </p>

        {l.description && (
          <p className="mt-2 line-clamp-3 text-sm text-muted-foreground leading-relaxed">
            {l.description}
          </p>
        )}

        <div className="mt-auto pt-3">
          {l.certifications && (
            <p className="mb-2 flex items-start gap-1 text-[11px] text-muted-foreground">
              <Verified className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
              {l.certifications}
            </p>
          )}
          <p className="rounded-md bg-muted px-2.5 py-2 text-xs text-muted-foreground">
            📞 Contact: {l.farmerContact}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function RequestCard({ request: r }: { request: BuyerRequest }) {
  return (
    <Card className="flex flex-col transition-shadow hover:shadow-md">
      <CardContent className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold">
              Looking for: <span className="text-primary">{r.crop}</span>
            </h3>
            <p className="text-xs text-muted-foreground">
              {r.company} · {r.buyerName}
            </p>
          </div>
          <span className="text-lg" aria-hidden="true">
            {countryFlag(r.country)}
          </span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-md bg-muted px-2.5 py-1.5">
            <p className="text-muted-foreground">Quantity</p>
            <p className="mt-0.5 font-medium">{r.quantity}</p>
          </div>
          <div className="rounded-md bg-muted px-2.5 py-1.5">
            <p className="text-muted-foreground">Target price</p>
            <p className="mt-0.5 font-medium">{r.targetPrice}</p>
          </div>
        </div>

        {r.notes && (
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {r.notes}
          </p>
        )}

        <div className="mt-auto pt-3 flex items-center justify-between">
          <Badge variant="outline">{r.incoterm}</Badge>
          <p className="text-[11px] text-muted-foreground">
            Posted {new Date(r.createdAt).toLocaleDateString("en-KE", {
              day: "numeric",
              month: "short",
            })}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function countryFlag(country: string): string {
  const flags: Record<string, string> = {
    Kenya: "🇰🇪", Netherlands: "🇳🇱", China: "🇨🇳",
    "United Arab Emirates": "🇦🇪", "United Kingdom": "🇬🇧",
    Germany: "🇩🇪", Pakistan: "🇵🇰", "United States": "🇺🇸",
    France: "🇫🇷", Egypt: "🇪🇬", "Saudi Arabia": "🇸🇦",
    India: "🇮🇳", "South Africa": "🇿🇦", Uganda: "🇺🇬",
    Tanzania: "🇹🇿", Rwanda: "🇷🇼",
  };
  return flags[country] ?? "🌍";
}

// ─────────────────────────────────────────────
// New Listing Dialog (farmers)
// ─────────────────────────────────────────────
function NewListingDialog({
  onSuccess,
  trigger,
}: {
  onSuccess: () => void;
  trigger?: React.ReactNode;
}) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    farmerName: "",
    farmerContact: "",
    county: "",
    crop: "",
    variety: "",
    quantity: "",
    unit: "kg",
    price: "",
    certifications: "",
    harvestWindow: "",
    description: "",
  });

  const set = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.farmerName || !form.farmerContact || !form.county || !form.crop || !form.quantity || !form.price) {
      toast({
        title: "Missing details",
        description: "Please fill your name, contact, county, crop, quantity and price.",
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          quantity: Number(form.quantity),
          price: Number(form.price),
        }),
      });
      if (!res.ok) throw new Error();
      toast({
        title: "Listing published! 🌱",
        description: "Your produce is now visible to buyers on Kilimo Radar.",
      });
      setOpen(false);
      setForm({
        farmerName: "", farmerContact: "", county: "", crop: "", variety: "",
        quantity: "", unit: "kg", price: "", certifications: "", harvestWindow: "",
        description: "",
      });
      onSuccess();
    } catch {
      toast({
        title: "Could not publish",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button>
            <Plus className="h-4 w-4 mr-1" aria-hidden="true" />
            List produce
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto custom-scroll sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>List your produce — Free</DialogTitle>
          <DialogDescription>
            Your listing is shown to buyers around the world at no cost.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Your name *">
              <Input value={form.farmerName} onChange={(e) => set("farmerName", e.target.value)} placeholder="e.g. Wanjiku Kariuki" />
            </FormField>
            <FormField label="Phone / email *">
              <Input value={form.farmerContact} onChange={(e) => set("farmerContact", e.target.value)} placeholder="0722 000 000" />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="County *">
              <Select value={form.county} onValueChange={(v) => set("county", v)}>
                <SelectTrigger><SelectValue placeholder="Select county" /></SelectTrigger>
                <SelectContent className="max-h-72">
                  {COUNTIES.map((c) => (
                    <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Crop *">
              <Select value={form.crop} onValueChange={(v) => set("crop", v)}>
                <SelectTrigger><SelectValue placeholder="Select crop" /></SelectTrigger>
                <SelectContent className="max-h-72">
                  {CROPS.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <FormField label="Quantity *">
              <Input type="number" min="1" value={form.quantity} onChange={(e) => set("quantity", e.target.value)} placeholder="2000" />
            </FormField>
            <FormField label="Unit">
              <Select value={form.unit} onValueChange={(v) => set("unit", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="tonnes">tonnes</SelectItem>
                  <SelectItem value="stems">stems</SelectItem>
                  <SelectItem value="crates">crates</SelectItem>
                  <SelectItem value="bags">bags</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Price (KES) *">
              <Input type="number" min="1" value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="52" />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Variety">
              <Input value={form.variety} onChange={(e) => set("variety", e.target.value)} placeholder="e.g. Hass, SL28" />
            </FormField>
            <FormField label="Harvest window">
              <Input value={form.harvestWindow} onChange={(e) => set("harvestWindow", e.target.value)} placeholder="e.g. Jun–Aug" />
            </FormField>
          </div>
          <FormField label="Certifications (if any)">
            <Input value={form.certifications} onChange={(e) => set("certifications", e.target.value)} placeholder="e.g. GlobalG.A.P., KenyaGAP, Fairtrade" />
          </FormField>
          <FormField label="Description">
            <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Quality, farm details, what kind of buyer you're looking for…" rows={3} />
          </FormField>
          <DialogFooter>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
              Publish listing
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────
// New Request Dialog (buyers)
// ─────────────────────────────────────────────
function NewRequestDialog({
  onSuccess,
  trigger,
}: {
  onSuccess: () => void;
  trigger?: React.ReactNode;
}) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    buyerName: "",
    company: "",
    country: "",
    crop: "",
    quantity: "",
    targetPrice: "",
    incoterm: "FOB",
    notes: "",
  });

  const set = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.buyerName || !form.company || !form.country || !form.crop || !form.quantity || !form.targetPrice) {
      toast({
        title: "Missing details",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/buyer-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast({
        title: "Request posted! 🤝",
        description: "Kenyan farmers can now see what you're looking for.",
      });
      setOpen(false);
      setForm({ buyerName: "", company: "", country: "", crop: "", quantity: "", targetPrice: "", incoterm: "FOB", notes: "" });
      onSuccess();
    } catch {
      toast({
        title: "Could not post request",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-1" aria-hidden="true" />
            Post request
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto custom-scroll sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Post a buying request — Free</DialogTitle>
          <DialogDescription>
            Tell Kenyan farmers what you want to source. No fees or commissions.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Contact person *">
              <Input value={form.buyerName} onChange={(e) => set("buyerName", e.target.value)} placeholder="e.g. Sanne Verhoeven" />
            </FormField>
            <FormField label="Company *">
              <Input value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="e.g. Tulip Fresh B.V." />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Country *">
              <Select value={form.country} onValueChange={(v) => set("country", v)}>
                <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
                <SelectContent className="max-h-72">
                  {COUNTRIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Crop wanted *">
              <Select value={form.crop} onValueChange={(v) => set("crop", v)}>
                <SelectTrigger><SelectValue placeholder="Select crop" /></SelectTrigger>
                <SelectContent className="max-h-72">
                  {CROPS.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Quantity needed *">
              <Input value={form.quantity} onChange={(e) => set("quantity", e.target.value)} placeholder="e.g. 1 x 40ft reefer / week" />
            </FormField>
            <FormField label="Target price *">
              <Input value={form.targetPrice} onChange={(e) => set("targetPrice", e.target.value)} placeholder="e.g. EUR 8.50/kg CFR" />
            </FormField>
          </div>
          <FormField label="Delivery terms">
            <Select value={form.incoterm} onValueChange={(v) => set("incoterm", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {INCOTERMS.map((i) => (
                  <SelectItem key={i} value={i}>{i}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Notes for farmers">
            <Textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Certifications required, payment terms, support offered…" rows={3} />
          </FormField>
          <DialogFooter>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
              Post request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}

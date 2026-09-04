"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CROPS, COUNTIES, COUNTRIES } from "@/lib/data";
import {
  Sprout,
  Handshake,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Users,
  Globe2,
} from "lucide-react";

export function JoinView() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-extrabold sm:text-3xl">Join Kilimo Radar — it&apos;s free</h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground leading-relaxed">
          Free for farmers. Free for buyers. No commissions on your trades, ever.
          We built this so Kenyan farmers keep more of what the world pays for
          their harvest.
        </p>
      </div>

      {/* Free-forever promise */}
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {[
          { icon: ShieldCheck, text: "No fees. No commissions. No hidden costs." },
          { icon: Users, text: "Your contact goes only on listings you post." },
          { icon: Globe2, text: "Get alerts matched to your crops and markets." },
        ].map((f, i) => (
          <div key={i} className="flex items-center gap-2.5 rounded-lg border border-primary/25 bg-secondary/50 p-3">
            <f.icon className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <p className="text-xs font-medium leading-snug">{f.text}</p>
          </div>
        ))}
      </div>

      <Tabs defaultValue="farmer" className="space-y-4">
        <TabsList className="mx-auto">
          <TabsTrigger value="farmer" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Sprout className="mr-1.5 h-4 w-4" aria-hidden="true" />
            I&apos;m a farmer
          </TabsTrigger>
          <TabsTrigger value="buyer" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Handshake className="mr-1.5 h-4 w-4" aria-hidden="true" />
            I&apos;m a buyer
          </TabsTrigger>
        </TabsList>

        <TabsContent value="farmer">
          <Card>
            <CardHeader>
              <CardTitle>Farmer registration</CardTitle>
              <CardDescription>
                Register free to list produce, receive alerts for your crops,
                and see what buyers are paying.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <JoinForm role="farmer" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="buyer">
          <Card>
            <CardHeader>
              <CardTitle>Buyer registration</CardTitle>
              <CardDescription>
                Register free to post buying requests and contact Kenyan
                farmers directly — no broker margin.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <JoinForm role="buyer" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function JoinForm({ role }: { role: "farmer" | "buyer" }) {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const [farmer, setFarmer] = useState({
    name: "", email: "", phone: "", county: "", farmSizeAcres: "", crops: "", exportReady: false,
  });
  const [buyer, setBuyer] = useState({
    name: "", email: "", company: "", country: "", crops: "", website: "",
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (role === "farmer") {
      if (!farmer.name || !farmer.email || !farmer.county || !farmer.crops) {
        toast({
          title: "Missing details",
          description: "Please fill your name, email, county and crops.",
          variant: "destructive",
        });
        return;
      }
      setSubmitting(true);
      try {
        const res = await fetch("/api/join", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role, ...farmer }),
        });
        if (!res.ok) throw new Error();
        setDone(true);
        toast({
          title: "Karibu, farmer! 🌱",
          description: "Your registration is complete — free forever.",
        });
      } catch {
        toast({
          title: "Registration failed",
          description: "Please try again in a moment.",
          variant: "destructive",
        });
      } finally {
        setSubmitting(false);
      }
    } else {
      if (!buyer.name || !buyer.email || !buyer.company || !buyer.country || !buyer.crops) {
        toast({
          title: "Missing details",
          description: "Please fill your name, email, company, country and crops of interest.",
          variant: "destructive",
        });
        return;
      }
      setSubmitting(true);
      try {
        const res = await fetch("/api/join", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role, ...buyer }),
        });
        if (!res.ok) throw new Error();
        setDone(true);
        toast({
          title: "Welcome aboard! 🤝",
          description: "Your buyer registration is complete — free forever.",
        });
      } catch {
        toast({
          title: "Registration failed",
          description: "Please try again in a moment.",
          variant: "destructive",
        });
      } finally {
        setSubmitting(false);
      }
    }
  };

  if (done) {
    return (
      <div className="flex flex-col items-center py-8 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
          <CheckCircle2 className="h-8 w-8 text-primary" aria-hidden="true" />
        </span>
        <h3 className="mt-4 text-lg font-bold">
          {role === "farmer" ? "Karibu Kilimo Radar!" : "Welcome to Kilimo Radar!"}
        </h3>
        <p className="mt-2 max-w-md text-sm text-muted-foreground leading-relaxed">
          {role === "farmer"
            ? "You're registered. Head to the Marketplace to list your produce, and check the Geo Radar for alerts affecting your crops."
            : "You're registered. Head to the Marketplace to post what you're sourcing — Kenyan farmers are waiting to hear from you."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {role === "farmer" ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="f-name">Full name *</Label>
              <Input id="f-name" value={farmer.name} onChange={(e) => setFarmer({ ...farmer, name: e.target.value })} placeholder="e.g. Wanjiku Kariuki" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="f-email">Email *</Label>
              <Input id="f-email" type="email" value={farmer.email} onChange={(e) => setFarmer({ ...farmer, email: e.target.value })} placeholder="you@example.co.ke" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="f-phone">Phone (M-Pesa number)</Label>
              <Input id="f-phone" value={farmer.phone} onChange={(e) => setFarmer({ ...farmer, phone: e.target.value })} placeholder="0722 000 000" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="f-county">County *</Label>
              <Select value={farmer.county} onValueChange={(v) => setFarmer({ ...farmer, county: v })}>
                <SelectTrigger id="f-county"><SelectValue placeholder="Select county" /></SelectTrigger>
                <SelectContent className="max-h-72">
                  {COUNTIES.map((c) => (
                    <SelectItem key={c.name} value={c.name}>
                      {c.name} — {c.mainCrops.slice(0, 2).join(", ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="f-size">Farm size (acres)</Label>
              <Input id="f-size" type="number" min="0" step="0.5" value={farmer.farmSizeAcres} onChange={(e) => setFarmer({ ...farmer, farmSizeAcres: e.target.value })} placeholder="e.g. 2.5" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="f-crops">What do you grow? * (comma-separated)</Label>
            <Textarea id="f-crops" value={farmer.crops} onChange={(e) => setFarmer({ ...farmer, crops: e.target.value })} placeholder="e.g. Avocado, Coffee, Macadamia" rows={2} />
            <p className="text-[11px] text-muted-foreground">
              Popular export crops: {CROPS.slice(0, 8).join(", ")}…
            </p>
          </div>
          <div className="flex items-start space-x-2 rounded-lg border border-border p-3">
            <Checkbox
              id="f-export"
              checked={farmer.exportReady}
              onCheckedChange={(v) => setFarmer({ ...farmer, exportReady: v === true })}
            />
            <div className="leading-none">
              <label htmlFor="f-export" className="text-sm font-medium cursor-pointer">
                I already sell (or want to sell) to export markets
              </label>
              <p className="mt-1 text-xs text-muted-foreground">
                We&apos;ll prioritize export-related alerts and buyer matches for you.
              </p>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="b-name">Contact person *</Label>
              <Input id="b-name" value={buyer.name} onChange={(e) => setBuyer({ ...buyer, name: e.target.value })} placeholder="e.g. Sanne Verhoeven" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="b-company">Company *</Label>
              <Input id="b-company" value={buyer.company} onChange={(e) => setBuyer({ ...buyer, company: e.target.value })} placeholder="e.g. Tulip Fresh Produce B.V." />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="b-email">Email *</Label>
              <Input id="b-email" type="email" value={buyer.email} onChange={(e) => setBuyer({ ...buyer, email: e.target.value })} placeholder="sourcing@company.com" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="b-country">Country *</Label>
              <Select value={buyer.country} onValueChange={(v) => setBuyer({ ...buyer, country: v })}>
                <SelectTrigger id="b-country"><SelectValue placeholder="Select country" /></SelectTrigger>
                <SelectContent className="max-h-72">
                  {COUNTRIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="b-crops">Crops you want to source * (comma-separated)</Label>
            <Textarea id="b-crops" value={buyer.crops} onChange={(e) => setBuyer({ ...buyer, crops: e.target.value })} placeholder="e.g. Avocado, Macadamia, French Beans" rows={2} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="b-website">Company website</Label>
            <Input id="b-website" value={buyer.website} onChange={(e) => setBuyer({ ...buyer, website: e.target.value })} placeholder="https://company.com" />
          </div>
        </>
      )}
      <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto">
        {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
        {role === "farmer" ? "Register as farmer — Free" : "Register as buyer — Free"}
      </Button>
    </form>
  );
}

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../components/dialog";
import { Button } from "../components/button";
import { Input } from "../components/input";
import { Label } from "../components/label";
import { Sparkles } from "lucide-react";

const STORAGE_KEY = "platinum_helms_lead_submitted";

export function LeadCaptureDialog() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;
    const timer = setTimeout(() => setOpen(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(STORAGE_KEY, "true");
    setOpen(false);
    toast.success("Thanks! Continuing your enquiry on WhatsApp…");
    const message = `Hi! I'm ${formData.name}. I'm interested in luxury vehicles at Platinum Helms.`;
    window.open(`https://wa.me/2348123456789?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? setOpen(true) : dismiss())}>
      <DialogContent className="w-[92vw] max-w-md overflow-hidden rounded-2xl border-border p-0">
        {/* Header with brand accent */}
        <div className="relative bg-gradient-to-br from-obsidian to-slate-deep p-8 text-white">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand">
            <Sparkles size={13} /> Exclusive Access
          </span>
          <DialogHeader>
            <DialogTitle className="font-display text-3xl font-bold text-white">
              Welcome to Platinum Helms
            </DialogTitle>
            <DialogDescription className="mt-1 text-white/70">
              Discover exclusive offers and personalised recommendations for your luxury vehicle journey.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 p-8">
          <div className="space-y-2">
            <Label htmlFor="lead-name">Full Name *</Label>
            <Input id="lead-name" placeholder="John Doe" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lead-email">Email Address *</Label>
            <Input id="lead-email" type="email" placeholder="john@example.com" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lead-phone">Phone Number</Label>
            <Input id="lead-phone" type="tel" placeholder="+234 812 345 6789" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
          </div>
          <div className="flex gap-3 pt-1">
            <Button type="submit" size="lg" className="flex-1 bg-brand hover:bg-brand-strong">Get Started</Button>
            <Button type="button" size="lg" variant="outline" className="flex-1" onClick={dismiss}>Skip for Now</Button>
          </div>
          <p className="text-center text-xs text-muted-foreground">
            We respect your privacy. Your information is secure and never shared with third parties.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}

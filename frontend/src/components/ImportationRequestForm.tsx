import { useState } from "react";
import { toast } from "sonner";
import api from "@/lib/api";
import { Button } from "../components/button";
import { Input } from "../components/input";
import { Label } from "../components/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/select";
import { Textarea } from "../components/textarea";
import { RadioGroup, RadioGroupItem } from "../components/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../components/dialog";
import { CheckCircle2, Loader2, AlertTriangle, Globe } from "lucide-react";

interface ImportationRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ImportationRequestForm({ isOpen, onClose }: ImportationRequestFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    desiredCar: "",
    preferredCountry: "",
    budgetRange: "",
    deliveryTimeline: "",
    importationType: "",
    additionalDetails: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await api.leads.submitImportation({
        ...formData,
        source: "Importation Page",
      });
      setIsSubmitted(true);
      toast.success("Importation request submitted!");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to submit request";
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      desiredCar: "",
      preferredCountry: "",
      budgetRange: "",
      deliveryTimeline: "",
      importationType: "",
      additionalDetails: "",
    });
    setIsSubmitted(false);
    onClose();
  };

  const openWhatsApp = () => {
    const message = `Hi, I just submitted an importation request for ${formData.desiredCar} from ${formData.preferredCountry}. My name is ${formData.fullName}.`;
    window.open(`https://wa.me/2348123456789?text=${encodeURIComponent(message)}`, "_blank");
    handleReset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(v) => !v && handleReset()}>
      <DialogContent className="w-[96vw] max-w-2xl overflow-hidden rounded-2xl border-border p-0">
        {!isSubmitted ? (
          <>
            <div className="bg-gradient-to-br from-obsidian to-slate-deep px-8 py-6 text-white">
              <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand">
                <Globe size={12} /> Importation
              </span>
              <DialogHeader>
                <DialogTitle className="font-display text-2xl font-bold text-white">
                  Car Importation Request
                </DialogTitle>
                <DialogDescription className="mt-1 text-sm text-white/70">
                  Submit your request and our specialist will reach out with quotes and delivery details.
                </DialogDescription>
              </DialogHeader>
            </div>

            <div className="max-h-[62vh] overflow-y-auto px-8 py-6">
              <form id="ir-form" onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="flex items-start gap-3 rounded-xl border border-brand/40 bg-brand/5 px-4 py-3 text-sm text-brand">
                    <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <h3 className="font-display text-lg font-semibold text-foreground">Personal Information</h3>
                  <div className="space-y-2">
                    <Label htmlFor="ir-fullName">Full Name *</Label>
                    <Input
                      id="ir-fullName"
                      placeholder="Adewale Johnson"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="ir-email">Email Address *</Label>
                      <Input
                        id="ir-email"
                        type="email"
                        placeholder="adewale@email.com"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ir-phone">Phone (WhatsApp preferred) *</Label>
                      <Input
                        id="ir-phone"
                        type="tel"
                        placeholder="+234 809 555 0000"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-display text-lg font-semibold text-foreground">Vehicle & Importation Details</h3>
                  <div className="space-y-2">
                    <Label htmlFor="ir-car">Desired Car Brand & Model *</Label>
                    <Input
                      id="ir-car"
                      placeholder="e.g., Toyota Highlander 2019"
                      required
                      value={formData.desiredCar}
                      onChange={(e) => setFormData({ ...formData, desiredCar: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="ir-country">Country of Import *</Label>
                      <Select
                        value={formData.preferredCountry}
                        onValueChange={(value) => setFormData({ ...formData, preferredCountry: value })}
                        required
                      >
                        <SelectTrigger id="ir-country">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USA">USA</SelectItem>
                          <SelectItem value="Canada">Canada</SelectItem>
                          <SelectItem value="UAE">UAE</SelectItem>
                          <SelectItem value="Germany">Germany</SelectItem>
                          <SelectItem value="UK">United Kingdom</SelectItem>
                          <SelectItem value="Japan">Japan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ir-budget">Budget Range (₦) *</Label>
                      <Select
                        value={formData.budgetRange}
                        onValueChange={(value) => setFormData({ ...formData, budgetRange: value })}
                        required
                      >
                        <SelectTrigger id="ir-budget">
                          <SelectValue placeholder="Select budget" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5M-7M">₦5M – ₦7M</SelectItem>
                          <SelectItem value="7M-10M">₦7M – ₦10M</SelectItem>
                          <SelectItem value="10M-15M">₦10M – ₦15M</SelectItem>
                          <SelectItem value="15M-20M">₦15M – ₦20M</SelectItem>
                          <SelectItem value="20M+">₦20M+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ir-timeline">Delivery Timeline *</Label>
                      <Select
                        value={formData.deliveryTimeline}
                        onValueChange={(value) => setFormData({ ...formData, deliveryTimeline: value })}
                        required
                      >
                        <SelectTrigger id="ir-timeline">
                          <SelectValue placeholder="Select timeline" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="4-6">4–6 weeks</SelectItem>
                          <SelectItem value="6-8">6–8 weeks</SelectItem>
                          <SelectItem value="8-12">8–12 weeks</SelectItem>
                          <SelectItem value="flexible">Flexible</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Importation Type *</Label>
                    <RadioGroup
                      value={formData.importationType}
                      onValueChange={(value) => setFormData({ ...formData, importationType: value })}
                      required
                    >
                      <div className="flex items-start space-x-3 rounded-xl border border-border p-4 transition-colors hover:bg-muted/40">
                        <RadioGroupItem value="self-import" id="ir-self" className="mt-0.5" />
                        <div>
                          <Label htmlFor="ir-self" className="cursor-pointer font-medium">
                            Self-Import
                          </Label>
                          <p className="text-xs text-muted-foreground">I have a specific vehicle to import</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 rounded-xl border border-border p-4 transition-colors hover:bg-muted/40">
                        <RadioGroupItem value="assisted-import" id="ir-assisted" className="mt-0.5" />
                        <div>
                          <Label htmlFor="ir-assisted" className="cursor-pointer font-medium">
                            Assisted Import
                          </Label>
                          <p className="text-xs text-muted-foreground">Help me find and import the right vehicle</p>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ir-details">Additional Details</Label>
                  <Textarea
                    id="ir-details"
                    placeholder="Preferred colour, mileage, features, etc…"
                    rows={3}
                    value={formData.additionalDetails}
                    onChange={(e) => setFormData({ ...formData, additionalDetails: e.target.value })}
                  />
                </div>
              </form>
            </div>

            <div className="border-t border-border px-8 py-4">
              <Button
                form="ir-form"
                type="submit"
                size="lg"
                className="w-full bg-brand hover:bg-brand-strong"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Submitting…
                  </>
                ) : (
                  "Submit Request"
                )}
              </Button>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                We respect your privacy. Your information is secure and never shared with third parties.
              </p>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center px-8 py-12 text-center">
            <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-brand/10">
              <CheckCircle2 size={32} className="text-brand" />
            </div>
            <h3 className="font-display text-2xl font-bold text-foreground">
              Request Submitted!
            </h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Thank you, <span className="font-medium text-foreground">{formData.fullName}</span>. Our
              importation specialist will reach out with quotes and delivery details shortly.
            </p>

            <div className="mt-6 w-full rounded-xl border border-border bg-muted/40 p-4 text-left">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Summary
              </p>
              {[
                ["Vehicle", formData.desiredCar],
                ["Import From", formData.preferredCountry],
                ["Budget Range", formData.budgetRange],
                ["Timeline", formData.deliveryTimeline ? `${formData.deliveryTimeline} weeks` : "—"],
                ["Import Type", formData.importationType.replace("-", " ")],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex justify-between border-b border-border py-2 text-sm last:border-0 capitalize"
                >
                  <span className="text-muted-foreground normal-case">{k}</span>
                  <span className="font-medium text-foreground">{v}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex w-full flex-col gap-3">
              <Button
                size="lg"
                className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white"
                onClick={openWhatsApp}
              >
                Continue on WhatsApp
              </Button>
              <Button size="lg" variant="outline" className="w-full" onClick={handleReset}>
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

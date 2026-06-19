import { useState } from "react";
import { toast } from "sonner";
import api from "@/lib/api";
import { Button } from "../components/button";
import { Input } from "../components/input";
import { Label } from "../components/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/select";
import { Textarea } from "../components/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../components/dialog";
import { CheckCircle2, Loader2, AlertTriangle, Sparkles } from "lucide-react";

interface FinancingEligibilityFormProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCar?: string;
}

export function FinancingEligibilityForm({ isOpen, onClose, selectedCar }: FinancingEligibilityFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    selectedCar: selectedCar || "",
    employmentStatus: "",
    monthlyIncome: "",
    repaymentDuration: "",
    initialDeposit: "",
    additionalNotes: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const [firstName, ...lastNameParts] = formData.fullName.trim().split(" ");
    setIsSubmitting(true);
    setError("");

    try {
      await api.leads.submitFinancing({
        firstName: firstName || formData.fullName,
        lastName: lastNameParts.join(" ") || "N/A",
        email: formData.email,
        phone: formData.phone,
        employmentStatus: formData.employmentStatus,
        monthlyIncome: formData.monthlyIncome,
        preferredRepaymentDuration: `${formData.repaymentDuration} months`,
        initialDepositBudget: formData.initialDeposit || null,
        additionalNotes: [
          formData.selectedCar ? `Selected car: ${formData.selectedCar}` : "",
          formData.additionalNotes,
        ]
          .filter(Boolean)
          .join("\n"),
        authorizeCredit: true,
        agreeToTerms: true,
        source: "Financing Page",
      });
      setIsSubmitted(true);
      toast.success("Eligibility request submitted!");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to submit financing request";
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
      selectedCar: selectedCar || "",
      employmentStatus: "",
      monthlyIncome: "",
      repaymentDuration: "",
      initialDeposit: "",
      additionalNotes: "",
    });
    setIsSubmitted(false);
    onClose();
  };

  const openWhatsApp = () => {
    const message = `Hi, I just submitted a financing eligibility form for ${formData.selectedCar || "a vehicle"}. My name is ${formData.fullName}.`;
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
                <Sparkles size={12} /> Financing
              </span>
              <DialogHeader>
                <DialogTitle className="font-display text-2xl font-bold text-white">
                  Check Your Financing Eligibility
                </DialogTitle>
                <DialogDescription className="mt-1 text-sm text-white/70">
                  Our financing team will review your details and reach out with available plans.
                </DialogDescription>
              </DialogHeader>
            </div>

            <div className="max-h-[62vh] overflow-y-auto px-8 py-6">
              <form id="ef-form" onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="flex items-start gap-3 rounded-xl border border-brand/40 bg-brand/5 px-4 py-3 text-sm text-brand">
                    <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <h3 className="font-display text-lg font-semibold text-foreground">Personal Information</h3>
                  <div className="space-y-2">
                    <Label htmlFor="ef-fullName">Full Name *</Label>
                    <Input
                      id="ef-fullName"
                      placeholder="John Doe"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="ef-email">Email Address *</Label>
                      <Input
                        id="ef-email"
                        type="email"
                        placeholder="johndoe@email.com"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ef-phone">Phone (WhatsApp preferred) *</Label>
                      <Input
                        id="ef-phone"
                        type="tel"
                        placeholder="+234 812 345 6789"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-display text-lg font-semibold text-foreground">Vehicle & Financial Details</h3>
                  <div className="space-y-2">
                    <Label htmlFor="ef-car">Selected Car</Label>
                    <Input
                      id="ef-car"
                      placeholder="e.g., Toyota Corolla 2020"
                      value={formData.selectedCar}
                      onChange={(e) => setFormData({ ...formData, selectedCar: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="ef-employment">Employment Status *</Label>
                      <Select
                        value={formData.employmentStatus}
                        onValueChange={(value) => setFormData({ ...formData, employmentStatus: value })}
                        required
                      >
                        <SelectTrigger id="ef-employment">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full-time">Employed</SelectItem>
                          <SelectItem value="self-employed">Self-Employed</SelectItem>
                          <SelectItem value="business-owner">Business Owner</SelectItem>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ef-income">Monthly Income Range *</Label>
                      <Select
                        value={formData.monthlyIncome}
                        onValueChange={(value) => setFormData({ ...formData, monthlyIncome: value })}
                        required
                      >
                        <SelectTrigger id="ef-income">
                          <SelectValue placeholder="Select range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="100k-250k">₦100,000 – ₦250,000</SelectItem>
                          <SelectItem value="250k-500k">₦250,000 – ₦500,000</SelectItem>
                          <SelectItem value="500k-1m">₦500,000 – ₦1,000,000</SelectItem>
                          <SelectItem value="1m+">₦1,000,000+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ef-duration">Repayment Duration *</Label>
                      <Select
                        value={formData.repaymentDuration}
                        onValueChange={(value) => setFormData({ ...formData, repaymentDuration: value })}
                        required
                      >
                        <SelectTrigger id="ef-duration">
                          <SelectValue placeholder="Select term" />
                        </SelectTrigger>
                        <SelectContent>
                          {[6, 12, 18, 24, 36, 48].map((m) => (
                            <SelectItem key={m} value={String(m)}>
                              {m} months
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ef-deposit">Initial Deposit Budget (₦)</Label>
                      <Input
                        id="ef-deposit"
                        type="number"
                        placeholder="e.g., 1,500,000"
                        value={formData.initialDeposit}
                        onChange={(e) => setFormData({ ...formData, initialDeposit: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ef-notes">Additional Notes</Label>
                  <Textarea
                    id="ef-notes"
                    placeholder="Specific preferences or questions…"
                    rows={3}
                    value={formData.additionalNotes}
                    onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                  />
                </div>
              </form>
            </div>

            <div className="border-t border-border px-8 py-4">
              <Button
                form="ef-form"
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
                  "Check My Eligibility"
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
            <h3 className="font-display text-2xl font-bold text-foreground">Request Submitted!</h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Thank you, <span className="font-medium text-foreground">{formData.fullName}</span>. Our
              financing team will contact you shortly with available plans.
            </p>

            <div className="mt-6 w-full rounded-xl border border-border bg-muted/40 p-4 text-left">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Summary
              </p>
              {[
                ["Vehicle", formData.selectedCar || "Not specified"],
                ["Income Range", formData.monthlyIncome || "—"],
                [
                  "Repayment Term",
                  formData.repaymentDuration ? `${formData.repaymentDuration} months` : "—",
                ],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex justify-between border-b border-border py-2 text-sm last:border-0"
                >
                  <span className="text-muted-foreground">{k}</span>
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

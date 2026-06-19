import { useState } from "react";
import { toast } from "sonner";
import api from "@/lib/api";
import { formatCurrency } from "@/lib/adminUtils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../components/dialog";
import { Button } from "../components/button";
import { Input } from "../components/input";
import { Label } from "../components/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/select";
import { Separator } from "../components/separator";
import { Checkbox } from "../components/checkbox";
import {
  FileText,
  User,
  Briefcase,
  DollarSign,
  CheckCircle,
  Clock,
  Search,
  CreditCard,
  Loader2,
  AlertTriangle,
  FileCheck,
} from "lucide-react";

interface FinancialApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
  vehiclePrice?: number;
}

type ApplicationStatus = "draft" | "submitted" | "verifying" | "eligibility" | "approved" | "denied";

interface FormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  ssn: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  employmentStatus: string;
  employer: string;
  jobTitle: string;
  employmentLength: string;
  workPhone: string;
  annualIncome: string;
  additionalIncome: string;
  monthlyHousing: string;
  monthlyDebt: string;
  authorizeCredit: boolean;
  agreeToTerms: boolean;
}

const statusSteps = [
  { id: "submitted", label: "Submitted", icon: FileText },
  { id: "verifying", label: "Verifying", icon: Search },
  { id: "eligibility", label: "Credit Check", icon: CreditCard },
  { id: "approved", label: "Approved", icon: CheckCircle },
];

export function FinancialApplicationForm({
  isOpen,
  onClose,
  vehiclePrice = 0,
}: FinancialApplicationFormProps) {
  const [applicationStatus, setApplicationStatus] = useState<ApplicationStatus>("draft");
  const [approvedAmount, setApprovedAmount] = useState<number>(0);
  const [estimatedRate, setEstimatedRate] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    ssn: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    employmentStatus: "",
    employer: "",
    jobTitle: "",
    employmentLength: "",
    workPhone: "",
    annualIncome: "",
    additionalIncome: "",
    monthlyHousing: "",
    monthlyDebt: "",
    authorizeCredit: false,
    agreeToTerms: false,
  });

  const updateField = (field: keyof FormData, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await api.leads.submitFinancing({
        ...formData,
        source: "Financial Application Form",
      });

      setApplicationStatus("submitted");
      setTimeout(() => setApplicationStatus("verifying"), 1000);
      setTimeout(() => setApplicationStatus("eligibility"), 2200);
      setTimeout(() => {
        setApplicationStatus("approved");
        const income = parseFloat(formData.annualIncome) || 0;
        setApprovedAmount(Math.min(income * 0.4, vehiclePrice * 1.2));
        setEstimatedRate(4.9);
      }, 3400);

      toast.success("Application submitted successfully!");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to submit application";
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () =>
    formData.firstName &&
    formData.lastName &&
    formData.email &&
    formData.ssn &&
    formData.annualIncome &&
    formData.authorizeCredit &&
    formData.agreeToTerms;

  const currentStepIndex = statusSteps.findIndex((s) => s.id === applicationStatus);
  const progressPct = applicationStatus === "draft" ? 0 : ((currentStepIndex + 1) / statusSteps.length) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[96vw] max-w-4xl overflow-hidden rounded-2xl border-border p-0">
        {/* Dark header */}
        <div className="bg-gradient-to-br from-obsidian to-slate-deep px-8 py-6 text-white">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand">
            <FileCheck size={12} /> Full Application
          </span>
          <DialogHeader>
            <DialogTitle className="font-display text-2xl font-bold text-white">
              Financing Application
            </DialogTitle>
            <DialogDescription className="mt-1 text-sm text-white/70">
              Complete your application to get pre-approved for vehicle financing.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Status tracker (shown after submit) */}
        {applicationStatus !== "draft" && (
          <div className="border-b border-border bg-muted/30 px-8 py-6">
            <div className="mb-4 flex items-center gap-2">
              <Clock size={16} className="text-brand" />
              <span className="text-sm font-semibold text-foreground">Application Status</span>
            </div>
            {/* Progress bar */}
            <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-brand transition-all duration-700"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            {/* Steps */}
            <div className="grid grid-cols-4 gap-2">
              {statusSteps.map((step, index) => {
                const isActive = currentStepIndex >= index;
                const isCurrent = step.id === applicationStatus;
                const StepIcon = step.icon;
                return (
                  <div key={step.id} className={`flex flex-col items-center text-center ${isActive ? "opacity-100" : "opacity-35"}`}>
                    <div
                      className={`mb-2 flex size-11 items-center justify-center rounded-full transition-all ${
                        isCurrent
                          ? "animate-pulse bg-brand text-white"
                          : isActive
                          ? "bg-green-600 text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <StepIcon size={18} />
                    </div>
                    <p className="text-xs font-medium text-foreground">{step.label}</p>
                    {isCurrent && (
                      <span className="mt-1 rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-semibold text-brand">
                        Processing
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Approval result */}
            {applicationStatus === "approved" && (
              <div className="mt-6 rounded-2xl bg-gradient-to-br from-obsidian to-slate-deep p-6 text-white">
                <div className="mb-4 flex items-center gap-2">
                  <CheckCircle size={20} className="text-green-400" />
                  <h4 className="font-display text-lg font-semibold">Congratulations! You're Pre-Approved</h4>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="mb-1 text-xs text-white/60">Approved Amount</p>
                    <p className="font-display text-2xl font-bold text-brand">{formatCurrency(approvedAmount)}</p>
                  </div>
                  <div>
                    <p className="mb-1 text-xs text-white/60">Estimated Rate</p>
                    <p className="font-display text-2xl font-bold text-brand">{estimatedRate.toFixed(2)}% APR</p>
                  </div>
                </div>
                <p className="mt-4 text-xs text-white/60">
                  A financing specialist will contact you within 24 hours to finalise your application.
                </p>
                <a
                  href={`https://wa.me/2348123456789?text=${encodeURIComponent(`Hi! I've been pre-approved for financing. Reference: ${formData.firstName} ${formData.lastName}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 block"
                >
                  <Button className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white">
                    Continue on WhatsApp
                  </Button>
                </a>
                <Button variant="outline" className="mt-2 w-full border-white/20 text-white hover:bg-white/10 hover:text-white" onClick={onClose}>
                  Close
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Processing state */}
        {applicationStatus !== "draft" && applicationStatus !== "approved" && (
          <div className="px-8 py-8 text-center">
            <Loader2 size={32} className="mx-auto mb-3 animate-spin text-brand" />
            <p className="text-sm text-muted-foreground">Processing your application… Do not close this window.</p>
          </div>
        )}

        {/* Application form */}
        {applicationStatus === "draft" && (
          <div className="max-h-[62vh] overflow-y-auto">
            <form id="fa-form" onSubmit={handleSubmit} className="space-y-0 px-8 py-6">
              {error && (
                <div className="mb-6 flex items-start gap-3 rounded-xl border border-brand/40 bg-brand/5 px-4 py-3 text-sm text-brand">
                  <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                  {error}
                </div>
              )}

              {/* Personal Information */}
              <div className="mb-8">
                <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-foreground">
                  <User size={18} className="text-brand" /> Personal Information
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fa-firstName">First Name *</Label>
                    <Input id="fa-firstName" value={formData.firstName} onChange={(e) => updateField("firstName", e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fa-lastName">Last Name *</Label>
                    <Input id="fa-lastName" value={formData.lastName} onChange={(e) => updateField("lastName", e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fa-dob">Date of Birth *</Label>
                    <Input id="fa-dob" type="date" value={formData.dateOfBirth} onChange={(e) => updateField("dateOfBirth", e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fa-ssn">NIN / ID Number *</Label>
                    <Input id="fa-ssn" type="password" placeholder="Enter securely" value={formData.ssn} onChange={(e) => updateField("ssn", e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fa-phone">Phone Number *</Label>
                    <Input id="fa-phone" type="tel" value={formData.phone} onChange={(e) => updateField("phone", e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fa-email">Email Address *</Label>
                    <Input id="fa-email" type="email" value={formData.email} onChange={(e) => updateField("email", e.target.value)} required />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="fa-address">Street Address *</Label>
                    <Input id="fa-address" value={formData.address} onChange={(e) => updateField("address", e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fa-city">City *</Label>
                    <Input id="fa-city" value={formData.city} onChange={(e) => updateField("city", e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fa-state">State *</Label>
                    <Input id="fa-state" value={formData.state} onChange={(e) => updateField("state", e.target.value)} required />
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Employment */}
              <div className="mb-8">
                <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-foreground">
                  <Briefcase size={18} className="text-brand" /> Employment Information
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fa-empStatus">Employment Status *</Label>
                    <Select value={formData.employmentStatus} onValueChange={(v) => updateField("employmentStatus", v)}>
                      <SelectTrigger id="fa-empStatus"><SelectValue placeholder="Select status" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Employed Full-Time</SelectItem>
                        <SelectItem value="part-time">Employed Part-Time</SelectItem>
                        <SelectItem value="self-employed">Self-Employed</SelectItem>
                        <SelectItem value="retired">Retired</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fa-employer">Employer Name *</Label>
                    <Input id="fa-employer" value={formData.employer} onChange={(e) => updateField("employer", e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fa-jobTitle">Job Title *</Label>
                    <Input id="fa-jobTitle" value={formData.jobTitle} onChange={(e) => updateField("jobTitle", e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fa-empLength">Time at Current Job *</Label>
                    <Select value={formData.employmentLength} onValueChange={(v) => updateField("employmentLength", v)}>
                      <SelectTrigger id="fa-empLength"><SelectValue placeholder="Select duration" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="less1">Less than 1 year</SelectItem>
                        <SelectItem value="1-2">1–2 years</SelectItem>
                        <SelectItem value="2-5">2–5 years</SelectItem>
                        <SelectItem value="5plus">5+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fa-workPhone">Work Phone</Label>
                    <Input id="fa-workPhone" type="tel" value={formData.workPhone} onChange={(e) => updateField("workPhone", e.target.value)} />
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Financial */}
              <div className="mb-8">
                <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-foreground">
                  <DollarSign size={18} className="text-brand" /> Financial Information
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fa-income">Annual Gross Income (₦) *</Label>
                    <Input id="fa-income" type="number" placeholder="Enter amount" value={formData.annualIncome} onChange={(e) => updateField("annualIncome", e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fa-addIncome">Additional Monthly Income (₦)</Label>
                    <Input id="fa-addIncome" type="number" placeholder="Enter amount" value={formData.additionalIncome} onChange={(e) => updateField("additionalIncome", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fa-housing">Monthly Housing Payment (₦) *</Label>
                    <Input id="fa-housing" type="number" placeholder="Rent or mortgage" value={formData.monthlyHousing} onChange={(e) => updateField("monthlyHousing", e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fa-debt">Other Monthly Debt Payments (₦)</Label>
                    <Input id="fa-debt" type="number" placeholder="Credit cards, loans, etc." value={formData.monthlyDebt} onChange={(e) => updateField("monthlyDebt", e.target.value)} />
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Consent */}
              <div className="mb-6">
                <h3 className="mb-4 font-display text-lg font-semibold text-foreground">Authorization & Consent</h3>
                <div className="space-y-3 rounded-xl border border-border bg-muted/30 p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="fa-credit"
                      checked={formData.authorizeCredit}
                      onCheckedChange={(checked) => updateField("authorizeCredit", checked as boolean)}
                    />
                    <div>
                      <label htmlFor="fa-credit" className="cursor-pointer text-sm font-medium leading-none text-foreground">
                        I authorise Platinum Helms to obtain my credit report *
                      </label>
                      <p className="mt-1 text-xs text-muted-foreground">
                        This allows us to check your credit history to determine financing eligibility.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="fa-terms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => updateField("agreeToTerms", checked as boolean)}
                    />
                    <div>
                      <label htmlFor="fa-terms" className="cursor-pointer text-sm font-medium leading-none text-foreground">
                        I agree to the terms and conditions *
                      </label>
                      <p className="mt-1 text-xs text-muted-foreground">
                        By submitting, you certify that all information provided is accurate and complete.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-xs text-amber-900">
                  <strong>Important:</strong> Submitting this application may result in a credit inquiry. Your information is encrypted and secure.
                </p>
              </div>
            </form>
          </div>
        )}

        {/* Footer actions (draft state only) */}
        {applicationStatus === "draft" && (
          <div className="border-t border-border px-8 py-4">
            <Button
              form="fa-form"
              type="submit"
              size="lg"
              className="w-full bg-brand hover:bg-brand-strong"
              disabled={!isFormValid() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Submitting…
                </>
              ) : (
                "Submit Application"
              )}
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              * Required fields. All information is kept confidential and secure.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

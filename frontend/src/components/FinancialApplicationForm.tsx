import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../components/dialog";
import { Button } from "../components/button";
import { Input } from "../components/input";
import { Label } from "../components/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/select";
import { Separator } from "../components/separator";
import { Progress } from "../components/progress";
import { Badge } from "../components/badge";
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
  X,
} from "lucide-react";

interface FinancialApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
  vehiclePrice?: number;
}

type ApplicationStatus = "draft" | "submitted" | "verifying" | "eligibility" | "approved" | "denied";

interface FormData {
  // Personal Information
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
  
  // Employment Information
  employmentStatus: string;
  employer: string;
  jobTitle: string;
  employmentLength: string;
  workPhone: string;
  
  // Financial Information
  annualIncome: string;
  additionalIncome: string;
  monthlyHousing: string;
  monthlyDebt: string;
  
  // Credit Authorization
  authorizeCredit: boolean;
  agreeToTerms: boolean;
}

const statusSteps = [
  { id: "submitted", label: "Submitted", icon: FileText },
  { id: "verifying", label: "Verifying", icon: Search },
  { id: "eligibility", label: "Credit Eligibility", icon: CreditCard },
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
    
    // Simulate submission process
    setApplicationStatus("submitted");
    
    // Simulate verification
    setTimeout(() => {
      setApplicationStatus("verifying");
    }, 1500);
    
    // Simulate credit check
    setTimeout(() => {
      setApplicationStatus("eligibility");
    }, 3500);
    
    // Simulate approval
    setTimeout(() => {
      setApplicationStatus("approved");
      // Calculate approved amount based on income
      const income = parseFloat(formData.annualIncome) || 0;
      const approved = Math.min(income * 0.4, vehiclePrice * 1.2);
      setApprovedAmount(approved);
      setEstimatedRate(4.9 + Math.random() * 3); // Random rate between 4.9% and 7.9%
    }, 5500);
  };

  const getStatusIndex = () => {
    const statusOrder = ["draft", "submitted", "verifying", "eligibility", "approved", "denied"];
    return statusOrder.indexOf(applicationStatus);
  };

  const isFormValid = () => {
    return (
      formData.firstName &&
      formData.lastName &&
      formData.email &&
      formData.ssn &&
      formData.annualIncome &&
      formData.authorizeCredit &&
      formData.agreeToTerms
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-50 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-br from-black to-gray-900 p-8 text-white">
          <DialogHeader>
            <DialogTitle className="text-white text-2xl mb-2">
              Financing Application
            </DialogTitle>
            <DialogDescription className="text-white/90 text-base">
              Complete your financial application to get pre-approved for vehicle financing
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Application Status Tracker */}
        {applicationStatus !== "draft" && (
          <div className="px-8 pt-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="mb-4 flex items-center gap-2">
                <Clock className="text-red-600" size={20} />
                Application Status
              </h3>
              
              {/* Progress Bar */}
              <div className="mb-6">
                <Progress 
                  value={((getStatusIndex()) / 4) * 100} 
                  className="h-2"
                />
              </div>

              {/* Status Steps */}
              <div className="grid grid-cols-4 gap-4">
                {statusSteps.map((step, index) => {
                  const isActive = statusSteps.findIndex(s => s.id === applicationStatus) >= index;
                  const isCurrent = step.id === applicationStatus;
                  const StepIcon = step.icon;
                  
                  return (
                    <div
                      key={step.id}
                      className={`flex flex-col items-center text-center ${
                        isActive ? "opacity-100" : "opacity-40"
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                          isCurrent
                            ? "bg-red-600 text-white animate-pulse"
                            : isActive
                            ? "bg-green-600 text-white"
                            : "bg-gray-200 text-gray-400"
                        }`}
                      >
                        <StepIcon size={20} />
                      </div>
                      <p className="text-xs">{step.label}</p>
                      {isCurrent && (
                        <Badge className="mt-2 bg-red-600 text-white border-none text-xs">
                          In Progress
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Approval Result */}
              {applicationStatus === "approved" && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="text-green-600" size={24} />
                    <h4 className="text-green-900">Congratulations! You're Pre-Approved</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-green-700 mb-1">Approved Amount</p>
                      <p className="text-green-900">${approvedAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-green-700 mb-1">Estimated Rate</p>
                      <p className="text-green-900">{estimatedRate.toFixed(2)}% APR</p>
                    </div>
                  </div>
                  <p className="text-xs text-green-700 mt-3 mb-4">
                    A financing specialist will contact you within 24 hours to finalize your application.
                  </p>
                  <a
                    href={`https://wa.me/15551234567?text=${encodeURIComponent(`Hi! I've been pre-approved for financing. Reference: ${formData.firstName} ${formData.lastName}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button type="button" className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      Continue on WhatsApp
                    </Button>
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Application Form */}
        {applicationStatus === "draft" && (
          <form onSubmit={handleSubmit} className="p-8">
            {/* Personal Information */}
            <div className="mb-8">
              <h3 className="mb-4 flex items-center gap-2">
                <User className="text-red-600" size={20} />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => updateField("firstName", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => updateField("lastName", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => updateField("dateOfBirth", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ssn">Social Security Number *</Label>
                  <Input
                    id="ssn"
                    type="password"
                    placeholder="XXX-XX-XXXX"
                    value={formData.ssn}
                    onChange={(e) => updateField("ssn", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Street Address *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => updateField("state", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code *</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => updateField("zipCode", e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <Separator className="my-8" />

            {/* Employment Information */}
            <div className="mb-8">
              <h3 className="mb-4 flex items-center gap-2">
                <Briefcase className="text-red-600" size={20} />
                Employment Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employmentStatus">Employment Status *</Label>
                  <Select
                    value={formData.employmentStatus}
                    onValueChange={(value) => updateField("employmentStatus", value)}
                  >
                    <SelectTrigger id="employmentStatus">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employed">Employed Full-Time</SelectItem>
                      <SelectItem value="parttime">Employed Part-Time</SelectItem>
                      <SelectItem value="selfemployed">Self-Employed</SelectItem>
                      <SelectItem value="retired">Retired</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employer">Employer Name *</Label>
                  <Input
                    id="employer"
                    value={formData.employer}
                    onChange={(e) => updateField("employer", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title *</Label>
                  <Input
                    id="jobTitle"
                    value={formData.jobTitle}
                    onChange={(e) => updateField("jobTitle", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employmentLength">Time at Current Job *</Label>
                  <Select
                    value={formData.employmentLength}
                    onValueChange={(value) => updateField("employmentLength", value)}
                  >
                    <SelectTrigger id="employmentLength">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="less1">Less than 1 year</SelectItem>
                      <SelectItem value="1-2">1-2 years</SelectItem>
                      <SelectItem value="2-5">2-5 years</SelectItem>
                      <SelectItem value="5plus">5+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workPhone">Work Phone Number</Label>
                  <Input
                    id="workPhone"
                    type="tel"
                    value={formData.workPhone}
                    onChange={(e) => updateField("workPhone", e.target.value)}
                  />
                </div>
              </div>
            </div>

            <Separator className="my-8" />

            {/* Financial Information */}
            <div className="mb-8">
              <h3 className="mb-4 flex items-center gap-2">
                <DollarSign className="text-red-600" size={20} />
                Financial Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="annualIncome">Annual Gross Income *</Label>
                  <Input
                    id="annualIncome"
                    type="number"
                    placeholder="$"
                    value={formData.annualIncome}
                    onChange={(e) => updateField("annualIncome", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="additionalIncome">Additional Monthly Income</Label>
                  <Input
                    id="additionalIncome"
                    type="number"
                    placeholder="$"
                    value={formData.additionalIncome}
                    onChange={(e) => updateField("additionalIncome", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthlyHousing">Monthly Housing Payment *</Label>
                  <Input
                    id="monthlyHousing"
                    type="number"
                    placeholder="$ (rent or mortgage)"
                    value={formData.monthlyHousing}
                    onChange={(e) => updateField("monthlyHousing", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthlyDebt">Other Monthly Debt Payments</Label>
                  <Input
                    id="monthlyDebt"
                    type="number"
                    placeholder="$ (credit cards, loans, etc.)"
                    value={formData.monthlyDebt}
                    onChange={(e) => updateField("monthlyDebt", e.target.value)}
                  />
                </div>
              </div>
            </div>

            <Separator className="my-8" />

            {/* Credit Authorization */}
            <div className="mb-8">
              <h3 className="mb-4">Authorization & Consent</h3>
              <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="authorizeCredit"
                    checked={formData.authorizeCredit}
                    onCheckedChange={(checked) =>
                      updateField("authorizeCredit", checked as boolean)
                    }
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="authorizeCredit"
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I authorize Platinum Helms to obtain my credit report *
                    </label>
                    <p className="text-xs text-gray-500">
                      This authorization allows us to check your credit history and score
                      from credit bureaus to determine your financing eligibility.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) =>
                      updateField("agreeToTerms", checked as boolean)
                    }
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="agreeToTerms"
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I agree to the terms and conditions *
                    </label>
                    <p className="text-xs text-gray-500">
                      By submitting this application, you certify that all information
                      provided is accurate and complete.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-xs text-yellow-900">
                <strong>Important:</strong> Submitting this application will result in a
                hard inquiry on your credit report, which may temporarily affect your
                credit score. Your information is encrypted and secure.
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white"
              size="lg"
              disabled={!isFormValid()}
            >
              Submit Application
            </Button>

            <p className="text-xs text-gray-500 text-center mt-4">
              * Required fields. All information is kept confidential and secure.
            </p>
          </form>
        )}

        {/* Processing State */}
        {applicationStatus !== "draft" && applicationStatus !== "approved" && (
          <div className="px-8 pb-8">
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                Please wait while we process your application...
              </p>
              <p className="text-sm text-gray-500">
                This typically takes 3-5 minutes. Do not close this window.
              </p>
            </div>
          </div>
        )}

        {/* Approved State Actions */}
        {applicationStatus === "approved" && (
          <div className="px-8 pb-8">
            <div className="flex gap-4">
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 border-gray-300"
                size="lg"
              >
                Close
              </Button>
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                size="lg"
              >
                Continue to Vehicle Selection
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

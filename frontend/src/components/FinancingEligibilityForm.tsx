import { useState } from "react";
import { Button } from "../components/button";
import { Input } from "../components/input";
import { Label } from "../components/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/select";
import { Textarea } from "../components/textarea";
import { RadioGroup, RadioGroupItem } from "../components/radio-group";
import { Card } from "../components/card";
import { CheckCircle2, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../components/dialog";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save to localStorage (since no backend)
    const submissions = JSON.parse(localStorage.getItem("financingRequests") || "[]");
    const newSubmission = {
      ...formData,
      formType: "Financing",
      submissionDate: new Date().toISOString(),
      status: "Pending",
      source: "Financing Page",
    };
    submissions.push(newSubmission);
    localStorage.setItem("financingRequests", JSON.stringify(submissions));

    setIsSubmitted(true);
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
    const whatsappUrl = `https://wa.me/2348123456789?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
    handleReset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {!isSubmitted ? (
          <>
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-black">Check Your Auto Financing Eligibility</DialogTitle>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X size={20} />
                </Button>
              </div>
              <DialogDescription className="text-gray-600 text-sm mt-2">
                Fill out this form and our financing team will contact you shortly to discuss your eligibility and available plans.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6 mt-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-black">Personal Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="johndoe@email.com"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number (WhatsApp preferred) *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+234 812 345 6789"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              {/* Vehicle & Financial Information */}
              <div className="space-y-4">
                <h3 className="text-black">Vehicle & Financial Details</h3>

                <div className="space-y-2">
                  <Label htmlFor="selectedCar">Selected Car</Label>
                  <Input
                    id="selectedCar"
                    placeholder="e.g., Toyota Corolla 2020"
                    value={formData.selectedCar}
                    onChange={(e) => setFormData({ ...formData, selectedCar: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employmentStatus">Employment Status *</Label>
                  <Select
                    value={formData.employmentStatus}
                    onValueChange={(value) => setFormData({ ...formData, employmentStatus: value })}
                    required
                  >
                    <SelectTrigger id="employmentStatus">
                      <SelectValue placeholder="Select your employment status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employed">Employed</SelectItem>
                      <SelectItem value="self-employed">Self-Employed</SelectItem>
                      <SelectItem value="business-owner">Business Owner</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="monthlyIncome">Monthly Income Range *</Label>
                  <Select
                    value={formData.monthlyIncome}
                    onValueChange={(value) => setFormData({ ...formData, monthlyIncome: value })}
                    required
                  >
                    <SelectTrigger id="monthlyIncome">
                      <SelectValue placeholder="Select your income range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="100k-250k">â‚¦100,000 - â‚¦250,000</SelectItem>
                      <SelectItem value="250k-500k">â‚¦250,000 - â‚¦500,000</SelectItem>
                      <SelectItem value="500k-1m">â‚¦500,000 - â‚¦1,000,000</SelectItem>
                      <SelectItem value="1m+">â‚¦1,000,000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="repaymentDuration">Preferred Repayment Duration *</Label>
                  <Select
                    value={formData.repaymentDuration}
                    onValueChange={(value) => setFormData({ ...formData, repaymentDuration: value })}
                    required
                  >
                    <SelectTrigger id="repaymentDuration">
                      <SelectValue placeholder="Select repayment duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">6 months</SelectItem>
                      <SelectItem value="12">12 months</SelectItem>
                      <SelectItem value="18">18 months</SelectItem>
                      <SelectItem value="24">24 months</SelectItem>
                      <SelectItem value="36">36 months</SelectItem>
                      <SelectItem value="48">48 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="initialDeposit">Initial Deposit Budget (â‚¦)</Label>
                  <Input
                    id="initialDeposit"
                    type="number"
                    placeholder="e.g., 1500000"
                    value={formData.initialDeposit}
                    onChange={(e) => setFormData({ ...formData, initialDeposit: e.target.value })}
                  />
                  <p className="text-xs text-gray-500">Optional but helpful for assessment</p>
                </div>
              </div>

              {/* Additional Notes */}
              <div className="space-y-2">
                <Label htmlFor="additionalNotes">Additional Notes / Message</Label>
                <Textarea
                  id="additionalNotes"
                  placeholder="e.g., I'm interested in the Corolla 2020 model..."
                  rows={4}
                  value={formData.additionalNotes}
                  onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                />
              </div>

              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-medium">
                Check My Eligibility
              </Button>
            </form>
          </>
        ) : (
          <div className="py-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="text-green-600" size={32} />
              </div>
              <h3 className="text-black mb-2">Thank You, {formData.fullName}!</h3>
              <p className="text-gray-600">
                Your financing eligibility request has been received. Our financing team will contact you shortly to discuss your eligibility and available plans.
              </p>
            </div>

            <Card className="p-4 bg-gray-50 border-none mb-6">
              <h4 className="text-black text-sm mb-3">Submission Summary:</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Vehicle:</span>
                  <span className="text-black">{formData.selectedCar || "Not specified"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Income Range:</span>
                  <span className="text-black">{formData.monthlyIncome}</span>
                </div>
                <div className="flex justify-between">
                  <span>Repayment Term:</span>
                  <span className="text-black">{formData.repaymentDuration} months</span>
                </div>
              </div>
            </Card>

            <div className="flex flex-col gap-3">
              <Button
                onClick={openWhatsApp}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium"
              >
                Continue on WhatsApp
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="w-full text-black border-gray-300 hover:bg-gray-100 font-medium"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

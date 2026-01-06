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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save to localStorage (since no backend)
    const submissions = JSON.parse(localStorage.getItem("importationRequests") || "[]");
    const newSubmission = {
      ...formData,
      formType: "Importation",
      submissionDate: new Date().toISOString(),
      status: "Pending",
      source: "Importation Page",
    };
    submissions.push(newSubmission);
    localStorage.setItem("importationRequests", JSON.stringify(submissions));

    setIsSubmitted(true);
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
                <DialogTitle className="text-black">Request for Car Importation Assistance</DialogTitle>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X size={20} />
                </Button>
              </div>
              <DialogDescription className="text-gray-600 text-sm mt-2">
                Submit your importation request and our specialist will reach out with quotes and delivery details.
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
                    placeholder="Adewale Johnson"
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
                    placeholder="adewale@email.com"
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
                    placeholder="+234 809 555 0000"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              {/* Vehicle & Importation Details */}
              <div className="space-y-4">
                <h3 className="text-black">Vehicle & Importation Details</h3>

                <div className="space-y-2">
                  <Label htmlFor="desiredCar">Desired Car Brand & Model *</Label>
                  <Input
                    id="desiredCar"
                    placeholder="e.g., Toyota Highlander 2019"
                    required
                    value={formData.desiredCar}
                    onChange={(e) => setFormData({ ...formData, desiredCar: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferredCountry">Preferred Country of Import *</Label>
                  <Select
                    value={formData.preferredCountry}
                    onValueChange={(value) => setFormData({ ...formData, preferredCountry: value })}
                    required
                  >
                    <SelectTrigger id="preferredCountry">
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
                  <p className="text-xs text-gray-500">This helps estimate import timeline and costs</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budgetRange">Budget Range (â‚¦) *</Label>
                  <Select
                    value={formData.budgetRange}
                    onValueChange={(value) => setFormData({ ...formData, budgetRange: value })}
                    required
                  >
                    <SelectTrigger id="budgetRange">
                      <SelectValue placeholder="Select your budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5M-7M">â‚¦5,000,000 - â‚¦7,000,000</SelectItem>
                      <SelectItem value="7M-10M">â‚¦7,000,000 - â‚¦10,000,000</SelectItem>
                      <SelectItem value="10M-15M">â‚¦10,000,000 - â‚¦15,000,000</SelectItem>
                      <SelectItem value="15M-20M">â‚¦15,000,000 - â‚¦20,000,000</SelectItem>
                      <SelectItem value="20M+">â‚¦20,000,000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deliveryTimeline">Expected Delivery Timeline *</Label>
                  <Select
                    value={formData.deliveryTimeline}
                    onValueChange={(value) => setFormData({ ...formData, deliveryTimeline: value })}
                    required
                  >
                    <SelectTrigger id="deliveryTimeline">
                      <SelectValue placeholder="Select expected timeline" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4-6">4-6 weeks</SelectItem>
                      <SelectItem value="6-8">6-8 weeks</SelectItem>
                      <SelectItem value="8-12">8-12 weeks</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Importation Type *</Label>
                  <RadioGroup
                    value={formData.importationType}
                    onValueChange={(value) => setFormData({ ...formData, importationType: value })}
                    required
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="self-import" id="self-import" />
                      <Label htmlFor="self-import" className="cursor-pointer">
                        Self-Import (I have a specific vehicle to import)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="assisted-import" id="assisted-import" />
                      <Label htmlFor="assisted-import" className="cursor-pointer">
                        Assisted Import (Help me find and import the right vehicle)
                      </Label>
                    </div>
                  </RadioGroup>
                  <p className="text-xs text-gray-500">
                    Defines the level of support you need
                  </p>
                </div>
              </div>

              {/* Additional Details */}
              <div className="space-y-2">
                <Label htmlFor="additionalDetails">Additional Details</Label>
                <Textarea
                  id="additionalDetails"
                  placeholder="e.g., Prefer white color, hybrid engine, low mileage..."
                  rows={4}
                  value={formData.additionalDetails}
                  onChange={(e) => setFormData({ ...formData, additionalDetails: e.target.value })}
                />
                <p className="text-xs text-gray-500">
                  Optional: Specify preferences like color, mileage, features, etc.
                </p>
              </div>

              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-medium">
                Submit Request
              </Button>
            </form>
          </>
        ) : (
          <div className="py-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="text-green-600" size={32} />
              </div>
              <h3 className="text-black mb-2">Thanks, {formData.fullName}!</h3>
              <p className="text-gray-600">
                Your importation request has been received. Our importation specialist will reach out shortly with quotes and delivery details.
              </p>
            </div>

            <Card className="p-4 bg-gray-50 border-none mb-6">
              <h4 className="text-black text-sm mb-3">Submission Summary:</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Vehicle:</span>
                  <span className="text-black">{formData.desiredCar}</span>
                </div>
                <div className="flex justify-between">
                  <span>Import From:</span>
                  <span className="text-black">{formData.preferredCountry}</span>
                </div>
                <div className="flex justify-between">
                  <span>Budget Range:</span>
                  <span className="text-black">{formData.budgetRange}</span>
                </div>
                <div className="flex justify-between">
                  <span>Timeline:</span>
                  <span className="text-black">{formData.deliveryTimeline}</span>
                </div>
                <div className="flex justify-between">
                  <span>Import Type:</span>
                  <span className="text-black capitalize">{formData.importationType.replace('-', ' ')}</span>
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

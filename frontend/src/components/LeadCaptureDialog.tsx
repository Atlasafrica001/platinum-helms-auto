import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../components/dialog";
import { Button } from "../components/button";
import { Input } from "../components/input";
import { Label } from "../components/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/select";
import { X } from "lucide-react";

export function LeadCaptureDialog() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    interest: "",
  });

  useEffect(() => {
    // Check if user has already submitted the form
    const hasSubmitted = localStorage.getItem("platinum_helms_lead_submitted");
    
    if (!hasSubmitted) {
      // Show dialog after a short delay for better UX
      const timer = setTimeout(() => {
        setOpen(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Store form data (in a real app, send to backend)
    console.log("Lead captured:", formData);
    
    // Mark as submitted in localStorage
    localStorage.setItem("platinum_helms_lead_submitted", "true");
    
    // Redirect to WhatsApp
    const message = `Hi! I'm ${formData.name}. I'm interested in ${formData.interest || "luxury vehicles"} at Platinum Helms.`;
    const whatsappUrl = `https://wa.me/15551234567?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    // Close dialog
    setOpen(false);
  };

  const handleSkip = () => {
    localStorage.setItem("platinum_helms_lead_submitted", "true");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="fixed left-1/2 top-1/2 lg:-translate-x-64 lg:-translate-y-64 md:-translate-x-72 md:-translate-y-72 sm:-translate-x-80 sm:-translate-y-80 sm:max-w-[500px] w-[90vw] max-w-md max-h-[85vh] overflow-y-auto p-0 rounded-lg "
      >
        <div className="relative">
          {/* Close button */}
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X size={20} className="text-white" />
          </button>

          {/* Header with red accent */}
          <div className="bg-gradient-to-br from-black to-gray-900 p-8 text-white">
            <DialogHeader>
              <DialogTitle className="text-white text-2xl mb-2">
                Welcome to Platinum Helms
              </DialogTitle>
              <DialogDescription className="text-white/90 text-base">
                Discover exclusive offers and personalized recommendations for your
                luxury vehicle journey.
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>



            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                size="lg"
              >
                Get Started
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleSkip}
                className="flex-1"
                size="lg"
              >
                Skip for Now
              </Button>
            </div>

            <p className="text-xs text-gray-500 text-center">
              We respect your privacy. Your information is secure and will never be
              shared with third parties.
            </p>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../components/dialog";
import { Button } from "../components/button";
import { Badge } from "../components/badge";
import { Separator } from "../components/separator";
import { ImageWithFallback } from "../components/ImageWithFallback";
import {
  Calendar,
  Gauge,
  Fuel,
  Settings,
  Shield,
  Award,
  CreditCard,
  Calculator,
  PhoneCall,
  Heart,
  Share2,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Vehicle {
  id: number;
  name: string;
  brand: string;
  category: string;
  year: number;
  condition: string;
  price: number;
  image: string;
  features: string[];
  tags?: string[];
  country?: string;
}

interface VehicleDetailsDialogProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
}

export function VehicleDetailsDialog({
  vehicle,
  isOpen,
  onClose,
  onNavigate,
}: VehicleDetailsDialogProps) {
  if (!vehicle) return null;

  // Slideshow state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Multiple images for slideshow - main image + additional views
  const vehicleImages = [
    vehicle.image,
    vehicle.image, // In a real app, these would be different angles
    vehicle.image, // e.g., interior, side view, rear view, etc.
    vehicle.image,
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % vehicleImages.length);
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + vehicleImages.length) % vehicleImages.length);
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Mock additional details
  const specs = [
    { icon: Gauge, label: "Engine", value: "Twin-Turbo V8" },
    { icon: Settings, label: "Transmission", value: "9-Speed Automatic" },
    { icon: Fuel, label: "Fuel Type", value: "Premium Gasoline" },
    { icon: Calendar, label: "Mileage", value: vehicle.condition === "new" ? "0 mi" : "12,450 mi" },
  ];

  const highlights = [
    "Premium leather interior with heated and ventilated seats",
    "Advanced driver assistance systems",
    "Premium sound system with 3D surround",
    "Panoramic sunroof with power shade",
    "Adaptive LED headlights with high beam assist",
    "Wireless smartphone integration (Apple CarPlay & Android Auto)",
    "360-degree camera system",
    "Heads-up display with navigation",
  ];

  const handleFinancing = () => {
    onNavigate("financing");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0">
        {/* Visually Hidden Accessibility Elements */}
        <DialogHeader className="sr-only">
          <DialogTitle>{vehicle.brand} {vehicle.name}</DialogTitle>
          <DialogDescription>
            Detailed information about {vehicle.year} {vehicle.brand} {vehicle.name} - ${vehicle.price.toLocaleString()}
          </DialogDescription>
        </DialogHeader>

        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-50 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Hero Image Slideshow */}
        <div className="relative h-[400px] w-full overflow-hidden">
          {/* Images */}
          <div className="relative h-full w-full">
            {vehicleImages.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <ImageWithFallback
                  src={image}
                  alt={`${vehicle.name} - View ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Navigation Arrows */}
          <button
            onClick={previousImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft size={24} className="text-white" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
            aria-label="Next image"
          >
            <ChevronRight size={24} className="text-white" />
          </button>

          {/* Image Indicators */}
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            {vehicleImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentImageIndex
                    ? 'bg-white w-8'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
          
          {/* Floating Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            <Badge className="bg-black/80 text-white border-none px-3 py-1">
              {vehicle.year}
            </Badge>
            {vehicle.condition === "new" && (
              <Badge className="bg-red-600 text-white border-none px-3 py-1">
                Brand New
              </Badge>
            )}
            {vehicle.country && (
              <Badge className="bg-white/90 text-black border-none px-3 py-1">
                {vehicle.country}
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <button className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
              <Heart size={20} className="text-black" />
            </button>
            <button className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
              <Share2 size={20} className="text-black" />
            </button>
          </div>

          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
            <p className="text-sm text-white/80 mb-1">{vehicle.brand}</p>
            <h2 className="text-white mb-2">{vehicle.name}</h2>
            <p className="text-white">
              ${vehicle.price.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Quick Specs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {specs.map((spec, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg"
              >
                <spec.icon size={24} className="text-red-600 mb-2" />
                <p className="text-xs text-gray-500 mb-1">{spec.label}</p>
                <p className="text-sm">{spec.value}</p>
              </div>
            ))}
          </div>

          {/* Features */}
          <div className="mb-8">
            <h3 className="mb-4 flex items-center gap-2">
              <Award size={20} className="text-red-600" />
              Key Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {vehicle.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Highlights */}
          <div className="mb-8">
            <h3 className="mb-4 flex items-center gap-2">
              <Shield size={20} className="text-red-600" />
              Premium Highlights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {highlights.map((highlight, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm text-gray-600">{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-8" />

          {/* Financing Section */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-lg mb-6">
            <h3 className="mb-3 flex items-center gap-2">
              <CreditCard size={20} className="text-red-600" />
              Financing Available
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Flexible financing options starting from as low as 3.9% APR. Get pre-approved in minutes.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 mb-1">Estimated Monthly</p>
                <p className="text-red-600">
                  ${Math.round((vehicle.price * 0.02)).toLocaleString()}/mo
                </p>
                <p className="text-xs text-gray-500 mt-1">60 months @ 4.9% APR</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 mb-1">Down Payment</p>
                <p className="text-red-600">
                  ${Math.round((vehicle.price * 0.2)).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">20% recommended</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={handleFinancing}
              className="bg-red-600 hover:bg-red-700 text-white"
              size="lg"
            >
              <Calculator className="mr-2" size={18} />
              Get Financing
            </Button>
            <a
              href={`https://wa.me/15551234567?text=${encodeURIComponent(`Hi! I'm interested in the ${vehicle.year} ${vehicle.brand} ${vehicle.name}. Can you provide more details?`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button
                variant="outline"
                className="w-full border-gray-300 hover:bg-gray-50"
                size="lg"
              >
                <PhoneCall className="mr-2 flex-shrink-0" size={16} />
                <span className="truncate">Contact Specialist</span>
              </Button>
            </a>
            <a
              href={`https://wa.me/15551234567?text=${encodeURIComponent(`Hi! I'd like to schedule a test drive for the ${vehicle.year} ${vehicle.brand} ${vehicle.name}.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button
                variant="outline"
                className="w-full border-gray-300 hover:bg-gray-50"
                size="lg"
              >
                Schedule Test Drive
              </Button>
            </a>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-gray-500 mt-6 text-center">
            *Financing subject to credit approval. Monthly payment estimates are for illustration purposes only.
            Actual rates and terms may vary based on creditworthiness and other factors.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

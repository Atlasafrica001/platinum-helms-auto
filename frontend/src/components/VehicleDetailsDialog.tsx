import { useState } from "react";
import { formatCurrency } from "@/lib/adminUtils";
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
  images?: Array<{ url: string }>;
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

export function VehicleDetailsDialog({ vehicle, isOpen, onClose, onNavigate }: VehicleDetailsDialogProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!vehicle) return null;

  const vehicleImages =
    vehicle.images && vehicle.images.length > 0
      ? vehicle.images.map((img) => img.url)
      : [vehicle.image];

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % vehicleImages.length);
  const previousImage = () => setCurrentImageIndex((prev) => (prev - 1 + vehicleImages.length) % vehicleImages.length);

  const specs = [
    { icon: Gauge, label: "Engine", value: "Twin-Turbo V8" },
    { icon: Settings, label: "Transmission", value: "9-Speed Automatic" },
    { icon: Fuel, label: "Fuel Type", value: "Premium Gasoline" },
    { icon: Calendar, label: "Mileage", value: vehicle.condition === "new" ? "0 km" : "12,450 km" },
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
      <DialogContent className="w-[96vw] max-w-5xl overflow-hidden rounded-2xl border-border p-0 max-h-[92vh]">
        {/* Accessibility header */}
        <DialogHeader className="sr-only">
          <DialogTitle>
            {vehicle.brand} {vehicle.name}
          </DialogTitle>
          <DialogDescription>
            Detailed information about {vehicle.year} {vehicle.brand} {vehicle.name} —{" "}
            {formatCurrency(vehicle.price)}
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto">
          {/* Hero image slideshow */}
          <div className="relative h-[320px] w-full overflow-hidden sm:h-[400px]">
            {vehicleImages.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  index === currentImageIndex ? "opacity-100" : "opacity-0"
                }`}
              >
                <ImageWithFallback
                  src={image}
                  alt={`${vehicle.name} — view ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-transparent to-transparent" />

            {/* Nav arrows */}
            {vehicleImages.length > 1 && (
              <>
                <button
                  onClick={previousImage}
                  className="absolute left-4 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
                  aria-label="Next image"
                >
                  <ChevronRight size={22} />
                </button>
                <div className="absolute bottom-20 left-1/2 z-10 flex -translate-x-1/2 gap-2">
                  {vehicleImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`h-1.5 rounded-full transition-all ${
                        index === currentImageIndex ? "w-6 bg-white" : "w-1.5 bg-white/50 hover:bg-white/75"
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Badges */}
            <div className="absolute left-4 top-4 z-10 flex flex-col gap-2">
              <Badge className="border-none bg-black/80 px-3 py-1 text-white">{vehicle.year}</Badge>
              {vehicle.condition === "new" && (
                <Badge className="border-none bg-brand px-3 py-1 text-white">Brand New</Badge>
              )}
              {vehicle.country && (
                <Badge className="border-none bg-white/90 px-3 py-1 text-foreground">{vehicle.country}</Badge>
              )}
            </div>

            {/* Wishlist / Share */}
            <div className="absolute right-12 top-4 z-10 flex gap-2">
              <button className="flex size-9 items-center justify-center rounded-full bg-white/90 text-foreground transition-colors hover:bg-white">
                <Heart size={17} />
              </button>
              <button className="flex size-9 items-center justify-center rounded-full bg-white/90 text-foreground transition-colors hover:bg-white">
                <Share2 size={17} />
              </button>
            </div>

            {/* Title overlay */}
            <div className="absolute bottom-0 left-0 right-0 z-10 p-6 text-white">
              <p className="mb-0.5 text-sm text-white/75">{vehicle.brand}</p>
              <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">{vehicle.name}</h2>
              <p className="mt-1 font-display text-xl font-semibold text-brand">{formatCurrency(vehicle.price)}</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            {/* Quick specs */}
            <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
              {specs.map((spec) => (
                <div
                  key={spec.label}
                  className="flex flex-col items-center rounded-xl bg-muted/50 p-4 text-center"
                >
                  <spec.icon size={22} className="mb-2 text-brand" />
                  <p className="mb-0.5 text-xs text-muted-foreground">{spec.label}</p>
                  <p className="text-sm font-medium text-foreground">{spec.value}</p>
                </div>
              ))}
            </div>

            {/* Key features */}
            {vehicle.features.length > 0 && (
              <div className="mb-8">
                <h3 className="mb-4 flex items-center gap-2 font-display text-xl font-semibold text-foreground">
                  <Award size={18} className="text-brand" /> Key Features
                </h3>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  {vehicle.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Premium highlights */}
            <div className="mb-8">
              <h3 className="mb-4 flex items-center gap-2 font-display text-xl font-semibold text-foreground">
                <Shield size={18} className="text-brand" /> Premium Highlights
              </h3>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="mt-2 size-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
                    <span className="text-sm text-muted-foreground">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="my-8" />

            {/* Financing card */}
            <div className="mb-6 rounded-2xl bg-gradient-to-br from-obsidian to-slate-deep p-6 text-white">
              <h3 className="mb-2 flex items-center gap-2 font-display text-lg font-semibold">
                <CreditCard size={18} className="text-brand" /> Financing Available
              </h3>
              <p className="mb-4 text-sm text-white/70">
                Flexible options starting from 3.9% APR. Get pre-approved in minutes.
              </p>
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-white/10 p-4">
                  <p className="mb-0.5 text-xs text-white/60">Est. Monthly</p>
                  <p className="font-display text-lg font-semibold text-brand">
                    {formatCurrency(Math.round(vehicle.price * 0.02))}/mo
                  </p>
                  <p className="text-xs text-white/50">60 months @ 4.9% APR</p>
                </div>
                <div className="rounded-xl bg-white/10 p-4">
                  <p className="mb-0.5 text-xs text-white/60">Down Payment</p>
                  <p className="font-display text-lg font-semibold text-brand">
                    {formatCurrency(Math.round(vehicle.price * 0.2))}
                  </p>
                  <p className="text-xs text-white/50">20% recommended</p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <Button onClick={handleFinancing} size="lg" className="bg-brand hover:bg-brand-strong text-white">
                <Calculator size={16} className="mr-2" /> Get Financing
              </Button>
              <a
                href={`https://wa.me/2348123456789?text=${encodeURIComponent(`Hi! I'm interested in the ${vehicle.year} ${vehicle.brand} ${vehicle.name}. Can you provide more details?`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button variant="outline" size="lg" className="w-full">
                  <PhoneCall size={16} className="mr-2 shrink-0" />
                  <span className="truncate">Contact Specialist</span>
                </Button>
              </a>
              <a
                href={`https://wa.me/2348123456789?text=${encodeURIComponent(`Hi! I'd like to schedule a test drive for the ${vehicle.year} ${vehicle.brand} ${vehicle.name}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button variant="outline" size="lg" className="w-full">
                  Schedule Test Drive
                </Button>
              </a>
            </div>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              *Financing subject to credit approval. Monthly payment estimates are for illustration purposes only.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

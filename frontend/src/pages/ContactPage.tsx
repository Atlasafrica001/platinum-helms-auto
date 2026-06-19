import { useState } from "react";
import { toast } from "sonner";
import api, { ApiError } from "@/lib/api";
import { Reveal } from "../components/motion/Reveal";
import { Button } from "../components/button";
import { Card } from "../components/card";
import { Input } from "../components/input";
import { Label } from "../components/label";
import { Textarea } from "../components/textarea";
import { Spinner } from "../components/feedback/StateViews";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

const initialForm = { name: "", email: "", phone: "", subject: "", message: "" };

const contactCards = [
  { Icon: Phone, title: "Phone", lines: ["+234 812 345 6789", "+234 909 876 5432"] },
  { Icon: Mail, title: "Email", lines: ["info@platinumhelms.com", "sales@platinumhelms.com"] },
  { Icon: MapPin, title: "Address", lines: ["123 Luxury Auto Boulevard", "Victoria Island, Lagos"] },
  { Icon: Clock, title: "Business Hours", lines: ["Mon – Fri: 9am – 7pm", "Sat: 10am – 6pm · Sun: Closed"] },
];

export function ContactPage() {
  const [formData, setFormData] = useState(initialForm);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const phoneNumber = "2348123456789";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    "Hello! I have a question about Platinum Helms.",
  )}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      await api.leads.submitContact(formData);
      setIsSubmitted(true);
      setFormData(initialForm);
      toast.success("Message sent — we'll be in touch shortly.");
    } catch (err) {
      const message = err instanceof ApiError || err instanceof Error ? err.message : "Unable to send message";
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative flex h-[48vh] min-h-80 items-center justify-center overflow-hidden bg-obsidian">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-obsidian via-obsidian to-slate-deep" />
          <div className="pointer-events-none absolute -top-20 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-brand/15 blur-3xl" />
        </div>
        <Reveal className="relative px-4 text-center">
          <h1 className="font-display text-5xl font-bold tracking-tight text-white sm:text-6xl">Contact Us</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/70">
            Get in touch with our team of automotive experts.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Info */}
          <div>
            <h2 className="font-display text-3xl font-bold text-foreground">Get In Touch</h2>
            <p className="mt-3 max-w-md text-muted-foreground">
              Whether you're looking to purchase, import, or finance your dream vehicle, our team is here to help.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {contactCards.map(({ Icon, title, lines }) => (
                <Card key={title} className="rounded-2xl border-border p-6">
                  <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-brand text-white">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="font-sans text-base font-semibold text-foreground">{title}</h3>
                  {lines.map((l) => (
                    <p key={l} className="text-sm text-muted-foreground">{l}</p>
                  ))}
                </Card>
              ))}
            </div>
          </div>

          {/* Form */}
          <Card className="rounded-2xl border-border p-8">
            <h2 className="font-display text-3xl font-bold text-foreground">Send Us a Message</h2>
            {isSubmitted ? (
              <div className="py-10 text-center">
                <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <CheckCircle2 className="size-8" />
                </div>
                <h3 className="font-display text-2xl font-semibold text-foreground">Message Sent!</h3>
                <p className="mt-2 text-muted-foreground">Thank you for reaching out. We'll get back to you shortly.</p>
                <div className="mt-6">
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <Button className="gap-2 bg-[#25D366] text-white hover:bg-[#20BA5A]">
                      <MessageCircle className="size-4" /> Chat on WhatsApp
                    </Button>
                  </a>
                </div>
                <Button variant="ghost" className="mt-3" onClick={() => setIsSubmitted(false)}>
                  Send another message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                {error && (
                  <div role="alert" className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input id="name" name="name" required value={formData.name} onChange={handleChange} placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="john@example.com" />
                  </div>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="+234 812 345 6789" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input id="subject" name="subject" required value={formData.subject} onChange={handleChange} placeholder="How can we help?" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea id="message" name="message" required rows={5} value={formData.message} onChange={handleChange} placeholder="Tell us more about your inquiry…" />
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full gap-2 bg-brand hover:bg-brand-strong">
                  {isSubmitting ? <><Spinner size={16} className="text-white" /> Sending…</> : <><Send className="size-4" /> Send Message</>}
                </Button>

                <div className="relative py-1 text-center">
                  <span className="bg-card px-3 text-sm text-muted-foreground">or</span>
                  <div className="absolute inset-x-0 top-1/2 -z-10 border-t border-border" />
                </div>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="block">
                  <Button type="button" className="w-full gap-2 bg-[#25D366] text-white hover:bg-[#20BA5A]">
                    <MessageCircle className="size-4" /> Chat on WhatsApp
                  </Button>
                </a>
              </form>
            )}
          </Card>
        </div>
      </section>

      {/* Map */}
      <section className="bg-obsidian-soft py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-8 text-center">
            <h2 className="font-display text-3xl font-bold text-white">Visit Our Showroom</h2>
          </Reveal>
          <div className="overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
            <iframe
              title="Platinum Helms showroom location"
              src="https://www.google.com/maps?q=Victoria%20Island%20Lagos&output=embed"
              className="h-96 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

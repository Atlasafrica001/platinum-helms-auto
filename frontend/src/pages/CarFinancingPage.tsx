import { useState } from "react";
import { ImageWithFallback } from "../components/ImageWithFallback";
import { Reveal } from "../components/motion/Reveal";
import { Button } from "../components/button";
import { Card } from "../components/card";
import { Input } from "../components/input";
import { Label } from "../components/label";
import { Slider } from "../components/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/select";
import { Calculator, CreditCard, FileText, CheckCircle2, TrendingDown } from "lucide-react";
import { FinancialApplicationForm } from "../components/FinancialApplicationForm";
import { FinancingEligibilityForm } from "../components/FinancingEligibilityForm";
import { formatCurrency } from "@/lib/adminUtils";

interface CarFinancingPageProps {
  onNavigate: (page: string) => void;
}

const financingOptions = [
  { icon: CreditCard, title: "Standard Financing", rate: "From 4.5% APR", term: "Up to 72 months", description: "Traditional auto loan with competitive rates and flexible terms.", features: ["No prepayment penalties", "Fixed interest rates", "Quick approval process"] },
  { icon: TrendingDown, title: "Lease Programs", rate: "Low monthly payments", term: "24, 36, or 48 months", description: "Drive a new luxury vehicle every few years with lower monthly costs.", features: ["Lower monthly payments", "Warranty coverage included", "Option to purchase at end"] },
  { icon: FileText, title: "Cash Purchase", rate: "No interest", term: "Immediate ownership", description: "Own your vehicle outright with no monthly payments or interest.", features: ["Exclusive cash discounts", "Full ownership immediately", "No credit check required"] },
];

const steps = [
  { number: "01", title: "Pre-Qualification", description: "Get pre-qualified in minutes without impacting your credit score." },
  { number: "02", title: "Choose Your Vehicle", description: "Select your dream vehicle from our luxury inventory." },
  { number: "03", title: "Finalize Terms", description: "Review and customize your financing terms with our specialists." },
  { number: "04", title: "Drive Away", description: "Complete paperwork and take delivery of your new vehicle." },
];

const faqs = [
  { q: "What credit score do I need?", a: "We work with a range of credit profiles. Higher scores typically qualify for better rates, but we have programs for various situations." },
  { q: "Can I trade in my current vehicle?", a: "Yes — we accept trade-ins and can apply the value toward your down payment. Get an instant estimate from our specialists." },
  { q: "How long does approval take?", a: "Pre-qualification takes minutes online. Full approval typically takes 24–48 hours with all required documentation." },
  { q: "Are there any hidden fees?", a: "We believe in transparent pricing. All fees are disclosed upfront with no surprises before finalizing." },
];

export function CarFinancingPage({ onNavigate }: CarFinancingPageProps) {
  const [vehiclePrice, setVehiclePrice] = useState(250000000);
  const [downPayment, setDownPayment] = useState(1000000);
  const [loanTerm, setLoanTerm] = useState(60);
  const interestRate = 4.5;
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  const [isEligibilityFormOpen, setIsEligibilityFormOpen] = useState(false);

  const principal = vehiclePrice - downPayment;
  const monthlyRate = interestRate / 100 / 12;
  const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / (Math.pow(1 + monthlyRate, loanTerm) - 1);
  const totalAmount = monthlyPayment * loanTerm;
  const totalInterest = totalAmount - principal;

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative flex h-[420px] items-center overflow-hidden bg-obsidian">
        <div className="absolute inset-0">
          <ImageWithFallback src="https://images.unsplash.com/photo-1574023240744-64c47c8c0676?auto=format&fit=crop&q=80&w=1600" alt="Financing" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/80 to-obsidian/40" />
        </div>
        <div className="relative mx-auto w-full max-w-7xl px-4 pt-20 sm:px-6 lg:px-8">
          <Reveal className="max-w-2xl">
            <h1 className="font-display text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl">Flexible Financing Solutions</h1>
            <p className="mt-5 max-w-xl text-lg text-white/75">Make your luxury vehicle dreams a reality with tailored financing options and competitive rates.</p>
          </Reveal>
        </div>
      </section>

      {/* Calculator */}
      <section className="bg-background py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-12 text-center">
            <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-brand text-white"><Calculator size={28} /></div>
            <h2 className="font-display text-4xl font-bold text-foreground sm:text-5xl">Finance Calculator</h2>
            <p className="mt-3 text-lg text-muted-foreground">Estimate your monthly payments and explore different scenarios.</p>
          </Reveal>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <Card className="rounded-2xl border-border p-8 shadow-sm">
              <div className="space-y-8">
                <div>
                  <div className="mb-3 flex justify-between"><Label className="text-sm">Vehicle Price</Label><span className="text-sm font-medium">{formatCurrency(vehiclePrice)}</span></div>
                  <Slider value={[vehiclePrice]} onValueChange={(v) => setVehiclePrice(v[0])} min={5000000} max={250000000} step={500000} />
                  <div className="mt-2 flex justify-between text-xs text-muted-foreground"><span>{formatCurrency(5000000)}</span><span>{formatCurrency(250000000)}</span></div>
                </div>
                <div>
                  <div className="mb-3 flex justify-between"><Label className="text-sm">Down Payment ({((downPayment / vehiclePrice) * 100).toFixed(0)}%)</Label><span className="text-sm font-medium">{formatCurrency(downPayment)}</span></div>
                  <Slider value={[downPayment]} onValueChange={(v) => setDownPayment(v[0])} min={1000000} max={vehiclePrice * 0.5} step={500000} />
                  <div className="mt-2 flex justify-between text-xs text-muted-foreground"><span>{formatCurrency(1000000)}</span><span>{formatCurrency(vehiclePrice * 0.5)}</span></div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Loan Term</Label>
                  <Select value={loanTerm.toString()} onValueChange={(v) => setLoanTerm(parseInt(v))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[36, 48, 60, 72].map((m) => <SelectItem key={m} value={m.toString()}>{m} months ({m / 12} years)</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Interest Rate (APR)</Label>
                  <Input value={`${interestRate}%`} disabled />
                  <p className="text-xs text-muted-foreground">Estimated rate — actual rate may vary based on credit.</p>
                </div>
              </div>
            </Card>

            <div className="space-y-6">
              <Card className="rounded-2xl border-none bg-gradient-to-br from-obsidian to-slate-deep p-8 text-white">
                <h3 className="font-sans text-base text-white/70">Estimated Monthly Payment</h3>
                <div className="mt-4 font-display text-5xl font-bold text-brand">
                  {formatCurrency(monthlyPayment)}<span className="font-sans text-xl text-white/50">/mo</span>
                </div>
                <div className="mt-8 space-y-3">
                  <Button onClick={() => setIsEligibilityFormOpen(true)} size="lg" className="w-full bg-brand hover:bg-brand-strong">Check Eligibility</Button>
                  <Button onClick={() => setIsApplicationOpen(true)} size="lg" variant="outline" className="w-full border-white/30 bg-white/5 text-white hover:bg-white/15 hover:text-white">Full Application</Button>
                </div>
              </Card>

              <Card className="rounded-2xl border-border p-8">
                <h3 className="font-display text-2xl font-semibold text-foreground">Loan Summary</h3>
                <div className="mt-4">
                  {[
                    ["Vehicle Price", formatCurrency(vehiclePrice)],
                    ["Down Payment", formatCurrency(downPayment)],
                    ["Amount Financed", formatCurrency(principal)],
                    ["Loan Term", `${loanTerm} months`],
                    ["Interest Rate", `${interestRate}% APR`],
                    ["Total Interest", formatCurrency(totalInterest)],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b border-border py-3 text-sm">
                      <span className="text-muted-foreground">{k}</span><span className="font-medium text-foreground">{v}</span>
                    </div>
                  ))}
                  <div className="flex justify-between py-3"><span className="font-semibold text-foreground">Total Amount</span><span className="font-semibold text-brand">{formatCurrency(totalAmount)}</span></div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Options */}
      <section className="bg-obsidian-soft py-24 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="font-display text-4xl font-bold sm:text-5xl">Choose Your Financing Path</h2>
            <p className="mt-3 text-lg text-white/65">Select the option that best fits your lifestyle and budget.</p>
          </Reveal>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {financingOptions.map(({ icon: Icon, title, rate, term, description, features }, i) => (
              <Reveal key={title} delay={i * 0.08}>
                <Card className="glass-dark flex h-full flex-col rounded-2xl border-white/10 p-8 text-white">
                  <div className="mb-6 flex size-14 items-center justify-center rounded-xl bg-brand text-white"><Icon size={24} /></div>
                  <h3 className="font-display text-2xl font-semibold">{title}</h3>
                  <div className="mt-2 flex items-center gap-3 text-sm text-white/60"><span className="text-brand">{rate}</span><span>•</span><span>{term}</span></div>
                  <p className="mt-4 text-sm text-white/70">{description}</p>
                  <ul className="mt-6 flex-1 space-y-3">
                    {features.map((f) => (
                      <li key={f} className="flex items-start text-sm text-white/70"><CheckCircle2 size={16} className="mr-2 mt-0.5 shrink-0 text-brand" />{f}</li>
                    ))}
                  </ul>
                  <Button variant="outline" className="mt-6 w-full border-white/30 bg-white/5 text-white hover:bg-white/15 hover:text-white" onClick={() => onNavigate("contact")}>Learn More</Button>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="bg-background py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="font-display text-4xl font-bold text-foreground sm:text-5xl">Simple Financing Process</h2>
            <p className="mt-3 text-lg text-muted-foreground">Get approved and drive your dream vehicle in four easy steps.</p>
          </Reveal>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <Reveal key={step.number} delay={i * 0.08} className="text-center">
                <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-strong font-display text-2xl font-bold text-white">{step.number}</div>
                <h3 className="font-display text-xl font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
              </Reveal>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button onClick={() => setIsApplicationOpen(true)} size="lg" className="bg-brand px-8 shadow-luxe hover:bg-brand-strong">Get Pre-Qualified Now</Button>
            <p className="mt-4 text-sm text-muted-foreground">Won't affect your credit score • Takes less than 2 minutes</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-obsidian-soft py-24 text-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-12 text-center">
            <h2 className="font-display text-4xl font-bold sm:text-5xl">Frequently Asked Questions</h2>
          </Reveal>
          <div className="space-y-4">
            {faqs.map((f, i) => (
              <Reveal key={f.q} delay={i * 0.05}>
                <Card className="glass-dark rounded-2xl border-white/10 p-6 text-white">
                  <h3 className="font-sans text-base font-semibold">{f.q}</h3>
                  <p className="mt-2 text-sm text-white/65">{f.a}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-obsidian py-16 text-center text-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-4xl font-bold sm:text-5xl">Ready to Get Started?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/70">Our financing specialists are here to help you find the perfect solution.</p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button onClick={() => setIsEligibilityFormOpen(true)} size="lg" className="bg-brand px-8 shadow-luxe hover:bg-brand-strong">Check Eligibility</Button>
            <Button onClick={() => onNavigate("purchase")} size="lg" variant="outline" className="border-white/30 bg-white/5 px-8 text-white hover:bg-white/15 hover:text-white">Browse Vehicles</Button>
          </div>
        </div>
      </section>

      <FinancingEligibilityForm isOpen={isEligibilityFormOpen} onClose={() => setIsEligibilityFormOpen(false)} />
      <FinancialApplicationForm isOpen={isApplicationOpen} onClose={() => setIsApplicationOpen(false)} vehiclePrice={vehiclePrice} />
    </div>
  );
}

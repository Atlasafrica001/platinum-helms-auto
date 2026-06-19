import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { Loader2, Lock, Mail, AlertTriangle, ShieldCheck } from "lucide-react";

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAdminAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (isAuthenticated) navigate("/admin");
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      navigate("/admin");
    } catch (err: any) {
      setError(err.message || "Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-obsidian px-4">
      {/* Background glow blobs */}
      <div className="pointer-events-none absolute -left-40 -top-40 size-[600px] rounded-full bg-brand/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 size-[500px] rounded-full bg-brand/5 blur-[100px]" />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-deep/60 shadow-luxe backdrop-blur-xl">
          {/* Top accent bar */}
          <div className="h-1 w-full bg-gradient-to-r from-brand via-brand/60 to-transparent" />

          <div className="px-8 py-10">
            {/* Icon + Brand */}
            <div className="mb-8 flex flex-col items-center">
              <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-brand/15 ring-1 ring-brand/30">
                <ShieldCheck size={28} className="text-brand" />
              </div>
              <p className="font-display text-2xl font-bold tracking-tight text-white">
                Platinum Helms
              </p>
              <span className="mt-1.5 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-widest text-white/50">
                Admin Portal
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="flex items-start gap-3 rounded-xl border border-brand/30 bg-brand/10 px-4 py-3 text-sm text-brand">
                  <AlertTriangle size={15} className="mt-0.5 shrink-0" />
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-sm text-white/70">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="admin@platinumhelms.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-white/10 bg-white/5 pl-10 text-white placeholder:text-white/25 focus-visible:ring-brand/50"
                    disabled={isLoading}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password" className="text-sm text-white/70">
                  Password
                </Label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-white/10 bg-white/5 pl-10 text-white placeholder:text-white/25 focus-visible:ring-brand/50"
                    disabled={isLoading}
                    autoComplete="current-password"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="mt-2 w-full bg-brand hover:bg-brand-strong"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

          </div>
        </div>

        <p className="mt-6 text-center text-xs text-white/25">
          © {new Date().getFullYear()} Platinum Helms Autos. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;

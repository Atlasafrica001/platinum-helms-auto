import { useState } from "react";
import api from "@/lib/api";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { AlertTriangle, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";

export default function AdminSettingsPage() {
  const { user, refreshUser } = useAdminAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const changePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");
    setError("");

    try {
      await api.admin.changePassword(currentPassword, newPassword, confirmPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setMessage("Password updated successfully.");
      await refreshUser();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to change password");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">Admin Settings</h1>
        <p className="text-sm text-gray-500">Manage your dashboard account and security settings.</p>
      </div>

      {message && (
        <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <CheckCircle2 size={15} className="mt-0.5 shrink-0" /> {message}
        </div>
      )}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertTriangle size={15} className="mt-0.5 shrink-0" /> {error}
        </div>
      )}

      {/* Current admin card */}
      <Card className="border-none p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand/10">
            <ShieldCheck size={22} className="text-brand" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Current Admin</h2>
            <p className="mt-0.5 text-sm text-gray-700">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <span className="mt-1.5 inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-xs font-medium capitalize text-gray-600">
              {user?.role}
            </span>
          </div>
        </div>
      </Card>

      {/* Change password card */}
      <Card className="border-none p-6 shadow-sm">
        <h2 className="mb-5 font-semibold text-gray-900">Change Password</h2>
        <form onSubmit={changePassword} className="space-y-4">
          <div className="space-y-2">
            <Label>Current Password</Label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>New Password</Label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Confirm New Password</Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={isSaving} className="bg-brand hover:bg-brand-strong text-white">
            {isSaving && <Loader2 size={14} className="mr-2 animate-spin" />}
            Save Password
          </Button>
        </form>
      </Card>
    </div>
  );
}

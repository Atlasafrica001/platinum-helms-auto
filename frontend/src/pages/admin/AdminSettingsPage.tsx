import { useState } from "react";
import api from "@/lib/api";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { Loader2, ShieldCheck } from "lucide-react";

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
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Settings</h1>
        <p className="text-gray-600">Manage your dashboard account and security settings.</p>
      </div>

      {message && <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{message}</div>}
      {error && <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <Card className="p-6 border-none shadow-sm">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-lg bg-red-50 flex items-center justify-center">
            <ShieldCheck className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Current Admin</h2>
            <p className="text-sm text-gray-600">{user?.firstName} {user?.lastName}</p>
            <p className="text-sm text-gray-600">{user?.email}</p>
            <p className="text-sm text-gray-500">Role: {user?.role}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6 border-none shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Change Password</h2>
        <form onSubmit={changePassword} className="space-y-4">
          <div className="space-y-2">
            <Label>Current Password</Label>
            <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>New Password</Label>
            <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Confirm New Password</Label>
            <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>
          <Button type="submit" disabled={isSaving} className="bg-red-600 hover:bg-red-700 text-white">
            {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Save Password
          </Button>
        </form>
      </Card>
    </div>
  );
}

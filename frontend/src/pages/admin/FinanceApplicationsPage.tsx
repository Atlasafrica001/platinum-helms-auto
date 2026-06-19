import { useEffect, useState } from "react";
import api from "@/lib/api";
import { downloadCsv, formatCurrency, formatDate, labelStatus } from "@/lib/adminUtils";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { Input } from "@/components/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/table";
import { AlertTriangle, CheckCircle, Download, Loader2, XCircle } from "lucide-react";

type FinancingLead = {
  id: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  employmentStatus?: string;
  employer?: string;
  jobTitle?: string;
  monthlyIncome?: string;
  annualIncome?: string;
  preferredRepaymentDuration?: string;
  initialDepositBudget?: number | string | null;
  additionalNotes?: string;
  status?: string;
  submissionDate?: string;
  selectedCar?: { name?: string; brand?: string; model?: string } | null;
};

const statusVariant: Record<string, string> = {
  approved: "bg-green-100 text-green-800 border-green-200",
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  rejected: "bg-red-100 text-red-700 border-red-200",
  contacted: "bg-blue-100 text-blue-800 border-blue-200",
};

function StatusBadge({ status }: { status?: string }) {
  const cls = statusVariant[(status || "").toLowerCase()] || "bg-gray-100 text-gray-600 border-gray-200";
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${cls}`}>
      {labelStatus(status)}
    </span>
  );
}

export default function FinanceApplicationsPage() {
  const [applications, setApplications] = useState<FinancingLead[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const loadApplications = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await api.leads.getAll({ type: "financing", limit: 100, search });
      setApplications(response.data?.financing?.leads || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load applications");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeout = window.setTimeout(loadApplications, 250);
    return () => window.clearTimeout(timeout);
  }, [search]);

  const updateStatus = async (id: number, status: string) => {
    setActionId(`${id}-${status}`);
    try {
      await api.leads.updateStatus("financing", id, status);
      await loadApplications();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update status");
    } finally {
      setActionId(null);
    }
  };

  const exportApplications = () => {
    downloadCsv(
      "finance-applications.csv",
      applications.map((a) => ({
        id: a.id,
        name: `${a.firstName || ""} ${a.lastName || ""}`.trim(),
        email: a.email,
        phone: a.phone,
        selectedCar: a.selectedCar?.name,
        employmentStatus: a.employmentStatus,
        employer: a.employer,
        jobTitle: a.jobTitle,
        monthlyIncome: a.monthlyIncome,
        annualIncome: a.annualIncome,
        repaymentDuration: a.preferredRepaymentDuration,
        initialDepositBudget: a.initialDepositBudget,
        status: a.status,
        submissionDate: a.submissionDate,
        additionalNotes: a.additionalNotes,
      })),
    );
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Finance Applications</h1>
          <p className="text-sm text-gray-500">Review financing leads submitted from the public site.</p>
        </div>
        <Button onClick={exportApplications} className="bg-brand hover:bg-brand-strong text-white">
          <Download size={15} className="mr-1.5" /> Export Applications
        </Button>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertTriangle size={15} className="mt-0.5 shrink-0" /> {error}
        </div>
      )}

      <Card className="overflow-hidden border-none shadow-sm">
        <div className="border-b border-gray-100 p-5">
          <Input
            className="md:max-w-sm"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="font-semibold">Applicant</TableHead>
                <TableHead className="font-semibold">Vehicle</TableHead>
                <TableHead className="font-semibold">Employment</TableHead>
                <TableHead className="font-semibold">Financials</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center">
                    <Loader2 size={20} className="mx-auto animate-spin text-gray-400" />
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && applications.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">
                    No finance applications found.
                  </TableCell>
                </TableRow>
              )}
              {applications.map((app) => (
                <TableRow key={app.id} className="hover:bg-gray-50/50">
                  <TableCell>
                    <div className="font-medium text-gray-900">
                      {`${app.firstName || ""} ${app.lastName || ""}`.trim() || "Unnamed applicant"}
                    </div>
                    <div className="text-sm text-gray-500">{app.email}</div>
                    <div className="text-sm text-gray-500">{app.phone}</div>
                  </TableCell>
                  <TableCell className="text-gray-700">
                    {app.selectedCar?.name ||
                      `${app.selectedCar?.brand || ""} ${app.selectedCar?.model || ""}`.trim() ||
                      "N/A"}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    <div>{labelStatus(app.employmentStatus)}</div>
                    <div>{app.employer || "N/A"}</div>
                    <div>{app.jobTitle || "N/A"}</div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    <div>Monthly: {app.monthlyIncome || "N/A"}</div>
                    <div>Annual: {app.annualIncome || "N/A"}</div>
                    <div>Deposit: {formatCurrency(app.initialDepositBudget)}</div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={app.status} />
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">{formatDate(app.submissionDate)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateStatus(app.id, "approved")}
                        disabled={actionId === `${app.id}-approved`}
                        title="Approve"
                      >
                        {actionId === `${app.id}-approved` ? (
                          <Loader2 size={15} className="animate-spin" />
                        ) : (
                          <CheckCircle size={15} className="text-green-600" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateStatus(app.id, "rejected")}
                        disabled={actionId === `${app.id}-rejected`}
                        title="Reject"
                      >
                        {actionId === `${app.id}-rejected` ? (
                          <Loader2 size={15} className="animate-spin" />
                        ) : (
                          <XCircle size={15} className="text-red-500" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { downloadCsv, formatCurrency, formatDate, labelStatus } from "@/lib/adminUtils";
import { Badge } from "@/components/badge";
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
import { CheckCircle, Download, Loader2, XCircle } from "lucide-react";

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
      applications.map((application) => ({
        id: application.id,
        name: `${application.firstName || ""} ${application.lastName || ""}`.trim(),
        email: application.email,
        phone: application.phone,
        selectedCar: application.selectedCar?.name,
        employmentStatus: application.employmentStatus,
        employer: application.employer,
        jobTitle: application.jobTitle,
        monthlyIncome: application.monthlyIncome,
        annualIncome: application.annualIncome,
        repaymentDuration: application.preferredRepaymentDuration,
        initialDepositBudget: application.initialDepositBudget,
        status: application.status,
        submissionDate: application.submissionDate,
        additionalNotes: application.additionalNotes,
      })),
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Finance Applications</h1>
          <p className="text-gray-600">Review financing leads submitted from the public site.</p>
        </div>
        <Button onClick={exportApplications} className="bg-red-600 hover:bg-red-700 text-white">
          <Download className="w-4 h-4 mr-2" />
          Export Applications
        </Button>
      </div>

      {error && <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <Card className="border-none shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <Input className="md:max-w-sm" placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Employment</TableHead>
                <TableHead>Financials</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && <TableRow><TableCell colSpan={7} className="py-10 text-center text-gray-500">Loading applications...</TableCell></TableRow>}
              {!isLoading && applications.length === 0 && <TableRow><TableCell colSpan={7} className="py-10 text-center text-gray-500">No finance applications found.</TableCell></TableRow>}
              {applications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell>
                    <div className="font-medium">{`${application.firstName || ""} ${application.lastName || ""}`.trim() || "Unnamed applicant"}</div>
                    <div className="text-sm text-gray-600">{application.email}</div>
                    <div className="text-sm text-gray-600">{application.phone}</div>
                  </TableCell>
                  <TableCell>{application.selectedCar?.name || `${application.selectedCar?.brand || ""} ${application.selectedCar?.model || ""}`.trim() || "N/A"}</TableCell>
                  <TableCell className="text-sm text-gray-600">
                    <div>{labelStatus(application.employmentStatus)}</div>
                    <div>{application.employer || "N/A"}</div>
                    <div>{application.jobTitle || "N/A"}</div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    <div>Monthly: {application.monthlyIncome || "N/A"}</div>
                    <div>Annual: {application.annualIncome || "N/A"}</div>
                    <div>Deposit: {formatCurrency(application.initialDepositBudget)}</div>
                  </TableCell>
                  <TableCell><Badge>{labelStatus(application.status)}</Badge></TableCell>
                  <TableCell>{formatDate(application.submissionDate)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => updateStatus(application.id, "approved")} disabled={actionId === `${application.id}-approved`}>
                        {actionId === `${application.id}-approved` ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4 text-green-600" />}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => updateStatus(application.id, "rejected")} disabled={actionId === `${application.id}-rejected`}>
                        {actionId === `${application.id}-rejected` ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4 text-red-600" />}
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

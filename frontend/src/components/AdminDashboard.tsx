import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "@/lib/api";
import { Button } from "../components/button";
import { Input } from "../components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/tabs";
import {
  Car,
  FileText,
  MessageSquare,
  DollarSign,
  Package,
  Search,
  Download,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";

type DashboardOverview = {
  totalCars: number;
  activeCars: number;
  soldCars: number;
  totalLeads: number;
  totalFinancingLeads: number;
  pendingFinancingLeads: number;
  approvedFinancingLeads: number;
  totalImportationLeads: number;
  pendingImportationLeads: number;
  totalContactMessages: number;
  newContactMessages: number;
};

type Vehicle = {
  id: number;
  name?: string;
  brand?: string;
  make?: string;
  model?: string;
  year?: number;
  vin?: string | null;
  price?: number;
  status?: string;
};

type FinancingLead = {
  id: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  status?: string;
  submissionDate?: string;
  initialDepositBudget?: number | string | null;
  employmentStatus?: string;
  selectedCar?: { name?: string; brand?: string; model?: string } | null;
};

type ContactMessage = {
  id: number;
  name?: string;
  email?: string;
  phone?: string | null;
  subject?: string;
  message?: string;
  status?: string;
  createdAt?: string;
};

type DetailState =
  | { type: "vehicle"; data: Vehicle }
  | { type: "application"; data: FinancingLead }
  | { type: "contact"; data: ContactMessage }
  | null;

const emptyOverview: DashboardOverview = {
  totalCars: 0,
  activeCars: 0,
  soldCars: 0,
  totalLeads: 0,
  totalFinancingLeads: 0,
  pendingFinancingLeads: 0,
  approvedFinancingLeads: 0,
  totalImportationLeads: 0,
  pendingImportationLeads: 0,
  totalContactMessages: 0,
  newContactMessages: 0,
};

const formatCurrency = (value?: number | string | null) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const formatDate = (value?: string) => {
  if (!value) return "N/A";
  return new Intl.DateTimeFormat("en-NG", { year: "numeric", month: "short", day: "numeric" }).format(
    new Date(value),
  );
};

const labelStatus = (status?: string) => {
  if (!status) return "Unknown";
  return status
    .split(/[_\s-]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

const errMsg = (reason: unknown) =>
  reason instanceof Error ? reason.message : "Request failed";

const downloadCsv = (fileName: string, rows: Record<string, unknown>[]) => {
  if (rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const escapeCell = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`;
  const csv = [
    headers.join(","),
    ...rows.map((row) => headers.map((h) => escapeCell(row[h])).join(",")),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
};

const statusVariant: Record<string, string> = {
  available: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  reserved: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  sold: "bg-blue-500/15 text-blue-400 border-blue-500/25",
  hidden: "bg-white/10 text-white/40 border-white/15",
  approved: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  contacted: "bg-blue-500/15 text-blue-400 border-blue-500/25",
  pending: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  rejected: "bg-red-500/15 text-red-400 border-red-500/25",
  closed: "bg-white/10 text-white/40 border-white/15",
  new: "bg-blue-500/15 text-blue-400 border-blue-500/25",
  responded: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
};

function StatusBadge({ status }: { status?: string }) {
  const cls = statusVariant[(status || "").toLowerCase()] || "bg-white/10 text-white/40 border-white/15";
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${cls}`}>
      {labelStatus(status)}
    </span>
  );
}

const cell =
  "bg-white/[0.035] px-4 py-3.5 align-middle transition-colors first:rounded-l-xl last:rounded-r-xl group-hover:bg-white/[0.055]";
const th =
  "px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-white/25";
const iconBtn =
  "flex size-8 items-center justify-center rounded-lg transition hover:bg-white/[0.08] disabled:opacity-50";

const STATUS_FILTERS: Record<string, { value: string; label: string }[]> = {
  vehicles: [
    { value: "all", label: "All statuses" },
    { value: "available", label: "Available" },
    { value: "reserved", label: "Reserved" },
    { value: "sold", label: "Sold" },
    { value: "hidden", label: "Hidden" },
  ],
  applications: [
    { value: "all", label: "All statuses" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
    { value: "contacted", label: "Contacted" },
  ],
  contacts: [
    { value: "all", label: "All statuses" },
    { value: "new", label: "New" },
    { value: "responded", label: "Responded" },
    { value: "closed", label: "Closed" },
  ],
};

export function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("vehicles");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [overview, setOverview] = useState<DashboardOverview>(emptyOverview);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [applications, setApplications] = useState<FinancingLead[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  // Per-section errors — one failing endpoint no longer blanks the whole board.
  const [statsError, setStatsError] = useState("");
  const [vehiclesError, setVehiclesError] = useState("");
  const [leadsError, setLeadsError] = useState("");
  const [detail, setDetail] = useState<DetailState>(null);

  const loadDashboard = async (query = searchTerm, showRefreshing = false) => {
    if (showRefreshing) setIsRefreshing(true);
    else setIsLoading(true);

    const filters = query.trim() ? { search: query.trim(), limit: 20 } : { limit: 20 };
    const [statsR, carsR, leadsR] = await Promise.allSettled([
      api.stats.getDashboard(),
      api.cars.getAllAdmin(filters),
      api.leads.getAll(filters),
    ]);

    if (statsR.status === "fulfilled") {
      setOverview(statsR.value.data?.overview || emptyOverview);
      setStatsError("");
    } else {
      setStatsError(errMsg(statsR.reason));
    }

    if (carsR.status === "fulfilled") {
      setVehicles(carsR.value.data || []);
      setVehiclesError("");
    } else {
      setVehiclesError(errMsg(carsR.reason));
    }

    if (leadsR.status === "fulfilled") {
      setApplications(leadsR.value.data?.financing?.leads || []);
      setContacts(leadsR.value.data?.contact?.messages || []);
      setLeadsError("");
    } else {
      setLeadsError(errMsg(leadsR.reason));
    }

    setIsLoading(false);
    setIsRefreshing(false);
  };

  useEffect(() => {
    loadDashboard("");
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => loadDashboard(searchTerm, true), 350);
    return () => window.clearTimeout(timeout);
  }, [searchTerm]);

  // Reset the status filter when switching tabs (options differ per tab).
  useEffect(() => {
    setStatusFilter("all");
  }, [activeTab]);

  const totalInventoryValue = useMemo(
    () => vehicles.reduce((total, v) => total + Number(v.price || 0), 0),
    [vehicles],
  );

  const filteredVehicles = useMemo(
    () => (statusFilter === "all" ? vehicles : vehicles.filter((v) => v.status === statusFilter)),
    [vehicles, statusFilter],
  );
  const filteredApplications = useMemo(
    () => (statusFilter === "all" ? applications : applications.filter((a) => a.status === statusFilter)),
    [applications, statusFilter],
  );
  const filteredContacts = useMemo(
    () => (statusFilter === "all" ? contacts : contacts.filter((c) => c.status === statusFilter)),
    [contacts, statusFilter],
  );

  const deleteVehicle = (id: number) => {
    toast("Delete this vehicle?", {
      description: "This will permanently remove it from inventory.",
      action: { label: "Delete", onClick: () => doDeleteVehicle(id) },
      cancel: { label: "Cancel", onClick: () => {} },
      duration: 8000,
    });
  };

  const doDeleteVehicle = async (id: number) => {
    setActionId(`vehicle-${id}`);
    try {
      await api.cars.delete(id);
      await loadDashboard(searchTerm, true);
      toast.success("Vehicle deleted.");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Unable to delete vehicle");
    } finally {
      setActionId(null);
    }
  };

  const updateApplicationStatus = async (id: number, status: string) => {
    setActionId(`application-${id}-${status}`);
    try {
      await api.leads.updateStatus("financing", id, status);
      await loadDashboard(searchTerm, true);
      toast.success(`Application ${status}.`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Unable to update application");
    } finally {
      setActionId(null);
    }
  };

  const markContactResponded = async (id: number) => {
    setActionId(`contact-${id}-responded`);
    try {
      await api.leads.updateStatus("contact", id, "responded");
      await loadDashboard(searchTerm, true);
      toast.success("Marked as responded.");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Unable to update contact");
    } finally {
      setActionId(null);
    }
  };

  const deleteContact = (id: number) => {
    toast("Delete this contact message?", {
      description: "This action cannot be undone.",
      action: { label: "Delete", onClick: () => doDeleteContact(id) },
      cancel: { label: "Cancel", onClick: () => {} },
      duration: 8000,
    });
  };

  const doDeleteContact = async (id: number) => {
    setActionId(`contact-${id}`);
    try {
      await api.leads.delete("contact", id);
      await loadDashboard(searchTerm, true);
      toast.success("Contact deleted.");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Unable to delete contact");
    } finally {
      setActionId(null);
    }
  };

  const exportCurrentTab = () => {
    if (activeTab === "vehicles") {
      downloadCsv(
        "vehicles.csv",
        filteredVehicles.map((v) => ({
          id: v.id,
          vehicle: v.name || `${v.brand || v.make || ""} ${v.model || ""}`.trim(),
          year: v.year,
          vin: v.vin,
          price: v.price,
          status: v.status,
        })),
      );
      return;
    }
    if (activeTab === "applications") {
      downloadCsv(
        "finance-applications.csv",
        filteredApplications.map((a) => ({
          id: a.id,
          name: `${a.firstName || ""} ${a.lastName || ""}`.trim(),
          email: a.email,
          vehicle: a.selectedCar?.name || "N/A",
          depositBudget: a.initialDepositBudget,
          status: a.status,
          date: a.submissionDate,
        })),
      );
      return;
    }
    downloadCsv(
      "contacts.csv",
      filteredContacts.map((c) => ({
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        subject: c.subject,
        status: c.status,
        date: c.createdAt,
      })),
    );
  };

  const SectionError = ({ message }: { message: string }) =>
    message ? (
      <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
        <span className="flex items-start gap-2">
          <AlertTriangle size={15} className="mt-0.5 shrink-0" /> {message}
        </span>
        <button
          onClick={() => loadDashboard(searchTerm, true)}
          className="shrink-0 rounded-lg border border-red-500/30 px-2.5 py-1 text-xs font-medium text-red-300 transition hover:bg-red-500/10"
        >
          Retry
        </button>
      </div>
    ) : null;

  const FilterToolbar = ({ placeholder }: { placeholder: string }) => (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
        <Input
          placeholder={placeholder}
          className="border-white/[0.12] bg-white/[0.05] pl-9 text-white placeholder:text-white/30"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="border-white/[0.12] bg-white/[0.05] text-white sm:w-44">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {STATUS_FILTERS[activeTab].map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  const statCards = [
    {
      icon: Car,
      iconBg: "bg-blue-500/15",
      iconColor: "text-blue-400",
      value: overview.totalCars,
      label: "Total Vehicles",
      sub: `${overview.activeCars} active listings`,
    },
    {
      icon: FileText,
      iconBg: "bg-emerald-500/15",
      iconColor: "text-emerald-400",
      value: overview.totalFinancingLeads,
      label: "Finance Applications",
      sub: `${overview.pendingFinancingLeads} pending review`,
    },
    {
      icon: MessageSquare,
      iconBg: "bg-purple-500/15",
      iconColor: "text-purple-400",
      value: overview.totalContactMessages,
      label: "Contact Messages",
      sub: `${overview.newContactMessages} new`,
    },
    {
      icon: DollarSign,
      iconBg: "bg-brand/15",
      iconColor: "text-brand",
      value: formatCurrency(totalInventoryValue),
      label: "Inventory Value",
      sub: `${overview.soldCars} vehicles sold`,
    },
  ];

  return (
    <div className="min-h-screen bg-obsidian">
      {/* Sub-header */}
      <div className="border-b border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-bold text-white">Dashboard</h1>
              <p className="text-sm text-white/50">Manage your automotive business operations</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadDashboard(searchTerm, true)}
                disabled={isRefreshing}
                className="border-white/[0.12] bg-white/[0.04] text-white/70 hover:bg-white/[0.08] hover:text-white"
              >
                {isRefreshing ? (
                  <Loader2 size={14} className="mr-1.5 animate-spin" />
                ) : (
                  <RefreshCw size={14} className="mr-1.5" />
                )}
                Refresh
              </Button>
              <Button size="sm" className="bg-brand hover:bg-brand-strong text-white" onClick={exportCurrentTab}>
                <Download size={14} className="mr-1.5" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {statsError && <SectionError message={`Stats: ${statsError}`} />}

        {/* Stat cards */}
        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map(({ icon: Icon, iconBg, iconColor, value, label, sub }) => (
            <div key={label} className="rounded-2xl border border-white/[0.08] bg-obsidian-soft p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className={`flex size-11 items-center justify-center rounded-xl ${iconBg}`}>
                  <Icon size={20} className={iconColor} />
                </div>
              </div>
              <p className="mb-0.5 font-display text-2xl font-bold text-white">
                {isLoading ? <Loader2 size={20} className="animate-spin text-white/30" /> : value}
              </p>
              <p className="text-sm text-white/60">{label}</p>
              <p className="mt-1.5 text-xs font-medium text-white/40">{sub}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-5">
          <TabsList className="border border-white/[0.08] bg-white/[0.04]">
            <TabsTrigger value="vehicles" className="text-white/60 data-[state=active]:bg-brand data-[state=active]:text-white">
              <Car size={14} className="mr-1.5" /> Vehicles
            </TabsTrigger>
            <TabsTrigger value="applications" className="text-white/60 data-[state=active]:bg-brand data-[state=active]:text-white">
              <FileText size={14} className="mr-1.5" /> Applications
            </TabsTrigger>
            <TabsTrigger value="contacts" className="text-white/60 data-[state=active]:bg-brand data-[state=active]:text-white">
              <MessageSquare size={14} className="mr-1.5" /> Contacts
            </TabsTrigger>
          </TabsList>

          {/* Vehicles tab */}
          <TabsContent value="vehicles">
            <div className="rounded-2xl border border-white/[0.08] bg-obsidian-soft">
              <div className="border-b border-white/[0.06] p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-base font-semibold text-white">Vehicle Inventory</h2>
                    <p className="mt-0.5 text-xs text-white/40">{filteredVehicles.length} shown</p>
                  </div>
                  <Button
                    size="sm"
                    className="bg-brand hover:bg-brand-strong text-white"
                    onClick={() => navigate("/admin/vehicles")}
                  >
                    <Package size={14} className="mr-1.5" /> Manage All
                  </Button>
                </div>
                <FilterToolbar placeholder="Search vehicles…" />
              </div>
              <div className="overflow-x-auto px-4 pb-4 pt-2 sm:px-5">
                <SectionError message={vehiclesError} />
                <table className="w-full border-separate" style={{ borderSpacing: "0 6px", minWidth: 720 }}>
                  <thead>
                    <tr>
                      <th className={th}>Vehicle</th>
                      <th className={th}>Year</th>
                      <th className={th}>VIN</th>
                      <th className={th}>Price</th>
                      <th className={th}>Status</th>
                      <th className={`${th} text-right`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading && (
                      <tr>
                        <td colSpan={6} className="rounded-xl bg-white/[0.03] px-4 py-12 text-center text-sm text-white/30">
                          <Loader2 size={16} className="mx-auto mb-2 animate-spin" /> Loading vehicles…
                        </td>
                      </tr>
                    )}
                    {!isLoading && filteredVehicles.length === 0 && (
                      <tr>
                        <td colSpan={6} className="rounded-xl bg-white/[0.03] px-4 py-12 text-center text-sm text-white/30">
                          No vehicles found.
                        </td>
                      </tr>
                    )}
                    {!isLoading &&
                      filteredVehicles.map((vehicle) => (
                        <tr key={vehicle.id} className="group">
                          <td className={cell}>
                            <div className="min-w-[160px]">
                              <div className="text-sm font-medium text-white">
                                {vehicle.name || vehicle.brand || vehicle.make || "Unnamed"}
                              </div>
                              <div className="text-xs text-white/40">{vehicle.model || "N/A"}</div>
                            </div>
                          </td>
                          <td className={`${cell} text-sm text-white/70`}>{vehicle.year || "N/A"}</td>
                          <td className={`${cell} font-mono text-xs text-white/40`}>{vehicle.vin || "N/A"}</td>
                          <td className={`${cell} text-sm font-semibold text-brand`}>{formatCurrency(vehicle.price)}</td>
                          <td className={cell}><StatusBadge status={vehicle.status} /></td>
                          <td className={cell}>
                            <div className="flex justify-end gap-1">
                              <button className={iconBtn} title="View" onClick={() => setDetail({ type: "vehicle", data: vehicle })}>
                                <Eye size={15} className="text-white/50" />
                              </button>
                              <button className={iconBtn} title="Edit in inventory" onClick={() => navigate("/admin/vehicles")}>
                                <Edit size={15} className="text-white/50" />
                              </button>
                              <button
                                className={`${iconBtn} hover:bg-red-500/10`}
                                title="Delete"
                                onClick={() => deleteVehicle(vehicle.id)}
                                disabled={actionId === `vehicle-${vehicle.id}`}
                              >
                                {actionId === `vehicle-${vehicle.id}` ? (
                                  <Loader2 size={15} className="animate-spin text-white/30" />
                                ) : (
                                  <Trash2 size={15} className="text-red-400" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* Applications tab */}
          <TabsContent value="applications">
            <div className="rounded-2xl border border-white/[0.08] bg-obsidian-soft">
              <div className="border-b border-white/[0.06] p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h2 className="font-display text-base font-semibold text-white">Finance Applications</h2>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
                      <CheckCircle size={12} /> {overview.approvedFinancingLeads} Approved
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-400">
                      <Clock size={12} /> {overview.pendingFinancingLeads} Pending
                    </span>
                  </div>
                </div>
                <FilterToolbar placeholder="Search applications…" />
              </div>
              <div className="overflow-x-auto px-4 pb-4 pt-2 sm:px-5">
                <SectionError message={leadsError} />
                <table className="w-full border-separate" style={{ borderSpacing: "0 6px", minWidth: 720 }}>
                  <thead>
                    <tr>
                      <th className={th}>Applicant</th>
                      <th className={th}>Vehicle Interest</th>
                      <th className={th}>Deposit</th>
                      <th className={th}>Date</th>
                      <th className={th}>Status</th>
                      <th className={`${th} text-right`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading && (
                      <tr>
                        <td colSpan={6} className="rounded-xl bg-white/[0.03] px-4 py-12 text-center text-sm text-white/30">
                          <Loader2 size={16} className="mx-auto mb-2 animate-spin" /> Loading applications…
                        </td>
                      </tr>
                    )}
                    {!isLoading && filteredApplications.length === 0 && (
                      <tr>
                        <td colSpan={6} className="rounded-xl bg-white/[0.03] px-4 py-12 text-center text-sm text-white/30">
                          No applications found.
                        </td>
                      </tr>
                    )}
                    {!isLoading &&
                      filteredApplications.map((app) => (
                        <tr key={app.id} className="group">
                          <td className={cell}>
                            <div className="min-w-[150px]">
                              <div className="text-sm font-medium text-white">
                                {`${app.firstName || ""} ${app.lastName || ""}`.trim() || "Unnamed"}
                              </div>
                              <div className="text-xs text-white/40">{app.email || "N/A"}</div>
                            </div>
                          </td>
                          <td className={`${cell} text-sm text-white/70`}>
                            {app.selectedCar?.name ||
                              `${app.selectedCar?.brand || ""} ${app.selectedCar?.model || ""}`.trim() ||
                              "—"}
                          </td>
                          <td className={`${cell} text-sm font-semibold text-brand`}>{formatCurrency(app.initialDepositBudget)}</td>
                          <td className={`${cell} text-xs text-white/35`}>{formatDate(app.submissionDate)}</td>
                          <td className={cell}><StatusBadge status={app.status} /></td>
                          <td className={cell}>
                            <div className="flex justify-end gap-1">
                              <button className={iconBtn} title="View" onClick={() => setDetail({ type: "application", data: app })}>
                                <Eye size={15} className="text-white/50" />
                              </button>
                              <button
                                className={`${iconBtn} hover:bg-emerald-500/10`}
                                title="Approve"
                                onClick={() => updateApplicationStatus(app.id, "approved")}
                                disabled={actionId === `application-${app.id}-approved`}
                              >
                                {actionId === `application-${app.id}-approved` ? (
                                  <Loader2 size={15} className="animate-spin text-white/30" />
                                ) : (
                                  <CheckCircle size={15} className="text-emerald-400" />
                                )}
                              </button>
                              <button
                                className={`${iconBtn} hover:bg-red-500/10`}
                                title="Reject"
                                onClick={() => updateApplicationStatus(app.id, "rejected")}
                                disabled={actionId === `application-${app.id}-rejected`}
                              >
                                {actionId === `application-${app.id}-rejected` ? (
                                  <Loader2 size={15} className="animate-spin text-white/30" />
                                ) : (
                                  <XCircle size={15} className="text-red-400" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* Contacts tab */}
          <TabsContent value="contacts">
            <div className="rounded-2xl border border-white/[0.08] bg-obsidian-soft">
              <div className="border-b border-white/[0.06] p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-display text-base font-semibold text-white">Contact Messages</h2>
                  <Button size="sm" className="bg-brand hover:bg-brand-strong text-white" onClick={exportCurrentTab}>
                    <Download size={14} className="mr-1.5" /> Export
                  </Button>
                </div>
                <FilterToolbar placeholder="Search contacts…" />
              </div>
              <div className="overflow-x-auto px-4 pb-4 pt-2 sm:px-5">
                <SectionError message={leadsError} />
                <table className="w-full border-separate" style={{ borderSpacing: "0 6px", minWidth: 720 }}>
                  <thead>
                    <tr>
                      <th className={th}>Contact</th>
                      <th className={th}>Subject</th>
                      <th className={th}>Message</th>
                      <th className={th}>Date</th>
                      <th className={th}>Status</th>
                      <th className={`${th} text-right`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading && (
                      <tr>
                        <td colSpan={6} className="rounded-xl bg-white/[0.03] px-4 py-12 text-center text-sm text-white/30">
                          <Loader2 size={16} className="mx-auto mb-2 animate-spin" /> Loading contacts…
                        </td>
                      </tr>
                    )}
                    {!isLoading && filteredContacts.length === 0 && (
                      <tr>
                        <td colSpan={6} className="rounded-xl bg-white/[0.03] px-4 py-12 text-center text-sm text-white/30">
                          No contacts found.
                        </td>
                      </tr>
                    )}
                    {!isLoading &&
                      filteredContacts.map((contact) => (
                        <tr key={contact.id} className="group">
                          <td className={cell}>
                            <div className="min-w-[150px]">
                              <div className="text-sm font-medium text-white">{contact.name || "Unnamed"}</div>
                              <div className="text-xs text-white/40">{contact.email || "N/A"}</div>
                              <div className="text-xs text-white/30">{contact.phone || ""}</div>
                            </div>
                          </td>
                          <td className={`${cell} text-sm text-white/70`}>{contact.subject || "N/A"}</td>
                          <td className={`${cell} max-w-xs truncate text-sm text-white/45`}>{contact.message || "N/A"}</td>
                          <td className={`${cell} text-xs text-white/35`}>{formatDate(contact.createdAt)}</td>
                          <td className={cell}><StatusBadge status={contact.status} /></td>
                          <td className={cell}>
                            <div className="flex justify-end gap-1">
                              <button className={iconBtn} title="View" onClick={() => setDetail({ type: "contact", data: contact })}>
                                <Eye size={15} className="text-white/50" />
                              </button>
                              <button
                                className={`${iconBtn} hover:bg-blue-500/10`}
                                title="Mark responded"
                                onClick={() => markContactResponded(contact.id)}
                                disabled={actionId === `contact-${contact.id}-responded`}
                              >
                                {actionId === `contact-${contact.id}-responded` ? (
                                  <Loader2 size={15} className="animate-spin text-white/30" />
                                ) : (
                                  <CheckCircle size={15} className="text-blue-400" />
                                )}
                              </button>
                              <button
                                className={`${iconBtn} hover:bg-red-500/10`}
                                title="Delete"
                                onClick={() => deleteContact(contact.id)}
                                disabled={actionId === `contact-${contact.id}`}
                              >
                                {actionId === `contact-${contact.id}` ? (
                                  <Loader2 size={15} className="animate-spin text-white/30" />
                                ) : (
                                  <Trash2 size={15} className="text-red-400" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Detail dialog */}
      <Dialog open={!!detail} onOpenChange={(open) => !open && setDetail(null)}>
        <DialogContent className="border-white/10 bg-[#15151B] text-white">
          {detail?.type === "vehicle" && (
            <>
              <DialogHeader>
                <DialogTitle className="text-white">
                  {detail.data.name || `${detail.data.brand || ""} ${detail.data.model || ""}`.trim() || "Vehicle"}
                </DialogTitle>
                <DialogDescription className="text-white/50">Vehicle details</DialogDescription>
              </DialogHeader>
              <dl className="space-y-2.5 text-sm">
                <DetailRow label="Brand / Model" value={`${detail.data.brand || detail.data.make || "—"} ${detail.data.model || ""}`} />
                <DetailRow label="Year" value={detail.data.year} />
                <DetailRow label="VIN" value={detail.data.vin} />
                <DetailRow label="Price" value={formatCurrency(detail.data.price)} />
                <DetailRow label="Status" value={labelStatus(detail.data.status)} />
              </dl>
              <Button className="mt-2 w-full bg-brand hover:bg-brand-strong" onClick={() => navigate("/admin/vehicles")}>
                Manage in Inventory
              </Button>
            </>
          )}
          {detail?.type === "application" && (
            <>
              <DialogHeader>
                <DialogTitle className="text-white">
                  {`${detail.data.firstName || ""} ${detail.data.lastName || ""}`.trim() || "Applicant"}
                </DialogTitle>
                <DialogDescription className="text-white/50">Finance application</DialogDescription>
              </DialogHeader>
              <dl className="space-y-2.5 text-sm">
                <DetailRow label="Email" value={detail.data.email} />
                <DetailRow label="Phone" value={detail.data.phone} />
                <DetailRow label="Employment" value={labelStatus(detail.data.employmentStatus)} />
                <DetailRow label="Vehicle Interest" value={detail.data.selectedCar?.name} />
                <DetailRow label="Deposit Budget" value={formatCurrency(detail.data.initialDepositBudget)} />
                <DetailRow label="Submitted" value={formatDate(detail.data.submissionDate)} />
                <DetailRow label="Status" value={labelStatus(detail.data.status)} />
              </dl>
            </>
          )}
          {detail?.type === "contact" && (
            <>
              <DialogHeader>
                <DialogTitle className="text-white">{detail.data.name || "Contact"}</DialogTitle>
                <DialogDescription className="text-white/50">{detail.data.subject || "Message"}</DialogDescription>
              </DialogHeader>
              <dl className="space-y-2.5 text-sm">
                <DetailRow label="Email" value={detail.data.email} />
                <DetailRow label="Phone" value={detail.data.phone} />
                <DetailRow label="Submitted" value={formatDate(detail.data.createdAt)} />
                <DetailRow label="Status" value={labelStatus(detail.data.status)} />
              </dl>
              <div className="mt-1 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-white/70">
                {detail.data.message || "No message."}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/[0.06] pb-2.5 last:border-0">
      <dt className="text-white/40">{label}</dt>
      <dd className="text-right font-medium text-white/80">{value || "—"}</dd>
    </div>
  );
}

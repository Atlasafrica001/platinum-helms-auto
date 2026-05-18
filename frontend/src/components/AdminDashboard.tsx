import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { Card } from "../components/card";
import { Button } from "../components/button";
import { Input } from "../components/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/tabs";
import { Badge } from "../components/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/table";
import {
  Car,
  FileText,
  MessageSquare,
  TrendingUp,
  DollarSign,
  Package,
  Search,
  Filter,
  Download,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  RefreshCw,
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
  status?: string;
  submissionDate?: string;
  initialDepositBudget?: number | string | null;
  selectedCar?: {
    name?: string;
    brand?: string;
    model?: string;
  } | null;
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

const formatCurrency = (value?: number | string | null) => {
  const amount = Number(value || 0);

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (value?: string) => {
  if (!value) return "N/A";

  return new Intl.DateTimeFormat("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
};

const labelStatus = (status?: string) => {
  if (!status) return "Unknown";

  return status
    .split(/[_\s-]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

const downloadCsv = (fileName: string, rows: Record<string, unknown>[]) => {
  if (rows.length === 0) return;

  const headers = Object.keys(rows[0]);
  const escapeCell = (value: unknown) =>
    `"${String(value ?? "").replace(/"/g, '""')}"`;
  const csv = [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => escapeCell(row[header])).join(",")),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
};

export function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("vehicles");
  const [searchTerm, setSearchTerm] = useState("");
  const [overview, setOverview] = useState<DashboardOverview>(emptyOverview);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [applications, setApplications] = useState<FinancingLead[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const loadDashboard = async (query = searchTerm, showRefreshing = false) => {
    if (showRefreshing) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError("");

    try {
      const filters = query.trim() ? { search: query.trim(), limit: 20 } : { limit: 20 };
      const [statsResponse, carsResponse, leadsResponse] = await Promise.all([
        api.stats.getDashboard(),
        api.cars.getAllAdmin(filters),
        api.leads.getAll(filters),
      ]);

      setOverview(statsResponse.data?.overview || emptyOverview);
      setVehicles(carsResponse.data || []);
      setApplications(leadsResponse.data?.financing?.leads || []);
      setContacts(leadsResponse.data?.contact?.messages || []);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Unable to load dashboard data";
      setError(message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboard("");
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      loadDashboard(searchTerm, true);
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [searchTerm]);

  const totalInventoryValue = useMemo(
    () => vehicles.reduce((total, vehicle) => total + Number(vehicle.price || 0), 0),
    [vehicles],
  );

  const getStatusBadge = (status?: string) => {
    const normalized = (status || "").toLowerCase();
    const statusColors: Record<string, string> = {
      available: "bg-green-100 text-green-800",
      reserved: "bg-yellow-100 text-yellow-800",
      sold: "bg-gray-100 text-gray-800",
      hidden: "bg-gray-100 text-gray-800",
      approved: "bg-green-100 text-green-800",
      contacted: "bg-blue-100 text-blue-800",
      pending: "bg-yellow-100 text-yellow-800",
      rejected: "bg-red-100 text-red-800",
      closed: "bg-gray-100 text-gray-800",
      new: "bg-blue-100 text-blue-800",
      responded: "bg-green-100 text-green-800",
    };

    return (
      <Badge className={statusColors[normalized] || "bg-gray-100 text-gray-800"}>
        {labelStatus(status)}
      </Badge>
    );
  };

  const deleteVehicle = async (id: number) => {
    if (!window.confirm("Delete this vehicle from inventory?")) return;

    setActionId(`vehicle-${id}`);
    try {
      await api.cars.delete(id);
      await loadDashboard(searchTerm, true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to delete vehicle");
    } finally {
      setActionId(null);
    }
  };

  const updateApplicationStatus = async (id: number, status: string) => {
    setActionId(`application-${id}-${status}`);
    try {
      await api.leads.updateStatus("financing", id, status);
      await loadDashboard(searchTerm, true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to update application");
    } finally {
      setActionId(null);
    }
  };

  const markContactResponded = async (id: number) => {
    setActionId(`contact-${id}-responded`);
    try {
      await api.leads.updateStatus("contact", id, "responded");
      await loadDashboard(searchTerm, true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to update contact");
    } finally {
      setActionId(null);
    }
  };

  const deleteContact = async (id: number) => {
    if (!window.confirm("Delete this contact message?")) return;

    setActionId(`contact-${id}`);
    try {
      await api.leads.delete("contact", id);
      await loadDashboard(searchTerm, true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to delete contact");
    } finally {
      setActionId(null);
    }
  };

  const exportCurrentTab = () => {
    if (activeTab === "vehicles") {
      downloadCsv(
        "vehicles.csv",
        vehicles.map((vehicle) => ({
          id: vehicle.id,
          vehicle: vehicle.name || `${vehicle.brand || vehicle.make || ""} ${vehicle.model || ""}`.trim(),
          year: vehicle.year,
          vin: vehicle.vin,
          price: vehicle.price,
          status: vehicle.status,
        })),
      );
      return;
    }

    if (activeTab === "applications") {
      downloadCsv(
        "finance-applications.csv",
        applications.map((application) => ({
          id: application.id,
          name: `${application.firstName || ""} ${application.lastName || ""}`.trim(),
          email: application.email,
          vehicle: application.selectedCar?.name || "N/A",
          depositBudget: application.initialDepositBudget,
          status: application.status,
          date: application.submissionDate,
        })),
      );
      return;
    }

    downloadCsv(
      "contacts.csv",
      contacts.map((contact) => ({
        id: contact.id,
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        subject: contact.subject,
        status: contact.status,
        date: contact.createdAt,
      })),
    );
  };

  const renderEmptyRow = (message: string, colSpan: number) => (
    <TableRow>
      <TableCell colSpan={colSpan} className="py-10 text-center text-gray-500">
        {message}
      </TableCell>
    </TableRow>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">
                Manage your automotive business operations
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => loadDashboard(searchTerm, true)}
                disabled={isRefreshing}
              >
                {isRefreshing ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                Refresh
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={exportCurrentTab}
              >
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 border-none shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Car className="w-6 h-6 text-blue-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="mb-1">{isLoading ? "..." : overview.totalCars}</h3>
            <p className="text-sm text-gray-600">Total Vehicles</p>
            <p className="text-xs text-green-600 mt-2">
              {overview.activeCars} active listings
            </p>
          </Card>

          <Card className="p-6 border-none shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="mb-1">
              {isLoading ? "..." : overview.totalFinancingLeads}
            </h3>
            <p className="text-sm text-gray-600">Finance Applications</p>
            <p className="text-xs text-yellow-600 mt-2">
              {overview.pendingFinancingLeads} pending review
            </p>
          </Card>

          <Card className="p-6 border-none shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="mb-1">
              {isLoading ? "..." : overview.totalContactMessages}
            </h3>
            <p className="text-sm text-gray-600">Contact Messages</p>
            <p className="text-xs text-blue-600 mt-2">
              {overview.newContactMessages} new messages
            </p>
          </Card>

          <Card className="p-6 border-none shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-red-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="mb-1">{formatCurrency(totalInventoryValue)}</h3>
            <p className="text-sm text-gray-600">Loaded Inventory Value</p>
            <p className="text-xs text-green-600 mt-2">
              {overview.soldCars} sold vehicles
            </p>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white border">
            <TabsTrigger value="vehicles" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              <Car className="w-4 h-4 mr-2" />
              Vehicles
            </TabsTrigger>
            <TabsTrigger value="applications" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              <FileText className="w-4 h-4 mr-2" />
              Applications
            </TabsTrigger>
            <TabsTrigger value="contacts" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              <MessageSquare className="w-4 h-4 mr-2" />
              Contacts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="vehicles">
            <Card className="border-none shadow-sm">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between mb-4">
                  <h2>Vehicle Inventory</h2>
                  <Button
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => navigate("/admin/vehicles")}
                  >
                    <Package className="w-4 h-4 mr-2" />
                    See All Vehicles
                  </Button>
                </div>
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search vehicles..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" disabled>
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>VIN</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading && renderEmptyRow("Loading vehicles...", 6)}
                    {!isLoading &&
                      vehicles.length === 0 &&
                      renderEmptyRow("No vehicles found.", 6)}
                    {!isLoading &&
                      vehicles.map((vehicle) => (
                        <TableRow key={vehicle.id}>
                          <TableCell>
                            <div>
                              <div>{vehicle.name || vehicle.brand || vehicle.make || "Unnamed vehicle"}</div>
                              <div className="text-sm text-gray-600">
                                {vehicle.model || "N/A"}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{vehicle.year || "N/A"}</TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {vehicle.vin || "N/A"}
                          </TableCell>
                          <TableCell>{formatCurrency(vehicle.price)}</TableCell>
                          <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm" disabled>
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" disabled>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteVehicle(vehicle.id)}
                                disabled={actionId === `vehicle-${vehicle.id}`}
                              >
                                {actionId === `vehicle-${vehicle.id}` ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4 text-red-600" />
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
          </TabsContent>

          <TabsContent value="applications">
            <Card className="border-none shadow-sm">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between mb-4">
                  <h2>Finance Applications</h2>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                      {overview.approvedFinancingLeads} Approved
                    </Button>
                    <Button variant="outline" size="sm">
                      <Clock className="w-4 h-4 mr-2 text-yellow-600" />
                      {overview.pendingFinancingLeads} Pending
                    </Button>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search applications..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" disabled>
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Applicant</TableHead>
                      <TableHead>Vehicle Interest</TableHead>
                      <TableHead>Deposit Budget</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading && renderEmptyRow("Loading applications...", 6)}
                    {!isLoading &&
                      applications.length === 0 &&
                      renderEmptyRow("No applications found.", 6)}
                    {!isLoading &&
                      applications.map((application) => (
                        <TableRow key={application.id}>
                          <TableCell>
                            <div>
                              <div>
                                {`${application.firstName || ""} ${application.lastName || ""}`.trim() ||
                                  "Unnamed applicant"}
                              </div>
                              <div className="text-sm text-gray-600">
                                {application.email || "N/A"}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {application.selectedCar?.name ||
                              `${application.selectedCar?.brand || ""} ${application.selectedCar?.model || ""}`.trim() ||
                              "N/A"}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(application.initialDepositBudget)}
                          </TableCell>
                          <TableCell>{formatDate(application.submissionDate)}</TableCell>
                          <TableCell>{getStatusBadge(application.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm" disabled>
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-green-600"
                                onClick={() => updateApplicationStatus(application.id, "approved")}
                                disabled={actionId === `application-${application.id}-approved`}
                              >
                                {actionId === `application-${application.id}-approved` ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <CheckCircle className="w-4 h-4" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600"
                                onClick={() => updateApplicationStatus(application.id, "rejected")}
                                disabled={actionId === `application-${application.id}-rejected`}
                              >
                                {actionId === `application-${application.id}-rejected` ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <XCircle className="w-4 h-4" />
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
          </TabsContent>

          <TabsContent value="contacts">
            <Card className="border-none shadow-sm">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between mb-4">
                  <h2>Contact Messages</h2>
                  <Button
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={exportCurrentTab}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search contacts..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" disabled>
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Contact</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading && renderEmptyRow("Loading contacts...", 6)}
                    {!isLoading &&
                      contacts.length === 0 &&
                      renderEmptyRow("No contacts found.", 6)}
                    {!isLoading &&
                      contacts.map((contact) => (
                        <TableRow key={contact.id}>
                          <TableCell>
                            <div>
                              <div>{contact.name || "Unnamed contact"}</div>
                              <div className="text-sm text-gray-600">
                                {contact.email || "N/A"}
                              </div>
                              <div className="text-sm text-gray-600">
                                {contact.phone || "N/A"}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{contact.subject || "N/A"}</TableCell>
                          <TableCell className="max-w-xs truncate">
                            {contact.message || "N/A"}
                          </TableCell>
                          <TableCell>{formatDate(contact.createdAt)}</TableCell>
                          <TableCell>{getStatusBadge(contact.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm" disabled>
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markContactResponded(contact.id)}
                                disabled={actionId === `contact-${contact.id}-responded`}
                              >
                                {actionId === `contact-${contact.id}-responded` ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Edit className="w-4 h-4" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteContact(contact.id)}
                                disabled={actionId === `contact-${contact.id}`}
                              >
                                {actionId === `contact-${contact.id}` ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4 text-red-600" />
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

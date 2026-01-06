import { useState } from "react";
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
  // LayoutDashboard,
  Car,
  FileText,
  MessageSquare,
  TrendingUp,
  // Users,
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
} from "lucide-react";

// Mock data for the dashboard
const mockStats = {
  totalVehicles: 48,
  totalApplications: 156,
  totalContacts: 89,
  monthlyRevenue: 2450000,
  pendingApplications: 23,
  approvedApplications: 98,
  activeListings: 42,
};

const mockVehicles = [
  {
    id: 1,
    make: "Mercedes-Benz",
    model: "S-Class",
    year: 2024,
    price: 125000,
    status: "Available",
    vin: "WDD2221771A123456",
  },
  {
    id: 2,
    make: "BMW",
    model: "7 Series",
    year: 2024,
    price: 110000,
    status: "Reserved",
    vin: "WBA7E2C53JG123456",
  },
  {
    id: 3,
    make: "Audi",
    model: "A8",
    year: 2023,
    price: 95000,
    status: "Available",
    vin: "WAUZZZ8V9KA123456",
  },
  {
    id: 4,
    make: "Porsche",
    model: "Panamera",
    year: 2024,
    price: 135000,
    status: "Sold",
    vin: "WP0AA2A71KL123456",
  },
  {
    id: 5,
    make: "Range Rover",
    model: "Autobiography",
    year: 2024,
    price: 150000,
    status: "Available",
    vin: "SALGS2VF5KA123456",
  },
];

const mockApplications = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@email.com",
    vehicleInterest: "Mercedes-Benz S-Class",
    amount: 125000,
    status: "Under Review",
    date: "2025-10-28",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    vehicleInterest: "BMW 7 Series",
    amount: 110000,
    status: "Approved",
    date: "2025-10-25",
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "m.brown@email.com",
    vehicleInterest: "Audi A8",
    amount: 95000,
    status: "Pending Documents",
    date: "2025-10-30",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.d@email.com",
    vehicleInterest: "Porsche Panamera",
    amount: 135000,
    status: "Rejected",
    date: "2025-10-22",
  },
  {
    id: 5,
    name: "David Wilson",
    email: "d.wilson@email.com",
    vehicleInterest: "Range Rover",
    amount: 150000,
    status: "Approved",
    date: "2025-10-29",
  },
];

const mockContacts = [
  {
    id: 1,
    name: "Robert Taylor",
    email: "r.taylor@email.com",
    phone: "+1 (555) 123-4567",
    subject: "Vehicle Import Inquiry",
    message: "Interested in importing a vehicle from Europe...",
    date: "2025-11-01",
    status: "New",
  },
  {
    id: 2,
    name: "Lisa Anderson",
    email: "l.anderson@email.com",
    phone: "+1 (555) 234-5678",
    subject: "Financing Options",
    message: "Would like to know more about financing options...",
    date: "2025-10-31",
    status: "Responded",
  },
  {
    id: 3,
    name: "James Martinez",
    email: "j.martinez@email.com",
    phone: "+1 (555) 345-6789",
    subject: "Test Drive Request",
    message: "Requesting a test drive for the S-Class...",
    date: "2025-10-30",
    status: "Scheduled",
  },
  {
    id: 4,
    name: "Patricia Garcia",
    email: "p.garcia@email.com",
    phone: "+1 (555) 456-7890",
    subject: "General Inquiry",
    message: "Question about your vehicle selection...",
    date: "2025-10-29",
    status: "Responded",
  },
];

export function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      Available: "bg-green-100 text-green-800",
      Reserved: "bg-yellow-100 text-yellow-800",
      Sold: "bg-gray-100 text-gray-800",
      Approved: "bg-green-100 text-green-800",
      "Under Review": "bg-blue-100 text-blue-800",
      "Pending Documents": "bg-yellow-100 text-yellow-800",
      Rejected: "bg-red-100 text-red-800",
      New: "bg-blue-100 text-blue-800",
      Responded: "bg-green-100 text-green-800",
      Scheduled: "bg-purple-100 text-purple-800",
    };

    return (
      <Badge className={`${statusColors[status] || "bg-gray-100 text-gray-800"}`}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">
                Manage your automotive business operations
              </p>
            </div>
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 border-none shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Car className="w-6 h-6 text-blue-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="mb-1">{mockStats.totalVehicles}</h3>
            <p className="text-sm text-gray-600">Total Vehicles</p>
            <p className="text-xs text-green-600 mt-2">
              {mockStats.activeListings} active listings
            </p>
          </Card>

          <Card className="p-6 border-none shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="mb-1">{mockStats.totalApplications}</h3>
            <p className="text-sm text-gray-600">Finance Applications</p>
            <p className="text-xs text-yellow-600 mt-2">
              {mockStats.pendingApplications} pending review
            </p>
          </Card>

          <Card className="p-6 border-none shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="mb-1">{mockStats.totalContacts}</h3>
            <p className="text-sm text-gray-600">Contact Messages</p>
            <p className="text-xs text-blue-600 mt-2">15 new this week</p>
          </Card>

          <Card className="p-6 border-none shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-red-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="mb-1">
              ${(mockStats.monthlyRevenue / 1000000).toFixed(2)}M
            </h3>
            <p className="text-sm text-gray-600">Monthly Revenue</p>
            <p className="text-xs text-green-600 mt-2">+12% from last month</p>
          </Card>
        </div>

        {/* Data Tables */}
        <Tabs defaultValue="vehicles" className="space-y-6">
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

          {/* Vehicles Tab */}
          <TabsContent value="vehicles">
            <Card className="border-none shadow-sm">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between mb-4">
                  <h2>Vehicle Inventory</h2>
                  <Button className="bg-red-600 hover:bg-red-700 text-white">
                    <Package className="w-4 h-4 mr-2" />
                    Add Vehicle
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
                  <Button variant="outline">
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
                    {mockVehicles.map((vehicle) => (
                      <TableRow key={vehicle.id}>
                        <TableCell>
                          <div>
                            <div>{vehicle.make}</div>
                            <div className="text-sm text-gray-600">
                              {vehicle.model}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{vehicle.year}</TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {vehicle.vin}
                        </TableCell>
                        <TableCell>${vehicle.price.toLocaleString()}</TableCell>
                        <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4 text-red-600" />
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

          {/* Applications Tab */}
          <TabsContent value="applications">
            <Card className="border-none shadow-sm">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between mb-4">
                  <h2>Finance Applications</h2>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                      {mockStats.approvedApplications} Approved
                    </Button>
                    <Button variant="outline" size="sm">
                      <Clock className="w-4 h-4 mr-2 text-yellow-600" />
                      {mockStats.pendingApplications} Pending
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
                  <Button variant="outline">
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
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockApplications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell>
                          <div>
                            <div>{app.name}</div>
                            <div className="text-sm text-gray-600">
                              {app.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{app.vehicleInterest}</TableCell>
                        <TableCell>${app.amount.toLocaleString()}</TableCell>
                        <TableCell>{app.date}</TableCell>
                        <TableCell>{getStatusBadge(app.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-green-600"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600"
                            >
                              <XCircle className="w-4 h-4" />
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

          {/* Contacts Tab */}
          <TabsContent value="contacts">
            <Card className="border-none shadow-sm">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between mb-4">
                  <h2>Contact Messages</h2>
                  <Button className="bg-red-600 hover:bg-red-700 text-white">
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
                  <Button variant="outline">
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
                    {mockContacts.map((contact) => (
                      <TableRow key={contact.id}>
                        <TableCell>
                          <div>
                            <div>{contact.name}</div>
                            <div className="text-sm text-gray-600">
                              {contact.email}
                            </div>
                            <div className="text-sm text-gray-600">
                              {contact.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{contact.subject}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {contact.message}
                        </TableCell>
                        <TableCell>{contact.date}</TableCell>
                        <TableCell>{getStatusBadge(contact.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4 text-red-600" />
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

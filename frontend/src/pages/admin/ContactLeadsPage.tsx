import { useEffect, useState } from "react";
import api from "@/lib/api";
import { downloadCsv, formatDate, labelStatus } from "@/lib/adminUtils";
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
import { CheckCircle, Download, Loader2, Trash2 } from "lucide-react";

type ContactLead = {
  id: number;
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  status?: string;
  createdAt?: string;
};

export default function ContactLeadsPage() {
  const [contacts, setContacts] = useState<ContactLead[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const loadContacts = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await api.leads.getAll({ type: "contact", limit: 100, search });
      setContacts(response.data?.contact?.messages || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load contacts");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeout = window.setTimeout(loadContacts, 250);
    return () => window.clearTimeout(timeout);
  }, [search]);

  const updateStatus = async (id: number, status: string) => {
    setActionId(`${id}-${status}`);
    try {
      await api.leads.updateStatus("contact", id, status);
      await loadContacts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update contact");
    } finally {
      setActionId(null);
    }
  };

  const deleteContact = async (id: number) => {
    if (!window.confirm("Delete this contact lead?")) return;
    setActionId(`${id}-delete`);
    try {
      await api.leads.delete("contact", id);
      await loadContacts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete contact");
    } finally {
      setActionId(null);
    }
  };

  const exportContacts = () => {
    downloadCsv(
      "contact-leads.csv",
      contacts.map((contact) => ({
        id: contact.id,
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        subject: contact.subject,
        message: contact.message,
        status: contact.status,
        createdAt: contact.createdAt,
      })),
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contact Leads</h1>
          <p className="text-gray-600">Messages and contact requests submitted from the public site.</p>
        </div>
        <Button onClick={exportContacts} className="bg-red-600 hover:bg-red-700 text-white">
          <Download className="w-4 h-4 mr-2" />
          Export Contacts
        </Button>
      </div>

      {error && <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <Card className="border-none shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <Input className="md:max-w-sm" placeholder="Search contacts..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contact</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && <TableRow><TableCell colSpan={6} className="py-10 text-center text-gray-500">Loading contact leads...</TableCell></TableRow>}
              {!isLoading && contacts.length === 0 && <TableRow><TableCell colSpan={6} className="py-10 text-center text-gray-500">No contact leads found.</TableCell></TableRow>}
              {contacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell>
                    <div className="font-medium">{contact.name || "Unnamed contact"}</div>
                    <div className="text-sm text-gray-600">{contact.email}</div>
                    <div className="text-sm text-gray-600">{contact.phone || "N/A"}</div>
                  </TableCell>
                  <TableCell>{contact.subject}</TableCell>
                  <TableCell className="max-w-md text-sm text-gray-600">{contact.message}</TableCell>
                  <TableCell><Badge>{labelStatus(contact.status)}</Badge></TableCell>
                  <TableCell>{formatDate(contact.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => updateStatus(contact.id, "responded")} disabled={actionId === `${contact.id}-responded`}>
                        {actionId === `${contact.id}-responded` ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4 text-green-600" />}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => deleteContact(contact.id)} disabled={actionId === `${contact.id}-delete`}>
                        {actionId === `${contact.id}-delete` ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 text-red-600" />}
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

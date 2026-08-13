import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Mail, MessageSquare, CreditCard, Calculator, CloudUpload, CalendarDays, Building2, Chrome,
} from "lucide-react";

type Status = "connected" | "not_connected" | "available";

interface ServiceDef {
  name: string;
  category: string;
  description: string;
  icon: React.ElementType;
  status: Status;
}

/**
 * Future-ready catalogue. Nothing here is implemented yet — every entry is
 * explicitly marked as available so the UI never claims a false connection.
 */
const SERVICES: ServiceDef[] = [
  { name: "Google Workspace", category: "Productivity", description: "Gmail, Drive and Calendar access for your organization.", icon: Chrome, status: "available" },
  { name: "Microsoft 365", category: "Productivity", description: "Outlook mail, OneDrive and Teams connectivity.", icon: Building2, status: "available" },
  { name: "Email Provider", category: "Communication", description: "Transactional email delivery for notifications and documents.", icon: Mail, status: "available" },
  { name: "WhatsApp Business", category: "Communication", description: "Client messaging and job updates over WhatsApp.", icon: MessageSquare, status: "available" },
  { name: "Payment Provider", category: "Finance", description: "Collect payments against invoices raised in Finance.", icon: CreditCard, status: "available" },
  { name: "Accounting System", category: "Finance", description: "Push invoices, receipts and expenses to your accounting stack.", icon: Calculator, status: "available" },
  { name: "Cloud Storage", category: "Documents", description: "Sync job documents and drawings to external storage.", icon: CloudUpload, status: "available" },
  { name: "Calendars", category: "Scheduling", description: "Publish site visits, jobs and SLA deadlines to calendars.", icon: CalendarDays, status: "available" },
];

const STATUS_LABEL: Record<Status, string> = {
  connected: "Connected",
  not_connected: "Not connected",
  available: "Available",
};

export default function ConnectedServices() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Connected Services</CardTitle>
        <p className="text-sm text-muted-foreground">
          External systems that can be connected to this workspace. None are active yet — connecting
          third-party services is handled in a later phase.
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          {SERVICES.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.name} className="flex items-start gap-3 rounded-lg border p-3">
                <div className="rounded-md bg-muted p-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold">{s.name}</p>
                    <Badge variant="outline">{STATUS_LABEL[s.status]}</Badge>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{s.category}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{s.description}</p>
                  <Button size="sm" variant="outline" className="mt-2" disabled>
                    Connect
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

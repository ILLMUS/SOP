import StageField from "./StageField";
import type { StageFormProps } from "./types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Check, Rocket, Lock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function InvoicingForm({ formData, jobId }: StageFormProps) {
  const synced = formData.api_synced_at;

  const { data: quoteBuilderUrl } = useQuery({
    queryKey: ["app-settings", "quote_builder_base_url"],
    queryFn: async () => {
      const { data } = await supabase
        .from("app_settings").select("value").eq("key", "quote_builder_base_url").maybeSingle();
      return data?.value || null;
    },
  });

  const handleLaunch = () => {
    if (!quoteBuilderUrl) { toast.error("Quote builder URL not configured."); return; }
    if (!jobId) { toast.error("Job ID missing."); return; }
    const sep = quoteBuilderUrl.includes("?") ? "&" : "?";
    window.open(
      `${quoteBuilderUrl}${sep}job_id=${encodeURIComponent(jobId)}&section=invoice`,
      "_blank", "noopener,noreferrer"
    );
  };

  return (
    <div className="space-y-4">
      <Card className="border-accent/40 bg-accent/5 p-3">
        <p className="text-sm flex items-start gap-2">
          <Lock className="h-4 w-4 mt-0.5 text-accent shrink-0" />
          <span>
            <strong>Externally managed.</strong> Invoices are generated in the external Quote Builder and synced here.
            Use the Launch button to issue or revise the invoice; sent status updates automatically.
          </span>
        </p>
      </Card>

      {quoteBuilderUrl && jobId && (
        <Card className="border-primary/30 bg-primary/5 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-primary flex items-center gap-2">
                <Rocket className="h-4 w-4" />
                External Quote Builder — Invoice
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                Open the Invoice section for this job.
              </p>
            </div>
            <Button size="sm" onClick={handleLaunch} className="gap-1.5">
              <ExternalLink className="h-3.5 w-3.5" />
              Open Quote Builder
            </Button>
          </div>
        </Card>
      )}

      {synced ? (
        <Card className="border-accent/30 bg-accent/5 p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-accent flex items-center gap-2">
              <ExternalLink className="h-4 w-4" /> Invoice Synced
            </h4>
            <Badge variant="outline" className="border-success text-success text-xs">
              <Check className="h-3 w-3 mr-1" />
              {new Date(synced).toLocaleString()}
            </Badge>
          </div>
        </Card>
      ) : (
        <Card className="border-locked/40 bg-locked/10 p-4">
          <p className="text-sm text-muted-foreground">
            No invoice synced yet. Issue the invoice in the external Quote Builder and it will appear here automatically.
          </p>
        </Card>
      )}

      <StageField type="text" label="Invoice Number" required readOnly
        value={formData.invoice_number || ""} onChange={() => {}}
        placeholder="(synced from Quote Builder)" />
      <StageField type="currency" label="Invoice Amount" required readOnly
        value={formData.invoice_amount || ""} onChange={() => {}} placeholder="0.00" />
      <StageField type="text" label="Due Date" readOnly
        value={formData.due_date || ""} onChange={() => {}} placeholder="YYYY-MM-DD" />
      <StageField type="checkbox" label="Invoice sent to client" readOnly
        checked={!!formData.invoice_sent} onChange={() => {}} />
      {formData.invoice_document_url && (
        <a
          href={formData.invoice_document_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          View synced invoice document
        </a>
      )}
    </div>
  );
}
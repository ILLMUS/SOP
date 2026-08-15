import StageField from "./StageField";
import type { StageFormProps } from "./types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { ExternalLink, Check, Rocket, Lock, Clock, AlertCircle, RefreshCw, BadgeCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";
import { buildQuoteBuilderUrl } from "@/lib/quoteBuilder";

interface LineItem {
  id: string;
  type: "material" | "labour" | "other";
  description: string;
  qty: number;
  unit_price: number;
  markup_pct: number;
}

export default function QuotationPrepForm({ formData, jobId, onQuoteConfirm }: StageFormProps) {
  const synced = formData.api_synced_at;
  const lineItems: LineItem[] = formData.line_items || [];
  const [confirmed, setConfirmed] = useState(false);

  // Reset the confirmation checkbox whenever the synced data changes,
  // so the user must re-confirm the latest quote ref and totals.
  useEffect(() => {
    setConfirmed(false);
    onQuoteConfirm?.(false);
  }, [formData.api_synced_at, formData.quote_ref, formData.quote_amount, formData.vat_amount, formData.total_amount]);

  const handleConfirm = (checked: boolean) => {
    setConfirmed(checked);
    onQuoteConfirm?.(checked);
  };


  const subtotal = lineItems.reduce((s, i) => {
    const base = i.qty * i.unit_price;
    return s + base + base * (i.markup_pct || 0) / 100;
  }, 0);
  const vatAmount = parseFloat(formData.vat_amount || "0");
  const totalAmount = parseFloat(formData.quote_amount || subtotal.toFixed(2)) + vatAmount;

  const { data: quoteBuilderUrl } = useQuery({
    queryKey: ["app-settings", "quote_builder_base_url"],
    queryFn: async () => {
      const { data } = await supabase
        .from("app_settings")
        .select("value")
        .eq("key", "quote_builder_base_url")
        .maybeSingle();
      return data?.value || null;
    },
  });

  // Pull client data from the job + lead_entry stage to prefill the Quote Builder.
  const { data: prefillData } = useQuery({
    queryKey: ["quote-builder-prefill", jobId],
    enabled: !!jobId,
    queryFn: async () => {
      const [jobRes, leadRes] = await Promise.all([
        supabase
          .from("jobs")
          .select("job_number, client_name, client_email, client_phone, client_location, service_type")
          .eq("id", jobId!)
          .maybeSingle(),
        supabase
          .from("job_stages")
          .select("form_data")
          .eq("job_id", jobId!)
          .eq("stage", "lead_entry")
          .maybeSingle(),
      ]);
      return {
        job: jobRes.data,
        lead: (leadRes.data?.form_data as Record<string, any>) || {},
      };
    },
  });

  const handleLaunch = () => {
    if (!quoteBuilderUrl) {
      toast.error("Quote builder URL is not configured. Please contact an administrator.");
      setLaunchResult({ status: "error", at: new Date(), message: "Quote builder URL not configured" });
      return;
    }
    if (!jobId) {
      toast.error("Cannot launch quote builder — job ID is missing.");
      setLaunchResult({ status: "error", at: new Date(), message: "Job ID missing" });
      return;
    }
    const returnUrl = `${window.location.origin}/jobs/${jobId}?from=quote_builder&stage=quotation_preparation`;
    const j = prefillData?.job;
    const lead = prefillData?.lead || {};
    const url = buildQuoteBuilderUrl(
      quoteBuilderUrl,
      {
        jobId,
        jobNumber: j?.job_number,
        clientName: j?.client_name,
        clientEmail: j?.client_email,
        clientPhone: j?.client_phone,
        clientLocation: j?.client_location,
        serviceType: j?.service_type,
        leadSource: lead.lead_source,
        urgency: lead.urgency,
        initialRequirements: lead.initial_requirements,
      },
      returnUrl,
      window.location.origin,
    );
    const win = window.open(url, "_blank", "noopener,noreferrer");
    if (!win) {
      setLaunchResult({ status: "blocked", at: new Date(), message: "Popup blocked by browser" });
      toast.error("Popup blocked. Allow popups for this site and try again.");
    } else {
      setLaunchResult({ status: "success", at: new Date() });
    }
  };

  const [launchResult, setLaunchResult] = useState<{
    status: "success" | "error" | "blocked";
    at: Date;
    message?: string;
  } | null>(null);

  // Auto-launch once per job when entering this stage and no quote has synced yet.
  const autoLaunchedRef = useRef(false);
  useEffect(() => {
    if (autoLaunchedRef.current) return;
    // Wait until prefill data has loaded so the Quote Builder gets the client info.
    if (!quoteBuilderUrl || !jobId || synced || !prefillData) return;
    const key = `qb-autolaunched-${jobId}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    autoLaunchedRef.current = true;
    handleLaunch();
    toast.info("Opening Quote Builder in a new tab…");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quoteBuilderUrl, jobId, synced, prefillData]);

  const typeLabel = (t: string) =>
    t === "material" ? "Material" : t === "labour" ? "Labour" : "Other";

  return (
    <div className="space-y-4">
      <Card className="border-accent/40 bg-accent/5 p-3">
        <p className="text-sm flex items-start gap-2">
          <Lock className="h-4 w-4 mt-0.5 text-accent shrink-0" />
          <span>
            <strong>Externally managed.</strong> Quotes are created in the external Quote Builder and synced back here.
            Use the Launch button to open this job in the builder. Line items, totals, and the document are read-only in this app.
          </span>
        </p>
      </Card>

      {/* Launch Quote Builder */}
<Card className="border-primary/30 bg-primary/5 p-4">
  <div className="flex items-center justify-between gap-4">
    <div>
      <h4 className="text-sm font-semibold text-primary flex items-center gap-2">
        <Rocket className="h-4 w-4" />
        External Quote Builder
      </h4>

      <p className="text-xs text-muted-foreground mt-1">
        Create the quotation in the external Quote Builder using this
        client's job information.
      </p>

      {!quoteBuilderUrl && (
        <p className="text-xs text-destructive mt-2">
          Quote Builder URL is not configured.
        </p>
      )}

      {!jobId && (
        <p className="text-xs text-destructive mt-2">
          Job ID is missing.
        </p>
      )}
    </div>

    <Button
      size="sm"
      onClick={handleLaunch}
      className="gap-1.5 shrink-0"
    >
      <Rocket className="h-3.5 w-3.5" />
      Launch Quote Builder
    </Button>
  </div>
</Card>

      {/* Launch Result */}
      {launchResult && (
        <Card
          className={
            launchResult.status === "success"
              ? "border-success/30 bg-success/5 p-3"
              : "border-destructive/30 bg-destructive/5 p-3"
          }
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm">
              {launchResult.status === "success" ? (
                <>
                  <Check className="h-4 w-4 text-success" />
                  <span className="text-success font-medium">Quote Builder opened in new tab</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <span className="text-destructive font-medium">
                    Launch failed{launchResult.message ? ` — ${launchResult.message}` : ""}
                  </span>
                </>
              )}
              <span className="text-xs text-muted-foreground inline-flex items-center gap-1 ml-1">
                <Clock className="h-3 w-3" />
                {launchResult.at.toLocaleTimeString()}
              </span>
            </div>
            {launchResult.status !== "success" && (
              <Button size="sm" variant="outline" onClick={handleLaunch} className="gap-1.5">
                <RefreshCw className="h-3.5 w-3.5" />
                Retry
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* API Sync Status */}
      {synced ? (
        <Card className="border-success/40 bg-success/5 p-4">
          <div className="flex items-start gap-3">
            <BadgeCheck className="h-5 w-5 text-success mt-0.5 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h4 className="text-sm font-semibold text-success">
                  Quote synced — please confirm before approving
                </h4>
                <Badge variant="outline" className="border-success text-success text-xs">
                  <Check className="h-3 w-3 mr-1" />
                  {new Date(synced).toLocaleString()}
                </Badge>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Quote Ref</p>
                  <p className="text-sm font-semibold font-mono">{formData.quote_ref || "—"}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Subtotal</p>
                  <p className="text-sm font-semibold">E {subtotal.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">VAT</p>
                  <p className="text-sm font-semibold">E {vatAmount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Total (incl. VAT)</p>
                  <p className="text-sm font-bold text-success">E {totalAmount.toFixed(2)}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground pt-1">
                Review the ref and recalculated totals above match the Quote Builder before approving this stage.
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="border-locked/40 bg-locked/10 p-4">
          <p className="text-sm text-muted-foreground">
            No quote synced yet. Build the quote in the external Quote Builder and it will appear here automatically.
          </p>
        </Card>
      )}

      {/* Approval confirmation checkbox — required before Approve is enabled */}
      {synced && (
        <StageField
          type="checkbox"
          label="I confirm the synced quote reference and recalculated totals are correct before approving."
          checked={confirmed}
          onChange={handleConfirm}
          readOnly={false}
        />
      )}

      <StageField type="text" label="Quote Reference Number" required readOnly
        value={formData.quote_ref || ""} onChange={() => {}}
        placeholder="(synced from Quote Builder)"
      />


      {/* Line Items (read-only mirror) */}
      {lineItems.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Line Items</h4>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[70px] text-right">Qty</TableHead>
                  <TableHead className="w-[110px] text-right">Unit Price</TableHead>
                  <TableHead className="w-[80px] text-right">Markup %</TableHead>
                  <TableHead className="w-[110px] text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lineItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="p-2 text-sm">{typeLabel(item.type)}</TableCell>
                    <TableCell className="p-2 text-sm">{item.description}</TableCell>
                    <TableCell className="p-2 text-sm text-right">{item.qty}</TableCell>
                    <TableCell className="p-2 text-sm text-right">E {item.unit_price.toFixed(2)}</TableCell>
                    <TableCell className="p-2 text-sm text-right">{item.markup_pct || 0}%</TableCell>
                    <TableCell className="p-2 text-right text-sm font-medium">
                      E {(item.qty * item.unit_price * (1 + (item.markup_pct || 0) / 100)).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={5} className="text-right font-semibold text-sm">
                    Subtotal
                  </TableCell>
                  <TableCell className="text-right font-semibold text-sm">
                    E {subtotal.toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </div>
      )}

      {/* Summary (all read-only, synced) */}
      <StageField type="currency" label="Quoted Amount (excl. VAT)" required readOnly
        value={formData.quote_amount || ""} onChange={() => {}} placeholder="0.00"
      />
      <StageField type="currency" label="VAT Amount" readOnly
        value={formData.vat_amount || ""} onChange={() => {}} placeholder="0.00"
      />
      <div className="rounded border border-accent/30 bg-accent/5 p-3">
        <p className="text-sm font-medium text-muted-foreground">Total (incl. VAT)</p>
        <p className="font-heading text-xl font-bold text-accent">
          E {totalAmount.toFixed(2)}
        </p>
      </div>
      <StageField type="text" label="Validity Period" readOnly
        value={formData.validity || ""} onChange={() => {}}
      />
      <StageField type="textarea" label="Terms & Conditions" readOnly
        value={formData.terms || ""} onChange={() => {}} rows={4}
      />
      {formData.quote_document_url && (
        <a
          href={formData.quote_document_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          View synced quote document
        </a>
      )}
    </div>
  );
}

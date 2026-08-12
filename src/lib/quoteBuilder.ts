/**
 * Build the launch URL for the external Quote Builder with prefill data
 * from the job record and the Lead Entry stage.
 *
 * The external Quote Builder is expected to read these query params and
 * pre-populate its new-quote form. Unknown params are safe to ignore.
 */
export interface QuoteBuilderPrefill {
  jobId: string;
  jobNumber?: string | null;
  clientName?: string | null;
  clientEmail?: string | null;
  clientPhone?: string | null;
  clientLocation?: string | null;
  serviceType?: string | null;
  leadSource?: string | null;
  urgency?: string | null;
  initialRequirements?: string | null;
}

export function buildQuoteBuilderUrl(
  baseUrl: string,
  prefill: QuoteBuilderPrefill,
  returnUrl: string,
  origin: string,
): string {
  const sep = baseUrl.includes("?") ? "&" : "?";
  const params = new URLSearchParams();

  // Routing / behavior hints
  params.set("job_id", prefill.jobId);
  params.set("section", "quote");
  params.set("action", "new");
  params.set("autostart", "1");
  params.set("route", "/quotes/new");
  params.set("return_url", returnUrl);
  params.set("origin", origin);

  // Prefill payload (flat for simple consumers)
  const flat: Record<string, string | null | undefined> = {
    job_number: prefill.jobNumber,
    client_name: prefill.clientName,
    client_email: prefill.clientEmail,
    client_phone: prefill.clientPhone,
    client_location: prefill.clientLocation,
    service_type: prefill.serviceType,
    lead_source: prefill.leadSource,
    urgency: prefill.urgency,
    initial_requirements: prefill.initialRequirements,
  };
  for (const [k, v] of Object.entries(flat)) {
    if (v != null && v !== "") params.set(k, String(v));
  }

  // Also send a JSON blob for richer consumers
  const prefillJson = Object.fromEntries(
    Object.entries(flat).filter(([, v]) => v != null && v !== ""),
  );
  if (Object.keys(prefillJson).length > 0) {
    params.set("prefill", JSON.stringify(prefillJson));
  }

  return `${baseUrl}${sep}${params.toString()}`;
}
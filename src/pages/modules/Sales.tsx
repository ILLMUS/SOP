import ModulePlaceholder from "@/components/layout/ModulePlaceholder";

export default function Sales() {
  return (
    <ModulePlaceholder
      title="Sales"
      summary="Quotes, approvals and conversion — currently driven through the SOP pipeline and the external quote builder."
      planned={[
        "Win/loss reason analytics",
        "Value forecasting by stage",
        "Proposal templates",
      ]}
      linked={[
        { to: "/crm/leads", label: "Leads", description: "Qualify enquiries and convert them" },
        { to: "/crm/opportunities", label: "Opportunities", description: "Qualified work in play" },
        { to: "/crm/deals", label: "Deals", description: "Close deals and start the work" },
        { to: "/jobs", label: "Active jobs", description: "Quotation and approval stages live here" },
      ]}
    />
  );
}
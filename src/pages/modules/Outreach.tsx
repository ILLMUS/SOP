import ModulePlaceholder from "@/components/layout/ModulePlaceholder";

export default function Outreach() {
  return (
    <ModulePlaceholder
      title="Outreach"
      summary="Top-of-funnel activity: campaigns, lead capture and follow-up cadences."
      planned={[
        "Lead capture forms and inbound routing",
        "Campaign lists and outreach sequences",
        "Contact activity timeline and follow-up reminders",
      ]}
      linked={[
        { to: "/crm/accounts", label: "Prospects", description: "Accounts you have not converted yet" },
        { to: "/crm/activities", label: "Activities & follow-ups", description: "Calls, meetings, notes and tasks" },
        { to: "/crm/leads", label: "Leads", description: "Enquiries entering the pipeline" },
      ]}
    />
  );
}
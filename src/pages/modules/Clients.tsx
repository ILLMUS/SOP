import ModulePlaceholder from "@/components/layout/ModulePlaceholder";

export default function Clients() {
  return (
    <ModulePlaceholder
      title="Clients"
      summary="Client records, contacts and history. Today clients are captured per job."
      planned={[
        "Client portal access management",
        "Support tickets and feedback",
        "Renewal and maintenance reminders",
      ]}
      linked={[
        { to: "/crm/accounts", label: "Accounts & prospects", description: "Every company in your lifecycle" },
        { to: "/crm/contacts", label: "Contacts", description: "People linked to their accounts" },
        { to: "/jobs", label: "Jobs by client", description: "Search jobs by client name" },
        { to: "/track", label: "Client tracking page", description: "Public job tracking link" },
      ]}
    />
  );
}
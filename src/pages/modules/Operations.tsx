import ModulePlaceholder from "@/components/layout/ModulePlaceholder";

export default function Operations() {
  return (
    <ModulePlaceholder
      title="Operations"
      summary="Delivery execution — jobs, stages, fabrication and field work run here."
      planned={[
        "Capacity and scheduling calendar",
        "Resource and team allocation board",
        "QC checklists and handover packs",
      ]}
      linked={[
        { to: "/jobs", label: "Jobs", description: "All active and completed jobs" },
        { to: "/jobs/new", label: "New job", description: "Start a workflow from a template" },
        { to: "/admin/assignments", label: "Legacy stages", description: "Fabrication stage assignments" },
      ]}
    />
  );
}
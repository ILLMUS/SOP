export interface NichePreset {
  key: string;
  label: string;
  roles: string[];
  workflow: string;
  steps: string[];
}

export const NICHE_PRESETS: NichePreset[] = [
  {
    key: "fabrication",
    label: "Fabrication / Manufacturing",
    workflow: "Fabrication Job Flow",
    roles: ["Sales", "Estimator", "Workshop Manager", "Installer", "Accounts"],
    steps: ["Lead Entry", "Site Assessment", "Costing", "Quotation", "Client Approval", "Fabrication", "Installation", "Invoicing", "Closure"],
  },
  {
    key: "construction",
    label: "Construction / Trades",
    workflow: "Project Flow",
    roles: ["Estimator", "Site Foreman", "Project Manager", "Accounts"],
    steps: ["Enquiry", "Site Inspection", "Quotation", "Client Approval", "Materials Order", "Execution", "Snag List", "Handover", "Invoicing"],
  },
  {
    key: "services",
    label: "Professional Services / Agency",
    workflow: "Client Delivery Flow",
    roles: ["Account Manager", "Specialist", "Reviewer", "Billing"],
    steps: ["Enquiry", "Discovery Call", "Proposal", "Client Approval", "Delivery", "Review", "Invoicing", "Closure"],
  },
  {
    key: "health",
    label: "Clinic / Health Practice",
    workflow: "Patient Flow",
    roles: ["Receptionist", "Practitioner", "Billing"],
    steps: ["Booking", "Intake Form", "Consultation", "Treatment Plan", "Follow-up", "Billing"],
  },
  {
    key: "hospitality",
    label: "Catering / Events / Hospitality",
    workflow: "Event Flow",
    roles: ["Coordinator", "Chef / Lead", "Logistics", "Accounts"],
    steps: ["Enquiry", "Menu / Brief", "Quotation", "Deposit", "Preparation", "Event Day", "Debrief", "Final Invoice"],
  },
  {
    key: "logistics",
    label: "Logistics / Transport",
    workflow: "Delivery Flow",
    roles: ["Dispatcher", "Driver", "Warehouse", "Accounts"],
    steps: ["Booking", "Load Planning", "Dispatch", "In Transit", "Proof of Delivery", "Invoicing"],
  },
  {
    key: "retail",
    label: "Retail / E-commerce",
    workflow: "Order Flow",
    roles: ["Sales", "Picker / Packer", "Dispatch", "Support"],
    steps: ["Order Received", "Payment Confirmed", "Picking", "Packing", "Shipping", "Delivered", "After-sales"],
  },
  {
    key: "other",
    label: "Something else",
    workflow: "Main Workflow",
    roles: ["Team Member", "Manager"],
    steps: ["Enquiry", "Assessment", "Quotation", "Approval", "Delivery", "Invoicing"],
  },
];

export const EMPLOYEE_RANGES = ["Just me", "2-5", "6-20", "21-50", "51-200", "200+"];

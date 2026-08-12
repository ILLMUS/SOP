import type { SopFieldType } from "@/lib/sopFields";

export interface LibraryField {
  label: string;
  type: SopFieldType;
  required?: boolean;
  help?: string;
  options?: string[];
}

export interface LibraryStage {
  name: string;
  description: string;
  role: string;
  backupRole?: string;
  slaHours: number;
  requiresApproval?: boolean;
  fields: LibraryField[];
}

export interface LibraryTemplate {
  key: string;
  name: string;
  niche: string;
  summary: string;
  roles: string[];
  stages: LibraryStage[];
}

export const SOP_LIBRARY: LibraryTemplate[] = [
  {
    key: "fabrication",
    name: "Fabrication Job Flow",
    niche: "Fabrication / Manufacturing",
    summary: "Lead to installation with costing, client sign-off and shop-drawing control.",
    roles: ["Sales", "Estimator", "Workshop Manager", "Installer", "Accounts"],
    stages: [
      {
        name: "Lead Entry",
        description: "Capture the enquiry and confirm the client's contact details.",
        role: "Sales",
        slaHours: 12,
        fields: [
          { label: "Enquiry source", type: "select", required: true, options: ["Referral", "Website", "Walk-in", "Repeat client", "Social media"] },
          { label: "What does the client need?", type: "textarea", required: true },
          { label: "Site address", type: "text", required: true },
          { label: "Target completion date", type: "date" },
        ],
      },
      {
        name: "Site Assessment",
        description: "Measure up on site and photograph existing conditions.",
        role: "Estimator",
        backupRole: "Workshop Manager",
        slaHours: 48,
        fields: [
          { label: "Measurements & notes", type: "textarea", required: true },
          { label: "Site photos", type: "file", required: true },
          { label: "Access restrictions", type: "textarea" },
        ],
      },
      {
        name: "Costing",
        description: "Price materials, labour and transport before quoting.",
        role: "Estimator",
        slaHours: 24,
        requiresApproval: true,
        fields: [
          { label: "Material cost", type: "currency", required: true },
          { label: "Labour cost", type: "currency", required: true },
          { label: "Transport / other", type: "currency" },
          { label: "Margin %", type: "number", required: true },
        ],
      },
      {
        name: "Quotation",
        description: "Issue the formal quote to the client.",
        role: "Sales",
        slaHours: 24,
        fields: [
          { label: "Quote reference", type: "text", required: true },
          { label: "Quote total", type: "currency", required: true },
          { label: "Quote document", type: "file", required: true },
        ],
      },
      {
        name: "Client Approval",
        description: "Written acceptance and deposit before any work starts.",
        role: "Sales",
        backupRole: "Accounts",
        slaHours: 72,
        requiresApproval: true,
        fields: [
          { label: "Client accepted?", type: "checkbox", required: true },
          { label: "Signed acceptance / PO", type: "file", required: true },
          { label: "Deposit received", type: "currency", required: true },
        ],
      },
      {
        name: "Fabrication",
        description: "Build to the approved drawings and record QC.",
        role: "Workshop Manager",
        slaHours: 120,
        fields: [
          { label: "Production start date", type: "date", required: true },
          { label: "QC check passed", type: "checkbox", required: true },
          { label: "Workshop photos", type: "file" },
        ],
      },
      {
        name: "Installation",
        description: "Install on site and get the client's sign-off.",
        role: "Installer",
        slaHours: 72,
        requiresApproval: true,
        fields: [
          { label: "Install date", type: "date", required: true },
          { label: "Completion photos", type: "file", required: true },
          { label: "Client sign-off name", type: "text", required: true },
          { label: "Snags noted", type: "textarea" },
        ],
      },
      {
        name: "Invoicing & Closure",
        description: "Invoice the balance and close the job.",
        role: "Accounts",
        slaHours: 24,
        fields: [
          { label: "Invoice number", type: "text", required: true },
          { label: "Balance due", type: "currency", required: true },
          { label: "Payment received in full", type: "checkbox" },
        ],
      },
    ],
  },
  {
    key: "construction",
    name: "Construction Project Flow",
    niche: "Construction / Trades",
    summary: "Enquiry to handover with materials control, snag list and retention.",
    roles: ["Estimator", "Site Foreman", "Project Manager", "Accounts"],
    stages: [
      { name: "Enquiry", description: "Log the client's scope and budget expectations.", role: "Estimator", slaHours: 12, fields: [
        { label: "Client requirement", type: "textarea", required: true },
        { label: "Budget range", type: "currency" },
        { label: "Preferred start date", type: "date" },
      ] },
      { name: "Site Inspection", description: "Inspect the site and record constraints.", role: "Site Foreman", slaHours: 48, fields: [
        { label: "Site condition notes", type: "textarea", required: true },
        { label: "Site photos", type: "file", required: true },
        { label: "Services / utilities on site", type: "textarea" },
      ] },
      { name: "Quotation", description: "Price the works and issue the quote.", role: "Estimator", slaHours: 48, requiresApproval: true, fields: [
        { label: "Quote total", type: "currency", required: true },
        { label: "Bill of quantities", type: "file", required: true },
        { label: "Validity (days)", type: "number" },
      ] },
      { name: "Client Approval", description: "Signed contract and deposit received.", role: "Project Manager", slaHours: 72, requiresApproval: true, fields: [
        { label: "Signed contract", type: "file", required: true },
        { label: "Deposit received", type: "currency", required: true },
      ] },
      { name: "Materials Order", description: "Order materials and confirm delivery dates.", role: "Project Manager", slaHours: 48, fields: [
        { label: "Supplier", type: "text", required: true },
        { label: "Purchase order", type: "file" },
        { label: "Expected delivery", type: "date", required: true },
      ] },
      { name: "Execution", description: "Carry out the works with weekly progress logs.", role: "Site Foreman", slaHours: 240, fields: [
        { label: "Progress %", type: "number", required: true },
        { label: "Progress photos", type: "file" },
        { label: "Site diary notes", type: "textarea" },
      ] },
      { name: "Snag List", description: "Walk the site with the client and list defects.", role: "Project Manager", slaHours: 48, fields: [
        { label: "Snags identified", type: "textarea", required: true },
        { label: "All snags cleared", type: "checkbox", required: true },
      ] },
      { name: "Handover & Invoicing", description: "Hand over, issue certificate and final invoice.", role: "Accounts", slaHours: 48, requiresApproval: true, fields: [
        { label: "Handover certificate", type: "file", required: true },
        { label: "Final invoice amount", type: "currency", required: true },
        { label: "Retention held", type: "currency" },
      ] },
    ],
  },
  {
    key: "services",
    name: "Client Delivery Flow",
    niche: "Professional Services / Agency",
    summary: "Discovery to delivery with proposal sign-off and QA review.",
    roles: ["Account Manager", "Specialist", "Reviewer", "Billing"],
    stages: [
      { name: "Enquiry", description: "Qualify the lead and log the brief.", role: "Account Manager", slaHours: 8, fields: [
        { label: "Client brief", type: "textarea", required: true },
        { label: "Contact email", type: "email", required: true },
        { label: "Budget indication", type: "currency" },
      ] },
      { name: "Discovery Call", description: "Run the discovery session and capture goals.", role: "Account Manager", slaHours: 48, fields: [
        { label: "Call date", type: "date", required: true },
        { label: "Goals & success measures", type: "textarea", required: true },
        { label: "Notes / recording", type: "file" },
      ] },
      { name: "Proposal", description: "Draft scope, pricing and timeline.", role: "Specialist", backupRole: "Account Manager", slaHours: 72, requiresApproval: true, fields: [
        { label: "Scope of work", type: "textarea", required: true },
        { label: "Fee", type: "currency", required: true },
        { label: "Proposal document", type: "file", required: true },
      ] },
      { name: "Client Approval", description: "Signed proposal before work begins.", role: "Account Manager", slaHours: 120, requiresApproval: true, fields: [
        { label: "Signed proposal", type: "file", required: true },
        { label: "Kick-off date", type: "date", required: true },
      ] },
      { name: "Delivery", description: "Do the work and log deliverables.", role: "Specialist", slaHours: 240, fields: [
        { label: "Deliverables completed", type: "textarea", required: true },
        { label: "Files delivered", type: "file" },
      ] },
      { name: "Quality Review", description: "Internal QA before it reaches the client.", role: "Reviewer", slaHours: 24, requiresApproval: true, fields: [
        { label: "Review passed", type: "checkbox", required: true },
        { label: "Reviewer comments", type: "textarea" },
      ] },
      { name: "Invoicing & Closure", description: "Invoice, gather feedback and close.", role: "Billing", slaHours: 24, fields: [
        { label: "Invoice number", type: "text", required: true },
        { label: "Amount invoiced", type: "currency", required: true },
        { label: "Client feedback", type: "textarea" },
      ] },
    ],
  },
  {
    key: "health",
    name: "Patient Flow",
    niche: "Clinic / Health Practice",
    summary: "Booking to billing with intake, consent and follow-up.",
    roles: ["Receptionist", "Practitioner", "Billing"],
    stages: [
      { name: "Booking", description: "Capture the appointment and patient details.", role: "Receptionist", slaHours: 4, fields: [
        { label: "Patient name", type: "text", required: true },
        { label: "Contact number", type: "tel", required: true },
        { label: "Appointment date", type: "date", required: true },
        { label: "Reason for visit", type: "textarea" },
      ] },
      { name: "Intake & Consent", description: "History, medical aid details and signed consent.", role: "Receptionist", slaHours: 2, fields: [
        { label: "Medical history", type: "textarea", required: true },
        { label: "Medical aid / scheme", type: "text" },
        { label: "Signed consent form", type: "file", required: true },
      ] },
      { name: "Consultation", description: "Clinical assessment and findings.", role: "Practitioner", slaHours: 4, fields: [
        { label: "Assessment findings", type: "textarea", required: true },
        { label: "Diagnosis code", type: "text" },
      ] },
      { name: "Treatment Plan", description: "Agree the plan and any scripts or referrals.", role: "Practitioner", slaHours: 24, requiresApproval: true, fields: [
        { label: "Treatment plan", type: "textarea", required: true },
        { label: "Referral required", type: "checkbox" },
        { label: "Script / documents", type: "file" },
      ] },
      { name: "Follow-up", description: "Check in and book the next visit if needed.", role: "Receptionist", slaHours: 168, fields: [
        { label: "Follow-up outcome", type: "textarea", required: true },
        { label: "Next appointment", type: "date" },
      ] },
      { name: "Billing", description: "Submit the claim or invoice the patient.", role: "Billing", slaHours: 24, fields: [
        { label: "Amount billed", type: "currency", required: true },
        { label: "Claim submitted", type: "checkbox" },
        { label: "Invoice", type: "file" },
      ] },
    ],
  },
  {
    key: "hospitality",
    name: "Event & Catering Flow",
    niche: "Catering / Events / Hospitality",
    summary: "Enquiry to debrief with deposit control and event-day checklist.",
    roles: ["Coordinator", "Chef / Lead", "Logistics", "Accounts"],
    stages: [
      { name: "Enquiry", description: "Log the event date, headcount and venue.", role: "Coordinator", slaHours: 8, fields: [
        { label: "Event date", type: "date", required: true },
        { label: "Guest count", type: "number", required: true },
        { label: "Venue", type: "text", required: true },
      ] },
      { name: "Menu / Brief", description: "Agree menu, dietary needs and styling.", role: "Chef / Lead", slaHours: 48, fields: [
        { label: "Menu selection", type: "textarea", required: true },
        { label: "Dietary requirements", type: "textarea" },
        { label: "Mood board / references", type: "file" },
      ] },
      { name: "Quotation", description: "Price per head plus staffing and hire items.", role: "Coordinator", slaHours: 24, requiresApproval: true, fields: [
        { label: "Price per head", type: "currency", required: true },
        { label: "Quote total", type: "currency", required: true },
      ] },
      { name: "Deposit", description: "Secure the date with a deposit.", role: "Accounts", slaHours: 72, requiresApproval: true, fields: [
        { label: "Deposit amount", type: "currency", required: true },
        { label: "Proof of payment", type: "file", required: true },
      ] },
      { name: "Preparation", description: "Order stock, confirm staff and logistics.", role: "Logistics", slaHours: 72, fields: [
        { label: "Stock ordered", type: "checkbox", required: true },
        { label: "Staff roster", type: "textarea", required: true },
        { label: "Equipment hire confirmed", type: "checkbox" },
      ] },
      { name: "Event Day", description: "Run sheet, service and client check-in.", role: "Chef / Lead", slaHours: 24, fields: [
        { label: "Setup complete time", type: "text", required: true },
        { label: "Issues on the day", type: "textarea" },
        { label: "Event photos", type: "file" },
      ] },
      { name: "Debrief & Final Invoice", description: "Wrap up, invoice the balance and capture lessons.", role: "Accounts", slaHours: 48, fields: [
        { label: "Balance invoiced", type: "currency", required: true },
        { label: "What to improve next time", type: "textarea" },
      ] },
    ],
  },
  {
    key: "logistics",
    name: "Delivery Flow",
    niche: "Logistics / Transport",
    summary: "Booking to POD with load planning and dispatch control.",
    roles: ["Dispatcher", "Driver", "Warehouse", "Accounts"],
    stages: [
      { name: "Booking", description: "Capture collection and delivery details.", role: "Dispatcher", slaHours: 4, fields: [
        { label: "Collection address", type: "text", required: true },
        { label: "Delivery address", type: "text", required: true },
        { label: "Cargo description", type: "textarea", required: true },
        { label: "Weight (kg)", type: "number" },
      ] },
      { name: "Load Planning", description: "Allocate vehicle, driver and route.", role: "Dispatcher", slaHours: 12, fields: [
        { label: "Vehicle", type: "text", required: true },
        { label: "Driver", type: "text", required: true },
        { label: "Planned route notes", type: "textarea" },
      ] },
      { name: "Dispatch", description: "Load, inspect and release the vehicle.", role: "Warehouse", slaHours: 6, requiresApproval: true, fields: [
        { label: "Loaded and secured", type: "checkbox", required: true },
        { label: "Vehicle inspection passed", type: "checkbox", required: true },
        { label: "Departure time", type: "text", required: true },
      ] },
      { name: "In Transit", description: "Track progress and log any delays.", role: "Driver", slaHours: 48, fields: [
        { label: "Current status", type: "select", required: true, options: ["On schedule", "Delayed", "Breakdown", "Rerouted"] },
        { label: "Delay reason", type: "textarea" },
      ] },
      { name: "Proof of Delivery", description: "Signature, photos and condition on arrival.", role: "Driver", slaHours: 12, requiresApproval: true, fields: [
        { label: "Receiver name", type: "text", required: true },
        { label: "POD document / photo", type: "file", required: true },
        { label: "Damage reported", type: "checkbox" },
      ] },
      { name: "Invoicing", description: "Invoice the trip and close it out.", role: "Accounts", slaHours: 24, fields: [
        { label: "Invoice number", type: "text", required: true },
        { label: "Amount", type: "currency", required: true },
      ] },
    ],
  },
  {
    key: "retail",
    name: "Order Fulfilment Flow",
    niche: "Retail / E-commerce",
    summary: "Order to after-sales with payment, picking and shipping checks.",
    roles: ["Sales", "Picker / Packer", "Dispatch", "Support"],
    stages: [
      { name: "Order Received", description: "Log the order and confirm stock availability.", role: "Sales", slaHours: 4, fields: [
        { label: "Order number", type: "text", required: true },
        { label: "Items ordered", type: "textarea", required: true },
        { label: "Order value", type: "currency", required: true },
      ] },
      { name: "Payment Confirmed", description: "Verify payment before picking.", role: "Sales", slaHours: 12, requiresApproval: true, fields: [
        { label: "Payment method", type: "select", required: true, options: ["Card", "EFT", "Cash", "COD", "Payment link"] },
        { label: "Proof of payment", type: "file" },
      ] },
      { name: "Picking", description: "Pick items from stock and flag shortages.", role: "Picker / Packer", slaHours: 8, fields: [
        { label: "All items picked", type: "checkbox", required: true },
        { label: "Shortages / substitutions", type: "textarea" },
      ] },
      { name: "Packing", description: "Pack, label and photograph the parcel.", role: "Picker / Packer", slaHours: 4, fields: [
        { label: "Parcel count", type: "number", required: true },
        { label: "Packed photo", type: "file" },
      ] },
      { name: "Shipping", description: "Hand to courier and record the tracking number.", role: "Dispatch", slaHours: 12, fields: [
        { label: "Courier", type: "text", required: true },
        { label: "Tracking number", type: "text", required: true },
        { label: "Expected delivery", type: "date" },
      ] },
      { name: "Delivered", description: "Confirm delivery with the customer.", role: "Support", slaHours: 72, requiresApproval: true, fields: [
        { label: "Delivery confirmed", type: "checkbox", required: true },
        { label: "Delivery date", type: "date", required: true },
      ] },
      { name: "After-sales", description: "Handle returns, reviews and repeat orders.", role: "Support", slaHours: 168, fields: [
        { label: "Issue raised", type: "checkbox" },
        { label: "Resolution notes", type: "textarea" },
      ] },
    ],
  },
  {
    key: "property",
    name: "Property Maintenance Flow",
    niche: "Property / Facilities",
    summary: "Tenant request to sign-off with contractor dispatch and cost approval.",
    roles: ["Property Manager", "Contractor", "Finance"],
    stages: [
      { name: "Request Logged", description: "Capture the tenant's fault report.", role: "Property Manager", slaHours: 4, fields: [
        { label: "Unit / property", type: "text", required: true },
        { label: "Fault description", type: "textarea", required: true },
        { label: "Urgency", type: "select", required: true, options: ["Emergency", "High", "Normal", "Low"] },
        { label: "Photos", type: "file" },
      ] },
      { name: "Assessment", description: "Inspect and determine the scope of repair.", role: "Contractor", slaHours: 48, fields: [
        { label: "Findings", type: "textarea", required: true },
        { label: "Estimated cost", type: "currency", required: true },
      ] },
      { name: "Cost Approval", description: "Owner or manager approves the spend.", role: "Finance", backupRole: "Property Manager", slaHours: 48, requiresApproval: true, fields: [
        { label: "Approved amount", type: "currency", required: true },
        { label: "Approval note", type: "textarea" },
      ] },
      { name: "Repair Work", description: "Carry out the repair and log materials used.", role: "Contractor", slaHours: 96, fields: [
        { label: "Work done", type: "textarea", required: true },
        { label: "After photos", type: "file", required: true },
      ] },
      { name: "Tenant Sign-off", description: "Tenant confirms the issue is resolved.", role: "Property Manager", slaHours: 48, requiresApproval: true, fields: [
        { label: "Tenant satisfied", type: "checkbox", required: true },
        { label: "Sign-off name", type: "text", required: true },
      ] },
      { name: "Invoice & Close", description: "Process the contractor invoice and close.", role: "Finance", slaHours: 48, fields: [
        { label: "Invoice", type: "file", required: true },
        { label: "Amount paid", type: "currency", required: true },
      ] },
    ],
  },
  {
    key: "education",
    name: "Student Enrolment Flow",
    niche: "Education / Training",
    summary: "Enquiry to certification with documents, payment and attendance.",
    roles: ["Admissions", "Facilitator", "Finance"],
    stages: [
      { name: "Enquiry", description: "Capture the prospective student's interest.", role: "Admissions", slaHours: 8, fields: [
        { label: "Student name", type: "text", required: true },
        { label: "Email", type: "email", required: true },
        { label: "Course of interest", type: "text", required: true },
      ] },
      { name: "Application & Documents", description: "Collect ID, qualifications and application form.", role: "Admissions", slaHours: 72, fields: [
        { label: "ID document", type: "file", required: true },
        { label: "Qualification certificates", type: "file" },
        { label: "Application form", type: "file", required: true },
      ] },
      { name: "Acceptance", description: "Review and accept or decline the application.", role: "Admissions", slaHours: 48, requiresApproval: true, fields: [
        { label: "Outcome", type: "select", required: true, options: ["Accepted", "Waitlisted", "Declined"] },
        { label: "Reason / conditions", type: "textarea" },
      ] },
      { name: "Payment", description: "Registration fee or funding confirmation.", role: "Finance", slaHours: 72, requiresApproval: true, fields: [
        { label: "Amount received", type: "currency", required: true },
        { label: "Proof of payment", type: "file", required: true },
      ] },
      { name: "Course Delivery", description: "Run the course and track attendance.", role: "Facilitator", slaHours: 720, fields: [
        { label: "Attendance %", type: "number", required: true },
        { label: "Assessment results", type: "textarea" },
      ] },
      { name: "Certification", description: "Issue the certificate and close the record.", role: "Admissions", slaHours: 72, fields: [
        { label: "Certificate issued", type: "checkbox", required: true },
        { label: "Certificate file", type: "file" },
      ] },
    ],
  },
];

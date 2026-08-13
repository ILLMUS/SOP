import {
  LayoutDashboard,
  Megaphone,
  Handshake,
  Factory,
  Workflow,
  Users,
  Wallet,
  BarChart3,
  ShieldCheck,
  Briefcase,
  ClipboardList,
  UserCog,
  Settings,
  FileText,
  Receipt,
  Building2,
  Contact,
  Target,
  Activity,
  CheckSquare,
  MessageSquare,
  CalendarDays,
  FileSignature,
  Percent,
  Share2,
  LayoutList,
  GitBranch,
  ListChecks,
  BadgeCheck,
  Timer,
  FormInput,
  Files,
  FileBarChart,
  CreditCard,
  Banknote,
  Package,
  LifeBuoy,
  Wrench,
  Star,
  Gauge,
  History,
  UsersRound,
  Plug,
  Rocket,
  SlidersHorizontal,
} from "lucide-react";

export interface ModuleLink {
  to: string;
  label: string;
  icon?: React.ElementType;
  adminOnly?: boolean;
}

export interface ModuleGroup {
  key: string;
  label: string;
  icon: React.ElementType;
  to: string;
  adminOnly?: boolean;
  children?: ModuleLink[];
}

/** A single row in the grouped sidebar navigation. */
export interface NavItem {
  label: string;
  icon: React.ElementType;
  to: string;
  end?: boolean;
  adminOnly?: boolean;
  /** Key of a live counter resolved by the sidebar (jobs, approvals, assignments...). */
  count?: "jobs" | "approvals" | "assignments" | "overdue";
}

export interface NavSection {
  /** Undefined for the top ungrouped block. */
  label?: string;
  items: NavItem[];
}

/**
 * Grouped Business OS navigation. Every entry points at a route that exists —
 * modules without a dedicated page yet resolve to their module hub.
 */
export const NAV_SECTIONS: NavSection[] = [
  {
    items: [
      { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard", end: true },
      { label: "My Work", icon: Rocket, to: "/jobs", count: "assignments" },
    ],
  },
  {
    label: "Outreach & CRM",
    items: [
      { label: "Prospects", icon: Target, to: "/crm/accounts" },
      { label: "Accounts", icon: Building2, to: "/crm/accounts" },
      { label: "Contacts", icon: Contact, to: "/crm/contacts" },
      { label: "Campaigns", icon: Megaphone, to: "/outreach" },
      { label: "Leads", icon: Handshake, to: "/crm/leads" },
      { label: "Opportunities", icon: Percent, to: "/crm/opportunities" },
      { label: "Activities", icon: Activity, to: "/crm/activities" },
      { label: "Tasks & Follow-ups", icon: CheckSquare, to: "/crm/activities" },
      { label: "Communications", icon: MessageSquare, to: "/outreach" },
      { label: "Meetings", icon: CalendarDays, to: "/outreach" },
      { label: "Proposals", icon: FileSignature, to: "/sales" },
      { label: "Deals", icon: Handshake, to: "/crm/deals" },
      { label: "Partners & Referrals", icon: Share2, to: "/outreach" },
      { label: "Reports", icon: FileBarChart, to: "/admin/reports", adminOnly: true },
    ],
  },
  {
    label: "SOP & Operations",
    items: [
      { label: "SOP Templates", icon: LayoutList, to: "/admin/sop", adminOnly: true },
      { label: "Workflows", icon: GitBranch, to: "/admin/sop", adminOnly: true },
      { label: "Jobs / Projects", icon: Briefcase, to: "/jobs" },
      { label: "Job Pipeline", icon: Workflow, to: "/operations" },
      { label: "My Assignments", icon: ListChecks, to: "/jobs", count: "assignments" },
      { label: "Approvals", icon: BadgeCheck, to: "/operations", count: "approvals" },
      { label: "SLA Monitor", icon: Timer, to: "/operations", count: "overdue" },
      { label: "Forms", icon: FormInput, to: "/admin/sop", adminOnly: true },
      { label: "Documents", icon: Files, to: "/operations" },
    ],
  },
  {
    label: "Finance",
    items: [
      { label: "Quotes", icon: FileText, to: "/finance" },
      { label: "Invoices", icon: Receipt, to: "/finance" },
      { label: "Payments", icon: CreditCard, to: "/finance" },
      { label: "Expenses", icon: Banknote, to: "/finance" },
      { label: "Products & Services", icon: Package, to: "/finance" },
    ],
  },
  {
    label: "Customer Success",
    items: [
      { label: "Clients", icon: Users, to: "/crm/accounts" },
      { label: "Onboarding", icon: ClipboardList, to: "/clients" },
      { label: "Support Tickets", icon: LifeBuoy, to: "/clients" },
      { label: "Maintenance", icon: Wrench, to: "/operations" },
      { label: "Feedback", icon: Star, to: "/clients" },
    ],
  },
  {
    label: "Management",
    items: [
      { label: "Reports & Analytics", icon: BarChart3, to: "/reports" },
      { label: "Performance", icon: Gauge, to: "/reports" },
      { label: "Audit Trail", icon: History, to: "/admin/reports", adminOnly: true },
    ],
  },
  {
    label: "Administration",
    items: [
      { label: "Users & Roles", icon: UserCog, to: "/admin/users", adminOnly: true },
      { label: "Teams", icon: UsersRound, to: "/admin/roles", adminOnly: true },
      { label: "Business Configuration", icon: SlidersHorizontal, to: "/admin/configuration", adminOnly: true },
      { label: "Settings", icon: Settings, to: "/settings" },
      { label: "Integrations", icon: Plug, to: "/admin/integrations", adminOnly: true },
    ],
  },
];

/** Page titles + subtitles used by the app header, longest match wins. */
export const ROUTE_TITLES: { path: string; title: string; subtitle: string }[] = [
  { path: "/dashboard", title: "Dashboard", subtitle: "Here's what's happening across your workspace." },
  { path: "/jobs/new", title: "New Job", subtitle: "Start a work item from one of your workflows." },
  { path: "/jobs", title: "Jobs / Projects", subtitle: "Every work item running through your SOP engine." },
  { path: "/crm/accounts", title: "Accounts & Prospects", subtitle: "Prospect to client, in one place." },
  { path: "/crm/contacts", title: "Contacts", subtitle: "People linked to their accounts." },
  { path: "/crm/leads", title: "Leads", subtitle: "Qualify enquiries and convert them." },
  { path: "/crm/opportunities", title: "Opportunities", subtitle: "Qualified work in play." },
  { path: "/crm/deals", title: "Deals", subtitle: "Close deals and start the work." },
  { path: "/crm/activities", title: "Activities & Follow-ups", subtitle: "Calls, meetings, notes and tasks." },
  { path: "/outreach", title: "Outreach & CRM", subtitle: "Prospects, campaigns and follow-ups." },
  { path: "/sales", title: "Sales", subtitle: "Leads, opportunities and proposals." },
  { path: "/operations", title: "Operations", subtitle: "Pipeline, SLAs and delivery." },
  { path: "/clients", title: "Clients", subtitle: "Accounts, onboarding and support." },
  { path: "/finance", title: "Finance", subtitle: "Quotes, invoices and payments." },
  { path: "/admin/sop", title: "SOP Builder", subtitle: "Design the workflows your business runs on." },
  { path: "/admin/roles", title: "Roles & Teams", subtitle: "Who is responsible for each stage." },
  { path: "/admin/configuration", title: "Business Configuration", subtitle: "Define how your Business OS operates." },
  { path: "/admin/integrations", title: "Integration Center", subtitle: "Connect your workspace to external tools and services." },
  { path: "/admin/users", title: "Users & Roles", subtitle: "Manage workspace access." },
  { path: "/admin/assignments", title: "Stage Assignments", subtitle: "Legacy stage ownership defaults." },
  { path: "/admin/reports", title: "Reports & Analytics", subtitle: "Performance across the operation." },
  { path: "/reports", title: "Reports & Analytics", subtitle: "Performance across the operation." },
  { path: "/settings", title: "Settings", subtitle: "Profile, appearance, notifications and admin." },
];

/** Business OS module map. Existing pages are wired in rather than duplicated. */
export const MODULES: ModuleGroup[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
  { key: "outreach", label: "Outreach", icon: Megaphone, to: "/outreach" },
  { key: "sales", label: "Sales", icon: Handshake, to: "/sales" },
  {
    key: "operations",
    label: "Operations",
    icon: Factory,
    to: "/operations",
    children: [
      { to: "/jobs", label: "Jobs", icon: Briefcase },
      { to: "/admin/assignments", label: "Legacy Stages", icon: ClipboardList, adminOnly: true },
    ],
  },
  {
    key: "sop",
    label: "SOP",
    icon: Workflow,
    to: "/admin/sop",
    adminOnly: true,
    children: [
      { to: "/admin/sop", label: "SOP Builder", icon: Workflow, adminOnly: true },
      { to: "/admin/roles", label: "Roles", icon: UserCog, adminOnly: true },
    ],
  },
  { key: "clients", label: "Clients", icon: Users, to: "/clients" },
  {
    key: "finance",
    label: "Finance",
    icon: Wallet,
    to: "/finance",
    children: [
      { to: "/finance", label: "Overview", icon: Receipt },
    ],
  },
  { key: "reporting", label: "Reporting", icon: BarChart3, to: "/admin/reports", adminOnly: true },
  {
    key: "admin",
    label: "Admin",
    icon: ShieldCheck,
    to: "/admin/users",
    adminOnly: true,
    children: [
      { to: "/admin/users", label: "User Management", icon: Users, adminOnly: true },
      { to: "/settings", label: "Settings", icon: Settings },
      { to: "/admin/reports", label: "Reports", icon: FileText, adminOnly: true },
    ],
  },
];
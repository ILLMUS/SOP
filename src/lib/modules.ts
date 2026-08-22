import {
  LayoutDashboard,
  Target,
  Handshake,
  Percent,
  CheckSquare,
  LayoutList,
  GitBranch,
  Briefcase,
  ListChecks,
  Timer,
  ClipboardCheck,
  FileText,
  Receipt,
  CreditCard,
  Banknote,
  Users,
  ClipboardList,
  LifeBuoy,
  Wrench,
  BarChart3,
  Gauge,
  Activity,
  UserCog,
  UsersRound,
  Settings,
  Plug,
  ShieldCheck,
  Megaphone,
  Building2,
  Contact,
  MessageSquare,
  CalendarDays,
  FileSignature,
  Share2,
  Package,
  Files,
  FormInput,
  Workflow,
  Factory,
  Wallet,
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

/**
 * Live counters used by the sidebar.
 */
export type NavCount =
  | "jobs"
  | "approvals"
  | "assignments"
  | "overdue";

/**
 * A single navigation item.
 */
export interface NavItem {
  label: string;
  icon: React.ElementType;
  to: string;
  end?: boolean;
  adminOnly?: boolean;
  count?: NavCount;
}

/**
 * Sidebar navigation section.
 *
 * Sections intentionally use business language rather than
 * software/enterprise terminology.
 */
export interface NavSection {
  label?: string;
  items: NavItem[];
}

/**
 * ============================================================
 * HUSTLEOS SIDEBAR
 * ============================================================
 *
 * COMMAND CENTER — What's happening?
 * GROW            — Where is the next money coming from?
 * OPERATE         — What work needs to get done?
 * FINANCE         — What have we quoted, billed and collected?
 * CLIENTS         — Who are we serving?
 * INSIGHTS        — How are we performing?
 *
 * Administration is intentionally kept out of the main
 * navigation. It belongs behind the user's profile/settings.
 */
export const NAV_SECTIONS: NavSection[] = [

  // ==========================================================
  // COMMAND CENTER
  // ==========================================================
  {
    items: [
      {
        label: "Command Center",
        icon: LayoutDashboard,
        to: "/dashboard",
        end: true,
      },
    ],
  },

  // ==========================================================
  // GROW
  // ==========================================================
  {
    label: "Grow",
    items: [
      {
        label: "Prospects",
        icon: Target,
        to: "/crm/accounts",
      },
      {
        label: "Leads",
        icon: Handshake,
        to: "/crm/leads",
      },
      {
        label: "Opportunities",
        icon: Percent,
        to: "/crm/opportunities",
      },
      {
        label: "Deals",
        icon: Handshake,
        to: "/crm/deals",
      },
      {
        label: "Follow-ups",
        icon: CheckSquare,
        to: "/crm/activities",
      },
    ],
  },

  // ==========================================================
  // OPERATE
  // ==========================================================
  {
    label: "Operate",
    items: [
      {
        label: "SOP Templates",
        icon: LayoutList,
        to: "/admin/sop",
        adminOnly: true,
      },
      {
        label: "Workflows",
        icon: GitBranch,
        to: "/admin/sop",
        adminOnly: true,
      },
      {
        label: "Jobs",
        icon: Briefcase,
        to: "/jobs",
        count: "jobs",
      },
      {
        label: "My Assignments",
        icon: ListChecks,
        to: "/jobs",
        count: "assignments",
      },
      {
        label: "SLA Monitor",
        icon: Timer,
        to: "/operations",
        count: "overdue",
      },
      {
        label: "Quality Control",
        icon: ClipboardCheck,
        to: "/operations/qc",
      },
      {
        label: "Scheduling",
        icon: CalendarDays,
        to: "/operations/schedule",
      },
      {
        label: "Team Allocation",
        icon: Users,
        to: "/operations/allocation",
      },
      {
        label: "Documents",
        icon: Files,
        to: "/operations",
      },
    ],
  },

  // ==========================================================
  // FINANCE
  // ==========================================================
  {
    label: "Finance",
    items: [
      {
        label: "Quotes",
        icon: FileText,
        to: "/finance",
      },
      {
        label: "Invoices",
        icon: Receipt,
        to: "/finance",
      },
      {
        label: "Payments",
        icon: CreditCard,
        to: "/finance",
      },
      {
        label: "Expenses",
        icon: Banknote,
        to: "/finance",
      },
      {
        label: "Products & Services",
        icon: Package,
        to: "/finance",
      },
    ],
  },

  // ==========================================================
  // CLIENTS
  // ==========================================================
  {
    label: "Clients",
    items: [
      {
        label: "Clients",
        icon: Users,
        to: "/crm/accounts",
      },
      {
        label: "Contacts",
        icon: Contact,
        to: "/crm/contacts",
      },
      {
        label: "Client Portal",
        icon: ClipboardList,
        to: "/clients/portal",
      },
      {
        label: "Support",
        icon: LifeBuoy,
        to: "/clients/tickets",
      },
      {
        label: "Renewals",
        icon: Wrench,
        to: "/clients/reminders",
      },
      {
        label: "Feedback",
        icon: Handshake,
        to: "/clients/feedback",
      },
    ],
  },

  // ==========================================================
  // INSIGHTS
  // ==========================================================
  {
    label: "Insights",
    items: [
      {
        label: "Reports",
        icon: BarChart3,
        to: "/reports",
      },
      {
        label: "Performance",
        icon: Gauge,
        to: "/reports",
      },
      {
        label: "Activity",
        icon: Activity,
        to: "/crm/activities",
      },
    ],
  },

  // ==========================================================
  // ADMINISTRATION
  // ==========================================================
  //
  // Kept available to the sidebar implementation, but only
  // exposed to administrators.
  //
  // If you want an ultra-clean HUSTLEOS sidebar, these can
  // later be moved completely into the profile menu.
  //
  {
    label: "Administration",
    items: [
      {
        label: "Users & Roles",
        icon: UserCog,
        to: "/admin/users",
        adminOnly: true,
      },
      {
        label: "Teams",
        icon: UsersRound,
        to: "/admin/roles",
        adminOnly: true,
      },
      {
        label: "Business Settings",
        icon: SlidersHorizontal,
        to: "/admin/configuration",
        adminOnly: true,
      },
      {
        label: "Integrations",
        icon: Plug,
        to: "/admin/integrations",
        adminOnly: true,
      },
      {
        label: "Audit Trail",
        icon: ShieldCheck,
        to: "/admin/reports",
        adminOnly: true,
      },
      {
        label: "Settings",
        icon: Settings,
        to: "/settings",
      },
    ],
  },
];

/**
 * ============================================================
 * ROUTE TITLES
 * ============================================================
 */

export const ROUTE_TITLES: {
  path: string;
  title: string;
  subtitle: string;
}[] = [

  // ----------------------------------------------------------
  // COMMAND CENTER
  // ----------------------------------------------------------
  {
    path: "/dashboard",
    title: "Command Center",
    subtitle: "What's happening across your business.",
  },

  // ----------------------------------------------------------
  // GROW
  // ----------------------------------------------------------
  {
    path: "/crm/accounts",
    title: "Prospects",
    subtitle: "Businesses and people you could be doing business with.",
  },
  {
    path: "/crm/contacts",
    title: "Contacts",
    subtitle: "The people behind your prospects, clients and deals.",
  },
  {
    path: "/crm/leads",
    title: "Leads",
    subtitle: "Turn enquiries into real business opportunities.",
  },
  {
    path: "/crm/opportunities",
    title: "Opportunities",
    subtitle: "Business currently in play.",
  },
  {
    path: "/crm/deals",
    title: "Deals",
    subtitle: "Track the business you're working to close.",
  },
  {
    path: "/crm/activities",
    title: "Follow-ups",
    subtitle: "Calls, meetings, tasks and the next action.",
  },
  {
    path: "/outreach",
    title: "Grow",
    subtitle: "Build relationships and create new business.",
  },
  {
    path: "/sales/win-loss",
    title: "Win / Loss",
    subtitle: "Understand why business is won or lost.",
  },
  {
    path: "/sales/forecast",
    title: "Sales Forecast",
    subtitle: "See the value of business currently in your pipeline.",
  },
  {
    path: "/sales/proposals",
    title: "Proposals",
    subtitle: "Prepare proposals that move opportunities forward.",
  },

  // ----------------------------------------------------------
  // OPERATE
  // ----------------------------------------------------------
  {
    path: "/jobs/new",
    title: "New Job",
    subtitle: "Start work from one of your business workflows.",
  },
  {
    path: "/jobs",
    title: "Jobs",
    subtitle: "Everything your business is currently working on.",
  },
  {
    path: "/operations/schedule",
    title: "Scheduling",
    subtitle: "Plan work around deadlines and available capacity.",
  },
  {
    path: "/operations/allocation",
    title: "Team Allocation",
    subtitle: "Make sure every job has an owner.",
  },
  {
    path: "/operations/qc",
    title: "Quality Control",
    subtitle: "Check work before it moves to the next stage.",
  },
  {
    path: "/operations",
    title: "Operations",
    subtitle: "Monitor the work moving through your business.",
  },
  {
    path: "/admin/sop",
    title: "SOP Templates",
    subtitle: "Build the processes your business runs on.",
  },
  {
    path: "/admin/roles",
    title: "Roles & Teams",
    subtitle: "Define who is responsible for each part of the work.",
  },

  // ----------------------------------------------------------
  // FINANCE
  // ----------------------------------------------------------
  {
    path: "/finance",
    title: "Finance",
    subtitle: "What have we quoted, billed and collected?",
  },

  // ----------------------------------------------------------
  // CLIENTS
  // ----------------------------------------------------------
  {
    path: "/clients",
    title: "Clients",
    subtitle: "The people and businesses you serve.",
  },
  {
    path: "/clients/portal",
    title: "Client Portal",
    subtitle: "Give clients visibility into their work.",
  },
  {
    path: "/clients/tickets",
    title: "Support",
    subtitle: "Manage client issues, requests and support.",
  },
  {
    path: "/clients/feedback",
    title: "Feedback",
    subtitle: "Learn what clients think about your service.",
  },
  {
    path: "/clients/reminders",
    title: "Renewals",
    subtitle: "Keep recurring work and maintenance from being forgotten.",
  },

  // ----------------------------------------------------------
  // INSIGHTS
  // ----------------------------------------------------------
  {
    path: "/reports",
    title: "Reports",
    subtitle: "Understand what's happening across your business.",
  },
  {
    path: "/admin/reports",
    title: "Reports & Analytics",
    subtitle: "Performance across your business.",
  },

  // ----------------------------------------------------------
  // ADMINISTRATION
  // ----------------------------------------------------------
  {
    path: "/admin/users",
    title: "Users & Roles",
    subtitle: "Control who has access to your business.",
  },
  {
    path: "/admin/configuration",
    title: "Business Settings",
    subtitle: "Configure how HUSTLEOS works for your business.",
  },
  {
    path: "/admin/integrations",
    title: "Integrations",
    subtitle: "Connect HUSTLEOS with the tools you use.",
  },
  {
    path: "/settings",
    title: "Settings",
    subtitle: "Manage your profile and application preferences.",
  },
];

/**
 * ============================================================
 * BUSINESS OS MODULE MAP
 * ============================================================
 *
 * Kept for existing parts of the application that consume
 * MODULES rather than NAV_SECTIONS.
 */
export const MODULES: ModuleGroup[] = [

  {
    key: "dashboard",
    label: "Command Center",
    icon: LayoutDashboard,
    to: "/dashboard",
  },

  {
    key: "grow",
    label: "Grow",
    icon: Target,
    to: "/outreach",
    children: [
      {
        to: "/crm/accounts",
        label: "Prospects",
        icon: Target,
      },
      {
        to: "/crm/leads",
        label: "Leads",
        icon: Handshake,
      },
      {
        to: "/crm/opportunities",
        label: "Opportunities",
        icon: Percent,
      },
      {
        to: "/crm/deals",
        label: "Deals",
        icon: Handshake,
      },
      {
        to: "/crm/activities",
        label: "Follow-ups",
        icon: CheckSquare,
      },
    ],
  },

  {
    key: "operate",
    label: "Operate",
    icon: Factory,
    to: "/operations",
    children: [
      {
        to: "/admin/sop",
        label: "SOP Templates",
        icon: LayoutList,
        adminOnly: true,
      },
      {
        to: "/admin/sop",
        label: "Workflows",
        icon: GitBranch,
        adminOnly: true,
      },
      {
        to: "/jobs",
        label: "Jobs",
        icon: Briefcase,
      },
      {
        to: "/jobs",
        label: "My Assignments",
        icon: ListChecks,
      },
      {
        to: "/operations",
        label: "SLA Monitor",
        icon: Timer,
      },
      {
        to: "/operations/qc",
        label: "Quality Control",
        icon: ClipboardCheck,
      },
    ],
  },

  {
    key: "finance",
    label: "Finance",
    icon: Wallet,
    to: "/finance",
    children: [
      {
        to: "/finance",
        label: "Quotes",
        icon: FileText,
      },
      {
        to: "/finance",
        label: "Invoices",
        icon: Receipt,
      },
      {
        to: "/finance",
        label: "Payments",
        icon: CreditCard,
      },
      {
        to: "/finance",
        label: "Expenses",
        icon: Banknote,
      },
    ],
  },

  {
    key: "clients",
    label: "Clients",
    icon: Users,
    to: "/clients",
    children: [
      {
        to: "/crm/accounts",
        label: "Clients",
        icon: Users,
      },
      {
        to: "/clients/portal",
        label: "Client Portal",
        icon: ClipboardList,
      },
      {
        to: "/clients/tickets",
        label: "Support",
        icon: LifeBuoy,
      },
      {
        to: "/clients/reminders",
        label: "Renewals",
        icon: Wrench,
      },
    ],
  },

  {
    key: "insights",
    label: "Insights",
    icon: BarChart3,
    to: "/reports",
    children: [
      {
        to: "/reports",
        label: "Reports",
        icon: BarChart3,
      },
      {
        to: "/reports",
        label: "Performance",
        icon: Gauge,
      },
      {
        to: "/crm/activities",
        label: "Activity",
        icon: Activity,
      },
    ],
  },

  {
    key: "administration",
    label: "Administration",
    icon: ShieldCheck,
    to: "/admin/users",
    adminOnly: true,
    children: [
      {
        to: "/admin/users",
        label: "Users & Roles",
        icon: UserCog,
        adminOnly: true,
      },
      {
        to: "/admin/roles",
        label: "Teams",
        icon: UsersRound,
        adminOnly: true,
      },
      {
        to: "/admin/configuration",
        label: "Business Settings",
        icon: SlidersHorizontal,
        adminOnly: true,
      },
      {
        to: "/admin/integrations",
        label: "Integrations",
        icon: Plug,
        adminOnly: true,
      },
      {
        to: "/settings",
        label: "Settings",
        icon: Settings,
      },
    ],
  },
];
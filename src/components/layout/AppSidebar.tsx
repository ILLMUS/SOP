import { NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Settings,
  ClipboardList,
  BarChart3,
  Workflow,
  UserCog,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
  open: boolean;
  onClose: () => void;
}

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, adminOnly: false },
  { to: "/jobs", label: "Jobs", icon: Briefcase, adminOnly: false },
  { to: "/admin/sop", label: "SOP Builder", icon: Workflow, adminOnly: true },
  { to: "/admin/roles", label: "Roles", icon: UserCog, adminOnly: true },
  { to: "/admin/users", label: "User Management", icon: Users, adminOnly: true },
  { to: "/admin/assignments", label: "Legacy Stages", icon: ClipboardList, adminOnly: true },
  { to: "/admin/reports", label: "Reports", icon: BarChart3, adminOnly: true },
  { to: "/settings", label: "Settings", icon: Settings, adminOnly: false },
];

export default function AppSidebar({ open, onClose }: AppSidebarProps) {
  const { isAdmin, organization } = useAuth();

  const filteredNav = navItems.filter((item) => !item.adminOnly || isAdmin);

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full w-56 flex-col bg-sidebar text-sidebar-foreground transition-transform duration-200 md:static md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand */}
        <div className="flex h-14 items-center px-4 border-b border-sidebar-border">
          <span className="truncate font-heading text-lg font-bold uppercase text-sidebar-primary">
            {organization?.name ?? "Workspace"}
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {filteredNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )
              }
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <p className="text-[10px] uppercase tracking-widest text-sidebar-foreground/40">
            SOP Pipeline v1.0
          </p>
        </div>
      </aside>
    </>
  );
}

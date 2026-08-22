import { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { NAV_SECTIONS } from "@/lib/modules";
import { ROLE_LABELS } from "@/lib/constants";

import {
  Boxes,
  ChevronDown,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreVertical,
  LogOut,
} from "lucide-react";

interface AppSidebarProps {
  open: boolean;
  onClose: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

type Counts = Record<
  "jobs" | "approvals" | "assignments" | "overdue",
  number
>;

export default function AppSidebar({
  open,
  onClose,
  collapsed,
  onToggleCollapse,
}: AppSidebarProps) {
  const { isAdmin, organization, profile, roles, user, signOut } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [counts, setCounts] = useState<Counts>({
    jobs: 0,
    approvals: 0,
    assignments: 0,
    overdue: 0,
  });

  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set()
  );

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mobileProfileMenuOpen, setMobileProfileMenuOpen] = useState(false);

  /*
   * ------------------------------------------------------------
   * ACTIVE NAVIGATION SECTIONS
   * ------------------------------------------------------------
   */

  const activeSectionKeys = useMemo(() => {
    const active = new Set<string>();

    NAV_SECTIONS.forEach((section, index) => {
      const sectionKey = section.label ?? `top-${index}`;

      const visibleItems = section.items.filter(
        (item) => !item.adminOnly || isAdmin
      );

      const sectionIsActive = visibleItems.some((item) =>
        item.end
          ? pathname === item.to
          : pathname.startsWith(item.to)
      );

      if (sectionIsActive) {
        active.add(sectionKey);
      }
    });

    return active;
  }, [pathname, isAdmin]);

  /*
   * Automatically open the section containing
   * the current page.
   */

  useEffect(() => {
    setOpenSections((previous) => {
      const next = new Set(previous);

      activeSectionKeys.forEach((key) => {
        next.add(key);
      });

      return next;
    });
  }, [activeSectionKeys]);

  /*
   * ------------------------------------------------------------
   * SECTION TOGGLE
   * ------------------------------------------------------------
   */

  const toggleSection = (key: string) => {
    setOpenSections((previous) => {
      const next = new Set(previous);

      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }

      return next;
    });
  };

  /*
   * ------------------------------------------------------------
   * SIDEBAR COUNTS
   * ------------------------------------------------------------
   */

  useEffect(() => {
    let cancelled = false;

    const loadCounts = async () => {
      try {
        const [
          jobsRes,
          approvalsRes,
          assignmentsRes,
          slaRes,
        ] = await Promise.all([
          supabase
            .from("jobs")
            .select("id", {
              count: "exact",
              head: true,
            })
            .eq("status", "active"),

          supabase
            .from("job_stages")
            .select("id", {
              count: "exact",
              head: true,
            })
            .eq("status", "pending_approval"),

          user
            ? supabase
                .from("job_stages")
                .select("id", {
                  count: "exact",
                  head: true,
                })
                .in("status", [
                  "active",
                  "pending_approval",
                ])
                .or(
                  `primary_owner_id.eq.${user.id},secondary_owner_id.eq.${user.id}`
                )
            : Promise.resolve({
                count: 0,
              } as any),

          supabase
            .from("job_stages")
            .select(
              "sla_started_at, sla_deadline_hours"
            )
            .eq("status", "active")
            .not("sla_started_at", "is", null)
            .not("sla_deadline_hours", "is", null),
        ]);

        const now = Date.now();

        const overdue = ((slaRes as any).data || []).filter(
          (stage: any) => {
            const deadline =
              new Date(stage.sla_started_at).getTime() +
              stage.sla_deadline_hours * 3600_000;

            return now > deadline;
          }
        ).length;

        if (!cancelled) {
          setCounts({
            jobs: jobsRes.count ?? 0,
            approvals: approvalsRes.count ?? 0,
            assignments:
              (assignmentsRes as any).count ?? 0,
            overdue,
          });
        }
      } catch (error) {
        console.error(
          "Failed to load HustleOS sidebar counts:",
          error
        );
      }
    };

    loadCounts();

    return () => {
      cancelled = true;
    };
  }, [user]);

  /*
   * ------------------------------------------------------------
   * USER INITIALS
   * ------------------------------------------------------------
   */

  const initials = (profile?.full_name || "U")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  /*
   * Filter out Administration section entirely and Settings from main navigation
   */
  const filteredNavSections = useMemo(() => {
    const adminTargets = [
      "users & roles",
      "teams",
      "business settings",
      "integrations",
      "audit trail",
      "settings",
    ];

    return NAV_SECTIONS.map((section) => {
      const items = section.items.filter((item) => {
        const labelLower = item.label.toLowerCase();
        return !adminTargets.includes(labelLower);
      });
      return {
        ...section,
        items,
      };
    }).filter((section) => section.items.length > 0 && section.label?.toLowerCase() !== "administration");
  }, []);

  /*
   * Extract Administration and Settings items specifically for the profile dropdown menu
   */
  const dropdownAdminItems = useMemo(() => {
    const adminTargets = [
      "users & roles",
      "teams",
      "business settings",
      "integrations",
      "audit trail",
      "settings",
    ];

    const extracted: any[] = [];
    NAV_SECTIONS.forEach((section) => {
      section.items.forEach((item) => {
        const labelLower = item.label.toLowerCase();
        if (adminTargets.includes(labelLower)) {
          if (!item.adminOnly || isAdmin) {
            extracted.push(item);
          }
        }
      });
    });
    return extracted;
  }, [isAdmin]);

  /*
   * ------------------------------------------------------------
   * RENDER
   * ------------------------------------------------------------
   */

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-foreground/30 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full flex-col",
          "bg-sidebar text-sidebar-foreground",
          "transition-all duration-200",
          "lg:static lg:translate-x-0",
          collapsed ? "w-[76px]" : "w-64",
          open
            ? "translate-x-0"
            : "-translate-x-full"
        )}
      >
        {/* HUSTLEOS BRAND */}
        <NavLink
          to="/dashboard"
          end
          onClick={onClose}
          title={
            collapsed
              ? "HUSTLEOS — Command Center"
              : undefined
          }
          className={cn(
            "flex h-16 shrink-0 items-center gap-2.5 px-4",
            "transition-colors",
            "hover:bg-sidebar-accent/60",
            pathname === "/dashboard" &&
              "bg-sidebar-accent/30"
          )}
        >
          <div
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
              "bg-sidebar-primary",
              "transition-transform duration-200",
              "group-hover:scale-105"
            )}
          >
            <Boxes
              className="h-[18px] w-[18px] text-sidebar-primary-foreground"
              strokeWidth={2.2}
            />
          </div>

          {!collapsed && (
            <div className="min-w-0">
              <div className="truncate font-heading text-[17px] font-extrabold tracking-tight text-white">
                HUSTLEOS
              </div>
              <div className="truncate text-[9px] font-semibold uppercase tracking-[0.18em] text-sidebar-foreground/40">
                Business Operating System
              </div>
            </div>
          )}
        </NavLink>

        {/* MOBILE-ONLY TOP PROFILE MENU BAR (Near Insights / Workspace) */}
        <div className="relative px-3 pb-3 lg:hidden border-b border-sidebar-border/60 mb-2">
          <div className="flex items-center justify-between mb-1.5 px-1">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40">
              Account & Profile
            </p>
          </div>
          
          <button
            type="button"
            onClick={() => setMobileProfileMenuOpen((prev) => !prev)}
            className="flex w-full items-center gap-2 rounded-lg border border-sidebar-border bg-sidebar-accent/80 px-2.5 py-2 text-left text-[13px] font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
          >
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-[10px] font-bold text-sidebar-primary-foreground">
              {initials}
            </div>
            <span className="flex-1 truncate">
              {profile?.full_name ?? "User Profile"}
            </span>
            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-sidebar-foreground/50" />
          </button>

          {/* Mobile Dropdown Panel */}
          {mobileProfileMenuOpen && (
            <div className="absolute left-3 right-3 top-full mt-1 rounded-lg border border-sidebar-border bg-sidebar-accent p-1.5 shadow-xl z-50 space-y-1 text-sidebar-foreground">
              {dropdownAdminItems.length > 0 && (
                <div className="mb-1 border-b border-sidebar-border/50 pb-1">
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-sidebar-foreground/45">
                    Administration
                  </div>
                  {dropdownAdminItems.map((adminItem, i) => (
                    <NavLink
                      key={`mob-admin-${i}`}
                      to={adminItem.to}
                      onClick={() => {
                        setMobileProfileMenuOpen(false);
                        onClose();
                      }}
                      className="flex items-center gap-2 rounded-md px-2 py-1.5 text-[12px] font-medium hover:bg-sidebar-primary hover:text-sidebar-primary-foreground transition-colors"
                    >
                      <adminItem.icon className="h-3.5 w-3.5" />
                      <span className="truncate">{adminItem.label}</span>
                    </NavLink>
                  ))}
                </div>
              )}

              {signOut && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileProfileMenuOpen(false);
                    signOut();
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-[12px] font-medium text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Log out</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* WORKSPACE (Desktop only) */}
        {!collapsed && (
          <div className="hidden lg:block px-3 pb-3">
            <p className="mb-1.5 px-1 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40">
              Business
            </p>
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-lg border border-sidebar-border bg-sidebar-accent/60 px-2.5 py-2 text-left text-[13px] font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
            >
              <Boxes className="h-3.5 w-3.5 shrink-0 text-sidebar-foreground/60" />
              <span className="flex-1 truncate">
                {organization?.name ?? "My Business"}
              </span>
              <ChevronDown className="h-3.5 w-3.5 shrink-0 text-sidebar-foreground/50" />
            </button>
          </div>
        )}

        {/* NAVIGATION (Filtered items) */}
        <nav className="thin-scroll flex-1 overflow-y-auto px-3 pb-4">
          {filteredNavSections.map((section, index) => {
            const sectionKey =
              section.label ?? `top-${index}`;

            const items = section.items;

            if (items.length === 0) {
              return null;
            }

            const hasLabel = Boolean(section.label);

            const isExpanded =
              collapsed ||
              openSections.has(sectionKey);

            const isActiveSection =
              activeSectionKeys.has(sectionKey);

            const totalCount = items.reduce(
              (sum, item) =>
                sum +
                (item.count
                  ? counts[item.count]
                  : 0),
              0
            );

            return (
              <div
                key={sectionKey}
                className={cn(index > 0 && "mt-5")}
              >
                {hasLabel && collapsed && (
                  <div className="mx-2 mb-2 border-t border-sidebar-border" />
                )}

                {hasLabel && !collapsed && (
                  <button
                    type="button"
                    onClick={() =>
                      toggleSection(sectionKey)
                    }
                    className={cn(
                      "mb-1.5 flex w-full items-center justify-between rounded-lg px-2.5 py-2",
                      "text-left text-[10px] font-bold uppercase tracking-[0.14em]",
                      "transition-colors",
                      isActiveSection
                        ? "bg-sidebar-primary/20 text-sidebar-primary-foreground"
                        : "text-sidebar-foreground/45 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                    )}
                    aria-expanded={isExpanded}
                  >
                    <span className="truncate">
                      {section.label}
                    </span>
                    <span className="flex items-center gap-1.5">
                      {totalCount > 0 && (
                        <span className="rounded-full bg-sidebar-primary/25 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                          {totalCount}
                        </span>
                      )}
                      <ChevronRight
                        className={cn(
                          "h-3.5 w-3.5 shrink-0 transition-transform duration-200",
                          isExpanded && "rotate-90"
                        )}
                      />
                    </span>
                  </button>
                )}

                <div
                  className={cn(
                    "space-y-0.5 overflow-hidden transition-all duration-200",
                    hasLabel &&
                      !collapsed &&
                      !isExpanded &&
                      "max-h-0 opacity-0",
                    hasLabel &&
                      !collapsed &&
                      isExpanded &&
                      "max-h-[1000px] opacity-100"
                  )}
                >
                  {items.map((item, itemIndex) => {
                    const count = item.count
                      ? counts[item.count]
                      : 0;

                    return (
                      <NavLink
                        key={`${sectionKey}-${item.label}-${itemIndex}`}
                        to={item.to}
                        end={item.end}
                        onClick={onClose}
                        title={
                          collapsed
                            ? item.label
                            : undefined
                        }
                        className={({ isActive }) =>
                          cn(
                            "group flex items-center gap-2.5 rounded-lg px-2.5 py-2",
                            "text-[13px] font-medium transition-colors",
                            collapsed &&
                              "justify-center px-0",
                            isActive
                              ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                              : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-white"
                          )
                        }
                      >
                        <item.icon
                          className="h-4 w-4 shrink-0"
                          strokeWidth={1.9}
                        />
                        {!collapsed && (
                          <span className="flex-1 truncate">
                            {item.label}
                          </span>
                        )}
                        {!collapsed &&
                          count > 0 && (
                            <span
                              className={cn(
                                "rounded-full px-1.5 py-0.5",
                                "text-[10px] font-semibold text-white",
                                item.count === "overdue"
                                  ? "bg-destructive/80"
                                  : "bg-sidebar-primary/25"
                              )}
                            >
                              {count}
                            </span>
                          )}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* COLLAPSE CONTROL (Desktop only) */}
        <button
          type="button"
          onClick={onToggleCollapse}
          className={cn(
            "hidden shrink-0 items-center gap-2.5 px-5 py-3",
            "text-[13px] font-medium text-sidebar-foreground/60",
            "transition-colors hover:text-white",
            "lg:flex",
            collapsed && "justify-center px-0"
          )}
          aria-label={
            collapsed
              ? "Expand navigation"
              : "Collapse navigation"
          }
        >
          {collapsed ? (
            <ChevronsRight className="h-4 w-4" />
          ) : (
            <ChevronsLeft className="h-4 w-4" />
          )}
          {!collapsed && "Collapse Menu"}
        </button>

        {/* USER PROFILE & DROPDOWN MENU (Desktop only, untouched) */}
        <div className="relative border-t border-sidebar-border hidden lg:block">
          {/* Dropdown Menu Popup */}
          {profileMenuOpen && (
            <div
              className={cn(
                "absolute bottom-full left-3 right-3 mb-2 rounded-lg border border-sidebar-border",
                "bg-sidebar-accent/95 backdrop-blur-md p-1.5 shadow-lg z-50 space-y-1 text-sidebar-foreground"
              )}
            >
              {dropdownAdminItems.length > 0 && (
                <div className="mb-1 border-b border-sidebar-border/50 pb-1">
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-sidebar-foreground/45">
                    Administration
                  </div>
                  {dropdownAdminItems.map((adminItem, i) => (
                    <NavLink
                      key={`admin-${i}`}
                      to={adminItem.to}
                      onClick={() => {
                        setProfileMenuOpen(false);
                        onClose();
                      }}
                      className="flex items-center gap-2 rounded-md px-2 py-1.5 text-[12px] font-medium hover:bg-sidebar-primary hover:text-sidebar-primary-foreground transition-colors"
                    >
                      <adminItem.icon className="h-3.5 w-3.5" />
                      <span className="truncate">{adminItem.label}</span>
                    </NavLink>
                  ))}
                </div>
              )}

              {signOut && (
                <button
                  type="button"
                  onClick={() => {
                    setProfileMenuOpen(false);
                    signOut();
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-[12px] font-medium text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Log out</span>
                </button>
              )}
            </div>
          )}

          {/* Profile Trigger Button */}
          <button
            type="button"
            onClick={() => setProfileMenuOpen((prev) => !prev)}
            title="Open profile menu"
            aria-label="Open profile menu"
            className={cn(
              "flex w-full shrink-0 items-center gap-2.5",
              "px-4 py-3",
              "text-left transition-colors hover:bg-sidebar-accent/40",
              collapsed && "justify-center px-0"
            )}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-[11px] font-bold text-sidebar-primary-foreground">
              {initials}
            </div>

            {!collapsed && (
              <>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold text-white">
                    {profile?.full_name ?? "User"}
                  </p>
                  <p className="truncate text-[11px] text-sidebar-foreground/50">
                    {roles.length > 0
                      ? ROLE_LABELS[roles[0]]
                      : "Member"}
                  </p>
                </div>

                <MoreVertical className="h-4 w-4 shrink-0 text-sidebar-foreground/40" />
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
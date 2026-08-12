import { useAuth } from "@/contexts/AuthContext";
import { LogOut, Menu, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROLE_LABELS } from "@/lib/constants";
import NotificationPanel from "./NotificationPanel";
import { useTheme } from "@/hooks/useTheme";

interface AppHeaderProps {
  onMenuToggle?: () => void;
}

export default function AppHeader({ onMenuToggle }: AppHeaderProps) {
  const { profile, roles, signOut, organization } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex h-14 items-center justify-between border-b bg-card px-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuToggle}>
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="font-heading text-lg font-bold uppercase tracking-tight text-foreground">
          {organization?.name ?? "Workspace"}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <NotificationPanel />

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          className="min-h-11 min-w-11 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Moon className="h-4 w-4" aria-hidden="true" />
          )}
        </Button>

        {/* User info */}
        <div className="hidden items-center gap-2 sm:flex">
          <div className="text-right">
            <p className="text-sm font-medium leading-none">{profile?.full_name}</p>
            <p className="text-xs text-muted-foreground">
              {roles.map((r) => ROLE_LABELS[r]).join(", ")}
            </p>
          </div>
        </div>

        <Button variant="ghost" size="icon" onClick={signOut} title="Sign out">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}

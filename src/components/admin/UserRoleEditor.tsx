import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ROLE_LABELS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Loader2, Pencil } from "lucide-react";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";
import { useAuth } from "@/contexts/AuthContext";

type AppRole = Database["public"]["Enums"]["app_role"];

interface UserRoleEditorProps {
  userId: string;
  userName: string;
  currentRoles: AppRole[];
  onRolesUpdated: () => void;
}

const ALL_ROLES = Object.keys(ROLE_LABELS) as AppRole[];

export default function UserRoleEditor({ userId, userName, currentRoles, onRolesUpdated }: UserRoleEditorProps) {
  const { orgId } = useAuth();
  const [open, setOpen] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<AppRole[]>(currentRoles);
  const [saving, setSaving] = useState(false);

  const handleOpen = (isOpen: boolean) => {
    if (isOpen) setSelectedRoles(currentRoles);
    setOpen(isOpen);
  };

  const toggleRole = (role: AppRole) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleSave = async () => {
    if (!orgId) {
      toast.error("No organization selected");
      return;
    }
    setSaving(true);

    try {
      const toAdd = selectedRoles.filter((r) => !currentRoles.includes(r));
      const toRemove = currentRoles.filter((r) => !selectedRoles.includes(r));

      if (toRemove.length > 0) {
        const { error: removeError } = await supabase
          .from("user_roles")
          .delete()
          .eq("user_id", userId)
          .eq("org_id", orgId)
          .in("role", toRemove);

        if (removeError) throw removeError;
      }

      if (toAdd.length > 0) {
        const { error: addError } = await supabase
          .from("user_roles")
          .insert(toAdd.map((role) => ({ user_id: userId, role, org_id: orgId })));

        if (addError) throw addError;
      }

      // Log role changes to audit trail
      const changes: string[] = [];
      if (toAdd.length > 0) changes.push(`Added: ${toAdd.map(r => ROLE_LABELS[r]).join(", ")}`);
      if (toRemove.length > 0) changes.push(`Removed: ${toRemove.map(r => ROLE_LABELS[r]).join(", ")}`);

      if (changes.length > 0) {
        await supabase.from("audit_log").insert({
          user_id: (await supabase.auth.getUser()).data.user!.id,
          org_id: orgId,
          action: "role_change",
          details: {
            target_user_id: userId,
            target_user_name: userName,
            added: toAdd,
            removed: toRemove,
            summary: changes.join("; "),
          },
        });
      }

      toast.success(`Roles updated for ${userName}`);
      setOpen(false);
      onRolesUpdated();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update roles";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const hasChanges =
    selectedRoles.length !== currentRoles.length ||
    selectedRoles.some((r) => !currentRoles.includes(r));

  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-wrap gap-1">
        {currentRoles.map((r) => (
          <Badge key={r} variant="outline" className="text-xs">
            {ROLE_LABELS[r]}
          </Badge>
        ))}
        {currentRoles.length === 0 && (
          <span className="text-xs text-muted-foreground">No role</span>
        )}
      </div>

      <Popover open={open} onOpenChange={handleOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-7 shrink-0 gap-1 px-2" aria-label={`Edit roles for ${userName}`}>
            <Pencil className="h-3 w-3" />
            <span className="text-xs">Edit</span>
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-64 p-3" align="start">
          <p className="mb-2 text-xs font-medium text-muted-foreground">Edit roles for {userName}</p>

          <div className="max-h-60 space-y-2 overflow-y-auto">
            {ALL_ROLES.map((role) => {
              const isChecked = selectedRoles.includes(role);

              return (
                <div
                  key={role}
                  className="flex items-center gap-2 rounded-sm px-1 py-1 text-sm hover:bg-muted/60"
                >
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={(checked) => {
                      const shouldBeChecked = Boolean(checked);
                      if (shouldBeChecked !== isChecked) toggleRole(role);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => toggleRole(role)}
                    className="flex-1 text-left"
                  >
                    {ROLE_LABELS[role]}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex justify-end gap-2 border-t pt-2">
            <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={saving || !hasChanges}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {saving && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
              Save
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
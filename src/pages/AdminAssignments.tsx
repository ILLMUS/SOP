import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { STAGE_LABELS, STAGE_ORDER, ROLE_LABELS } from "@/lib/constants";
import { Loader2, Save, ClipboardList } from "lucide-react";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type JobStage = Database["public"]["Enums"]["job_stage"];
type AppRole = Database["public"]["Enums"]["app_role"];

interface Assignment {
  id?: string;
  stage: JobStage;
  primary_role: AppRole;
  secondary_role: AppRole | null;
}

const NONE_VALUE = "__none__";

export default function AdminAssignments() {
  const { isAdmin, orgId } = useAuth();
  const [assignments, setAssignments] = useState<Record<JobStage, Assignment>>({} as any);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isAdmin) fetchAssignments();
  }, [isAdmin]);

  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  const fetchAssignments = async () => {
    const { data, error } = await supabase.from("stage_assignments").select("*");
    if (error) {
      toast.error("Failed to load assignments");
      setLoading(false);
      return;
    }

    const map: Record<string, Assignment> = {};
    // Initialize all stages with defaults
    for (const stage of STAGE_ORDER) {
      map[stage] = { stage, primary_role: "lead_handler", secondary_role: null };
    }
    // Override with existing data
    for (const row of data || []) {
      map[row.stage] = {
        id: row.id,
        stage: row.stage,
        primary_role: row.primary_role,
        secondary_role: row.secondary_role,
      };
    }
    setAssignments(map as Record<JobStage, Assignment>);
    setLoading(false);
  };

  const updateAssignment = (stage: JobStage, field: "primary_role" | "secondary_role", value: string) => {
    setAssignments((prev) => ({
      ...prev,
      [stage]: {
        ...prev[stage],
        [field]: value === NONE_VALUE ? null : value,
      },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const stage of STAGE_ORDER) {
        const a = assignments[stage];
        if (!a) continue;

        if (a.id) {
          // Update existing
          const { error } = await supabase
            .from("stage_assignments")
            .update({
              primary_role: a.primary_role,
              secondary_role: a.secondary_role,
            })
            .eq("id", a.id);
          if (error) throw error;
        } else {
          // Insert new
          const { data, error } = await supabase
            .from("stage_assignments")
            .insert({
              stage: a.stage,
              org_id: orgId!,
              primary_role: a.primary_role,
              secondary_role: a.secondary_role,
            })
            .select()
            .single();
          if (error) throw error;
          // Update local state with the new ID
          setAssignments((prev) => ({
            ...prev,
            [stage]: { ...prev[stage], id: data.id },
          }));
        }
      }
      toast.success("Stage assignments saved successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to save assignments");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  const roleOptions = Object.entries(ROLE_LABELS) as [AppRole, string][];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ClipboardList className="h-6 w-6 text-accent" />
          <h1 className="font-heading text-2xl font-bold">Stage Assignments</h1>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-accent text-accent-foreground hover:bg-accent/90"
        >
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save All
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        Assign the primary and secondary roles responsible for each pipeline stage. Users with these roles will be able to manage and approve work at each step.
      </p>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium w-8">#</th>
                  <th className="px-4 py-3 text-left font-medium">Stage</th>
                  <th className="px-4 py-3 text-left font-medium">Primary Role</th>
                  <th className="px-4 py-3 text-left font-medium">Secondary Role</th>
                </tr>
              </thead>
              <tbody>
                {STAGE_ORDER.map((stage, idx) => {
                  const a = assignments[stage];
                  return (
                    <tr key={stage} className="border-b last:border-0">
                      <td className="px-4 py-3 text-muted-foreground">{idx + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-mono text-xs">
                            {stage.replace(/_/g, "-")}
                          </Badge>
                          <span className="font-medium">{STAGE_LABELS[stage]}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Select
                          value={a?.primary_role || ""}
                          onValueChange={(v) => updateAssignment(stage, "primary_role", v)}
                        >
                          <SelectTrigger className="w-48">
                            <SelectValue placeholder="Select role..." />
                          </SelectTrigger>
                          <SelectContent>
                            {roleOptions.map(([key, label]) => (
                              <SelectItem key={key} value={key}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-3">
                        <Select
                          value={a?.secondary_role || NONE_VALUE}
                          onValueChange={(v) => updateAssignment(stage, "secondary_role", v)}
                        >
                          <SelectTrigger className="w-48">
                            <SelectValue placeholder="None" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={NONE_VALUE}>None</SelectItem>
                            {roleOptions.map(([key, label]) => (
                              <SelectItem key={key} value={key}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

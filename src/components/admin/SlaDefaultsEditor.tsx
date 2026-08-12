import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { STAGE_LABELS, STAGE_ORDER } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Save, Clock } from "lucide-react";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type JobStage = Database["public"]["Enums"]["job_stage"];

interface SlaDefault {
  stage: JobStage;
  deadline_hours: number;
}

export default function SlaDefaultsEditor() {
  const [defaults, setDefaults] = useState<SlaDefault[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("sla_defaults").select("stage, deadline_hours");
      if (data) {
        const map = new Map(data.map((d) => [d.stage, d.deadline_hours]));
        setDefaults(STAGE_ORDER.map((s) => ({ stage: s, deadline_hours: map.get(s) ?? 48 })));
      }
      setLoading(false);
    })();
  }, []);

  const handleChange = (stage: JobStage, hours: number) => {
    setDefaults((prev) => prev.map((d) => (d.stage === stage ? { ...d, deadline_hours: hours } : d)));
    setDirty(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const d of defaults) {
        const { error } = await supabase
          .from("sla_defaults")
          .update({ deadline_hours: d.deadline_hours })
          .eq("stage", d.stage);
        if (error) throw error;
      }
      setDirty(false);
      toast.success("SLA defaults updated");
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const formatHours = (h: number) => {
    if (h >= 24) {
      const days = Math.floor(h / 24);
      const rem = h % 24;
      return rem > 0 ? `${days}d ${rem}h` : `${days}d`;
    }
    return `${h}h`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="h-6 w-6 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 font-heading text-lg">
            <Clock className="h-5 w-5 text-accent" />
            Default SLA Deadlines
          </CardTitle>
          <Button onClick={handleSave} disabled={saving || !dirty} size="sm">
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Defaults
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Set the default SLA deadline for each pipeline stage. These apply to new jobs automatically.
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {defaults.map((d) => (
            <div key={d.stage} className="flex items-center gap-3 rounded-md border border-border p-3">
              <div className="flex-1 min-w-0">
                <Label className="text-xs font-medium truncate block">{STAGE_LABELS[d.stage]}</Label>
                <span className="text-xs text-muted-foreground">{formatHours(d.deadline_hours)}</span>
              </div>
              <Input
                type="number"
                min={1}
                max={720}
                value={d.deadline_hours}
                onChange={(e) => handleChange(d.stage, Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 text-right"
              />
              <span className="text-xs text-muted-foreground whitespace-nowrap">hrs</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

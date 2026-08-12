import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, ChevronRight, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { SOP_LIBRARY, type LibraryTemplate } from "@/lib/sopLibrary";
import { slugifyKey } from "@/lib/sopFields";

interface Props {
  orgId: string | null;
  userId?: string | null;
  onInstalled: (templateId: string) => void;
}

export default function SopTemplateLibrary({ orgId, userId, onInstalled }: Props) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<LibraryTemplate>(SOP_LIBRARY[0]);
  const [installing, setInstalling] = useState<string | null>(null);

  const install = async (tpl: LibraryTemplate) => {
    if (!orgId) return;
    setInstalling(tpl.key);
    try {
      // 1. Make sure every role in the template exists for this org
      const { data: existingRoles } = await supabase
        .from("org_roles")
        .select("id, name")
        .eq("org_id", orgId);
      const roleMap = new Map<string, string>();
      (existingRoles || []).forEach((r) => roleMap.set(r.name.toLowerCase(), r.id));

      const missing = tpl.roles.filter((r) => !roleMap.has(r.toLowerCase()));
      if (missing.length) {
        const { data: created, error } = await supabase
          .from("org_roles")
          .insert(missing.map((name) => ({ org_id: orgId, name, is_admin: false })))
          .select("id, name");
        if (error) throw error;
        (created || []).forEach((r) => roleMap.set(r.name.toLowerCase(), r.id));
      }

      // 2. Create the workflow
      const { data: template, error: tErr } = await supabase
        .from("sop_templates")
        .insert({
          org_id: orgId,
          name: tpl.name,
          description: tpl.summary,
          industry: tpl.niche,
          created_by: userId ?? null,
          is_active: false,
        })
        .select()
        .single();
      if (tErr) throw tErr;

      // 3. Stages
      const { data: stages, error: sErr } = await supabase
        .from("sop_stages")
        .insert(
          tpl.stages.map((s, i) => ({
            org_id: orgId,
            template_id: template.id,
            position: i,
            name: s.name,
            description: s.description,
            sla_hours: s.slaHours,
            requires_approval: s.requiresApproval ?? false,
            primary_role_id: roleMap.get(s.role.toLowerCase()) ?? null,
            secondary_role_id: s.backupRole ? roleMap.get(s.backupRole.toLowerCase()) ?? null : null,
          }))
        )
        .select("id, position");
      if (sErr) throw sErr;

      // 4. Fields per stage
      const byPosition = new Map<number, string>();
      (stages || []).forEach((s: any) => byPosition.set(s.position, s.id));
      const fieldRows = tpl.stages.flatMap((s, i) =>
        s.fields.map((f, j) => ({
          org_id: orgId,
          stage_id: byPosition.get(i)!,
          position: j,
          field_key: `${slugifyKey(f.label)}_${i}${j}`,
          label: f.label,
          field_type: f.type,
          required: f.required ?? false,
          help_text: f.help ?? null,
          options: f.options ?? [],
        }))
      );
      if (fieldRows.length) {
        const { error: fErr } = await supabase.from("sop_fields").insert(fieldRows);
        if (fErr) throw fErr;
      }

      toast.success(`"${tpl.name}" added — edit anything you like`);
      setOpen(false);
      onInstalled(template.id);
    } catch (e: any) {
      toast.error(e.message || "Could not add that template");
    } finally {
      setInstalling(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <BookOpen className="mr-2 h-4 w-4" /> Start from a template
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" /> SOP template library
          </DialogTitle>
          <DialogDescription>
            Pick a best-practice workflow for your niche. It is copied into your workspace — steps,
            owners, deadlines and questions are all editable afterwards.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 md:grid-cols-[240px_1fr]">
          <ScrollArea className="h-[420px] pr-2">
            <div className="space-y-1">
              {SOP_LIBRARY.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setSelected(t)}
                  className={`flex w-full items-center justify-between rounded border px-3 py-2 text-left text-sm transition-colors ${
                    selected.key === t.key
                      ? "border-accent bg-accent/5 font-medium"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <span>
                    {t.niche}
                    <span className="block text-xs text-muted-foreground">{t.stages.length} steps</span>
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </button>
              ))}
            </div>
          </ScrollArea>

          <div className="space-y-3">
            <div>
              <h3 className="font-heading text-lg font-bold">{selected.name}</h3>
              <p className="text-sm text-muted-foreground">{selected.summary}</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {selected.roles.map((r) => (
                <Badge key={r} variant="secondary">{r}</Badge>
              ))}
            </div>
            <ScrollArea className="h-[280px] rounded border border-border p-3">
              <ol className="space-y-3">
                {selected.stages.map((s, i) => (
                  <li key={s.name} className="text-sm">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono">{i + 1}</Badge>
                      <span className="font-medium">{s.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {s.role} · {s.slaHours}h
                        {s.requiresApproval ? " · approval" : ""}
                      </span>
                    </div>
                    <p className="mt-1 pl-8 text-xs text-muted-foreground">{s.description}</p>
                    <p className="pl-8 text-xs text-muted-foreground">
                      {s.fields.length} question(s): {s.fields.map((f) => f.label).join(", ")}
                    </p>
                  </li>
                ))}
              </ol>
            </ScrollArea>
            <Button
              className="w-full"
              onClick={() => install(selected)}
              disabled={!orgId || installing !== null}
            >
              {installing === selected.key ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <BookOpen className="mr-2 h-4 w-4" />
              )}
              Add "{selected.name}" to my workspace
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

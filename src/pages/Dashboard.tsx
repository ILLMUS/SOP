import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { STAGE_LABELS, STAGE_ORDER, getStageIndex } from "@/lib/constants";
import OverdueStagesWidget from "@/components/dashboard/OverdueStagesWidget";
import AnalyticsWidgets from "@/components/dashboard/AnalyticsWidgets";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import PendingApprovalsQueue from "@/components/dashboard/PendingApprovalsQueue";
import { Briefcase, Clock, AlertTriangle, CheckCircle2, Plus, Loader2, Siren, Radio } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Job = Tables<"jobs">;

export default function Dashboard() {
  const { user, isAdmin, hasRole } = useAuth();
  const isSuperAdmin = hasRole("super_admin");
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [overdueCount, setOverdueCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [live, setLive] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
      const [jobsRes, stagesRes] = await Promise.all([
        supabase
          .from("jobs")
          .select("*")
          .eq("status", "active")
          .order("updated_at", { ascending: false }),
        supabase
          .from("job_stages")
          .select("sla_started_at, sla_deadline_hours")
          .eq("status", "active")
          .not("sla_started_at", "is", null)
          .not("sla_deadline_hours", "is", null),
      ]);
      setJobs(jobsRes.data || []);

      const now = Date.now();
      const count = (stagesRes.data || []).filter((s) => {
        const deadline = new Date(s.sla_started_at!).getTime() + s.sla_deadline_hours! * 3600_000;
        return now > deadline;
      }).length;
      setOverdueCount(count);

      setLoading(false);
      setLastUpdate(new Date());
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Realtime subscriptions: refetch on any jobs/job_stages change.
  useEffect(() => {
    let debounce: number | null = null;
    const scheduleRefetch = () => {
      if (debounce) window.clearTimeout(debounce);
      debounce = window.setTimeout(() => fetchData(), 400);
    };

    const channel = supabase
      .channel("dashboard-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "jobs" }, scheduleRefetch)
      .on("postgres_changes", { event: "*", schema: "public", table: "job_stages" }, scheduleRefetch)
      .subscribe((status) => {
        setLive(status === "SUBSCRIBED");
      });

    // Recompute overdue count every minute so SLA breaches surface without a DB change.
    const tick = window.setInterval(fetchData, 60_000);

    return () => {
      if (debounce) window.clearTimeout(debounce);
      window.clearInterval(tick);
      supabase.removeChannel(channel);
    };
  }, [fetchData]);

  const stats = {
    total: jobs.length,
    active: jobs.filter((j) => j.status === "active").length,
    earlyStage: jobs.filter((j) => getStageIndex(j.current_stage) < 4).length,
    lateStage: jobs.filter((j) => getStageIndex(j.current_stage) >= 8).length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>SOP Pipeline Overview</span>
            <span className="inline-flex items-center gap-1">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  live ? "bg-success animate-pulse" : "bg-muted-foreground/40"
                }`}
              />
              <Radio className="h-3 w-3" />
              <span className="text-xs">
                {live ? "Live" : "Offline"}
                {lastUpdate && ` · ${lastUpdate.toLocaleTimeString()}`}
              </span>
            </span>
          </div>
        </div>
        {isSuperAdmin && (
          <Button
            onClick={() => navigate("/jobs/new")}
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Job
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard icon={Briefcase} label="Total Jobs" value={stats.total} />
        <StatCard icon={Clock} label="Active" value={stats.active} color="accent" />
        <StatCard icon={AlertTriangle} label="Early Stage" value={stats.earlyStage} color="warning" />
        <StatCard icon={CheckCircle2} label="Near Completion" value={stats.lateStage} color="success" />
        <StatCard icon={Siren} label="Overdue" value={overdueCount} color="destructive" />
      </div>

      {/* Analytics */}
      {isAdmin && <AnalyticsWidgets />}

      {/* Overdue Stages */}
      <OverdueStagesWidget />

      {/* Live Approvals + Activity */}
      <div className="grid gap-4 lg:grid-cols-2">
        <PendingApprovalsQueue />
        {isAdmin && <ActivityFeed />}
      </div>

      {/* Recent Jobs */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">Recent Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          {jobs.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              No active jobs. Create your first job to get started.
            </p>
          ) : (
            <div className="space-y-2">
              {jobs.slice(0, 10).map((job) => (
                <button
                  key={job.id}
                  onClick={() => navigate(`/jobs/${job.id}`)}
                  className="flex w-full items-center justify-between rounded border p-3 text-left transition-colors hover:bg-muted"
                >
                  <div>
                    <span className="font-mono text-xs text-muted-foreground">
                      {job.job_number}
                    </span>
                    <p className="font-medium">{job.client_name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {STAGE_LABELS[job.current_stage]}
                    </Badge>
                    <StageProgress stage={job.current_stage} />
                  </div>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded bg-${color || "primary"}/10`}
        >
          <Icon className={`h-5 w-5 text-${color || "primary"}`} />
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function StageProgress({ stage }: { stage: string }) {
  const idx = STAGE_ORDER.indexOf(stage as any);
  const pct = ((idx + 1) / STAGE_ORDER.length) * 100;

  return (
    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
      <div
        className="h-full rounded-full bg-accent transition-all"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

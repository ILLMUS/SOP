import { useEffect, useMemo, useState } from "react";
import { format, subDays, startOfDay, endOfDay, isWithinInterval } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Loader2, TrendingUp, Users, DollarSign, CalendarIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { STAGE_LABELS, STAGE_ORDER, getStageIndex } from "@/lib/constants";
import { ROLE_LABELS } from "@/lib/constants";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import type { Tables, Database } from "@/integrations/supabase/types";

type Job = Tables<"jobs">;
type JobStage = Tables<"job_stages">;

const STAGE_COLORS = [
  "hsl(var(--accent))",
  "hsl(var(--primary))",
  "hsl(210, 70%, 55%)",
  "hsl(180, 60%, 45%)",
  "hsl(150, 55%, 45%)",
  "hsl(120, 50%, 45%)",
  "hsl(80, 55%, 45%)",
  "hsl(45, 70%, 50%)",
  "hsl(30, 70%, 50%)",
  "hsl(15, 70%, 50%)",
  "hsl(0, 60%, 50%)",
  "hsl(280, 55%, 55%)",
];

export default function Reports() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stages, setStages] = useState<JobStage[]>([]);
  const [profiles, setProfiles] = useState<Tables<"profiles">[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    const fetch = async () => {
      const [jobsRes, stagesRes, profilesRes] = await Promise.all([
        supabase.from("jobs").select("*"),
        supabase.from("job_stages").select("*"),
        supabase.from("profiles").select("*"),
      ]);
      setJobs(jobsRes.data ?? []);
      setStages(stagesRes.data ?? []);
      setProfiles(profilesRes.data ?? []);
      setLoading(false);
    };
    fetch();
  }, []);

  const filteredJobs = useMemo(() => {
    if (!startDate && !endDate) return jobs;
    return jobs.filter((j) => {
      const d = new Date(j.created_at);
      if (startDate && d < startOfDay(startDate)) return false;
      if (endDate && d > endOfDay(endDate)) return false;
      return true;
    });
  }, [jobs, startDate, endDate]);

  const filteredStages = useMemo(() => {
    if (!startDate && !endDate) return stages;
    const jobIds = new Set(filteredJobs.map((j) => j.id));
    return stages.filter((s) => jobIds.has(s.job_id));
  }, [stages, filteredJobs, startDate, endDate]);

  const presets = [
    { label: "7 days", days: 7 },
    { label: "30 days", days: 30 },
    { label: "90 days", days: 90 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Reports</h1>
          <p className="text-sm text-muted-foreground">Analytics & insights</p>
        </div>

        {/* Date Range Filter */}
        <div className="flex flex-wrap items-center gap-2">
          {presets.map((p) => (
            <Button
              key={p.days}
              size="sm"
              variant={
                startDate &&
                format(startDate, "yyyy-MM-dd") === format(subDays(new Date(), p.days), "yyyy-MM-dd") &&
                !endDate
                  ? "default"
                  : "outline"
              }
              onClick={() => {
                setStartDate(subDays(new Date(), p.days));
                setEndDate(undefined);
              }}
              className="h-8 text-xs"
            >
              {p.label}
            </Button>
          ))}

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className={cn("h-8 gap-1.5 text-xs", startDate && "text-foreground")}>
                <CalendarIcon className="h-3.5 w-3.5" />
                {startDate ? format(startDate, "MMM d, yyyy") : "From"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>

          <span className="text-xs text-muted-foreground">→</span>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className={cn("h-8 gap-1.5 text-xs", endDate && "text-foreground")}>
                <CalendarIcon className="h-3.5 w-3.5" />
                {endDate ? format(endDate, "MMM d, yyyy") : "To"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>

          {(startDate || endDate) && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => {
                setStartDate(undefined);
                setEndDate(undefined);
              }}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>

      {(startDate || endDate) && (
        <p className="text-xs text-muted-foreground">
          Showing {filteredJobs.length} of {jobs.length} jobs
        </p>
      )}

      <Tabs defaultValue="pipeline">
        <TabsList>
          <TabsTrigger value="pipeline" className="gap-1.5">
            <TrendingUp className="h-3.5 w-3.5" /> Pipeline
          </TabsTrigger>
          <TabsTrigger value="team" className="gap-1.5">
            <Users className="h-3.5 w-3.5" /> Team
          </TabsTrigger>
          <TabsTrigger value="revenue" className="gap-1.5">
            <DollarSign className="h-3.5 w-3.5" /> Revenue
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline">
          <PipelineReport jobs={filteredJobs} stages={filteredStages} />
        </TabsContent>
        <TabsContent value="team">
          <TeamReport stages={filteredStages} profiles={profiles} jobs={filteredJobs} />
        </TabsContent>
        <TabsContent value="revenue">
          <RevenueReport jobs={filteredJobs} stages={filteredStages} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ── Pipeline Overview ─────────────────────────────── */

function PipelineReport({ jobs, stages }: { jobs: Job[]; stages: JobStage[] }) {
  // Jobs per stage
  const stageData = STAGE_ORDER.map((s, i) => ({
    stage: STAGE_LABELS[s],
    count: jobs.filter((j) => j.current_stage === s && j.status === "active").length,
    fill: STAGE_COLORS[i],
  }));

  const chartConfig: ChartConfig = Object.fromEntries(
    STAGE_ORDER.map((s, i) => [STAGE_LABELS[s], { label: STAGE_LABELS[s], color: STAGE_COLORS[i] }])
  );

  // Bottlenecks — stages with most pending_approval
  const bottlenecks = STAGE_ORDER.map((s) => {
    const stageRecords = stages.filter((r) => r.stage === s);
    const pending = stageRecords.filter((r) => r.status === "pending_approval").length;
    const active = stageRecords.filter((r) => r.status === "active").length;
    return { stage: STAGE_LABELS[s], pending, active };
  }).filter((b) => b.pending > 0 || b.active > 0);

  // Average stage duration (approved stages only)
  const durations = STAGE_ORDER.map((s) => {
    const approved = stages.filter((r) => r.stage === s && r.approved_at);
    if (approved.length === 0) return { stage: STAGE_LABELS[s], days: 0 };
    const totalMs = approved.reduce((sum, r) => {
      const start = new Date(r.created_at).getTime();
      const end = new Date(r.approved_at!).getTime();
      return sum + (end - start);
    }, 0);
    return { stage: STAGE_LABELS[s], days: Math.round(totalMs / approved.length / 86400000 * 10) / 10 };
  });

  const statusCounts = [
    { name: "Active", value: jobs.filter((j) => j.status === "active").length, color: "hsl(var(--accent))" },
    { name: "Completed", value: jobs.filter((j) => j.status === "completed").length, color: "hsl(150, 55%, 45%)" },
    { name: "On Hold", value: jobs.filter((j) => j.status === "on_hold").length, color: "hsl(45, 70%, 50%)" },
    { name: "Cancelled", value: jobs.filter((j) => j.status === "cancelled").length, color: "hsl(0, 60%, 50%)" },
  ].filter((s) => s.value > 0);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Jobs by Stage */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Active Jobs by Stage</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart data={stageData} margin={{ left: 0, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="stage" tick={{ fontSize: 10 }} angle={-35} textAnchor="end" height={80} />
              <YAxis allowDecimals={false} width={30} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Job Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Job Status Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          {statusCounts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No jobs yet</p>
          ) : (
            <div className="flex items-center gap-6">
              <PieChart width={160} height={160}>
                <Pie data={statusCounts} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} strokeWidth={2}>
                  {statusCounts.map((s, i) => (
                    <Cell key={i} fill={s.color} />
                  ))}
                </Pie>
              </PieChart>
              <div className="space-y-2">
                {statusCounts.map((s) => (
                  <div key={s.name} className="flex items-center gap-2 text-sm">
                    <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: s.color }} />
                    <span className="text-muted-foreground">{s.name}</span>
                    <span className="font-semibold">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Avg Stage Duration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Avg. Stage Duration (days)</CardTitle>
        </CardHeader>
        <CardContent>
          {durations.every((d) => d.days === 0) ? (
            <p className="py-4 text-center text-sm text-muted-foreground">Not enough completed stages yet</p>
          ) : (
            <div className="space-y-2">
              {durations.filter((d) => d.days > 0).map((d) => (
                <div key={d.stage} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{d.stage}</span>
                  <Badge variant="secondary">{d.days}d</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bottlenecks */}
      {bottlenecks.length > 0 && (
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Pipeline Bottlenecks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {bottlenecks.map((b) => (
                <div key={b.stage} className="rounded-lg border p-3">
                  <p className="text-sm font-medium">{b.stage}</p>
                  <div className="mt-1 flex gap-3 text-xs text-muted-foreground">
                    <span>{b.active} active</span>
                    <span className="text-amber-500 font-medium">{b.pending} pending approval</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/* ── Team Performance ─────────────────────────────── */

function TeamReport({
  stages,
  profiles,
  jobs,
}: {
  stages: JobStage[];
  profiles: Tables<"profiles">[];
  jobs: Job[];
}) {
  const nameMap = new Map(profiles.map((p) => [p.id, p.full_name]));

  // Completed stages per user (primary owner)
  const completedByUser = new Map<string, number>();
  const avgDurationByUser = new Map<string, number[]>();

  stages.forEach((s) => {
    if (s.status === "approved" && s.primary_owner_id) {
      completedByUser.set(s.primary_owner_id, (completedByUser.get(s.primary_owner_id) ?? 0) + 1);
      if (s.approved_at) {
        const dur = (new Date(s.approved_at).getTime() - new Date(s.created_at).getTime()) / 86400000;
        const arr = avgDurationByUser.get(s.primary_owner_id) ?? [];
        arr.push(dur);
        avgDurationByUser.set(s.primary_owner_id, arr);
      }
    }
  });

  const teamData = Array.from(completedByUser.entries())
    .map(([id, count]) => {
      const durs = avgDurationByUser.get(id) ?? [];
      const avg = durs.length ? Math.round((durs.reduce((a, b) => a + b, 0) / durs.length) * 10) / 10 : 0;
      return { name: nameMap.get(id) ?? "Unknown", completed: count, avgDays: avg };
    })
    .sort((a, b) => b.completed - a.completed);

  // Active assignments
  const activeByUser = new Map<string, number>();
  stages.forEach((s) => {
    if (s.status === "active" && s.primary_owner_id) {
      activeByUser.set(s.primary_owner_id, (activeByUser.get(s.primary_owner_id) ?? 0) + 1);
    }
  });

  const workloadData = Array.from(activeByUser.entries())
    .map(([id, count]) => ({ name: nameMap.get(id) ?? "Unknown", active: count }))
    .sort((a, b) => b.active - a.active);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Stages Completed */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Stages Completed per User</CardTitle>
        </CardHeader>
        <CardContent>
          {teamData.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">No completed stages yet</p>
          ) : (
            <div className="space-y-3">
              {teamData.map((t) => (
                <div key={t.name} className="flex items-center justify-between text-sm">
                  <span className="font-medium">{t.name}</span>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">{t.completed} stages</Badge>
                    {t.avgDays > 0 && (
                      <span className="text-xs text-muted-foreground">avg {t.avgDays}d</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Workload */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Current Workload</CardTitle>
        </CardHeader>
        <CardContent>
          {workloadData.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">No active assignments</p>
          ) : (
            <div className="space-y-3">
              {workloadData.map((w) => (
                <div key={w.name} className="flex items-center justify-between text-sm">
                  <span className="font-medium">{w.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 rounded-full bg-accent" style={{ width: `${Math.min(w.active * 20, 100)}px` }} />
                    <span className="text-xs text-muted-foreground">{w.active} active</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* ── Revenue / Costing ─────────────────────────────── */

function RevenueReport({ jobs, stages }: { jobs: Job[]; stages: JobStage[] }) {
  // Extract quoted amounts from costing/quotation stages form_data
  let totalQuoted = 0;
  let quotedCount = 0;
  const quotedJobs: { jobNumber: string; client: string; amount: number }[] = [];

  jobs.forEach((job) => {
    const costingStage = stages.find((s) => s.job_id === job.id && s.stage === "costing");
    const formData = costingStage?.form_data as Record<string, any> | null;
    const amount = Number(formData?.total_cost || formData?.estimated_cost || formData?.amount || 0);
    if (amount > 0) {
      totalQuoted += amount;
      quotedCount++;
      quotedJobs.push({ jobNumber: job.job_number, client: job.client_name, amount });
    }
  });

  const completedJobs = jobs.filter((j) => j.status === "completed").length;
  const cancelledJobs = jobs.filter((j) => j.status === "cancelled").length;
  const totalDecided = completedJobs + cancelledJobs;
  const winRate = totalDecided > 0 ? Math.round((completedJobs / totalDecided) * 100) : null;

  // Jobs reaching client_approval vs total
  const approvedJobs = stages.filter(
    (s) => s.stage === "client_approval" && s.status === "approved"
  ).length;
  const totalApprovalStages = stages.filter((s) => s.stage === "client_approval").length;
  const conversionRate =
    totalApprovalStages > 0 ? Math.round((approvedJobs / totalApprovalStages) * 100) : null;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Summary Cards */}
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <p className="text-3xl font-bold">
            {totalQuoted > 0 ? `R ${totalQuoted.toLocaleString()}` : "—"}
          </p>
          <p className="text-sm text-muted-foreground mt-1">Total Quoted Value</p>
          <p className="text-xs text-muted-foreground">{quotedCount} jobs with cost data</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <p className="text-3xl font-bold">{winRate !== null ? `${winRate}%` : "—"}</p>
          <p className="text-sm text-muted-foreground mt-1">Win Rate</p>
          <p className="text-xs text-muted-foreground">
            {completedJobs} won / {cancelledJobs} lost
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <p className="text-3xl font-bold">{conversionRate !== null ? `${conversionRate}%` : "—"}</p>
          <p className="text-sm text-muted-foreground mt-1">Approval Conversion</p>
          <p className="text-xs text-muted-foreground">
            {approvedJobs} approved / {totalApprovalStages} submitted
          </p>
        </CardContent>
      </Card>

      {/* Quoted Jobs Table */}
      <Card className="md:col-span-3">
        <CardHeader>
          <CardTitle className="text-base">Quoted Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          {quotedJobs.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No costing data available yet. Cost data is pulled from the Costing stage form.
            </p>
          ) : (
            <div className="space-y-2">
              {quotedJobs
                .sort((a, b) => b.amount - a.amount)
                .map((q) => (
                  <div key={q.jobNumber} className="flex items-center justify-between rounded border p-3 text-sm">
                    <div>
                      <span className="font-mono text-xs text-muted-foreground">{q.jobNumber}</span>
                      <p className="font-medium">{q.client}</p>
                    </div>
                    <span className="font-semibold">R {q.amount.toLocaleString()}</span>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

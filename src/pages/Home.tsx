import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Building2,
  ClipboardList,
  ListChecks,
  ShieldCheck,
  Workflow,
  Users,
  FileCheck2,
  Timer,
  Sparkles,
  CheckCircle2,
  BarChart3,
  ArrowUpRight,
} from "lucide-react";

const QUESTIONS = [
  {
    icon: Building2,
    title: "Your business",
    text: "Tell us your business name, niche, location and team size.",
    size: "large",
  },
  {
    icon: Users,
    title: "Your team",
    text: "Define who does what and assign responsibility.",
    size: "small",
  },
  {
    icon: Workflow,
    title: "Your workflow",
    text: "We turn your process into clear, connected steps.",
    size: "small",
  },
  {
    icon: ClipboardList,
    title: "Your information",
    text: "Choose exactly what each step needs to capture.",
    size: "wide",
  },
];

export default function Home() {
  const { session, orgId } = useAuth();
  const navigate = useNavigate();

  const start = () => {
    if (!session) return navigate("/login");
    if (!orgId) return navigate("/onboarding");

    navigate("/admin/sop");
  };

  return (
    <div className="min-h-screen overflow-hidden bg-background">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <Workflow className="h-5 w-5" />
            </div>

            <div className="flex flex-col leading-none">
              <span className="font-heading text-sm font-bold tracking-wide">
                SOP PIPELINE
              </span>
              <span className="mt-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Business Operating System
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/track">Track Job</Link>
            </Button>

            {session ? (
              <Button
                size="sm"
                className="bg-accent text-accent-foreground hover:bg-accent/90"
                asChild
              >
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <Button
                size="sm"
                className="bg-accent text-accent-foreground hover:bg-accent/90"
                asChild
              >
                <Link to="/login">Sign in</Link>
              </Button>
            )}
          </nav>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="relative border-b border-border">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
            <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
              {/* HERO COPY */}
              <div className="max-w-3xl">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3 py-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-accent" />

                  <span className="text-xs font-medium text-accent">
                    Build your business process from scratch
                  </span>
                </div>

                <h1 className="font-heading text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
                  Turn the way you work into a{" "}
                  <span className="text-accent">
                    system your team can follow.
                  </span>
                </h1>

                <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                  Answer a few questions about your business and build a
                  structured workflow with roles, steps, deadlines and the
                  information your team needs at every stage.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Button
                    size="lg"
                    onClick={start}
                    className="bg-accent px-6 text-accent-foreground hover:bg-accent/90"
                  >
                    Build My Process

                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>

                  <Button variant="outline" size="lg" asChild>
                    <Link to="/track">
                      Track a Job
                    </Link>
                  </Button>
                </div>

                {/* TRUST / FEATURE ROW */}
                <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    Custom workflows
                  </div>

                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    Team ownership
                  </div>

                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    Job tracking
                  </div>
                </div>
              </div>

              {/* HERO BENTO */}
              <div className="grid grid-cols-2 gap-3">
                {/* MAIN WORKFLOW CARD */}
                <div className="col-span-2 rounded-3xl border border-border bg-card p-5 shadow-sm md:p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                        <Workflow className="h-5 w-5" />
                      </div>

                      <p className="mt-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Active workflow
                      </p>

                      <h3 className="mt-1 font-heading text-xl font-bold">
                        Your Business Process
                      </h3>
                    </div>

                    <div className="rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                      Draft
                    </div>
                  </div>

                  {/* PIPELINE */}
                  <div className="mt-7 space-y-3">
                    {[
                      "New Job",
                      "Review & Planning",
                      "Work in Progress",
                      "Quality Check",
                      "Completed",
                    ].map((step, index) => (
                      <div
                        key={step}
                        className="flex items-center gap-3"
                      >
                        <div
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                            index === 0
                              ? "bg-accent text-accent-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {index + 1}
                        </div>

                        <div className="h-2 flex-1 rounded-full bg-muted">
                          <div
                            className={`h-full rounded-full ${
                              index === 0
                                ? "w-3/4 bg-accent"
                                : index === 1
                                ? "w-1/2 bg-muted-foreground/20"
                                : "w-1/4 bg-muted-foreground/10"
                            }`}
                          />
                        </div>

                        <span className="w-28 text-right text-xs text-muted-foreground">
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* TEAM CARD */}
                <div className="rounded-3xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between">
                    <Users className="h-5 w-5 text-accent" />

                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                  </div>

                  <p className="mt-8 text-3xl font-bold">Roles</p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Every step has an owner.
                  </p>
                </div>

                {/* DEADLINES CARD */}
                <div className="rounded-3xl border border-border bg-muted/30 p-5">
                  <Timer className="h-5 w-5 text-accent" />

                  <p className="mt-8 text-3xl font-bold">Deadlines</p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Keep every job moving.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              The setup process
            </p>

            <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight md:text-4xl">
              Four conversations between you and your business.
            </h2>

            <p className="mt-4 text-muted-foreground">
              You don't need to understand process design. Just explain how
              your business works.
            </p>
          </div>

          {/* BENTO QUESTIONS */}
          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {/* BUSINESS */}
            <div className="group rounded-3xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg md:col-span-2 md:row-span-2">
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                  <Building2 className="h-6 w-6" />
                </div>

                <span className="font-mono text-xs text-muted-foreground">
                  01
                </span>
              </div>

              <div className="mt-16">
                <h3 className="font-heading text-2xl font-bold">
                  Your business
                </h3>

                <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
                  Tell us what you do, where you operate and how your team is
                  structured. Your workflow starts with understanding your
                  business.
                </p>
              </div>

              <div className="mt-8 flex items-center gap-2 text-sm font-medium text-accent">
                Business context
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>

            {/* TEAM */}
            <div className="rounded-3xl border border-border bg-card p-6 md:col-span-2">
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Users className="h-5 w-5" />
                </div>

                <span className="font-mono text-xs text-muted-foreground">
                  02
                </span>
              </div>

              <h3 className="mt-8 font-heading text-xl font-bold">
                Your team roles
              </h3>

              <p className="mt-2 text-sm text-muted-foreground">
                Define who is responsible for what. SOP Pipeline connects
                people to the steps they own.
              </p>
            </div>

            {/* WORKFLOW */}
            <div className="rounded-3xl border border-border bg-primary p-6 text-primary-foreground">
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <Workflow className="h-5 w-5" />
                </div>

                <span className="font-mono text-xs text-primary-foreground/50">
                  03
                </span>
              </div>

              <h3 className="mt-8 font-heading text-xl font-bold">
                Your steps
              </h3>

              <p className="mt-2 text-sm text-primary-foreground/65">
                Build the actual sequence your jobs follow.
              </p>
            </div>

            {/* QUESTIONS */}
            <div className="rounded-3xl border border-border bg-accent p-6 text-accent-foreground">
              <div className="flex items-start justify-between">
                <FileCheck2 className="h-6 w-6" />

                <span className="font-mono text-xs opacity-60">
                  04
                </span>
              </div>

              <h3 className="mt-8 font-heading text-xl font-bold">
                Your questions
              </h3>

              <p className="mt-2 text-sm opacity-80">
                Decide what information must be captured at every stage.
              </p>
            </div>
          </div>
        </section>

        {/* FEATURE BENTO */}
        <section className="border-y border-border bg-muted/20">
          <div className="mx-auto max-w-7xl px-4 py-20 md:px-8">
            <div className="grid gap-4 lg:grid-cols-3">
              {/* BIG FEATURE */}
              <div className="rounded-3xl border border-border bg-card p-7 lg:col-span-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                  <ShieldCheck className="h-6 w-6" />
                </div>

                <h2 className="mt-10 max-w-xl font-heading text-3xl font-bold tracking-tight">
                  Change your process without breaking jobs already in motion.
                </h2>

                <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
                  Create a new version of your workflow whenever your business
                  changes. Existing jobs continue using the exact process they
                  started with.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <div className="rounded-xl border border-border px-4 py-3 text-sm">
                    Version control
                  </div>

                  <div className="rounded-xl border border-border px-4 py-3 text-sm">
                    Job history
                  </div>

                  <div className="rounded-xl border border-border px-4 py-3 text-sm">
                    Safe updates
                  </div>
                </div>
              </div>

              {/* STATS / VISUAL */}
              <div className="rounded-3xl border border-border bg-primary p-7 text-primary-foreground">
                <BarChart3 className="h-6 w-6 text-accent" />

                <p className="mt-10 text-xs font-bold uppercase tracking-wider text-primary-foreground/50">
                  Your operations
                </p>

                <h3 className="mt-2 font-heading text-2xl font-bold">
                  From scattered work to visible progress.
                </h3>

                <div className="mt-8 space-y-4">
                  <div>
                    <div className="mb-2 flex justify-between text-xs">
                      <span className="text-primary-foreground/60">
                        Jobs in progress
                      </span>

                      <span>08</span>
                    </div>

                    <div className="h-2 rounded-full bg-primary-foreground/10">
                      <div className="h-full w-[70%] rounded-full bg-accent" />
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex justify-between text-xs">
                      <span className="text-primary-foreground/60">
                        Completed
                      </span>

                      <span>24</span>
                    </div>

                    <div className="h-2 rounded-full bg-primary-foreground/10">
                      <div className="h-full w-[85%] rounded-full bg-accent" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-4xl px-4 py-20 text-center md:px-8">
          <div className="rounded-[2rem] border border-border bg-card px-6 py-14 md:px-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
              <Workflow className="h-7 w-7" />
            </div>

            <h2 className="mt-7 font-heading text-3xl font-bold tracking-tight md:text-4xl">
              Your business already has a process.
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              The question is whether your team can see it, follow it and know
              who is responsible for the next step.
            </p>

            <Button
              size="lg"
              onClick={start}
              className="mt-8 bg-accent px-8 text-accent-foreground hover:bg-accent/90"
            >
              Build Your Process

              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between md:px-8">
          <p>© {new Date().getFullYear()} SOP Pipeline</p>

          <div className="flex gap-5">
            <Link to="/track" className="hover:text-foreground">
              Track Job
            </Link>

            <Link to="/login" className="hover:text-foreground">
              Sign in
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
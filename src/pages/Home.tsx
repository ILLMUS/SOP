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
  CheckCircle2,
  Clock3,
  Layers3,
} from "lucide-react";

const STEPS = [
  {
    number: "01",
    icon: Building2,
    title: "Define your business",
    text: "Tell us what you do, where you operate and how your team works.",
  },
  {
    number: "02",
    icon: Users,
    title: "Define your roles",
    text: "Assign responsibility so every workflow step has an owner.",
  },
  {
    number: "03",
    icon: Workflow,
    title: "Build your workflow",
    text: "Create the sequence your team follows from start to finish.",
  },
  {
    number: "04",
    icon: ClipboardList,
    title: "Capture what matters",
    text: "Add the information, files, dates and amounts each step requires.",
  },
];

const FEATURES = [
  {
    icon: Workflow,
    title: "Structured workflows",
    text: "Turn the way your business operates into a repeatable process.",
  },
  {
    icon: Users,
    title: "Clear ownership",
    text: "Every step can have a responsible role so work never gets lost.",
  },
  {
    icon: Clock3,
    title: "Deadlines & SLA",
    text: "Track time-sensitive work and know when something needs attention.",
  },
  {
    icon: Layers3,
    title: "Versioned SOPs",
    text: "Improve your process without breaking jobs already in progress.",
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
    <div className="min-h-screen bg-background text-foreground">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
          <Link
            to="/"
            className="flex items-center gap-2 font-heading text-lg font-bold tracking-tight"
          >
            <span className="flex h-8 w-8 items-center justify-center bg-accent text-accent-foreground">
              <Workflow className="h-4 w-4" />
            </span>
            SOP PIPELINE
          </Link>

          <nav className="flex items-center gap-1">
            <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
              <a href="#how-it-works">How it works</a>
            </Button>

            <Button variant="ghost" size="sm" asChild>
              <Link to="/track">Track a job</Link>
            </Button>

            {session ? (
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Sign in</Link>
              </Button>
            )}
          </nav>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden border-b border-border bg-primary text-primary-foreground">
          {/* subtle grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 md:grid-cols-[1.1fr_0.9fr] md:px-8 md:py-28">
            <div className="flex flex-col justify-center">
              <div className="mb-5 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-accent">
                <span className="h-px w-8 bg-accent" />
                Business Operations System
              </div>

              <h1 className="max-w-3xl font-heading text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
                Turn the way you work into a{" "}
                <span className="text-accent">system.</span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-relaxed text-primary-foreground/70 md:text-lg">
                Build your business SOP, assign responsibility, capture the
                right information and track every job through a process your
                whole team can follow.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  size="lg"
                  onClick={start}
                  className="h-12 bg-accent px-6 text-accent-foreground hover:bg-accent/90"
                >
                  Build My SOP
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="h-12 border-primary-foreground/20 bg-transparent px-6 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <Link to="/track">Track a Job</Link>
                </Button>
              </div>

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs text-primary-foreground/50">
                <span>✓ Built around your business</span>
                <span>✓ No forced templates</span>
                <span>✓ Versioned workflows</span>
              </div>
            </div>

            {/* WORKFLOW PREVIEW */}
            <div className="flex items-center justify-center">
              <div className="w-full max-w-md border border-primary-foreground/15 bg-primary-foreground/[0.04] p-4 shadow-2xl">
                <div className="mb-4 flex items-center justify-between border-b border-primary-foreground/10 pb-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-primary-foreground/40">
                      Live workflow
                    </p>
                    <p className="mt-1 font-heading text-sm font-semibold">
                      Example Job Pipeline
                    </p>
                  </div>

                  <span className="flex items-center gap-1.5 text-[10px] text-accent">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    ACTIVE
                  </span>
                </div>

                {[
                  ["01", "Job Intake", "Customer information"],
                  ["02", "Quotation", "Pricing & approval"],
                  ["03", "Production", "Assigned team"],
                  ["04", "Quality Check", "Verification"],
                  ["05", "Delivery", "Completion"],
                ].map(([number, title, subtitle], index) => (
                  <div key={number}>
                    <div className="flex items-center gap-3 border border-primary-foreground/10 bg-primary-foreground/[0.03] p-3">
                      <span className="font-mono text-[10px] text-accent">
                        {number}
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{title}</p>
                        <p className="text-[11px] text-primary-foreground/40">
                          {subtitle}
                        </p>
                      </div>

                      {index < 2 && (
                        <CheckCircle2 className="h-4 w-4 text-accent" />
                      )}
                    </div>

                    {index < 4 && (
                      <div className="ml-5 h-3 border-l border-dashed border-primary-foreground/20" />
                    )}
                  </div>
                ))}

                <div className="mt-4 flex items-center justify-between border-t border-primary-foreground/10 pt-3 text-[10px] text-primary-foreground/40">
                  <span>5 workflow stages</span>
                  <span>Version 1.0</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* VALUE PROPOSITION */}
        <section className="border-b border-border px-4 py-16 md:px-8 md:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
                One system. Every step.
              </p>

              <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight md:text-4xl">
                Stop keeping your business process in people's heads.
              </h2>

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                SOP Pipeline turns informal processes into structured
                workflows your team can actually follow, measure and improve.
              </p>
            </div>

            <div className="mt-10 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map((feature) => (
                <div
                  key={feature.title}
                  className="bg-background p-6 transition-colors hover:bg-muted/40"
                >
                  <feature.icon className="h-5 w-5 text-accent" />

                  <h3 className="mt-5 font-heading text-base font-bold">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {feature.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section
          id="how-it-works"
          className="border-b border-border bg-muted/20 px-4 py-16 md:px-8 md:py-20"
        >
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
                  Setup
                </p>

                <h2 className="mt-2 font-heading text-3xl font-bold md:text-4xl">
                  Build your process in four steps.
                </h2>
              </div>

              <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                Start with how your business actually works. Then turn it into
                a workflow your team can execute consistently.
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((step) => (
                <div
                  key={step.number}
                  className="group relative border border-border bg-background p-6 transition-all hover:-translate-y-1 hover:border-accent/50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center bg-accent text-accent-foreground">
                      <step.icon className="h-4 w-4" />
                    </div>

                    <span className="font-mono text-xs text-muted-foreground">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="mt-6 font-heading text-lg font-bold">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* VERSIONING / TRUST */}
        <section className="px-4 py-16 md:px-8 md:py-20">
          <div className="mx-auto max-w-5xl">
            <div className="border border-border bg-muted/20 p-6 md:p-10">
              <div className="flex flex-col gap-8 md:flex-row md:items-center">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center bg-accent text-accent-foreground">
                  <ShieldCheck className="h-6 w-6" />
                </div>

                <div className="flex-1">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
                    Built for real operations
                  </p>

                  <h2 className="mt-2 font-heading text-2xl font-bold md:text-3xl">
                    Improve your process without breaking work already in
                    progress.
                  </h2>

                  <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                    Publish new SOP versions as your business evolves. Jobs
                    already running continue using the exact workflow version
                    they started with.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="border-t border-border bg-primary px-4 py-20 text-center text-primary-foreground md:px-8 md:py-24">
          <div className="mx-auto max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-accent">
              Start building
            </p>

            <h2 className="mt-4 font-heading text-3xl font-bold md:text-5xl">
              Your business has a process.
              <br />
              <span className="text-accent">Let's make it a system.</span>
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-primary-foreground/60 md:text-base">
              Answer a few questions and build an SOP designed around the way
              your business actually operates.
            </p>

            <Button
              size="lg"
              onClick={start}
              className="mt-8 h-12 bg-accent px-8 text-accent-foreground hover:bg-accent/90"
            >
              Build My SOP
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-border px-4 py-6 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-xs text-muted-foreground sm:flex-row">
          <span className="font-heading font-bold">SOP PIPELINE</span>

          <div className="flex items-center gap-4">
            <Link to="/track" className="hover:text-foreground">
              Track a job
            </Link>

            {session ? (
              <Link to="/dashboard" className="hover:text-foreground">
                Dashboard
              </Link>
            ) : (
              <Link to="/login" className="hover:text-foreground">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
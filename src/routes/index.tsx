import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Building2,
  CheckCircle2,
  GraduationCap,
  LibraryBig,
  MapPin,
  MessageSquareText,
  Search,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import type { ReactNode } from "react";

import { Hero3DScene } from "@/components/hero-3d-scene";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Murshidi - Smart University Assistant" },
      {
        name: "description",
        content:
          "Murshidi is a premium university assistant that helps students explore courses, prerequisites, instructors, and departments from one polished experience.",
      },
      { property: "og:title", content: "Murshidi - Smart University Assistant" },
      {
        property: "og:description",
        content:
          "A premium university experience designed to help students find academic information quickly and confidently.",
      },
    ],
  }),
  component: Index,
});

const stats = [
  { value: "Premium", label: "Visual identity" },
  { value: "24/7", label: "Always available" },
  { value: "1", label: "Unified experience" },
] as const;

const featureCards = [
  {
    title: "Course Intelligence",
    description:
      "Find course details, credit hours, and academic descriptions inside one elegant layer instead of jumping between many pages.",
    icon: BookOpen,
  },
  {
    title: "Clear Prerequisites",
    description:
      "Understand prerequisite paths and course sequencing in a structured way that helps students plan with confidence.",
    icon: CheckCircle2,
  },
  {
    title: "Instructor Access",
    description:
      "See instructor context and the academic information connected to each course faster and with less friction.",
    icon: UsersRound,
  },
  {
    title: "Campus Navigation",
    description:
      "Reach departments, offices, and student services without visual clutter or unnecessary complexity.",
    icon: Building2,
  },
] as const;

const toolCards = [
  {
    number: "01",
    eyebrow: "Academic Search",
    title: "Ask Directly",
    description:
      "A refined chat interface for quick questions about courses, schedules, and university policies.",
    bullets: ["Fast search", "Clean answers", "Academic context"],
    to: "/chatbot" as const,
  },
  {
    number: "02",
    eyebrow: "Study Planning",
    title: "Plan Smarter",
    description:
      "A premium planning view that helps students connect prerequisites with the next semester's path.",
    bullets: ["Prerequisites", "Semester flow", "Study direction"],
    to: "/courses" as const,
  },
  {
    number: "03",
    eyebrow: "Campus Guidance",
    title: "Find Faster",
    description:
      "Reach the right department, office, or support point without breaking the experience flow.",
    bullets: ["Departments", "Offices", "Support"],
    to: "/departments" as const,
  },
] as const;

const flowCards = [
  {
    title: "Discover",
    description:
      "Type your question naturally and let Murshidi capture the right university context.",
    icon: Search,
  },
  {
    title: "Clarify",
    description:
      "See prerequisites, course data, and academic relationships in a clean, readable format.",
    icon: MapPin,
  },
  {
    title: "Act",
    description:
      "Move toward registration, courses, or departments with a clearer next step.",
    icon: GraduationCap,
  },
] as const;

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/75 backdrop-blur">
        <Sparkles className="h-3.5 w-3.5 text-fuchsia-300" />
        {eyebrow}
      </div>
      <h2 className="text-balance text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      <p className="mt-4 text-pretty text-sm leading-7 text-slate-300 sm:text-base">
        {description}
      </p>
    </div>
  );
}

function StatTile({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
      <div className="text-xl font-black text-white">{value}</div>
      <div className="mt-1 text-xs font-medium uppercase tracking-[0.22em] text-slate-300/80">
        {label}
      </div>
    </div>
  );
}

function Index() {
  return (
    <main dir="ltr" className="relative overflow-x-clip bg-[#030714] text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-10rem] top-[-10rem] h-[26rem] w-[26rem] rounded-full bg-fuchsia-500/18 blur-3xl" />
        <div className="absolute right-[-8rem] top-[8rem] h-[22rem] w-[22rem] rounded-full bg-cyan-400/16 blur-3xl" />
        <div className="absolute bottom-[-8rem] left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-indigo-500/12 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:84px_84px] opacity-[0.16]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.18),transparent_46%)]" />
      </div>

      <section className="relative mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:px-8 lg:pb-28 lg:pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.02fr] lg:gap-14">
          <Reveal className="relative z-10">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-white/75 backdrop-blur">
              <BrainCircuit className="h-4 w-4 text-fuchsia-300" />
              Premium University Assistant
            </div>
            <h1 className="max-w-2xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-7xl">
              A modern university experience with a premium, clear presence
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
              Students enter a refined interface with a living visual centerpiece,
              glass layers, light motion, and fast access to courses,
              prerequisites, instructors, and departments from one place.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/chatbot"
                className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#b600a8_0%,#6d28d9_52%,#d97706_100%)] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_60px_-20px_rgba(182,0,168,0.72)] transition-transform hover:-translate-y-0.5"
              >
                Start conversation
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white/90 backdrop-blur transition-colors hover:bg-white/10"
              >
                <Search className="h-4 w-4" />
                Browse courses
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {stats.map((stat) => (
                <StatTile key={stat.label} value={stat.value} label={stat.label} />
              ))}
            </div>

            <div className="mt-6 flex items-center gap-3 text-sm text-slate-300">
              <ShieldCheck className="h-4 w-4 text-emerald-300" />
              Designed to feel like a premium product, not a standard portal.
            </div>
          </Reveal>

          <Reveal delay={0.12} className="relative">
            <div className="relative rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-[0_30px_120px_-48px_rgba(0,0,0,0.95)] backdrop-blur">
              <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_top,rgba(236,72,153,0.20),transparent_45%),radial-gradient(circle_at_bottom,rgba(34,211,238,0.16),transparent_45%)]" />
              <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950/65">
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-xs text-slate-300">
                  <span className="inline-flex items-center gap-2 font-semibold uppercase tracking-[0.22em]">
                    <LibraryBig className="h-4 w-4 text-fuchsia-300" />
                    Murshidi Dashboard
                  </span>
                  <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-emerald-200">
                    Connected
                  </span>
                </div>

                <div className="grid gap-4 p-4 md:grid-cols-[0.94fr_1.06fr]">
                  <div className="relative rounded-[1.4rem] border border-white/10 bg-white/5 p-3">
                    <Hero3DScene />
                  </div>

                  <div className="grid gap-4">
                    <div className="rounded-[1.35rem] border border-white/10 bg-gradient-to-br from-fuchsia-500/22 to-cyan-500/12 p-5">
                      <div className="flex items-center gap-2 text-sm font-semibold text-white">
                        <MessageSquareText className="h-4 w-4 text-cyan-300" />
                        Quick question
                      </div>
                      <p className="mt-3 text-sm leading-7 text-slate-200">
                        How many credit hours is the computer networks course, and
                        does it have prerequisites?
                      </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
                        <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                        <h3 className="mt-3 text-sm font-bold text-white">Organized answers</h3>
                        <p className="mt-2 text-sm leading-7 text-slate-300">
                          Every response is arranged to stay clear and easy to review.
                        </p>
                      </div>
                      <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
                        <Sparkles className="h-5 w-5 text-cyan-300" />
                        <h3 className="mt-3 text-sm font-bold text-white">Premium identity</h3>
                        <p className="mt-2 text-sm leading-7 text-slate-300">
                          Layers of light, glass, and motion create a modern feel.
                        </p>
                      </div>
                    </div>

                    <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-20 w-28 rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.3),transparent_50%),linear-gradient(180deg,#12172a,#070b16)]" />
                        <div>
                          <p className="text-sm font-semibold text-white">Compact information panel</p>
                          <p className="mt-1 text-sm leading-6 text-slate-300">
                            Built for courses, departments, and instructors in one place.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="What Murshidi offers"
            title="Everything a student needs in one calm experience"
            description="Instead of moving between many pages, students get a tidy experience that helps them find information quickly and confidently."
          />
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {featureCards.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Reveal key={feature.title} delay={index * 0.05}>
                <article className="h-full rounded-[1.6rem] border border-white/10 bg-white/5 p-5 shadow-[0_18px_70px_-52px_rgba(0,0,0,0.9)] backdrop-blur transition-transform hover:-translate-y-1">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500/20 to-cyan-500/15">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-white">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{feature.description}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Core tools"
            title="Three clear paths that support student needs"
            description="The tools are designed so the eye understands them quickly and the hand can use them easily, without clutter or exaggeration."
          />
        </Reveal>

        <div className="mt-10 grid gap-5">
          {toolCards.map((tool, index) => (
            <Reveal key={tool.title} delay={index * 0.08}>
              <article className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#070d1d]/90 p-4 shadow-[0_20px_80px_-52px_rgba(0,0,0,0.95)] backdrop-blur sm:p-5">
                <div className="grid gap-5 lg:grid-cols-[1fr_1.05fr] lg:items-stretch">
                  <div className="flex flex-col justify-between rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-white/7 to-white/3 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-5xl font-black leading-none text-white/90">
                          {tool.number}
                        </div>
                        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300/90">
                          {tool.eyebrow}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                        <Sparkles className="h-5 w-5 text-fuchsia-300" />
                      </div>
                    </div>

                    <div className="mt-8">
                      <h3 className="text-2xl font-black text-white">{tool.title}</h3>
                      <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300">
                        {tool.description}
                      </p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {tool.bullets.map((bullet) => (
                          <span
                            key={bullet}
                            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200"
                          >
                            {bullet}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-8">
                      <Link
                        to={tool.to}
                        className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                      >
                        Try now
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-[0.94fr_1.06fr]">
                    <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/35">
                      <img
                        src="/generated/murshidi-dashboard-scene.png"
                        alt={tool.title}
                        className="h-full min-h-[15rem] w-full object-cover"
                      />
                    </div>
                    <div className="grid gap-4">
                      <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-white">
                          <BookOpen className="h-4 w-4 text-emerald-300" />
                          Clear outputs
                        </div>
                        <p className="mt-2 text-sm leading-7 text-slate-300">
                          Built to give students the right starting point instead of guesswork.
                        </p>
                      </div>
                      <div className="rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-fuchsia-500/15 to-cyan-500/10 p-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-white">
                          <MapPin className="h-4 w-4 text-cyan-300" />
                          University content
                        </div>
                        <p className="mt-2 text-sm leading-7 text-slate-300">
                          Information shaped for daily student questions inside the campus
                          environment.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="The flow"
            title="From question to decision in three steps"
            description="A short and clear journey that helps students move from understanding to action without getting lost."
          />
        </Reveal>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {flowCards.map((step, index) => {
            const Icon = step.icon;
            return (
              <Reveal key={step.title} delay={index * 0.08}>
                <article className="rounded-[1.8rem] border border-white/10 bg-white/5 p-6 shadow-[0_18px_70px_-54px_rgba(0,0,0,0.9)] backdrop-blur">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500/20 to-cyan-500/15">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-4xl font-black text-white/15">0{index + 1}</div>
                  </div>
                  <h3 className="mt-6 text-xl font-black text-white">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{step.description}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <Reveal>
          <div className="overflow-hidden rounded-[2.2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(182,0,168,0.26),rgba(37,99,235,0.18),rgba(15,23,42,0.92))] px-6 py-10 shadow-[0_24px_90px_-56px_rgba(0,0,0,0.95)] sm:px-8 sm:py-12">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-white/80">
                <GraduationCap className="h-4 w-4 text-cyan-300" />
                Ready to use
              </div>
              <h2 className="mt-6 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                A modern, premium interface that gives Murshidi a stronger presence
              </h2>
              <p className="mt-4 text-sm leading-8 text-slate-200/85 sm:text-base">
                If you want the site to feel official, highly modern, and clear in the way
                it presents the visual centerpiece, this direction is the closest fit.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link
                  to="/chatbot"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition-transform hover:-translate-y-0.5"
                >
                  Start now
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/courses"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Browse courses
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}

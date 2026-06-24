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
  { value: "300+", label: "Students supported" },
  { value: "90%", label: "Answer clarity" },
  { value: "56", label: "Academic insights" },
  { value: "100%", label: "Unified flow" },
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

const serviceCards = [
  {
    number: "01",
    title: "Ask Directly",
    description:
      "A refined chat interface for quick questions about courses, schedules, and university policies.",
    icon: MessageSquareText,
  },
  {
    number: "02",
    title: "Plan Smarter",
    description:
      "A premium planning view that helps students connect prerequisites with the next semester's path.",
    icon: BrainCircuit,
  },
  {
    number: "03",
    title: "Find Faster",
    description:
      "Reach the right department, office, or support point without breaking the experience flow.",
    icon: Search,
  },
] as const;

const journeyCards = [
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
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay }}
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
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-white/75 backdrop-blur">
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
    <div className="rounded-[1.4rem] border border-white/10 bg-white/5 px-4 py-3 text-center backdrop-blur">
      <div className="text-2xl font-black text-white">{value}</div>
      <div className="mt-1 text-[0.7rem] font-medium uppercase tracking-[0.24em] text-slate-300/80">
        {label}
      </div>
    </div>
  );
}

function NavLink({ children, href }: { children: ReactNode; href: string }) {
  return (
    <a
      href={href}
      className="text-sm font-semibold uppercase tracking-[0.28em] text-white/75 transition-colors hover:text-white"
    >
      {children}
    </a>
  );
}

function HeroCard() {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-[0_30px_120px_-48px_rgba(0,0,0,0.95)] backdrop-blur">
      <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#050816]">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-xs text-slate-300">
          <span className="inline-flex items-center gap-2 font-semibold uppercase tracking-[0.22em]">
            <LibraryBig className="h-4 w-4 text-fuchsia-300" />
            Murshidi Dashboard
          </span>
          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-emerald-200">
            Connected
          </span>
        </div>

        <div className="grid gap-4 p-4 lg:grid-cols-[1.04fr_0.96fr]">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-3">
            <Hero3DScene />
          </div>

          <div className="grid gap-4">
            <div className="rounded-[1.35rem] border border-white/10 bg-gradient-to-br from-fuchsia-500/22 to-cyan-500/12 p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <MessageSquareText className="h-4 w-4 text-cyan-300" />
                Quick question
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-200">
                How many credit hours is the computer networks course, and does it
                have prerequisites?
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
                <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                <h3 className="mt-3 text-sm font-bold text-white">Organized answers</h3>
                <p className="mt-2 text-sm leading-7 text-slate-300">
                  Every response stays clear, structured, and easy to review.
                </p>
              </div>
              <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
                <Sparkles className="h-5 w-5 text-cyan-300" />
                <h3 className="mt-3 text-sm font-bold text-white">Premium identity</h3>
                <p className="mt-2 text-sm leading-7 text-slate-300">
                  Glass, light, and motion combine into a modern first impression.
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
  );
}

function ServiceCard({
  number,
  title,
  description,
  icon: Icon,
}: {
  number: string;
  title: string;
  description: string;
  icon: typeof MessageSquareText;
}) {
  return (
    <article className="grid gap-5 rounded-[2rem] border border-white/10 bg-[#0b1020]/95 p-4 shadow-[0_20px_80px_-52px_rgba(0,0,0,0.95)] backdrop-blur lg:grid-cols-[1fr_auto] lg:items-center">
      <div className="rounded-[1.6rem] border border-white/10 bg-gradient-to-br from-white/8 to-white/3 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-5xl font-black leading-none text-white/85">{number}</div>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300/90">
              Core experience
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <Icon className="h-5 w-5 text-fuchsia-300" />
          </div>
        </div>

        <div className="mt-7 max-w-xl">
          <h3 className="text-2xl font-black text-white">{title}</h3>
          <p className="mt-3 text-sm leading-7 text-slate-300">{description}</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:w-[24rem]">
        <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
          <BookOpen className="h-5 w-5 text-emerald-300" />
          <h4 className="mt-3 text-sm font-bold text-white">Clear outputs</h4>
          <p className="mt-2 text-sm leading-7 text-slate-300">
            Built to give students the right starting point instead of guesswork.
          </p>
        </div>
        <div className="rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-fuchsia-500/15 to-cyan-500/10 p-4">
          <MapPin className="h-5 w-5 text-cyan-300" />
          <h4 className="mt-3 text-sm font-bold text-white">University content</h4>
          <p className="mt-2 text-sm leading-7 text-slate-300">
            Information shaped for daily student questions inside the campus
            environment.
          </p>
        </div>
      </div>
    </article>
  );
}

function JourneyCard({
  title,
  description,
  icon: Icon,
  index,
}: {
  title: string;
  description: string;
  icon: typeof Search;
  index: number;
}) {
  return (
    <article className="rounded-[1.9rem] border border-white/10 bg-white/5 p-6 shadow-[0_18px_70px_-54px_rgba(0,0,0,0.9)] backdrop-blur">
      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500/20 to-cyan-500/15">
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div className="text-4xl font-black text-white/15">0{index + 1}</div>
      </div>
      <h3 className="mt-6 text-xl font-black text-white">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-300">{description}</p>
    </article>
  );
}

function Index() {
  return (
    <main dir="ltr" className="premium-home relative overflow-x-clip text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-8rem] top-[-10rem] h-[24rem] w-[24rem] rounded-full bg-fuchsia-500/18 blur-3xl" />
        <div className="absolute right-[-8rem] top-[8rem] h-[20rem] w-[20rem] rounded-full bg-cyan-400/15 blur-3xl" />
        <div className="absolute bottom-[-10rem] left-1/2 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:88px_88px] opacity-[0.15]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.16),transparent_46%)]" />
      </div>

      <header className="relative mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 lg:pt-8">
        <nav className="premium-navbar liquid-glass flex items-center justify-between rounded-full px-5 py-3 sm:px-6">
          <Link
            to="/"
            className="text-lg font-black tracking-tight text-white sm:text-xl"
          >
            Murshidi
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            <NavLink href="#features">Features</NavLink>
            <NavLink href="#services">Services</NavLink>
            <NavLink href="#journey">Journey</NavLink>
            <NavLink href="#contact">Contact</NavLink>
          </div>

          <Link
            to="/chatbot"
            className="premium-nav-action inline-flex items-center rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur"
          >
            Student experience
          </Link>
        </nav>
      </header>

      <section className="relative mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 lg:px-8 lg:pb-24 lg:pt-14">
        <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
          <Reveal className="premium-hero-copy relative z-10">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-white/75 backdrop-blur">
              <BrainCircuit className="h-4 w-4 text-fuchsia-300" />
              Premium University Assistant
            </div>
            <h1 className="max-w-2xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-7xl">
              Three clear paths that give students a smooth, confident experience
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
              Murshidi brings academic search, planning, and guidance together in
              one refined interface, so students can move from question to action
              without visual noise.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/chatbot"
                className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#b600a8_0%,#6d28d9_52%,#d97706_100%)] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_60px_-20px_rgba(182,0,168,0.72)] transition-transform hover:-translate-y-0.5"
              >
                Start chatting
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

            <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => (
                <StatTile key={stat.label} value={stat.value} label={stat.label} />
              ))}
            </div>

            <div className="mt-6 flex items-center gap-3 text-sm text-slate-300">
              <ShieldCheck className="h-4 w-4 text-emerald-300" />
              Built to feel like a premium product, not a standard portal.
            </div>
          </Reveal>

          <Reveal delay={0.12} className="interactive-hero-card relative">
            <HeroCard />
          </Reveal>
        </div>
      </section>

      <section id="features" className="relative mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="What students get"
            title="Everything a student needs in one calm experience"
            description="Instead of moving between scattered pages, the student gets a polished interface that keeps information clean and easy to trust."
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

      <section id="services" className="relative mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Three services"
            title="Three clear services that support student needs"
            description="Each card is designed as a self-contained experience so the student sees the value immediately."
          />
        </Reveal>

        <div className="mt-10 grid gap-4">
          {serviceCards.map((service, index) => (
            <Reveal key={service.title} delay={index * 0.08}>
              <ServiceCard
                number={service.number}
                title={service.title}
                description={service.description}
                icon={service.icon}
              />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="How it works"
            title="From question to decision in three steps"
            description="A short journey that helps students move from discovery to action without losing momentum."
          />
        </Reveal>

        <div
          id="journey"
          className="mt-10 grid gap-4 lg:grid-cols-3"
        >
          {journeyCards.map((step, index) => (
            <Reveal key={step.title} delay={index * 0.08}>
              <JourneyCard
                title={step.title}
                description={step.description}
                icon={step.icon}
                index={index}
              />
            </Reveal>
          ))}
        </div>
      </section>

      <section id="contact" className="relative mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
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
                If you want the site to feel official, modern, and visually rich,
                this layout is the closest match to the reference while keeping the
                content fully in English.
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

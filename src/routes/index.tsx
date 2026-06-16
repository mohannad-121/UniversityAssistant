import { createFileRoute, Link } from "@tanstack/react-router";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
  type Transition,
} from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Bot,
  BrainCircuit,
  Building2,
  CheckCircle2,
  Database,
  GraduationCap,
  MapPin,
  MessageSquare,
  Route as RouteIcon,
  Search,
  UserSearch,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "مرشدي -- Smart University Guide" },
      {
        name: "description",
        content:
          "مرشدي is a smart university assistant for courses, prerequisites, instructors, departments, offices, and student services.",
      },
      { property: "og:title", content: "مرشدي -- Smart University Guide" },
      {
        property: "og:description",
        content:
          "A smart university assistant that helps students navigate academic information faster.",
      },
    ],
  }),
  component: Index,
});

const portraitUrl =
  "/generated/murshidi-hero-assistant.png";

const academicObjectsUrl = "/generated/murshidi-academic-objects.png";
const dashboardSceneUrl = "/generated/murshidi-dashboard-scene.png";

const decorImages = [
  {
    alt: "Academic 3D objects",
    src: academicObjectsUrl,
    className:
      "left-[1%] top-[4%] w-[170px] rounded-[32px] sm:left-[2%] sm:w-[220px] md:left-[4%] md:w-[300px]",
    fade: { delay: 0.1, x: -80 },
  },
  {
    alt: "Student assistant 3D scene",
    src: portraitUrl,
    className:
      "bottom-[8%] left-[3%] w-[120px] rounded-[32px] sm:left-[6%] sm:w-[160px] md:left-[10%] md:w-[220px]",
    fade: { delay: 0.25, x: -80 },
  },
  {
    alt: "University dashboard 3D scene",
    src: dashboardSceneUrl,
    className:
      "right-[1%] top-[4%] w-[170px] rounded-[32px] sm:right-[2%] sm:w-[220px] md:right-[4%] md:w-[300px]",
    fade: { delay: 0.15, x: 80 },
  },
  {
    alt: "Academic object group",
    src: academicObjectsUrl,
    className:
      "bottom-[8%] right-[3%] w-[150px] rounded-[32px] sm:right-[6%] sm:w-[190px] md:right-[10%] md:w-[260px]",
    fade: { delay: 0.3, x: 80 },
  },
];

const marqueeImages = [
  academicObjectsUrl,
  dashboardSceneUrl,
  portraitUrl,
  academicObjectsUrl,
  dashboardSceneUrl,
  portraitUrl,
  academicObjectsUrl,
  dashboardSceneUrl,
  portraitUrl,
  academicObjectsUrl,
  dashboardSceneUrl,
  portraitUrl,
  academicObjectsUrl,
  dashboardSceneUrl,
  portraitUrl,
  academicObjectsUrl,
  dashboardSceneUrl,
  portraitUrl,
  academicObjectsUrl,
  dashboardSceneUrl,
  portraitUrl,
];

const services = [
  {
    icon: BookOpen,
    name: "Course Search",
    description:
      "Find course names, credit hours, prerequisites, and study-plan details without digging through scattered pages.",
  },
  {
    icon: CheckCircle2,
    name: "Prerequisite Guidance",
    description:
      "Understand what to take before a course and see how subjects connect across your academic path.",
  },
  {
    icon: UserSearch,
    name: "Instructor Lookup",
    description:
      "Discover who teaches each course, where to find them, and the academic context students need before registering.",
  },
  {
    icon: Building2,
    name: "Department Info",
    description:
      "Explore departments, majors, offices, and university information in a clear conversational flow.",
  },
  {
    icon: Bot,
    name: "AI Student Assistant",
    description:
      "Ask naturally in plain language and get fast, structured answers built around student questions.",
  },
];

const projectCards = [
  {
    number: "01",
    category: "Academic Search",
    name: "Ask Anything",
    icon: MessageSquare,
    images: [dashboardSceneUrl, academicObjectsUrl, portraitUrl],
  },
  {
    number: "02",
    category: "Planning",
    name: "Plan Smarter",
    icon: RouteIcon,
    images: [academicObjectsUrl, portraitUrl, dashboardSceneUrl],
  },
  {
    number: "03",
    category: "Campus Info",
    name: "Find Faster",
    icon: MapPin,
    images: [portraitUrl, dashboardSceneUrl, academicObjectsUrl],
  },
];

function FadeIn({
  as = "div",
  children,
  className,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
}: {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
}) {
  const Component = motion.create(as);

  return (
    <Component
      className={className}
      initial={{ opacity: 0, x, y }}
      transition={{ delay, duration, ease: [0.25, 0.1, 0.25, 1] as Transition["ease"] }}
      viewport={{ once: true, margin: "50px", amount: 0 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
    >
      {children}
    </Component>
  );
}

function ContactButton({ to = "/chatbot", label = "Start Chat" }: { to?: "/chatbot" | "/courses"; label?: string }) {
  return (
    <Link
      to={to}
      className="inline-flex rounded-full px-8 py-3 text-xs font-medium uppercase tracking-widest text-white outline outline-2 outline-offset-[-3px] outline-white transition-transform duration-200 hover:scale-[1.03] sm:px-10 sm:py-3.5 sm:text-sm md:px-12 md:py-4 md:text-base"
      style={{
        background: "linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)",
        boxShadow: "0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset",
      }}
    >
      {label}
    </Link>
  );
}

function LiveProjectButton() {
  return (
    <Link
      to="/chatbot"
      className="inline-flex items-center gap-2 rounded-full border-2 border-[#D7E2EA] px-8 py-3 text-sm font-medium uppercase tracking-widest text-[#D7E2EA] transition-colors hover:bg-[#D7E2EA]/10 sm:px-10 sm:py-3.5 sm:text-base"
    >
      Try مرشدي <ArrowRight className="h-4 w-4" />
    </Link>
  );
}

function Magnet({
  children,
  padding = 150,
  strength = 3,
  activeTransition = "transform 0.3s ease-out",
  inactiveTransition = "transform 0.6s ease-in-out",
}: {
  children: ReactNode;
  padding?: number;
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [style, setStyle] = useState<CSSProperties>({ transition: inactiveTransition });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const onMove = (event: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const inside =
        event.clientX >= rect.left - padding &&
        event.clientX <= rect.right + padding &&
        event.clientY >= rect.top - padding &&
        event.clientY <= rect.bottom + padding;

      if (!inside) {
        setStyle({ transform: "translate3d(0, 0, 0)", transition: inactiveTransition });
        return;
      }

      const x = (event.clientX - (rect.left + rect.width / 2)) / strength;
      const y = (event.clientY - (rect.top + rect.height / 2)) / strength;
      setStyle({ transform: `translate3d(${x}px, ${y}px, 0)`, transition: activeTransition });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [activeTransition, inactiveTransition, padding, strength]);

  return (
    <div ref={ref} style={{ ...style, willChange: "transform" }}>
      {children}
    </div>
  );
}

function AnimatedText({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.2"],
  });

  return (
    <p
      ref={ref}
      dir="rtl"
      className="max-w-[720px] text-center text-[clamp(1rem,2vw,1.35rem)] font-medium leading-relaxed text-[#D7E2EA]"
    >
      {text.split(/(\s+)/).map((part, index) => (
        <AnimatedPart
          key={`${part}-${index}`}
          part={part}
          index={index}
          progress={scrollYProgress}
          total={text.split(/(\s+)/).length}
        />
      ))}
    </p>
  );
}

function AnimatedPart({
  part,
  index,
  progress,
  total,
}: {
  part: string;
  index: number;
  progress: MotionValue<number>;
  total: number;
}) {
  const start = index / total;
  const end = Math.min(1, start + 0.12);
  const opacity = useTransform(progress, [start, end], [0.2, 1]);

  return (
    <span className="relative inline-block whitespace-pre">
      <span className="invisible">{part}</span>
      <motion.span className="absolute inset-0" style={{ opacity }}>
        {part}
      </motion.span>
    </span>
  );
}

function HeroSection() {
  return (
    <section className="relative flex h-screen flex-col overflow-x-clip bg-[#0C0C0C]">
      <FadeIn as="nav" delay={0} y={-20} className="z-20 flex justify-between px-6 pt-6 md:px-10 md:pt-8">
        {[
          ["About", "#about"],
          ["Services", "#services"],
          ["Tools", "#projects"],
          ["Contact", "#contact"],
        ].map(([item, href]) => (
          <a
            key={item}
            href={href}
            className="text-sm font-medium uppercase tracking-wider text-[#D7E2EA] transition-opacity duration-200 hover:opacity-70 md:text-lg lg:text-[1.4rem]"
          >
            {item}
          </a>
        ))}
      </FadeIn>

      <div className="mt-6 w-full overflow-hidden sm:mt-4 md:-mt-5">
        <FadeIn as="h1" delay={0.15} y={40} className="hero-heading w-full whitespace-nowrap text-center text-[10vw] font-black uppercase leading-none tracking-tight sm:text-[10.5vw] md:text-[11vw] lg:text-[11.5vw]">
          Meet مرشدي
        </FadeIn>
      </div>

      <FadeIn delay={0.6} y={30} className="absolute left-1/2 top-1/2 z-10 w-[240px] -translate-x-1/2 -translate-y-1/2 sm:bottom-0 sm:top-auto sm:w-[330px] sm:translate-y-0 md:w-[410px] lg:w-[480px]">
        <Magnet padding={150} strength={3}>
          <div className="relative">
            <img src={portraitUrl} alt="3D assistant character" className="w-full" />
            <div className="absolute left-1/2 top-[46%] flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/25 bg-black/45 px-4 py-2 text-sm font-semibold uppercase tracking-widest text-white backdrop-blur">
              <GraduationCap className="h-4 w-4" />
              Student AI
            </div>
          </div>
        </Magnet>
      </FadeIn>

      <div className="relative z-20 mt-auto flex items-end justify-between gap-6 px-6 pb-7 sm:pb-8 md:px-10 md:pb-10">
        <FadeIn delay={0.35} y={20}>
          <p className="max-w-[180px] text-[clamp(0.75rem,1.4vw,1.5rem)] font-light uppercase leading-snug tracking-wide text-[#D7E2EA] sm:max-w-[240px] md:max-w-[310px]">
            a smart university guide built to help students find answers faster
          </p>
        </FadeIn>
        <FadeIn delay={0.5} y={20}>
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  );
}

function MarqueeSection() {
  const ref = useRef<HTMLElement | null>(null);
  const [offset, setOffset] = useState(0);
  const rowOne = marqueeImages.slice(0, 11);
  const rowTwo = marqueeImages.slice(11);

  useEffect(() => {
    const onScroll = () => {
      const section = ref.current;
      if (!section) return;
      const sectionTop = section.offsetTop;
      setOffset((window.scrollY - sectionTop + window.innerHeight) * 0.3);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section ref={ref} className="overflow-hidden bg-[#0C0C0C] pb-10 pt-24 sm:pt-32 md:pt-40">
      <MarqueeRow images={rowOne} translate={offset - 200} />
      <div className="h-3" />
      <MarqueeRow images={rowTwo} translate={-(offset - 200)} />
    </section>
  );
}

function MarqueeRow({ images, translate }: { images: string[]; translate: number }) {
  return (
    <div
      className="flex gap-3"
      style={{ transform: `translateX(${translate}px)`, willChange: "transform" }}
    >
      {[...images, ...images, ...images].map((src, index) => (
        <img
          key={`${src}-${index}`}
          src={src}
          alt=""
          loading="lazy"
          className="h-[270px] w-[420px] flex-none rounded-2xl object-cover"
        />
      ))}
    </div>
  );
}

function AboutSection() {
  return (
    <section id="about" className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0C0C0C] px-5 py-20 sm:px-8 md:px-10">
      {decorImages.map((item) => (
        <FadeIn
          key={item.alt}
          delay={item.fade.delay}
          duration={0.9}
          x={item.fade.x}
          y={0}
          className={`pointer-events-none absolute ${item.className}`}
        >
          <img src={item.src} alt={item.alt} className="w-full" loading="lazy" />
        </FadeIn>
      ))}

      <div className="relative z-10 flex flex-col items-center gap-10 sm:gap-14 md:gap-16">
        <FadeIn as="h2" delay={0} y={40} className="hero-heading text-center text-[clamp(3rem,12vw,160px)] font-black uppercase leading-none tracking-tight">
          About me
        </FadeIn>
        <div className="flex flex-col items-center gap-16 sm:gap-20 md:gap-24">
          <h3 className="text-center text-[clamp(2.4rem,8vw,96px)] font-black leading-none text-[#D7E2EA]">
            مرشدي
          </h3>
          <AnimatedText text="بدأ مرشدي من فكرة بسيطة: لا يجب على الطالب أن يضيع وقته بين الصفحات والملفات ليسأل عن مادة أو متطلب أو مدرس أو مكتب. مرشدي يجمع المعلومات الجامعية في محادثة ذكية واحدة، ويحوّل الأسئلة اليومية إلى إجابات واضحة تساعد الطالب على التخطيط بثقة." />
          <div className="grid w-full max-w-5xl gap-4 px-2 md:grid-cols-2">
            <FadeIn delay={0.15} y={24}>
              <img
                src={academicObjectsUrl}
                alt="3D academic objects for مرشدي"
                className="h-[240px] w-full rounded-[36px] border border-white/10 object-cover shadow-[0_30px_80px_rgba(0,0,0,0.45)] md:h-[320px]"
                loading="lazy"
              />
            </FadeIn>
            <FadeIn delay={0.25} y={24}>
              <img
                src={dashboardSceneUrl}
                alt="3D dashboard scene for مرشدي"
                className="h-[240px] w-full rounded-[36px] border border-white/10 object-cover shadow-[0_30px_80px_rgba(0,0,0,0.45)] md:h-[320px]"
                loading="lazy"
              />
            </FadeIn>
          </div>
          <ContactButton />
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  return (
    <section id="services" className="rounded-t-[40px] bg-[#0C0C0C] px-5 py-20 text-[#D7E2EA] sm:rounded-t-[50px] sm:px-8 sm:py-24 md:rounded-t-[60px] md:px-10 md:py-32">
      <FadeIn as="h2" className="mb-16 text-center text-[clamp(3rem,12vw,160px)] font-black uppercase leading-none sm:mb-20 md:mb-28">
        Services
      </FadeIn>
      <div className="mx-auto max-w-5xl">
        {services.map(({ icon: Icon, name, description }, index) => (
          <FadeIn key={name} delay={index * 0.1} y={32}>
            <article className="grid gap-5 border-t border-white/15 py-8 last:border-b sm:grid-cols-[minmax(120px,0.34fr)_1fr] sm:gap-8 sm:py-10 md:py-12">
              <span className="flex items-end gap-3 text-[clamp(3rem,10vw,140px)] font-black leading-none">
                {(index + 1).toString().padStart(2, "0")}
                <Icon className="mb-2 h-[clamp(1.4rem,4vw,3rem)] w-[clamp(1.4rem,4vw,3rem)]" />
              </span>
              <div className="self-center">
                <h3 className="text-[clamp(1rem,2.2vw,2.1rem)] font-medium uppercase">{name}</h3>
                <p className="mt-3 max-w-2xl text-[clamp(0.85rem,1.6vw,1.25rem)] font-light leading-relaxed text-[#D7E2EA]/70">
                  {description}
                </p>
              </div>
            </article>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

function ProjectsSection() {
  return (
    <section id="projects" className="relative z-10 -mt-10 rounded-t-[40px] bg-[#0C0C0C] px-5 py-20 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 md:-mt-14 md:rounded-t-[60px] md:px-10">
      <FadeIn as="h2" className="hero-heading mb-14 text-center text-[clamp(3rem,12vw,160px)] font-black uppercase leading-none tracking-tight">
        Tools
      </FadeIn>
      <div className="mx-auto max-w-6xl">
        {projectCards.map((project, index) => (
          <ProjectCard
            key={project.name}
            index={index}
            project={project}
            totalCards={projectCards.length}
          />
        ))}
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  index,
  totalCards,
}: {
  project: (typeof projectCards)[number];
  index: number;
  totalCards: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const targetScale = 1 - (totalCards - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);
  const Icon = project.icon;

  return (
    <div ref={ref} className="h-[85vh]">
      <motion.article
        className="sticky top-24 overflow-hidden rounded-[40px] border-2 border-[#D7E2EA] bg-[#0C0C0C] p-4 sm:rounded-[50px] sm:p-6 md:top-32 md:rounded-[60px] md:p-8"
        style={{ scale, top: `calc(6rem + ${index * 28}px)` }}
      >
        <div className="grid gap-5 pb-6 text-[#D7E2EA] lg:grid-cols-[auto_1fr_auto_auto] lg:items-end">
          <span className="text-[clamp(3rem,10vw,140px)] font-black leading-none">
            {project.number}
          </span>
          <span className="flex items-center gap-2 self-center text-sm font-medium uppercase tracking-widest opacity-70">
            <Icon className="h-4 w-4" />
            {project.category}
          </span>
          <h3 className="text-[clamp(1.6rem,4vw,4.5rem)] font-black uppercase leading-none">
            {project.name}
          </h3>
          <LiveProjectButton />
        </div>

        <div className="grid gap-4 md:grid-cols-[0.4fr_0.6fr]">
          <div className="grid gap-4">
            <img
              src={project.images[0]}
              alt={`${project.name} preview 1`}
              loading="lazy"
              className="h-[clamp(130px,16vw,230px)] w-full rounded-[40px] object-cover sm:rounded-[50px] md:rounded-[60px]"
            />
            <img
              src={project.images[1]}
              alt={`${project.name} preview 2`}
              loading="lazy"
              className="h-[clamp(160px,22vw,340px)] w-full rounded-[40px] object-cover sm:rounded-[50px] md:rounded-[60px]"
            />
          </div>
          <img
            src={project.images[2]}
            alt={`${project.name} preview 3`}
            loading="lazy"
            className="h-full min-h-[330px] w-full rounded-[40px] object-cover sm:rounded-[50px] md:rounded-[60px]"
          />
        </div>
      </motion.article>
    </div>
  );
}

function Index() {
  return (
    <main className="min-h-screen overflow-x-clip bg-[#0C0C0C] font-['Kanit',sans-serif] text-[#D7E2EA]">
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
      <section id="contact" className="flex flex-col items-center gap-8 bg-[#0C0C0C] px-5 pb-24 pt-4 text-center">
        <FadeIn as="h2" className="hero-heading text-[clamp(3rem,12vw,150px)] font-black uppercase leading-none tracking-tight">
          Ready?
        </FadeIn>
        <div className="flex flex-wrap justify-center gap-3">
          <ContactButton />
          <ContactButton to="/courses" label="Browse Courses" />
        </div>
      </section>
    </main>
  );
}

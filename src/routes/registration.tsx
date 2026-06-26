import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpenCheck, CheckCircle2, Search, Trash2 } from "lucide-react";
import { PageLayout } from "@/components/layout";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getCategoryName,
  getCourseName,
  getMajorName,
  getStudyPlanCourses,
  studyPlanCourseMap,
  studyPlans,
  type MajorId,
  type StudyPlan,
} from "@/data/study-plans";
import type { Course } from "@/data/knowledge";
import {
  courseStateEventName,
  readCourseCodes,
  toggleCourseCode,
  writeCourseCodes,
} from "@/lib/student-courses";
import { useLanguage } from "@/lib/language";
import { repairMojibake } from "@/lib/text-encoding";

export const Route = createFileRoute("/registration")({
  head: () => ({
    meta: [
      { title: "Course Registration - مرشدي" },
      {
        name: "description",
        content: "Register planned courses and connect them to your مرشدي study-plan progress.",
      },
    ],
  }),
  component: RegistrationPage,
});

function RegistrationPage() {
  const { language } = useLanguage();
  const ar = (value: string) => (language === "ar" ? repairMojibake(value) : value);
  const [selectedMajor, setSelectedMajor] = useState<MajorId>("ai");
  const [query, setQuery] = useState("");
  const [registered, setRegistered] = useState<string[]>([]);
  const [completed, setCompleted] = useState<string[]>([]);
  const selectedPlan = studyPlans.find((plan) => plan.id === selectedMajor) ?? studyPlans[0];

  useEffect(() => {
    setRegistered(readCourseCodes(selectedMajor, "registered"));
    setCompleted(readCourseCodes(selectedMajor, "completed"));

    const update = () => {
      setRegistered(readCourseCodes(selectedMajor, "registered"));
      setCompleted(readCourseCodes(selectedMajor, "completed"));
    };

    window.addEventListener(courseStateEventName(), update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener(courseStateEventName(), update);
      window.removeEventListener("storage", update);
    };
  }, [selectedMajor]);

  const registeredSet = useMemo(() => new Set(registered), [registered]);
  const completedSet = useMemo(() => new Set(completed), [completed]);
  const countedSet = useMemo(
    () => new Set([...registeredSet, ...completedSet]),
    [completedSet, registeredSet],
  );
  const registeredCourses = registered
    .map((code) => studyPlanCourseMap.get(code))
    .filter((course): course is Course => Boolean(course));
  const registeredHours = calculateRegisteredHours(selectedPlan, registeredSet);
  const groupedCourses = selectedPlan.categories.map((category) => {
    const normalized = query.toLowerCase();
    const courses = category.courseCodes
      .map((code) => studyPlanCourseMap.get(code))
      .filter((course): course is Course => Boolean(course))
      .filter(
        (course) =>
          !normalized ||
          course.name.toLowerCase().includes(normalized) ||
          getCourseName(course, language).toLowerCase().includes(normalized) ||
          course.code.toLowerCase().includes(normalized),
      );

    return { category, courses };
  });

  function toggleRegistration(code: string) {
    const course = studyPlanCourseMap.get(code);
    if (course && getUnmetPrerequisites(course, countedSet).length > 0 && !registeredSet.has(code)) {
      return;
    }

    setRegistered(toggleCourseCode(selectedMajor, "registered", code));
  }

  function clearRegistration() {
    writeCourseCodes(selectedMajor, "registered", []);
    setRegistered([]);
  }

  return (
    <PageLayout>
      <PageHeader
        eyebrow={language === "ar" ? ar("ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø·Ù„اب") : "Student Registration"}
        title={language === "ar" ? ar("ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ù…Ùˆاد") : "Register Courses"}
        subtitle={
          language === "ar"
            ? ar("Ø£Ø¶Ù Ù…ÙˆØ§Ø¯ Ø§Ù„ÙØµÙ„. Ø§Ù„Ù…ÙˆØ§Ø¯ Ø§Ù„Ù…Ø³Ø¬Ù„Ø© ØªÙ†Ø­Ø³Ø¨ Ù…Ø¨Ø§Ø´Ø±Ø© Ø¶Ù…Ù† ØªÙ‚Ø¯Ù…Ùƒ ÙÙŠ ØµÙØ­Ø© Ø§Ù„Ù…Ùˆاد.")
            : "Add courses for your semester. Registered courses are counted in your study-plan progress on the Courses page."
        }
      />

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        <main className="min-w-0">
          <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-semibold text-muted-foreground">
                  {language === "ar" ? ar("Ø§Ù„تخصص") : "Major"}
                </p>
                <h2 className="mt-1 text-2xl font-bold text-foreground">
                  {getMajorName(selectedPlan, language)}
                </h2>
              </div>
              <select
                value={selectedMajor}
                onChange={(event) => setSelectedMajor(event.target.value as MajorId)}
                className="h-11 rounded-xl border border-input bg-card px-4 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
              >
                {studyPlans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {getMajorName(plan, language)}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <SummaryBox
                label={language === "ar" ? ar("Ø§Ù„Ø³Ø§Ø¹Ø§Øª Ø§Ù„Ù…Ø³Ø¬Ù„ة") : "Registered hours"}
                value={`${registeredHours}/${selectedPlan.totalHours}`}
              />
              <SummaryBox
                label={language === "ar" ? ar("Ø§Ù„Ù…ÙˆØ§Ø¯ Ø§Ù„Ù…Ø³Ø¬Ù„ة") : "Registered courses"}
                value={String(registeredCourses.length)}
              />
              <SummaryBox
                label={language === "ar" ? ar("Ø³Ø§Ø¹Ø§Øª Ø§Ù„خطة") : "Study plan hours"}
                value={String(selectedPlan.totalHours)}
              />
            </div>
          </section>

          <div className="relative mt-6">
            <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={language === "ar" ? ar("Ø§Ø¨Ø­Ø« Ø¨Ø§Ø³Ù… Ø§Ù„Ù…Ø§Ø¯Ø© Ø£Ùˆ Ø±Ù‚Ù…Ù‡ا...") : "Search by course name or code..."}
              className="h-11 w-full rounded-xl border border-input bg-card ps-10 pe-4 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
            />
          </div>

          <div className="mt-6 space-y-8">
            {groupedCourses.map((group) => (
              <section key={group.category.name}>
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
                  <div>
                    <h2 className="text-lg font-bold text-foreground">
                      {getCategoryName(group.category.name, language)}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {language === "ar"
                        ? ar(`${group.category.requiredHours} Ø³Ø§Ø¹Ø© Ù…Ø·Ù„Ùˆبة`)
                        : `${group.category.requiredHours} required hours`}
                      {group.category.selection === "choose"
                        ? language === "ar"
                          ? ar(" Ù…Ù† Ù‡Ø°Ù‡ Ø§Ù„Ù‚Ø§Ø¦Ù…Ø© Ø§Ù„Ø§Ø®ØªÙŠØ§Ø±ÙŠة")
                          : " from this elective pool"
                        : ""}
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {language === "ar" ? ar(`${group.courses.length} Ù…Ùˆاد`) : `${group.courses.length} courses`}
                  </Badge>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {group.courses.map((course) => {
                    const unmet = getUnmetPrerequisites(course, countedSet);
                    const isRegistered = registeredSet.has(course.code);

                    return (
                      <article
                        key={`${group.category.name}-${course.code}`}
                        className="rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-elevated"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <Badge variant="secondary" className="font-mono">
                              {course.code}
                            </Badge>
                            <h3 className="mt-3 text-base font-bold text-foreground">
                              {getCourseName(course, language)}
                            </h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {language === "ar"
                                ? ar(`${course.creditHours} Ø³Ø§Ø¹Ø§Øª Ù…Ø¹ØªÙ…دة`)
                                : `${course.creditHours} credit hours`}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleRegistration(course.code)}
                            disabled={!isRegistered && unmet.length > 0}
                            className={`inline-flex h-9 shrink-0 items-center gap-2 rounded-md border px-3 text-sm font-semibold transition-colors ${
                              isRegistered
                                ? "border-primary bg-primary text-primary-foreground"
                                : unmet.length > 0
                                  ? "cursor-not-allowed border-border bg-secondary text-muted-foreground opacity-60"
                                : "border-border bg-card text-foreground hover:bg-secondary"
                            }`}
                            title={
                              !isRegistered && unmet.length > 0
                                ? language === "ar"
                                  ? ar(`Ø£Ù†Ù‡Ù Ø§Ù„Ù…ØªØ·Ù„Ø¨Ø§Øª Ø§Ù„Ø³Ø§Ø¨Ù‚Ø© Ø£ÙˆÙ„Ø§Ù‹: ${unmet
                                      .map((code) => formatCourse(code, language))
                                      .join(", ")}`)
                                  : `Complete prerequisites first: ${unmet
                                      .map((code) => formatCourse(code, language))
                                      .join(", ")}`
                                : undefined
                            }
                          >
                            {isRegistered ? (
                              <>
                                <CheckCircle2 className="h-4 w-4" />
                                {language === "ar" ? ar("Ù…ضافة") : "Added"}
                              </>
                            ) : unmet.length > 0 ? (
                              <>
                                <BookOpenCheck className="h-4 w-4" />
                                {language === "ar" ? ar("Ù…Ù‚ÙÙ„ة") : "Locked"}
                              </>
                            ) : (
                              <>
                                <BookOpenCheck className="h-4 w-4" />
                                {language === "ar" ? "إضافة" : "Add"}
                              </>
                            )}
                          </button>
                        </div>

                        <div className="mt-4">
                          <p className="text-xs font-semibold text-muted-foreground">
                            {language === "ar" ? ar("Ø§Ù„Ù…ØªØ·Ù„Ø¨Ø§Øª Ø§Ù„Ø³Ø§Ø¨Ù‚ة") : "Prerequisites"}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {course.prerequisites.length ? (
                              course.prerequisites.map((code) => (
                                <Badge key={code} variant="outline" className="font-normal">
                                  {formatCourse(code, language)}
                                </Badge>
                              ))
                            ) : (
                              <Badge variant="outline" className="font-normal">
                                {language === "ar" ? ar("Ù„Ø§ ÙŠÙˆجد") : "None"}
                              </Badge>
                            )}
                          </div>
                          {unmet.length > 0 && (
                            <p className="mt-2 text-xs font-medium text-amber-600">
                              {language === "ar" ? ar("Ù…ØªØ·Ù„Ø¨ Ù†Ø§Ù‚ص: ") : "Missing prerequisite: "}
                              {unmet.map((code) => formatCourse(code, language)).join(", ")}
                            </p>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </main>

        <aside className="h-fit rounded-2xl border border-border bg-card p-6 shadow-card lg:sticky lg:top-24">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-foreground">
                {language === "ar" ? ar("Ù…ÙˆØ§Ø¯ÙŠ Ø§Ù„Ù…Ø³Ø¬Ù„ة") : "My Registered Courses"}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {language === "ar"
                  ? ar("Ù‡Ø°Ù‡ Ø§Ù„Ù…ÙˆØ§Ø¯ Ù…Ø­Ø³ÙˆØ¨Ø© Ø¶Ù…Ù† ØªÙ‚Ø¯Ù…Ùƒ ÙÙŠ ØµÙØ­Ø© Ø§Ù„Ù…Ùˆاد.")
                  : "These are included in your Courses page progress."}
              </p>
            </div>
            {registeredCourses.length > 0 && (
              <button
                type="button"
                onClick={clearRegistration}
                className="rounded-md border border-border p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
                aria-label="Clear registration"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="mt-5 space-y-3">
            {registeredCourses.length ? (
              registeredCourses.map((course) => (
                <div key={course.code} className="rounded-2xl border border-border bg-card p-4 shadow-card">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-foreground">
                        {getCourseName(course, language)}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {language === "ar"
                          ? `${course.code} - ${course.creditHours} ساعات`
                          : `${course.code} - ${course.creditHours} hours`}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleRegistration(course.code)}
                      className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
                      aria-label={`Remove ${course.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-card py-10 text-center text-sm text-muted-foreground shadow-card">
                {language === "ar" ? ar("Ù„Ø§ ØªÙˆØ¬Ø¯ Ù…ÙˆØ§Ø¯ Ù…Ø³Ø¬Ù„ة بعد.") : "No courses registered yet."}
              </div>
            )}
          </div>

          <Button asChild className="mt-5 w-full">
            <Link to="/courses">{language === "ar" ? ar("Ø¹Ø±Ø¶ Ø§Ù„ØªÙ‚Ø¯Ù…") : "View Progress"}</Link>
          </Button>
        </aside>
      </div>
    </PageLayout>
  );
}

function SummaryBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
      <p className="text-xs font-semibold text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-bold text-foreground">{value}</p>
    </div>
  );
}

function calculateRegisteredHours(plan: StudyPlan, registered: Set<string>) {
  return Math.min(
    plan.categories.reduce((total, category) => {
      const hours = category.courseCodes.reduce((sum, code) => {
        const course = studyPlanCourseMap.get(code);
        return registered.has(code) && course ? sum + course.creditHours : sum;
      }, 0);

      return total + Math.min(hours, category.requiredHours);
    }, 0),
    plan.totalHours,
  );
}

function getUnmetPrerequisites(course: Course, counted: Set<string>) {
  return course.prerequisites.filter((code) => studyPlanCourseMap.has(code) && !counted.has(code));
}

function formatCourse(code: string, language: "en" | "ar" = "en") {
  const course = studyPlanCourseMap.get(code);
  return course ? `${getCourseName(course, language)} (${course.code})` : code;
}



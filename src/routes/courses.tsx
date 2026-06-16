import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, CheckCircle2, Search } from "lucide-react";
import { PageLayout } from "@/components/layout";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/language";
import { fetchTable } from "@/lib/university-data";
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
import { repairMojibake } from "@/lib/text-encoding";

export const Route = createFileRoute("/courses")({
  head: () => ({
    meta: [
      { title: "Courses - مرشدي" },
      {
        name: "description",
        content:
          "Browse university study plans with course codes, credit hours, prerequisites, and student progress.",
      },
      { property: "og:title", content: "Courses - مرشدي" },
      {
        property: "og:description",
        content: "Search courses, track completed hours, and inspect prerequisites by major.",
      },
    ],
  }),
  component: CoursesPage,
});

function CoursesPage() {
  const { language, t } = useLanguage();
  const [query, setQuery] = useState("");
  const [selectedMajor, setSelectedMajor] = useState<MajorId>("ai");
  const [completed, setCompleted] = useState<string[]>([]);
  const [registered, setRegistered] = useState<string[]>([]);
  const { data: courses = [] } = useQuery({
    queryKey: ["courses"],
    queryFn: () => fetchTable("courses"),
  });
  const ar = (value: string) => (language === "ar" ? repairMojibake(value) : value);

  const selectedPlan = studyPlans.find((plan) => plan.id === selectedMajor) ?? studyPlans[0];
  const courseMap = useMemo(() => {
    const entries = courses.map((course) => [course.code, course] as const);
    return new Map(entries);
  }, [courses]);

  useEffect(() => {
    setCompleted(readCourseCodes(selectedMajor, "completed"));
    setRegistered(readCourseCodes(selectedMajor, "registered"));

    const update = () => {
      setCompleted(readCourseCodes(selectedMajor, "completed"));
      setRegistered(readCourseCodes(selectedMajor, "registered"));
    };

    window.addEventListener(courseStateEventName(), update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener(courseStateEventName(), update);
      window.removeEventListener("storage", update);
    };
  }, [selectedMajor]);

  const completedSet = useMemo(() => new Set(completed), [completed]);
  const registeredSet = useMemo(() => new Set(registered), [registered]);
  const countedSet = useMemo(
    () => new Set([...registeredSet, ...completedSet]),
    [completedSet, registeredSet],
  );
  const progress = calculateProgress(selectedPlan, countedSet, courseMap);
  const groupedCourses = selectedPlan.categories.map((category) => {
    const items = category.courseCodes
      .map((code) => courseMap.get(code) ?? studyPlanCourseMap.get(code))
      .filter((course): course is Course => Boolean(course));

    const filteredItems = items.filter((course) => {
      const normalized = query.toLowerCase();
      return (
        !normalized ||
        course.name.toLowerCase().includes(normalized) ||
        getCourseName(course, language).toLowerCase().includes(normalized) ||
        course.code.toLowerCase().includes(normalized) ||
        course.department.toLowerCase().includes(normalized)
      );
    });

    return { category, courses: filteredItems };
  });
  const shownCount = groupedCourses.reduce((sum, group) => sum + group.courses.length, 0);
  const totalCount = getStudyPlanCourses(selectedPlan).filter((item) => item.course).length;

  function toggleCourse(code: string) {
    setCompleted(toggleCourseCode(selectedMajor, "completed", code));
    if (!registeredSet.has(code)) {
      const nextRegistered = [...registered, code];
      setRegistered(nextRegistered);
      writeCourseCodes(selectedMajor, "registered", nextRegistered);
    }
  }

  return (
    <PageLayout>
      <PageHeader
        eyebrow={t("courses.eyebrow")}
        title={t("courses.title")}
        subtitle={
          language === "ar"
            ? ar("Ø§Ø®ØªØ± ØªØ®ØµØµÙƒØŒ ØªØ§Ø¨Ø¹ Ø§Ù„Ø³Ø§Ø¹Ø§Øª Ø§Ù„Ù…Ø­Ø³ÙˆØ¨Ø©ØŒ ÙˆØ§ÙØ­Øµ Ø§Ù„Ù…ØªØ·Ù„Ø¨Ø§Øª Ø§Ù„Ø³Ø§Ø¨Ù‚ة.")
            : "Choose your major, track completed credit hours, and inspect prerequisites."
        }
      />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-muted-foreground">
                {language === "ar" ? ar("Ø§Ù„Ø®Ø·Ø© Ø§Ù„Ø¯Ø±Ø§Ø³ÙŠة") : "Study plan"}
              </p>
              <h2 className="mt-1 text-2xl font-bold text-foreground">
                {getMajorName(selectedPlan, language)}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {language === "ar"
                  ? ar(`${progress.completedHours} Ù…Ù† ${selectedPlan.totalHours} Ø³Ø§Ø¹Ø© Ù…Ø­Ø³ÙˆØ¨Ø© Ù…Ù† Ø§Ù„Ù…ÙˆØ§Ø¯ Ø§Ù„Ù…Ø³Ø¬Ù„Ø© Ø£Ùˆ Ø§Ù„Ù…ÙƒØªÙ…Ù„ة`)
                  : `${progress.completedHours} of ${selectedPlan.totalHours} hours counted from registered or completed courses`}
              </p>
            </div>
            <select
              value={selectedMajor}
              onChange={(event) => setSelectedMajor(event.target.value as MajorId)}
              className="h-11 rounded-xl border border-input bg-background px-4 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
            >
              {studyPlans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {getMajorName(plan, language)}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-5">
            <div className="h-3 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${progress.percent}%` }}
              />
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {progress.categories.map((category) => (
                <div
                  key={category.name}
                  className="rounded-xl border border-border bg-card px-3 py-3 text-xs shadow-card"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-foreground">
                      {getCategoryName(category.name, language)}
                    </span>
                    <span className="shrink-0 text-muted-foreground">
                      {category.completed}/{category.required}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("courses.search")}
              className="h-11 w-full rounded-xl border border-input bg-card ps-10 pe-4 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
            />
          </div>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          {t("courses.showing")
            .replace("{shown}", String(shownCount))
            .replace("{total}", String(totalCount))}
        </p>

        <div className="mt-5 space-y-8">
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
                        ? ar(" ÙŠØªÙ… Ø§Ø®ØªÙŠØ§Ø±Ù‡Ø§ Ù…Ù† Ù‡Ø°Ù‡ Ø§Ù„Ù‚Ø§Ø¦Ù…ة")
                        : " chosen from this list"
                      : ""}
                  </p>
                </div>
                <Badge variant="secondary">
                  {language === "ar" ? ar(`${group.courses.length} Ù…Ùˆاد`) : `${group.courses.length} courses`}
                </Badge>
              </div>

              <div className="mt-4 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {group.courses.map((course) => (
                  <article
                    key={`${group.category.name}-${course.code}`}
                    className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-elevated"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
                        <BookOpen className="h-5 w-5" />
                      </span>
                      <div className="flex flex-wrap justify-end gap-2">
                        <Badge variant="secondary" className="font-mono">
                          {course.code}
                        </Badge>
                        <button
                          type="button"
                          onClick={() => toggleCourse(course.code)}
                          className={`inline-flex h-7 items-center gap-1.5 rounded-md border px-2 text-xs font-medium transition-colors ${
                            completedSet.has(course.code)
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-card text-muted-foreground hover:bg-secondary hover:text-foreground"
                          }`}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {completedSet.has(course.code)
                            ? language === "ar"
                              ? ar("Ù…ÙƒØªÙ…Ù„ة")
                              : "Completed"
                            : registeredSet.has(course.code)
                              ? language === "ar"
                                ? ar("Ù…Ø³Ø¬Ù„ة")
                                : "Registered"
                              : language === "ar"
                                ? ar("ØªØ­Ø¯ÙŠد")
                                : "Mark"}
                        </button>
                      </div>
                    </div>

                    <h3 className="mt-4 text-base font-bold text-foreground">
                      {getCourseName(course, language)}
                    </h3>
                    <p className="mt-1 text-xs font-medium text-accent">{course.department}</p>
                    <p className="mt-3 flex-1 text-sm text-muted-foreground">
                      {course.description}
                    </p>

                    <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">{t("courses.creditHours")}</span>
                        <span className="font-semibold text-foreground">{course.creditHours}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">{t("courses.prerequisites")}</span>
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {course.prerequisites.length ? (
                            course.prerequisites.map((prerequisite) => (
                              <Badge key={prerequisite} variant="outline" className="font-normal">
                                {formatPrerequisite(prerequisite, courseMap, language)}
                              </Badge>
                            ))
                          ) : (
                            <Badge variant="outline" className="font-normal">
                              {t("courses.none")}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>

        {shownCount === 0 && (
          <div className="mt-6 rounded-2xl border border-dashed border-border bg-card py-16 text-center text-muted-foreground shadow-card">
            {t("courses.empty")}
          </div>
        )}
      </div>
    </PageLayout>
  );
}

function calculateProgress(plan: StudyPlan, completed: Set<string>, courses: Map<string, Course>) {
  const categories = plan.categories.map((category) => {
    const completedHours = category.courseCodes.reduce((sum, code) => {
      const course = courses.get(code) ?? studyPlanCourseMap.get(code);
      return completed.has(code) && course ? sum + course.creditHours : sum;
    }, 0);
    const capped = Math.min(completedHours, category.requiredHours);

    return {
      name: category.name,
      completed: capped,
      required: category.requiredHours,
    };
  });
  const completedHours = Math.min(
    categories.reduce((sum, category) => sum + category.completed, 0),
    plan.totalHours,
  );

  return {
    categories,
    completedHours,
    percent: Math.round((completedHours / plan.totalHours) * 100),
  };
}

function formatPrerequisite(
  prerequisite: string,
  courses: Map<string, Course>,
  language: "en" | "ar",
) {
  const course = courses.get(prerequisite) ?? studyPlanCourseMap.get(prerequisite);
  return course ? `${getCourseName(course, language)} (${course.code})` : prerequisite;
}



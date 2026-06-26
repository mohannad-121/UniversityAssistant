import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Search, Mail, MapPin, Clock, BookOpen } from "lucide-react";
import { PageLayout } from "@/components/layout";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/language";
import { fetchTable } from "@/lib/university-data";
import { repairMojibake } from "@/lib/text-encoding";

export const Route = createFileRoute("/instructors")({
  head: () => ({
    meta: [
      { title: "Instructors - مرشدي" },
      {
        name: "description",
        content:
          "Find university instructors and doctors with office numbers, emails, courses taught, and office hours.",
      },
      { property: "og:title", content: "Instructors - مرشدي" },
      { property: "og:description", content: "Look up doctors and instructors across departments." },
    ],
  }),
  component: InstructorsPage,
});

function InstructorsPage() {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const { data: instructors = [] } = useQuery({
    queryKey: ["instructors"],
    queryFn: () => fetchTable("instructors"),
  });
  const q = query.toLowerCase();
  const cleanedInstructors = instructors.map((instructor) => ({
    ...instructor,
    name: repairMojibake(instructor.name),
    department: repairMojibake(instructor.department),
    office: repairMojibake(instructor.office),
    email: repairMojibake(instructor.email),
    officeHours: repairMojibake(instructor.officeHours),
    courses: instructor.courses.map(repairMojibake),
  }));
  const filtered = cleanedInstructors.filter(
    (i) =>
      i.name.toLowerCase().includes(q) ||
      i.department.toLowerCase().includes(q) ||
      i.courses.some((c) => c.toLowerCase().includes(q)),
  );

  return (
    <PageLayout>
      <PageHeader
        eyebrow={t("instructors.eyebrow")}
        title={t("instructors.title")}
        subtitle={t("instructors.subtitle")}
      />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("instructors.search")}
            className="h-11 w-full rounded-xl border border-input bg-card ps-10 pe-4 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
          />
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {filtered.map((i) => (
            <article
              key={i.id}
              className="rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-elevated"
            >
              <div className="flex items-center gap-4">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-hero text-lg font-bold text-primary-foreground">
                  {i.name
                    .replace("Dr. ", "")
                    .split(" ")
                    .map((p) => p[0])
                    .join("")
                    .slice(0, 2)}
                </span>
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-bold text-foreground">{i.name}</h2>
                  <p className="text-sm text-accent">{i.department}</p>
                </div>
              </div>

              <div className="mt-5 space-y-2.5 text-sm">
                <Row icon={MapPin} label={t("instructors.office")} value={i.office} />
                <Row icon={Mail} label={t("instructors.email")} value={i.email} />
                <Row icon={Clock} label={t("instructors.officeHours")} value={i.officeHours} />
              </div>

              <div className="mt-4 border-t border-border pt-4">
                <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <BookOpen className="h-3.5 w-3.5" /> {t("instructors.coursesTaught")}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {i.courses.map((c) => (
                    <Badge key={c} variant="secondary">
                      {c}
                    </Badge>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-6 rounded-2xl border border-dashed border-border bg-card py-16 text-center text-muted-foreground">
            {t("instructors.empty")}
          </div>
        )}
      </div>
    </PageLayout>
  );
}

function Row({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <Icon className="h-4 w-4 shrink-0 text-primary" />
      <span className="text-muted-foreground">{label}:</span>
      <span className="truncate font-medium text-foreground">{value}</span>
    </div>
  );
}


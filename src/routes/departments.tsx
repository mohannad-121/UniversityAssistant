import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Building2, MapPin, User2, LifeBuoy, Mail, Phone, Clock } from "lucide-react";
import { PageLayout } from "@/components/layout";
import { PageHeader } from "@/components/page-header";
import { itSupport } from "@/data/knowledge";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/language";
import { fetchTable } from "@/lib/university-data";

export const Route = createFileRoute("/departments")({
  head: () => ({
    meta: [
      { title: "Departments - مرشدي" },
      {
        name: "description",
        content:
          "Explore IT faculty departments: Data Science & AI, Computer Science, Software Engineering, Cybersecurity, CIS, and IT.",
      },
      { property: "og:title", content: "Departments - مرشدي" },
      { property: "og:description", content: "Browse IT faculty departments and their courses." },
    ],
  }),
  component: DepartmentsPage,
});

function DepartmentsPage() {
  const { t } = useLanguage();
  const { data: departments = [] } = useQuery({
    queryKey: ["departments"],
    queryFn: () => fetchTable("departments"),
  });

  return (
    <PageLayout>
      <PageHeader
        eyebrow={t("departments.eyebrow")}
        title={t("departments.title")}
        subtitle={t("departments.subtitle")}
      />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {departments.map((d) => (
            <article
              key={d.id}
              className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-elevated"
            >
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-secondary text-primary">
                <Building2 className="h-6 w-6" />
              </span>
              <h2 className="mt-4 text-lg font-bold text-foreground">{d.name}</h2>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{d.description}</p>

              <div className="mt-4">
                <p className="text-xs font-medium text-muted-foreground">{t("departments.mainCourses")}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {d.mainCourses.map((c) => (
                    <Badge key={c} variant="secondary">
                      {c}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
                <div className="flex items-center gap-2.5">
                  <MapPin className="h-4 w-4 shrink-0 text-primary" />
                  <span className="text-muted-foreground">{t("departments.contact")}:</span>
                  <span className="font-medium text-foreground">{d.contactOffice}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <User2 className="h-4 w-4 shrink-0 text-primary" />
                  <span className="text-muted-foreground">{t("departments.head")}:</span>
                  <span className="font-medium text-foreground">{d.head}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* IT Support highlight */}
        <div className="mt-10 overflow-hidden rounded-3xl border border-border bg-gradient-hero p-8 text-primary-foreground sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-xl">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-white/15">
                <LifeBuoy className="h-6 w-6" />
              </span>
              <h2 className="mt-4 text-2xl font-extrabold">{itSupport.name}</h2>
              <p className="mt-2 text-primary-foreground/80">
                {t("departments.supportSubtitle")}
              </p>
              <ul className="mt-4 grid gap-2 text-sm text-primary-foreground/90 sm:grid-cols-2">
                {itSupport.services.map((s) => (
                  <li key={s} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-foreground/70" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid w-full max-w-xs gap-3 rounded-2xl bg-white/10 p-5 text-sm">
              <InfoRow icon={MapPin} label={t("departments.office")} value={itSupport.office} />
              <InfoRow icon={Mail} label={t("departments.email")} value={itSupport.email} />
              <InfoRow icon={Phone} label={t("departments.phone")} value={itSupport.phone} />
              <InfoRow icon={Clock} label={t("departments.hours")} value={itSupport.hours} />
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="min-w-0">
        <p className="text-xs text-primary-foreground/70">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}


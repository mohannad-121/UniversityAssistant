import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { PageLayout } from "@/components/layout";
import { PageHeader } from "@/components/page-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLanguage } from "@/lib/language";
import { fetchTable } from "@/lib/university-data";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ - مرشدي" },
      {
        name: "description",
        content:
          "Frequently asked student questions about registration, prerequisites, departments, IT support, and office locations.",
      },
      { property: "og:title", content: "FAQ - مرشدي" },
      { property: "og:description", content: "Common student questions, answered." },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  const { t } = useLanguage();
  const { data: faqs = [] } = useQuery({
    queryKey: ["faqs"],
    queryFn: () => fetchTable("faqs"),
  });
  const allCategory = t("faq.all");
  const categories = useMemo(() => [allCategory, ...Array.from(new Set(faqs.map((f) => f.category)))], [allCategory]);
  const [active, setActive] = useState(allCategory);

  useEffect(() => {
    setActive((current) => (current === "All" || current === "Ø§Ù„ÙƒÙ„" ? allCategory : current));
  }, [allCategory]);

  const filtered = active === allCategory ? faqs : faqs.filter((f) => f.category === active);

  return (
    <PageLayout>
      <PageHeader
        eyebrow={t("faq.eyebrow")}
        title={t("faq.title")}
        subtitle={t("faq.subtitle")}
      />
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors " +
                (active === c
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card text-muted-foreground hover:bg-secondary")
              }
            >
              {c}
            </button>
          ))}
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {filtered.map((f) => (
            <AccordionItem
              key={f.id}
              value={f.id}
              className="rounded-2xl border border-border bg-card px-5 shadow-card"
            >
              <AccordionTrigger className="text-left text-base font-semibold hover:no-underline">
                {f.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{f.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </PageLayout>
  );
}


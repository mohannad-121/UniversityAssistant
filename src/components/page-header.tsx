import { repairMojibake } from "@/lib/text-encoding";

export function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  const cleanEyebrow = eyebrow ? repairMojibake(eyebrow) : undefined;
  const cleanTitle = repairMojibake(title);
  const cleanSubtitle = subtitle ? repairMojibake(subtitle) : undefined;

  return (
    <div className="border-b border-border bg-[radial-gradient(circle_at_18%_0%,rgba(182,0,168,0.20),transparent_26rem),linear-gradient(180deg,rgba(255,255,255,0.055),rgba(255,255,255,0.02))]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {cleanEyebrow && (
          <span className="mb-3 inline-block rounded-full border border-white/10 bg-secondary/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            {cleanEyebrow}
          </span>
        )}
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {cleanTitle}
        </h1>
        {cleanSubtitle && (
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
            {cleanSubtitle}
          </p>
        )}
      </div>
    </div>
  );
}

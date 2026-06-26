import { BRAND_LOGO_SRC, BRAND_NAME, BRAND_TAGLINE_AR } from "@/lib/brand";
import { cn } from "@/lib/utils";

export function BrandLogo({
  compact = false,
  className,
  imageClassName,
}: {
  compact?: boolean;
  className?: string;
  imageClassName?: string;
}) {
  return (
    <span className={cn("inline-flex min-w-0 items-center gap-2.5", className)}>
      <img
        src={BRAND_LOGO_SRC}
        alt={BRAND_NAME}
        className={cn("h-10 w-10 shrink-0 rounded-xl object-contain", imageClassName)}
      />
      {!compact && (
        <span className="flex min-w-0 flex-col leading-tight">
          <span className="truncate font-display text-base font-extrabold tracking-tight text-foreground">
            {BRAND_NAME}
          </span>
          <span className="truncate text-[11px] text-muted-foreground">{BRAND_TAGLINE_AR}</span>
        </span>
      )}
    </span>
  );
}

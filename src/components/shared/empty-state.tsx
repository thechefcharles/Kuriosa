import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title?: string;
  description?: string;
  /** Optional icon or illustration above the title */
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title = "Nothing here yet",
  description,
  icon,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-dashed border-muted-foreground/30 bg-muted/30 px-4 py-8 text-center",
        className
      )}
      role="status"
    >
      {icon}
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description ? (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}

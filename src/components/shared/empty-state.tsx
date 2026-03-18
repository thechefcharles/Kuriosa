interface EmptyStateProps {
  title?: string;
  description?: string;
}

export function EmptyState({
  title = "Nothing here yet",
  description,
}: EmptyStateProps) {
  return (
    <div
      className="rounded-lg border border-dashed border-muted-foreground/30 bg-muted/30 px-4 py-8 text-center"
      role="status"
    >
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description ? (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}

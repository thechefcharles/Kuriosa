interface ErrorStateProps {
  message: string;
}

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <div
      className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-4 text-destructive"
      role="alert"
    >
      <p className="text-sm font-medium">Something went wrong</p>
      <p className="mt-1 text-sm opacity-90">{message}</p>
    </div>
  );
}

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function DiscoverySection({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn("scroll-mt-20", className)}
    >
      {children}
    </section>
  );
}
